import AppBar from "@material-ui/core/AppBar"
import PropTypes from "prop-types"
import React from "react"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import favicon from "./favicon.png"

class Header extends React.Component {
	render() {
		return (
			<AppBar
				position="static"
				style={{
					marginBottom: 10,
				}}
			>
				<Toolbar>
					<img
						src={favicon}
						style={{
							height: `${64 - 4 * 2}px`,
							marginRight: "10px",
						}}
					/>
					<Typography
						variant="title"
						color="inherit"
						style={{
							flexGrow: 1,
							whiteSpace: "nowrap",
						}}
					>
						White & Black
					</Typography>
					<span
						onClick={this.props.onUsernameChange}
						style={{
							cursor: this.props.onUsernameChange ? "pointer" : "default",
							overflow: "hidden",
							textOverflow: "ellipsis",
						}}
					>
						{this.props.username}
					</span>
				</Toolbar>
			</AppBar>
		)
	}
}

Header.propTypes = {
	onUsernameChange: PropTypes.func,
	username: PropTypes.string.isRequired,
}

export default Header
