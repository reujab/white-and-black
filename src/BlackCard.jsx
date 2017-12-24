import PropTypes from "prop-types"
import React from "react"

class BlackCard extends React.Component {
	render() {
		return this.props.children && (
			<div className="card-wrapper">
				<div className="card black" dangerouslySetInnerHTML={{__html: this.props.children.text.replace(/_/g, "________")}} />
			</div>
		)
	}
}

BlackCard.propTypes = {
	children: PropTypes.shape({
		pick: PropTypes.number,
		text: PropTypes.string,
	}),
}

export default BlackCard
