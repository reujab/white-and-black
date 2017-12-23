package main

import (
	"github.com/gorilla/websocket"
)

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

	ws.ReadMessage()
}
