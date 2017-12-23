import PropTypes from "prop-types"
import React from "react"

class BlackCard extends React.Component {
	render() {
		return this.props.children ? (
			<div className="card-wrapper">
				<div className="card black">{this.props.children}</div>
			</div>
		) : null
	}
}

BlackCard.propTypes = {
	children: PropTypes.string,
}

export default BlackCard
