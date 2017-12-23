import PropTypes from "prop-types"
import React from "react"

import {
	Button,
	Grid,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Tooltip,
} from "material-ui"
import Star from "material-ui-icons/Star"
import Warning from "material-ui-icons/Warning"

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
					{player.czar && (
						<Tooltip title="Card Czar">
							<ListItemIcon>
								<Star />
							</ListItemIcon>
						</Tooltip>
					) || !player.online && (
						<Tooltip title="Offline">
							<ListItemIcon>
								<Warning />
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
						{owner && (
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
				</Grid>
			</Grid>
		)
	}
}

PlayerList.propTypes = {
	onStart: PropTypes.func.isRequired,
	players: PropTypes.arrayOf(PropTypes.shape({
		username: PropTypes.string.isRequired,
		online: PropTypes.bool.isRequired,
		czar: PropTypes.bool.isRequired,
		owner: PropTypes.bool.isRequired,
	})).isRequired,
	username: PropTypes.string.isRequired,
}

export default PlayerList
