import PropTypes from "prop-types"
import React from "react"

class BlackCard extends React.Component {
	render() {
		return this.props.children ? (
			<div className="card-wrapper">
				<div className="card black" dangerouslySetInnerHTML={{__html: this.props.children.replace(/_/g, "________")}} />
			</div>
		) : null
	}
}

BlackCard.propTypes = {
	children: PropTypes.string,
}

export default BlackCard
