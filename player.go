package main

import (
	"sync"

	"github.com/gorilla/websocket"
)

// Player represents a player.
type Player struct {
	sync.Mutex
	WS       *websocket.Conn
	Username string
	Czar     bool
	Hand     []string
	Selected []string
	Points   byte
}

// Send writes JSON to the websocket.
func (player *Player) Send(data interface{}) {
	player.Lock()
	defer player.Unlock()
	player.Send(data)
}

// SendHand sends the hand that the player has.
func (player *Player) SendHand() {
	player.Send(map[string][]string{
		"hand":     player.Hand,
		"selected": player.Selected,
	})
}
