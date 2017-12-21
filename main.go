package main

import (
	"encoding/json"
	"html/template"
	"log"
	"net/http"
	"os"
	"regexp"

	"github.com/gorilla/mux"
	"github.com/reujab/httplogger"
	"github.com/rs/xid"
)

// Game represents a game.
type Game struct {
	ID         string
	ScoreLimit int
	Deck       Deck
}

var games []Game

// Deck represents a deck.
type Deck struct {
	Black []string
	White []string
}

var deckRegex = regexp.MustCompile(`^[a-z\d ]+$`)

var templates = template.Must(template.ParseGlob("src/*.tmpl"))

func main() {
	router := mux.NewRouter()
	router.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir("dist"))))
	router.HandleFunc("/", func(res http.ResponseWriter, req *http.Request) {
		die(templates.ExecuteTemplate(res, "index.tmpl", nil))
	}).Methods("GET")
	router.HandleFunc("/create-game", func(res http.ResponseWriter, req *http.Request) {
		var settings struct {
			ScoreLimit int
			BlankCards int
			Decks      []string
		}
		err := json.NewDecoder(req.Body).Decode(&settings)
		if err != nil {
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
		for i := 0; i < settings.BlankCards; i++ {
			game.Deck.White = append(game.Deck.White, "_")
		}
		if len(game.Deck.Black) == 0 || len(game.Deck.White) == 0 {
			http.Error(res, "Bad Request", 400)
			return
		}

		games = append(games, game)
		res.Write([]byte(game.ID))
	}).Methods("POST")
	log.Println("Listening to :8080")
	panic(http.ListenAndServe(":8080", httplogger.Wrap(router.ServeHTTP, func(req *httplogger.Request) {
		log.Println(req.IP, req.Method, req.URL, req.Status, req.Time)
	})))
}

func die(err error) {
	if err != nil {
		panic(err)
	}
}
