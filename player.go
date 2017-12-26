package main

import "github.com/gorilla/websocket"

// Player represents a player.
type Player struct {
	WS       *websocket.Conn
	Username string
	Czar     bool
	Hand     []string
	Selected []string
	Points   byte
}

// SendHand sends the hand that the player has.
func (player *Player) SendHand() {
	player.WS.WriteJSON(map[string][]string{
		"hand":     player.Hand,
		"selected": player.Selected,
	})
}
