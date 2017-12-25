import "./main.sass"

import React, {Fragment} from "react"
import ReactDOM from "react-dom"

import Snackbar from "material-ui/Snackbar"
import BlankCard from "./BlankCard"
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
			username: localStorage.username || "",
			fillingBlank: false,

			error: "",
			players: [],
			started: true, // assume game has started until told otherwise
			blackCard: null,
			hand: [],
			highlighted: null,
			selected: null,
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

	selectCard(card) {
		if (this.state.highlighted === card) {
			// card is already highlighted
			if (card === "_") {
				this.setState({
					fillingBlank: true,
				})
			} else {
				this.send({
					id: "select",
					card,
				})
			}
		} else if (this.state.fillingBlank) {
			// blank card was previously selected
			this.setState({
				fillingBlank: false,
			})
			this.send({
				id: "select",
				card,
			})
		} else {
			// card is not yet highlighted
			this.setState({
				highlighted: card,
			})
		}
	}

	render() {
		return (
			<Fragment>
				<Snackbar open={!!this.state.error} message={this.state.error} />
				<BlankCard show={this.state.fillingBlank} onChange={this.selectCard.bind(this)} />
				<UsernamePicker username={this.state.username} onChange={this.setUsername.bind(this)} />

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
						<BlackCard selected={this.state.czarSelection ? null : this.state.selected}>{this.state.blackCard}</BlackCard>
						<WhiteCards
							hand={this.state.hand}
							czarSelection={this.state.czarSelection}
							czar={this.state.players.some((player) => player.username === this.state.username && player.czar)}
							highlighted={this.state.highlighted}
							onClick={this.selectCard.bind(this)}
						/>
					</Grid>
				</Grid>
			</Fragment>
		)
	}
}

addEventListener("DOMContentLoaded", () => {
	ReactDOM.render(<Game />, document.getElementById("root"))
})
