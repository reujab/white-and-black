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
				<UsernamePicker username={this.state.username} onChange={this.setUsername.bind(this)} />
				<Header username={this.state.username} />
			</Fragment>
		)
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
