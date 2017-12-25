import PropTypes from "prop-types"
import React from "react"

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

	render() {
		return (
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
							InputProps={{inputProps: {maxLength: 16}}}
							onChange={(e) => this.setState({
								input: e.target.value,
							})}
							onKeyDown={(e) => e.key === "Enter" && this.props.onChange(this.state.input)}
						/>
					</Grid>
					<Grid
						item
						xs={6}
						sm={12 - 8}
					>
						<Button
							raised
							disabled={this.state.input.length < 3}
							onClick={() => this.props.onChange(this.state.input)}
						>
							Submit
						</Button>
					</Grid>
				</Grid>
			</Dialog>
		)
	}
}

UsernamePicker.propTypes = {
	onChange: PropTypes.func.isRequired,
	username: PropTypes.string.isRequired,
}

export default UsernamePicker
