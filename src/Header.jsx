import PropTypes from "prop-types"
import React from "react"

import {
	AppBar,
	IconButton,
	Toolbar,
	Typography,
} from "material-ui"

class Header extends React.Component {
	render() {
		return (
			<AppBar position="static" style={{
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
					<Typography type="title" color="inherit" style={{
						flexGrow: 1,
					}}>White & Black</Typography>
					<span onClick={this.props.onUsernameChange} style={{
						cursor: this.props.onUsernameChange ? "pointer" : "default",
					}}>{this.props.username}</span>
				</Toolbar>
			</AppBar>
		)
	}
}

Header.propTypes = {
	username: PropTypes.string.isRequired,
	onUsernameChange: PropTypes.func,
}

export default Header
