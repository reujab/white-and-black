import PropTypes from "prop-types"
import React from "react"

class MiniCard extends React.Component {
	render() {
		return (
			<div
				style={{
					alignItems: "center",
					display: "inline-flex",
					marginRight: 25,
				}}
			>
				<div
					style={{
						background: this.props.color,
						border: "1px solid black",
						borderRadius: 3,
						display: "inline-block",
						height: 30,
						marginRight: 5,
						width: 20,
					}}
				/>
				{this.props.children}
			</div>
		)
	}
}

MiniCard.propTypes = {
	children: PropTypes.number.isRequired,
	color: PropTypes.string.isRequired,
}

export default MiniCard
