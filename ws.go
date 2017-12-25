package main

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"github.com/k0kubun/pp"
)

var upgrader websocket.Upgrader

func handleWS(res http.ResponseWriter, req *http.Request) {
	game := getGame(mux.Vars(req)["id"])
	if game == nil {
		http.NotFound(res, req)
		return
	}

	ws, err := upgrader.Upgrade(res, req, nil)
	die(err)
	defer ws.Close()

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

		// or there are too many players
		if len(game.Players) == 5 {
			ws.WriteJSON(map[string]string{
				"error": "There are already five players",
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
	game.SendGameState(player)
	game.SendBlackCard(player)
	game.SendCzarSelection(player)
	player.UpdateHand()

	for {
		var res map[string]interface{}
		if ws.ReadJSON(&res) != nil {
			break
		}

		switch res["id"].(string) {
		case "start":
			game.Start()
		case "select":
			game.SelectCard(player, res["card"].(string))
		default:
			pp.Println(res)
		}
	}
}
