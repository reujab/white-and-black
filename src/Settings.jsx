import React from "react"

import {
	Button,
	Checkbox,
	Grid,
	TextField,
	Tooltip,
	Typography,
	FormGroup,
	FormControlLabel,
} from "material-ui"
import MiniCard from "./MiniCard"

import deckMetadata from "./deck-metadata"
import superagent from "superagent"

class Settings extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			scoreLimit: 8,
			blankCards: 30,
			decks: [],
			blackCards: 0,
			whiteCards: 0,
		}

		this.handleChange = (key) => (e) => this.setState({
			[key]: e.target.value,
		})
	}

	render() {
		const decks = deckMetadata.map((deck) => <Tooltip key={deck[0]} title={`${deck[2]} Black Cards, ${deck[3]} White Cards`}>
			<FormControlLabel label={deck[1]} control={
				<Checkbox onChange={(e) => {
					if (e.target.checked) {
						this.setState({
							blackCards: this.state.blackCards + deck[2],
							whiteCards: this.state.whiteCards + deck[3],
						})
						this.state.decks.push(deck[0])
					} else {
						this.setState({
							blackCards: this.state.blackCards - deck[2],
							whiteCards: this.state.whiteCards - deck[3],
						})
						this.state.decks.splice(this.state.decks.indexOf(deck[0]), 1)
					}
				}} />
			} />
		</Tooltip>)

		return (
			<Grid container id="settings" style={{
				boxSizing: "border-box",
			}}>
				<Grid item xs={12}>
					<Typography type="headline">General</Typography>
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField label="Score Limit" value={this.state.scoreLimit} onChange={this.handleChange("scoreLimit")} fullWidth />
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField label="Blank Cards" value={this.state.blankCards} onChange={this.handleChange("blankCards")} fullWidth />
				</Grid>

				<Grid item xs={12}>
					<Typography type="headline">Decks</Typography>
				</Grid>
				<Grid item xs={12}>
					<FormGroup row>
						{decks}
					</FormGroup>
				</Grid>
				<Grid item xs={12}>
					<MiniCard color="black">{this.state.blackCards}</MiniCard>
					<MiniCard color="white">{this.state.whiteCards}</MiniCard>
				</Grid>

				<Grid item xs={12}>
					<Button raised onClick={this.submit.bind(this)}>Create Game</Button>
				</Grid>
			</Grid>
		)
	}

	async submit() {
		const res = await superagent.
			post("/create-game").
			send({
				scoreLimit: this.state.scoreLimit,
				blankCards: this.state.blankCards,
				decks: this.state.decks,
			})
		location.href = `/${res.text}`
	}
}

export default Settings
