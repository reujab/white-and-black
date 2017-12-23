import "./main.sass"

import React, {Fragment} from "react"
import ReactDOM from "react-dom"

import Snackbar from "material-ui/Snackbar"
import UsernamePicker from "./UsernamePicker"
import Header from "./Header"
import Grid from "material-ui/Grid"
import PlayerList from "./PlayerList"
import BlackCard from "./BlackCard"
import Hand from "./Hand"

class Game extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			error: "",
			username: localStorage.username || "",
			started: true, // assume game has started until told otherwise
			players: [],
			hand: [],
			blackCard: null,
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
			const res = JSON.parse(e.data)
			switch (res.id) {
			case "error":
				switch (res.err) {
				case "username taken":
					this.setState({
						username: "",
						error: "Username taken",
					})
					break
				case "game started":
					this.setState({
						error: "Game has already started",
					})
					break
				default:
					console.error("unknown err", res.err)
				}
				break
			case "game state":
				this.setState({
					started: res.started,
					blackCard: res.blackCard,
				})
				break
			case "players":
				this.setState({
					players: res.players,
				})
				break
			case "hand":
				this.setState({
					hand: res.hand,
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
				<Snackbar open={!!this.state.error} message={this.state.error} />
				<UsernamePicker
					username={this.state.username}
					onChange={this.setUsername.bind(this)}
					onError={(error) => this.setState({error})}
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
							onStart={() => this.send({id: "start game"})}
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
						<Hand onSelect={(selectedCard) => console.log(selectedCard)}>{this.state.hand}</Hand>
					</Grid>
				</Grid>
			</Fragment>
		)
	}
}

addEventListener("DOMContentLoaded", () => {
	ReactDOM.render(<Game />, document.getElementById("root"))
})
