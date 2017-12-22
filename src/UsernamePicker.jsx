import PropTypes from "prop-types"
import React, {Fragment} from "react"

import {
	Button,
	Dialog,
	DialogTitle,
	Grid,
	Snackbar,
	TextField,
} from "material-ui"

class UsernamePicker extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			usernameInput: "",
			error: "",
		}
	}

	render() {
		return (
			<Fragment>
				<Dialog open={!this.props.username}>
					<DialogTitle>Set username</DialogTitle>
					<Grid container style={{
						padding: 20,
					}}>
						<Grid item xs={12} sm={8}>
							<TextField fullWidth label="Username" onChange={(e) => this.setState({
								error: "",
								usernameInput: e.target.value,
							})} onKeyDown={(e) => e.key === "Enter" && this.setUsername()} />
						</Grid>
						<Grid item xs={6} sm={12 - 8}>
							<Button raised onClick={this.setUsername.bind(this)}>Submit</Button>
						</Grid>
					</Grid>
				</Dialog>
				<Snackbar open={!!this.state.error} message={this.state.error} />
			</Fragment>
		)
	}

	handleState(key) {
		return (e) => this.setState({
			[key]: e.target.value,
		})
	}

	setUsername() {
		const username = this.state.usernameInput

		if (username.length < 3) {
			this.setState({
				error: "Username too short",
			})
			return
		}

		if (username.length > 16) {
			this.setState({
				error: "Username too long",
			})
			return
		}

		this.props.onChange(username)
	}
}

UsernamePicker.propTypes = {
	username: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
}

export default UsernamePicker
