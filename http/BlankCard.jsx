import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import Grid from "@material-ui/core/Grid"
import PropTypes from "prop-types"
import React from "react"
import TextField from "@material-ui/core/TextField"

class BlankCard extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			input: "",
		}
	}

	render() {
		return (
			<Dialog open={this.props.show}>
				<DialogTitle>Blank card</DialogTitle>
				<Grid
					container
					style={{
						margin: 0,
						padding: 20,
						width: "100%",
					}}
				>
					<Grid item xs={12}>
						<TextField
							fullWidth
							value={this.state.input}
							InputProps={{inputProps: {maxLength: 1024}}}
							onChange={(e) => this.setState({
								input: e.target.value,
							})}
						/>
					</Grid>
					<Grid item xs={12}>
						<Button
							variant="contained"
							disabled={!this.state.input.length}
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

BlankCard.propTypes = {
	onChange: PropTypes.func.isRequired,
	show: PropTypes.bool.isRequired,
}

export default BlankCard
