package main

import (
	"bytes"
	"encoding/json"
	"io"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"net/url"
	"regexp"
	"strconv"
	"strings"
	"testing"
	"time"

	"github.com/gorilla/websocket"
	. "github.com/smartystreets/goconvey/convey"
)

func Test(t *testing.T) {
	server := httptest.NewServer(getRouter())
	defer server.Close()

	Convey("die", t, func() {
		So(func() {
			panic(nil)
		}, ShouldNotPanic)

		So(func() {
			die(io.EOF)
		}, ShouldPanicWith, io.EOF)
	})

	Convey("/", t, func() {
		res, err := http.Get(server.URL + "/")
		So(err, ShouldEqual, nil)
		So(res.StatusCode, ShouldEqual, 200)

		Convey("static/", func() {
			res, err := http.Get(server.URL + "/static/index.js")
			So(err, ShouldEqual, nil)
			So(res.StatusCode, ShouldEqual, 200)
		})

		Convey("create-game", func() {
			res, err := http.Get(server.URL + "/create-game")
			So(err, ShouldEqual, nil)
			So(res.StatusCode, ShouldEqual, 405)

			failures := []map[string]interface{}{
				{"scoreLimit": -1},
				{"scoreLimit": 0},
				{"scoreLimit": 256},
				{"blankCards": -1},
				{"blankCards": 256},
				{"decks": []string{}},
				{"decks": []string{".."}},
				{"decks": []string{"not found"}},
				{"owner": ""},
				{"owner": "12345678901234567"},
			}

			for _, failure := range failures {
				// fill omitted values with valid values
				_, scoreLimit := failure["scoreLimit"]
				if !scoreLimit {
					failure["scoreLimit"] = 5
				}
				_, blankCards := failure["blankCards"]
				if !blankCards {
					failure["blankCards"] = 32
				}
				_, decks := failure["decks"]
				if !decks {
					failure["decks"] = []string{"base"}
				}
				_, owner := failure["owner"]
				if !owner {
					failure["owner"] = "000"
				}

				body, err := json.Marshal(failure)
				So(err, ShouldEqual, nil)
				res, err := http.Post(server.URL+"/create-game", "application/json", bytes.NewReader(body))
				So(err, ShouldEqual, nil)
				So(res.StatusCode, ShouldEqual, 400)
				So(len(games), ShouldEqual, 0)
			}

			successes := []map[string]interface{}{
				{"scoreLimit": 1},
				{"scoreLimit": 255},
				{"blankCards": 0},
				{"blankCards": 255},
				{"owner": "123"},
				{"owner": "1234567890123456"},
			}

			for _, success := range successes {
				// fill omitted values with valid values
				_, scoreLimit := success["scoreLimit"]
				if !scoreLimit {
					success["scoreLimit"] = 5
				}
				_, blankCards := success["blankCards"]
				if !blankCards {
					success["blankCards"] = 32
				}
				_, decks := success["decks"]
				if !decks {
					success["decks"] = []string{"base"}
				}
				_, owner := success["owner"]
				if !owner {
					success["owner"] = "000"
				}

				body, err := json.Marshal(success)
				So(err, ShouldEqual, nil)
				gamesNum := len(games)
				res, err := http.Post(server.URL+"/create-game", "application/json", bytes.NewReader(body))
				So(err, ShouldEqual, nil)
				So(res.StatusCode, ShouldEqual, 200)
				body, err = ioutil.ReadAll(res.Body)
				So(err, ShouldEqual, nil)
				So(regexp.MustCompile(`^[a-z\d]{20}$`).Match(body), ShouldEqual, true)
				So(len(games), ShouldEqual, gamesNum+1)
			}
		})

		Convey("{id}", func() {
			res, err := http.Get(server.URL + "/" + strings.Repeat("0", 20))
			So(err, ShouldEqual, nil)
			So(res.StatusCode, ShouldEqual, 404)

			for id := range games {
				res, err = http.Get(server.URL + "/" + id)
				So(err, ShouldEqual, nil)
				So(res.StatusCode, ShouldEqual, 200)
			}

			Convey("/ws", func() {
				// 404 on invalid game id
				res, err := http.Get(server.URL + "/" + strings.Repeat("0", 20) + "/ws")
				So(err, ShouldEqual, nil)
				So(res.StatusCode, ShouldEqual, 404)

				So(len(games), ShouldBeGreaterThan, 0)
				for id, game := range games {
					uri, _ := url.Parse(server.URL + "/" + id + "/ws")
					uri.Scheme = "ws"

					// invalid username
					ws, _, err := websocket.DefaultDialer.Dial(uri.String(), nil)
					So(err, ShouldEqual, nil)
					ws.WriteMessage(websocket.TextMessage, []byte("--"))
					_, _, err = ws.NextReader()
					So(err, ShouldNotEqual, nil)

					var sockets []*websocket.Conn
					for i := 0; i < 4; i++ {
						username := []byte(strings.Repeat(strconv.Itoa(i), 3))
						// set username
						ws, _, err := websocket.DefaultDialer.Dial(uri.String(), nil)
						So(err, ShouldEqual, nil)
						So(len(game.Players), ShouldEqual, i)
						ws.WriteMessage(websocket.TextMessage, username)
						time.Sleep(time.Millisecond * 5)
						So(len(game.Players), ShouldEqual, i+1)

						// set same username with a new socket
						ws, _, err = websocket.DefaultDialer.Dial(uri.String(), nil)
						So(err, ShouldEqual, nil)
						ws.WriteMessage(websocket.TextMessage, username)
						var res map[string]interface{}
						ws.ReadJSON(&res)
						So(res["error"], ShouldEqual, "Username taken")

						sockets = append(sockets, ws)
					}
				}
			})
		})
	})
}
