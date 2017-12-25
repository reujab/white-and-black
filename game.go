package main

import (
	"math/rand"
	"sync"
)

// Game represents a game.
type Game struct {
	Started       bool
	ScoreLimit    byte
	Deck          Deck
	Players       []*Player
	Owner         string
	BlackCard     *BlackCard
	CzarSelecting bool
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
	if player.WS == nil {
		return
	}

	state := map[string]interface{}{
		"started":   game.Started,
		"blackCard": game.BlackCard,
	}
	var czarSelection [][]string
	if player.Czar {
		czarSelection = make([][]string, 0)
	}
	if game.CzarSelecting {
		for _, player := range game.Players {
			if player.Selected != nil {
				czarSelection = append(czarSelection, player.Selected)
			}
		}
	}
	state["czarSelection"] = czarSelection

	player.WS.WriteJSON(state)
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
	for _, player := range game.Players {
		game.UpdateGameState(player)
	}
}

// SelectCard selects a card to be played.
func (game *Game) SelectCard(player *Player, card string) {
	// TODO: handle when game.CzarSelecting

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
		// TODO: allow blank cards
		return
	}

	player.Selected = append(player.Selected, card)

	// check if every player submitted cards
	allCardsSelected := true
	for _, player := range game.Players {
		if !player.Czar && len(player.Selected) != game.BlackCard.Pick {
			allCardsSelected = false
			break
		}
	}
	if allCardsSelected {
		game.CzarSelecting = true
	}

	player.UpdateHand()
	for _, player := range game.Players {
		game.UpdateGameState(player)
	}
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
