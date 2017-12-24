package main

import (
	"math/rand"
	"sync"
)

// Game represents a game.
type Game struct {
	Started    bool
	ScoreLimit byte
	Deck       Deck
	Players    []*Player
	Owner      string
	BlackCard  *BlackCard
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

	// set black card
	game.BlackCard = &game.Deck.Black[0]
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

// SelectCard selects a card to be played.
func (game *Game) SelectCard(player *Player, card string) {
	// czars cannot select cards
	if player.Czar {
		return
	}

	if len(player.Selected) == game.BlackCard.Pick {
		return
	}

	var hasCard bool
	for i := range player.Hand {
		if player.Hand[i] == card {
			hasCard = true
			// remove card from hand
			player.Hand[i] = game.Deck.White[0]
			game.Deck.White = game.Deck.White[1:]
			break
		}
	}
	if !hasCard {
		return
	}

	player.Selected = append(player.Selected, card)

	// DEBUG
	if len(player.Selected) == game.BlackCard.Pick {
		game.BlackCard = &game.Deck.Black[0]
		game.Deck.Black = game.Deck.Black[1:]
		player.Selected = nil
	}

	player.UpdateHand()
	game.UpdateGameState(nil)
}

func getGame(id string) *Game {
	gamesMutex.RLock()
	defer gamesMutex.RUnlock()
	return games[id]
}

var (
	games      = make(map[string]*Game)
	gamesMutex sync.RWMutex
)
