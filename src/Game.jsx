import "./main.sass"

import React, {Fragment} from "react"
import ReactDOM from "react-dom"

import UsernamePicker from "./UsernamePicker"
import Header from "./Header"
import PlayerList from "./PlayerList"

class Game extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			username: localStorage.username || "",
			usernameError: "",
			started: true, // assume game has started until told otherwise
			players: [],
		}
	}

	componentWillMount() {
		if (this.state.username) {
			this.setUsername(this.state.username)
		}
	}

	setUsername(username) {
		localStorage.username = username
		this.setState({
			username,
			usernameError: "",
		})

		this.ws = new WebSocket(`ws://${location.host + location.pathname}/ws`)
		this.ws.onopen = () => {
			this.ws.send(username)
		}
		this.ws.onmessage = (e) => {
			const res = JSON.parse(e.data)
			switch (res.id) {
			case "error":
				switch (res.err) {
				case "username taken":
					this.setState({
						username: "",
						usernameError: "Username taken",
					})
					break
				case "game started":
					this.setState({
						usernameError: "Game has already started", // FIXME: don't use usernameError
					})
					break
				default:
					console.error("unknown err", res.err)
				}
				break
			case "game state":
				this.setState({
					started: res.started,
				})
				break
			case "players":
				this.setState({
					players: res.players,
				})
				break
			default:
				console.error("unknown msg", res)
			}
		}
	}

	send(msg) {
		this.ws.send(JSON.stringify(msg))
	}

	render() {
		return (
			<Fragment>
				<UsernamePicker
					error={this.state.usernameError}
					username={this.state.username}
					onChange={this.setUsername.bind(this)}
				/>
				<Header username={this.state.username} />
				<PlayerList
					username={this.state.username}
					players={this.state.players}
					started={this.state.started}
					onStart={() => this.send({id: "start game"})}
				/>
			</Fragment>
		)
	}
}

addEventListener("DOMContentLoaded", () => {
	ReactDOM.render(<Game />, document.getElementById("root"))
})
