package main

import (
	"math/rand"

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
	BlackCard  string
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
				"players": players,
			})
		}
	}
}

// UpdateGameState sends an updated game state to the specified player.
func (game *Game) UpdateGameState(player *Player) {
	state := map[string]interface{}{
		"started":   game.Started,
		"blackCard": game.BlackCard,
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

	// kick every offline player
	for i := len(game.Players) - 1; i != 0; i-- {
		if game.Players[i].WS == nil {
			game.Players = append(game.Players[:i], game.Players[i+1:]...)
		}
	}

	// HACK: ensure there are enough cards
	if len(game.Deck.White) < len(game.Players)*10 {
		panic("not enough cards") // FIXME: properly handle error
	}

	// set black card
	game.BlackCard = game.Deck.Black[0]
	game.Deck.Black = game.Deck.Black[1:]

	// give every player a hand of cards
	for _, player := range game.Players {
		player.Hand = game.Deck.White[:10]
		game.Deck.White = game.Deck.White[10:]
		player.UpdateHand()
	}

	// assign random player card czar
	game.Players[rand.Intn(len(game.Players))].Czar = true

	game.Started = true
	game.UpdatePlayers()
	game.UpdateGameState(nil)
}

// Player represents a player.
type Player struct {
	WS       *websocket.Conn
	Username string
	Czar     bool
	Hand     []string
}

// UpdateHand sends the hand that the player has.
func (player Player) UpdateHand() {
	player.WS.WriteJSON(map[string]interface{}{
		"hand": player.Hand,
	})
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
					"error":    "Username taken",
					"username": "",
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
				"error": "Game has already started",
			})
			return
		}

		player = &Player{
			Username: username,
			WS:       ws,
			Hand:     make([]string, 0),
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
	player.UpdateHand()

	for {
		var res map[string]string
		err := ws.ReadJSON(&res)
		if err != nil {
			break
		}

		switch res["id"] {
		case "start":
			game.Start()
		default:
			pp.Println(res)
		}
	}
}
