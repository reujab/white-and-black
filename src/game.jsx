import "./main.sass"

import React from "react"
import ReactDOM from "react-dom"

import Header from "./Header"

addEventListener("DOMContentLoaded", () => {
	ReactDOM.render([
		Header,
	], document.getElementById("root"))
})
