package main

import (
	"encoding/json"
	"net/http"
	"os"
	"regexp"

	"github.com/rs/xid"
)

var deckRegex = regexp.MustCompile(`^[a-z\d ]+$`)

func createGame(res http.ResponseWriter, req *http.Request) {
	var settings struct {
		ScoreLimit uint
		BlankCards uint
		Decks      []string
	}
	err := json.NewDecoder(req.Body).Decode(&settings)
	if err != nil || settings.ScoreLimit < 1 {
		http.Error(res, "Bad Request", 400)
		return
	}

	game := Game{
		ID:         xid.New().String(),
		ScoreLimit: settings.ScoreLimit,
	}
	for _, name := range settings.Decks {
		if !deckRegex.MatchString(name) {
			http.Error(res, "Bad Request", 400)
			return
		}

		file, err := os.Open("src/cards/" + name + ".json")
		if err != nil {
			http.Error(res, "Bad Request", 400)
			return
		}
		defer file.Close()

		var deck Deck
		err = json.NewDecoder(file).Decode(&deck)
		die(err)

		game.Deck.Black = append(game.Deck.Black, deck.Black...)
		game.Deck.White = append(game.Deck.White, deck.White...)
	}
	for i := uint(0); i < settings.BlankCards; i++ {
		game.Deck.White = append(game.Deck.White, "_")
	}
	if len(game.Deck.Black) == 0 || len(game.Deck.White) == 0 {
		http.Error(res, "Bad Request", 400)
		return
	}

	games = append(games, game)
	res.Write([]byte(game.ID))
}