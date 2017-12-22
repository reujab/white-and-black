import "./main.sass"

import React from "react"
import ReactDOM from "react-dom"

import Header from "./Header"
import Settings from "./Settings"

class Index extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			username: localStorage.username || "",
		}
	}

	render() {
		return [
			<Header key="header" username={this.state.username} onUsernameChange={this.resetUsername.bind(this)}/>,
			<Settings key="settings" />,
		]
	}

	resetUsername() {
		delete localStorage.username
		this.setState({
			username: "",
		})
	}
}

addEventListener("DOMContentLoaded", () => {
	ReactDOM.render(<Index />, document.getElementById("root"))
})
