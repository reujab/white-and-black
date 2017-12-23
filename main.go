package main

import (
	"html/template"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"github.com/reujab/httplogger"
)

// Game represents a game.
type Game struct {
	ID         string
	ScoreLimit uint
	Deck       Deck
	Players    []*Player
	Owner      string
}

var games []Game

// Deck represents a deck.
type Deck struct {
	Black []string
	White []string
}

// Player represents a player.
type Player struct {
	Username string
	WS       *websocket.Conn
}

var templates = template.Must(template.ParseGlob("src/*.tmpl"))

func main() {
	router := mux.NewRouter()
	router.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir("dist"))))
	router.HandleFunc("/", func(res http.ResponseWriter, req *http.Request) {
		die(templates.ExecuteTemplate(res, "index.tmpl", nil))
	}).Methods("GET")
	router.HandleFunc("/create-game", createGame).Methods("POST")
	router.HandleFunc(`/{id:[a-z\d]{20}}`, func(res http.ResponseWriter, req *http.Request) {
		if getGame(mux.Vars(req)["id"]) == nil {
			http.NotFound(res, req)
		} else {
			die(templates.ExecuteTemplate(res, "game.tmpl", nil))
		}
	}).Methods("GET")
	router.HandleFunc(`/{id:[a-z\d]{20}}/ws`, func(res http.ResponseWriter, req *http.Request) {
		game := getGame(mux.Vars(req)["id"])
		if game == nil {
			http.NotFound(res, req)
			return
		}

		ws, err := upgrader.Upgrade(res, req, nil)
		die(err)
		defer ws.Close()
		handlePlayer(game, ws)
	}).Methods("GET")
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

func getGame(id string) *Game {
	for i, game := range games {
		if game.ID == id {
			return &games[i]
		}
	}
	return nil
}
