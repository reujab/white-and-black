import "./index.sass"

import PropTypes from "prop-types"
import React from "react"
import ReactDOM from "react-dom"

import AppBar from "material-ui/AppBar"
import Checkbox from "material-ui/Checkbox"
import Grid from "material-ui/Grid"
import IconButton from "material-ui/IconButton"
import TextField from "material-ui/TextField"
import Toolbar from "material-ui/Toolbar"
import Tooltip from "material-ui/Tooltip"
import Typography from "material-ui/Typography"
import {FormGroup, FormControlLabel} from "material-ui/Form"

if (navigator.standalone) {
	document.documentElement.classList.add("standalone")
}

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
		const decks = [
			["base", "Base", 90, 460],
			["red", "Red Box", 70, 230],
			["blue", "Blue Box", 80, 220],
			["green", "Green Box", 55, 245],
			["90s", "90s Nostalgia", 7, 23],
			["box", "Box Expansion", 0, 21],
			["fantasy", "Fantasy", 6, 26],
			["food", "Food", 6, 24],
			["science", "Science", 7, 23],
			["www", "World Wide Web", 9, 21],
			["hillary", "Hillary", 3, 11],
			["trump", "Trump", 6, 34],
			["holiday", "Holiday", 16, 44],
			["pax", "PAX", 31, 121],
			["house of cards", "House of Cards", 9, 16],
			["reject", "Reject", 18, 40],
			["canadian", "Canadian", 5, 21],
			["apples2apples", "Apples to Apples\u00ae", 249, 747],
			["crabs adjust humidity", "Crabs Adjust Humidity", 129, 320],
			["cads about matrimony", "Cads About Matrimony", 55, 230],
			// TODO: more decks
		].map((deck) => <Tooltip key={deck[0]} title={`${deck[2]} Black Cards, ${deck[3]} White Cards`}>
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
			</Grid>
		)
	}
}

class MiniCard extends React.Component {
	render() {
		return (
			<div style={{
				display: "inline-flex",
				alignItems: "center",
				marginRight: 25,
			}}>
				<div style={{
					width: 20,
					height: 30,
					display: "inline-block",
					borderRadius: 3,
					background: this.props.color,
					border: "1px solid black",
					marginRight: 5,
				}} />
				{this.props.children}
			</div>
		)
	}
}

MiniCard.propTypes = {
	color: PropTypes.string.isRequired,
	children: PropTypes.number.isRequired,
}

addEventListener("DOMContentLoaded", () => {
	ReactDOM.render([
		<AppBar key="appbar" position="static" style={{
			marginBottom: 10,
		}}>
			<Toolbar>
				<IconButton disabled={true} style={{
					borderRadius: 0,
					marginRight: 10,
				}}>
					<img src="/static/favicon.png" style={{
						width: "100%",
					}} />
				</IconButton>
				<Typography type="title" color="inherit">White & Black</Typography>
			</Toolbar>
		</AppBar>,
		<Settings key="settings" />,
	], document.getElementById("root"))
})
