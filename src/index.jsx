import "./main.sass"

import React from "react"
import ReactDOM from "react-dom"

import Header from "./Header"
import Settings from "./Settings"

addEventListener("DOMContentLoaded", () => {
	ReactDOM.render([
		Header,
		<Settings key="settings" />,
	], document.getElementById("root"))
})
