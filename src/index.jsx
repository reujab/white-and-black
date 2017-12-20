import "./index.sass"

import React from "react"
import ReactDOM from "react-dom"

import AppBar from "material-ui/AppBar"
import IconButton from "material-ui/IconButton"
import Settings from "./Settings"
import Toolbar from "material-ui/Toolbar"
import Typography from "material-ui/Typography"

if (navigator.standalone) {
	document.documentElement.classList.add("standalone")
}

addEventListener("DOMContentLoaded", () => {
	ReactDOM.render([
		<AppBar key="appbar" position="static" style={{
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
		</AppBar>,
		<Settings key="settings" />,
	], document.getElementById("root"))
})
