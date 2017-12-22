import "./main.sass"

import React from "react"
import ReactDOM from "react-dom"

import Header from "./Header"
import UsernamePicker from "./UsernamePicker"

class Game extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			username: localStorage.username || "",
		}
	}

	render() {
		return [
			<UsernamePicker key="usernamePicker" username={this.state.username} onChange={this.setUsername.bind(this)} />,
			<Header key="header" username={this.state.username} />,
		]
	}

	setUsername(username) {
		localStorage.username = username
		this.setState({
			username,
		})

		// TODO: connect to websocket
	}
}

addEventListener("DOMContentLoaded", () => {
	ReactDOM.render(<Game />, document.getElementById("root"))
})
