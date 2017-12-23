import PropTypes from "prop-types"
import React, {Fragment} from "react"

import Dialog, {DialogTitle} from "material-ui/Dialog"
import Grid from "material-ui/Grid"
import TextField from "material-ui/TextField"
import Button from "material-ui/Button"

class UsernamePicker extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			input: "",
		}
	}

	setUsername() {
		const username = this.state.input

		if (username.length < 3) {
			this.props.onError("Username too short")
			return
		}

		if (username.length > 16) {
			this.props.onError("Username too long")
			return
		}

		this.props.onChange(username)
	}

	render() {
		return (
			<Fragment>
				<Dialog open={!this.props.username}>
					<DialogTitle>Set username</DialogTitle>
					<Grid
						container
						style={{
							margin: 0,
							padding: 20,
							width: "100%",
						}}
					>
						<Grid
							item
							xs={12}
							sm={8}
						>
							<TextField
								fullWidth
								label="Username"
								value={this.state.input}
								onChange={(e) => this.setState({
									input: e.target.value,
								})}
								onKeyDown={(e) => e.key === "Enter" && this.setUsername()}
							/>
						</Grid>
						<Grid
							item
							xs={6}
							sm={12 - 8}
						>
							<Button raised onClick={this.setUsername.bind(this)}>Submit</Button>
						</Grid>
					</Grid>
				</Dialog>
			</Fragment>
		)
	}
}

UsernamePicker.propTypes = {
	onChange: PropTypes.func.isRequired,
	onError: PropTypes.func.isRequired,
	username: PropTypes.string.isRequired,
}

export default UsernamePicker
