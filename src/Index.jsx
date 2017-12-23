import "./main.sass"

import React, {Fragment} from "react"
import ReactDOM from "react-dom"

import Snackbar from "material-ui/Snackbar"
import UsernamePicker from "./UsernamePicker"
import Header from "./Header"
import Settings from "./Settings"

class Index extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			error: "",
			username: localStorage.username || "",
		}
	}

	setUsername(username) {
		localStorage.username = username
		this.setState({
			error: "",
			username,
		})
	}

	render() {
		return (
			<Fragment>
				<Snackbar open={!!this.state.error} message={this.state.error} />
				<UsernamePicker
					username={this.state.username}
					onChange={this.setUsername.bind(this)}
					onError={(error) => this.setState({error})}
				/>
				<Header username={this.state.username} onUsernameChange={() => this.setUsername("")} />
				<Settings username={this.state.username} />
			</Fragment>
		)
	}
}

addEventListener("DOMContentLoaded", () => {
	ReactDOM.render(<Index />, document.getElementById("root"))
})
