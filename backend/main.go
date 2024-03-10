package main

import (
	"log"
	"math/rand"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
	"github.com/reujab/httplogger"
)

// Deck represents a deck.
type Deck struct {
	Black []BlackCard
	White []string
}

// BlackCard represents a black card.
type BlackCard struct {
	Pick int    `json:"pick"`
	Text string `json:"text"`
}

func init() {
	rand.Seed(time.Now().UnixNano())
}

func main() {
	port := "8080"
	if os.Getenv("PORT") != "" {
		port = os.Getenv("PORT")
	}

	log.Println("Listening to :" + port)
	panic(http.ListenAndServe(":"+port, httplogger.Wrap(getRouter().ServeHTTP, func(req *httplogger.Request) {
		log.Println(req.IP, req.Method, req.URL, req.Status, req.Time)
	})))
}

func getRouter() *mux.Router {
	router := mux.NewRouter()
	router.HandleFunc("/create-game", createGame).Methods("POST")
	router.HandleFunc(`/{id:[a-z\d]{20}}`, func(res http.ResponseWriter, req *http.Request) {
		if getGame(mux.Vars(req)["id"]) == nil {
			http.NotFound(res, req)
		} else {
			http.ServeFile(res, req, "dist/game.html")
		}
	}).Methods("GET")
	router.HandleFunc(`/{id:[a-z\d]{20}}/ws`, handleWS).Methods("GET")
	router.PathPrefix("/").Handler(http.FileServer(http.Dir("dist")))
	return router
}

func die(err error) {
	if err != nil {
		panic(err)
	}
}
