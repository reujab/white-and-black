import "./index.sass"

import React from "react"
import ReactDOM from "react-dom"

import AppBar from "material-ui/AppBar"
import Toolbar from "material-ui/Toolbar"
import Typography from "material-ui/Typography"
import IconButton from "material-ui/IconButton"

if (navigator.standalone) {
	document.documentElement.classList.add("standalone")
}

addEventListener("DOMContentLoaded", () => {
	ReactDOM.render([
		<AppBar key="appbar" position="static" style={{
			marginBottom: "10px",
		}}>
			<Toolbar>
				<IconButton disabled={true} style={{
					borderRadius: 0,
					marginRight: "10px",
				}}>
					<img src="/static/favicon.png" style={{
						width: "100%",
					}} />
				</IconButton>
				<Typography type="title" color="inherit">White & Black</Typography>
			</Toolbar>
		</AppBar>,
	], document.getElementById("root"))
})
