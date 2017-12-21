import React from "react"

import AppBar from "material-ui/AppBar"
import IconButton from "material-ui/IconButton"
import Toolbar from "material-ui/Toolbar"
import Typography from "material-ui/Typography"

export default <AppBar key="header" position="static" style={{
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
		<Typography type="title" color="inherit">White & Black</Typography>
	</Toolbar>
</AppBar>
