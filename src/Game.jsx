import "./main.sass"

import React, {Fragment} from "react"
import ReactDOM from "react-dom"

import Snackbar from "material-ui/Snackbar"
import UsernamePicker from "./UsernamePicker"
import Header from "./Header"
import Grid from "material-ui/Grid"
import PlayerList from "./PlayerList"
import BlackCard from "./BlackCard"
import WhiteCards from "./WhiteCards"

class Game extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			error: "",
			username: localStorage.username || "",
			players: [],
			started: true, // assume game has started until told otherwise
			blackCard: null,
			hand: [],
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
			error: "",
			username,
		})

		this.ws = new WebSocket(`ws://${location.host + location.pathname}/ws`)
		this.ws.onopen = () => {
			this.ws.send(username)
		}
		this.ws.onmessage = (e) => {
			const state = JSON.parse(e.data)
			console.log(state)
			this.setState(state)
		}
	}

	send(msg) {
		this.ws.send(JSON.stringify(msg))
	}

	render() {
		return (
			<Fragment>
				<Snackbar open={!!this.state.error} message={this.state.error} />
				<UsernamePicker
					username={this.state.username}
					onChange={this.setUsername.bind(this)}
				/>
				<Header username={this.state.username} />
				<Grid
					container
					style={{
						margin: 0,
						width: "100%",
					}}
				>
					<Grid
						item
						xs={12}
						md={3}
						lg={2}
					>
						<PlayerList
							username={this.state.username}
							players={this.state.players}
							started={this.state.started}
							onStart={() => this.send({id: "start"})}
						/>
					</Grid>
					<Grid
						item
						xs={12}
						md={12 - 3}
						lg={12 - 2}
						style={"orientation" in window ? {padding: 0} : {}}
					>
						<BlackCard>{this.state.blackCard}</BlackCard>
						<WhiteCards onSelect={(selectedCard) => console.log(selectedCard)}>{this.state.hand}</WhiteCards>
					</Grid>
				</Grid>
			</Fragment>
		)
	}
}

addEventListener("DOMContentLoaded", () => {
	ReactDOM.render(<Game />, document.getElementById("root"))
})
