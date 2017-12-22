import "./main.sass"

import React, {Fragment} from "react"
import ReactDOM from "react-dom"

import Header from "./Header"
import UsernamePicker from "./UsernamePicker"

class Game extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			username: localStorage.username || "",
			usernameError: "",
		}
	}

	componentWillMount() {
		if (this.state.username) {
			this.setUsername(this.state.username)
		}
	}

	render() {
		return (
			<Fragment>
				<UsernamePicker error={this.state.usernameError} username={this.state.username} onChange={this.setUsername.bind(this)} />
				<Header username={this.state.username} />
			</Fragment>
		)
	}

	setUsername(username) {
		localStorage.username = username
		this.setState({
			username,
			usernameError: "",
		})

		const ws = new WebSocket(`ws://${location.host + location.pathname}/ws`)
		ws.onopen = () => {
			ws.send(username)
		}
		ws.onmessage = (e) => {
			switch (e.data) {
			case "err:taken":
				this.setState({
					username: "",
					usernameError: "Username taken",
				})
				break
			default:
				console.error("Unknown message", e)
			}
		}
	}
}

addEventListener("DOMContentLoaded", () => {
	ReactDOM.render(<Game />, document.getElementById("root"))
})
