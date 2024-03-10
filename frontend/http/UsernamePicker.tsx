import * as React from "react"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import Grid from "@material-ui/core/Grid"
import TextField from "@material-ui/core/TextField"

interface Props {
	onChange: (string) => void
	username: string
}

interface State {
	input: string
}

class UsernamePicker extends React.Component<Props, State> {
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
					spacing={8}
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
							placeholder="Username"
							value={this.state.input}
							InputProps={{ inputProps: { maxLength: 16 } }}
							onChange={(e) => this.setState({
								input: e.target.value,
							})}
							onKeyDown={(e) => e.key === "Enter" && this.props.onChange(this.state.input)}
						/>
					</Grid>
					<Grid
						item
						xs={6}
						sm={4}
					>
						<Button
							fullWidth
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

export default UsernamePicker
