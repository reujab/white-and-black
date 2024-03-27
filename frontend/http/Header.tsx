import * as React from "react"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import favicon from "./favicon.png"

interface Props {
	onUsernameChange?: () => void
	username: string
}

class Header extends React.Component<Props> {
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

export default Header
