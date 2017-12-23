package main

import (
	"github.com/gorilla/websocket"
	"github.com/k0kubun/pp"
)

// Game represents a game.
type Game struct {
	Started    bool
	ScoreLimit uint
	Deck       Deck
	Players    []*Player
	Owner      string
}

// UpdatePlayers sends an updated list of players to every connected websocket.
func (game *Game) UpdatePlayers() {
	var players []map[string]interface{}
	for _, player := range game.Players {
		players = append(players, map[string]interface{}{
			"username": player.Username,
			"online":   player.WS != nil,
			"czar":     player.Czar,
			"owner":    game.Owner == player.Username,
		})
	}
	for _, player := range game.Players {
		if player.WS != nil {
			player.WS.WriteJSON(map[string]interface{}{
				"id":      "players",
				"players": players,
			})
		}
	}
}

// UpdateGameState sends an updated game state to the specified player.
func (game *Game) UpdateGameState(player *Player) {
	state := map[string]interface{}{
		"id":      "game state",
		"started": game.Started,
	}

	if player == nil {
		for _, player := range game.Players {
			if player.WS != nil {
				player.WS.WriteJSON(state)
			}
		}
	} else {
		player.WS.WriteJSON(state)
	}
}

// Start starts the game.
func (game *Game) Start() {
	var online int
	for _, player := range game.Players {
		if player.WS != nil {
			online++
		}
	}
	if online < 3 {
		return
	}

	game.Started = true
	game.UpdateGameState(nil)
}

var upgrader websocket.Upgrader

func handlePlayer(game *Game, ws *websocket.Conn) {
	_, body, err := ws.ReadMessage()
	die(err)
	username := string(body)
	if len(username) < 3 || len(username) > 16 {
		return
	}

	// check if a user with the same username is in the game
	var player *Player
	for i := range game.Players {
		if game.Players[i].Username == username {
			player = game.Players[i]

			// if the player disconnected, reconnect them
			if player.WS == nil {
				player.WS = ws
			} else {
				ws.WriteJSON(map[string]string{
					"id":  "error",
					"err": "username taken",
				})
				return
			}
		}
	}

	// if a player with that username doesn't yet exist, create it
	if player == nil {
		// unless the game has started
		if game.Started {
			ws.WriteJSON(map[string]string{
				"id":  "error",
				"err": "game started",
			})
			return
		}

		player = &Player{
			Username: username,
			WS:       ws,
		}
		game.Players = append(game.Players, player)
	}

	// once the socket closes, don't remove the player, just the websocket
	defer func() {
		player.WS = nil
		game.UpdatePlayers()
	}()

	game.UpdatePlayers()
	game.UpdateGameState(player)

	for {
		var res map[string]string
		err := ws.ReadJSON(&res)
		if err != nil {
			break
		}

		switch res["id"] {
		case "start game":
			game.Start()
		default:
			pp.Println(res)
		}
	}
}
