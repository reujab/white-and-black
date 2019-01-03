import * as React from "react"
import Button from "@material-ui/core/Button"
import Checkbox from "@material-ui/core/Checkbox"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import FormGroup from "@material-ui/core/FormGroup"
import Grid from "@material-ui/core/Grid"
import MiniCard from "./MiniCard"
import TextField from "@material-ui/core/TextField"
import Tooltip from "@material-ui/core/Tooltip"
import Typography from "@material-ui/core/Typography"
import deckMetadata from "../cards/metadata"
import superagent from "superagent"

interface Props {
	username: string
}

interface State {
	scoreLimit: string
	blankCards: string
	decks: string[]
	blackCards: number
	whiteCards: number
}

class Settings extends React.Component<Props, State> {
	constructor(props) {
		super(props)

		this.state = {
			scoreLimit: "8",
			blankCards: "30",
			decks: [],
			blackCards: 0,
			whiteCards: 0,
		}
	}

	isInputValid() {
		const scoreLimit = parseInt(this.state.scoreLimit)
		const blankCards = parseInt(this.state.blankCards)
		return (
			!isNaN(scoreLimit) &&
			!isNaN(blankCards) &&
			scoreLimit > 0 &&
			scoreLimit <= 255 &&
			blankCards >= 0 &&
			blankCards <= 255 &&
			this.state.decks.length !== 0
		)
	}

	async submit() {
		const res = await superagent.
			post("/create-game").
			send({
				scoreLimit: parseInt(this.state.scoreLimit),
				blankCards: parseInt(this.state.blankCards),
				decks: this.state.decks,
				owner: this.props.username,
			})
		location.href = `/${res.text}`
	}

	render() {
		const decks = deckMetadata.map((deck) => (
			<Tooltip key={deck[0]} title={`${deck[2]} Black Cards, ${deck[3]} White Cards`}>
				<FormControlLabel
					label={deck[1]}
					control={
						<Checkbox
							onChange={(e) => {
								const blackCards = deck[2] as number
								const whiteCards = deck[3] as number
								if (e.target.checked) {
									this.setState((state) => ({
										blackCards: state.blackCards + blackCards,
										whiteCards: state.whiteCards + whiteCards,
									}))
									this.state.decks.push(deck[0] as string)
								} else {
									this.setState((state) => ({
										blackCards: state.blackCards - blackCards,
										whiteCards: state.whiteCards - whiteCards,
									}))
									this.state.decks.splice(this.state.decks.indexOf(deck[0] as string), 1)
								}
							}}
						/>
					}
				/>
			</Tooltip>
		))

		return (
			<Grid
				container
				spacing={16}
				style={{
					margin: "auto",
					maxWidth: 750,
					width: "100%",
				}}
			>
				<Grid item xs={12}>
					<Typography variant="headline">General</Typography>
				</Grid>
				<Grid
					item
					xs={12}
					sm={6}
				>
					<TextField
						label="Score Limit"
						value={this.state.scoreLimit}
						onChange={(e) => this.setState({ scoreLimit: e.target.value })}
						fullWidth
					/>
				</Grid>
				<Grid
					item
					xs={12}
					sm={6}
				>
					<TextField
						label="Blank Cards"
						value={this.state.blankCards}
						onChange={(e) => this.setState({ blankCards: e.target.value })}
						fullWidth
					/>
				</Grid>

				<Grid item xs={12}>
					<Typography variant="headline">Decks</Typography>
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
					<Button
						variant="contained"
						disabled={!this.isInputValid()}
						onClick={this.submit.bind(this)}
					>
						Create Game
					</Button>
				</Grid>
			</Grid>
		)
	}
}

export default Settings
