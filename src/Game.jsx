import "./main.sass"

import React, {Fragment} from "react"
import ReactDOM from "react-dom"

import Header from "./Header"
import UsernamePicker from "./UsernamePicker"
import {
	Grid,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Tooltip,
} from "material-ui"
import Star from "material-ui-icons/Star"
import Warning from "material-ui-icons/Warning"

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

		const ws = new WebSocket(`ws://${location.host + location.pathname}/ws`)
		ws.onopen = () => {
			ws.send(username)
		}
		ws.onmessage = (e) => {
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
		const players = this.state.players.map((player) => (
			<ListItem key={player.username} button>
				{player.czar ? (
					<Tooltip title="Card Czar">
						<ListItemIcon>
							<Star />
						</ListItemIcon>
					</Tooltip>
				) : !player.online ? ( // eslint-disable-line
					<Tooltip title="Offline">
						<ListItemIcon>
							<Warning />
						</ListItemIcon>
					</Tooltip>
				) : null}
				<ListItemText
					inset
					primary={player.username}
					style={{
						overflow: "hidden",
					}}
				/>
			</ListItem>
		))

		return (
			<Fragment>
				<UsernamePicker
					error={this.state.usernameError}
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
						<List>
							{players}
						</List>
					</Grid>
				</Grid>
			</Fragment>
		)
	}
}

addEventListener("DOMContentLoaded", () => {
	ReactDOM.render(<Game />, document.getElementById("root"))
})
