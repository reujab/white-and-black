import "babel-polyfill"
import Header from "./Header"
import React, {Fragment} from "react"
import ReactDOM from "react-dom"
import Settings from "./Settings"
import UsernamePicker from "./UsernamePicker"

class Index extends React.Component {
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
			<Fragment>
				<UsernamePicker username={this.state.username} onChange={this.setUsername.bind(this)} />
				<Header username={this.state.username} onUsernameChange={() => this.setUsername("")} />
				<Settings username={this.state.username} />
			</Fragment>
		)
	}
}

addEventListener("DOMContentLoaded", () => {
	ReactDOM.render(<Index />, document.getElementById("root"))
})
