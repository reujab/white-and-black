import PropTypes from "prop-types"
import React from "react"

class MiniCard extends React.Component {
	render() {
		return (
			<div style={{
				display: "inline-flex",
				alignItems: "center",
				marginRight: 25,
			}}>
				<div style={{
					width: 20,
					height: 30,
					display: "inline-block",
					borderRadius: 3,
					background: this.props.color,
					border: "1px solid black",
					marginRight: 5,
				}} />
				{this.props.children}
			</div>
		)
	}
}

MiniCard.propTypes = {
	color: PropTypes.string.isRequired,
	children: PropTypes.number.isRequired,
}

export default MiniCard
