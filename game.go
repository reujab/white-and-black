package main

import (
	"math/rand"
	"reflect"
	"strings"
	"sync"
	"time"
)

// Game represents a game.
type Game struct {
	Started    bool
	ScoreLimit byte
	Owner      string
	Players    []*Player

	Deck          Deck
	CzarSelecting bool
	CzarSelection [][]string
	SelectedCards *int
	Sleeping      bool
}

// UpdatePlayers sends an updated list of players to every connected websocket.
func (game *Game) UpdatePlayers() {
	var players []map[string]interface{}
	for _, player := range game.Players {
		players = append(players, map[string]interface{}{
			"username": player.Username,
			"online":   player.WS != nil,
			"owner":    game.Owner == player.Username,
			"czar":     player.Czar,
			"points":   player.Points,
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

// SendGameState sends an updated game state to the specified player.
func (game *Game) SendGameState(player *Player) {
	player.WS.WriteJSON(map[string]bool{
		"started": game.Started,
	})
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

	// give every player a hand of cards
	for _, player := range game.Players {
		player.Hand = game.Deck.White[:10]
		game.Deck.White = game.Deck.White[10:]
		player.SendHand()
	}

	// assign random player card czar
	game.Players[rand.Intn(len(game.Players))].Czar = true

	game.Started = true
	game.UpdatePlayers()
	for _, player := range game.Players {
		game.SendGameState(player)
		game.SendBlackCard(player)
		if player.Czar {
			game.SendCzarSelection(player)
		}
	}
}

// SendBlackCard sends the current black card to the specified player.
func (game *Game) SendBlackCard(player *Player) {
	if game.Started {
		player.WS.WriteJSON(map[string]BlackCard{
			"blackCard": game.Deck.Black[0],
		})
	}
}

// SelectCard selects a card to be played.
func (game *Game) SelectCard(player *Player, card string) {
	if len(card) > 1024 || len(player.Selected) == game.Deck.Black[0].Pick {
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
		var hasBlank bool
		for i := range player.Hand {
			if player.Hand[i] == "_" {
				hasBlank = true

				// sanitize input
				card = strings.Replace(card, "&", "&amp;", -1)
				card = strings.Replace(card, "<", "&lt;", -1)
				card = strings.Replace(card, ">", "&gt;", -1)

				// remove card from hand
				player.Hand[i] = game.Deck.White[0]
				game.Deck.White = game.Deck.White[1:]
				break
			}
		}
		if !hasBlank {
			return
		}
	}

	player.Selected = append(player.Selected, card)

	// check if every player selected cards
	if !game.CzarSelecting {
		allCardsSelected := true
		for _, player := range game.Players {
			if !player.Czar && len(player.Selected) != game.Deck.Black[0].Pick {
				allCardsSelected = false
				break
			}
		}
		if allCardsSelected {
			game.CzarSelecting = true
			for _, player := range game.Players {
				if player.Selected != nil {
					game.CzarSelection = append(game.CzarSelection, player.Selected)
				}
			}

			// shuffle czar selection
			for i := range game.CzarSelection {
				j := rand.Intn(i + 1)
				game.CzarSelection[i], game.CzarSelection[j] = game.CzarSelection[j], game.CzarSelection[i]
			}
		}
	}

	player.SendHand()
	for _, player := range game.Players {
		if player.WS != nil {
			game.SendCzarSelection(player)
		}
	}
}

// SendCzarSelection sends the czar selection to the specified player.
func (game *Game) SendCzarSelection(player *Player) {
	czarSelection := game.CzarSelection
	if czarSelection == nil && player.Czar {
		// initialize slice
		czarSelection = make([][]string, 0)

		for _, player := range game.Players {
			if player.Selected != nil {
				czarSelection = append(czarSelection, make([]string, len(player.Selected)))
			}
		}
	}

	player.WS.WriteJSON(map[string][][]string{
		"czarSelection": czarSelection,
	})
}

// SelectCzarCard selects a white card from the czar's selection.
func (game *Game) SelectCzarCard(player *Player, index int) {
	if !player.Czar || !game.CzarSelecting {
		return
	}

	game.Sleeping = true
	game.SelectedCards = &index
	for _, player := range game.Players {
		if player.WS != nil {
			game.SendHighlightedCard(player)
		}

		if reflect.DeepEqual(player.Selected, game.CzarSelection[index]) {
			player.Points++
			if player.Points == game.ScoreLimit {
				for _, player := range game.Players {
					if player.WS != nil {
						game.SendWinnerSnackbar(player)
					}
				}
				game.UpdatePlayers()
				return
			}
		}
	}
	game.UpdatePlayers()

	go func() {
		time.Sleep(time.Second * 5)
		game.StartNextRound()
	}()
}

// SendHighlightedCard sends the highlighted czar card to the specified player.
func (game *Game) SendHighlightedCard(player *Player) {
	player.WS.WriteJSON(map[string]*int{
		"highlighted": game.SelectedCards,
	})
}

// StartNextRound starts the next round
func (game *Game) StartNextRound() {
	game.Deck.Black = game.Deck.Black[1:]
	game.CzarSelecting = false
	game.CzarSelection = nil
	game.SelectedCards = nil

	var isNextPlayer bool
	for _, player := range game.Players {
		// make next player card czar
		if isNextPlayer {
			isNextPlayer = false
			player.Czar = true
		} else if player.Czar {
			isNextPlayer = true
			player.Czar = false
		}

		player.Selected = nil
	}
	if isNextPlayer {
		game.Players[0].Czar = true
	}

	for _, player := range game.Players {
		if player.WS != nil {
			game.SendBlackCard(player)
			game.SendCzarSelection(player)
			game.SendHighlightedCard(player)
			player.SendHand()
		}
	}
	game.UpdatePlayers()
	game.Sleeping = false
}

// SendWinnerSnackbar sends the winning message to the specified player.
func (game *Game) SendWinnerSnackbar(player *Player) {
	// game will always be sleeping after a player wins
	if !game.Sleeping {
		return
	}

	var winner *Player
	for _, player := range game.Players {
		if player.Points == game.ScoreLimit {
			winner = player
			break
		}
	}
	if winner != nil {
		player.WS.WriteJSON(map[string]string{
			"snackbar": winner.Username + " won!",
		})
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
