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
				if (res.err === "username taken") {
					this.setState({
						username: "",
						usernameError: "Username taken",
					})
				}
				break
			case "players":
				console.log(res.players)
				this.setState({
					players: res.players,
				})
				break
			default:
				console.error("Unknown message", res)
			}
		}
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
					onStart={() => this.ws.send({id: "start game"})}
				/>
			</Fragment>
		)
	}
}

addEventListener("DOMContentLoaded", () => {
	ReactDOM.render(<Game />, document.getElementById("root"))
})
