import Button from "@material-ui/core/Button"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import PropTypes from "prop-types"
import React from "react"
import Star from "@material-ui/icons/Star"
import Tooltip from "@material-ui/core/Tooltip"
import Warning from "@material-ui/icons/Warning"

class PlayerList extends React.Component {
	render() {
		let owner = false
		let online = 0
		const players = this.props.players.map((player) => {
			if (player.owner && player.username === this.props.username) {
				owner = true
			}

			if (player.online) {
				online++
			}

			/* eslint-disable indent */
			return (
				<ListItem key={player.username} button>
					{!player.online && (
						<Tooltip title="Offline">
							<ListItemIcon>
								<Warning />
							</ListItemIcon>
						</Tooltip>
					) || player.czar && (
						<Tooltip title="Card Czar">
							<ListItemIcon>
								<Star />
							</ListItemIcon>
						</Tooltip>
					)}
					<ListItemText
						inset
						primary={player.username}
						secondary={`${player.points} Awesome Point${player.points === 1 ? "" : "s"}`}
						style={{
							overflow: "hidden",
						}}
					/>
				</ListItem>
			)
			/* eslint-enable */
		})

		return (
			<List>
				{players}
				{owner && !this.props.started && (
					<Button
						variant="contained"
						disabled={online < 3}
						style={{
							marginTop: 10,
							width: "100%",
						}}
						onClick={this.props.onStart}
					>
						Start Game
					</Button>
				)}
			</List>
		)
	}
}

PlayerList.propTypes = {
	onStart: PropTypes.func.isRequired,
	players: PropTypes.arrayOf(PropTypes.shape({
		czar: PropTypes.bool.isRequired,
		online: PropTypes.bool.isRequired,
		owner: PropTypes.bool.isRequired,
		username: PropTypes.string.isRequired,
	})).isRequired,
	started: PropTypes.bool.isRequired,
	username: PropTypes.string.isRequired,
}

export default PlayerList
