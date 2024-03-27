import "babel-polyfill"
import * as React from "react"
import Header from "./Header"
import ReactDOM from "react-dom"
import Settings from "./Settings"
import UsernamePicker from "./UsernamePicker"

interface State {
	username: string
}

class Index extends React.Component<any, State> {
	constructor(props) {
		super(props)

		this.state = {
			username: localStorage.username || "",
		}
	}

	setUsername(username) {
		localStorage.username = username
		this.setState({
			username,
		})
	}

	render() {
		return (
			<React.Fragment>
				<UsernamePicker username={this.state.username} onChange={this.setUsername.bind(this)} />
				<Header username={this.state.username} onUsernameChange={() => this.setUsername("")} />
				<Settings username={this.state.username} />
			</React.Fragment>
		)
	}
}

addEventListener("DOMContentLoaded", () => {
	ReactDOM.render(<Index />, document.getElementById("root"))
})
