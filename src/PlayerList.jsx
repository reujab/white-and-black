import PropTypes from "prop-types"
import React from "react"

import List, {ListItem, ListItemIcon, ListItemText} from "material-ui/List"
import Tooltip from "material-ui/Tooltip"
import Star from "material-ui-icons/Star"
import Warning from "material-ui-icons/Warning"
import Button from "material-ui/Button"

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
						<Tooltip title="Card Czar">
							<ListItemIcon>
								<Warning />
							</ListItemIcon>
						</Tooltip>
					) || player.czar && (
						<Tooltip title="Offline">
							<ListItemIcon>
								<Star />
							</ListItemIcon>
						</Tooltip>
					)}
					<ListItemText
						inset
						primary={player.username}
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
						raised
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
