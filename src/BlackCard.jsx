import PropTypes from "prop-types"
import React, {Fragment} from "react"

class BlackCard extends React.Component {
	render() {
		return this.props.children && (
			<Fragment>
				<div className="card-wrapper">
					<div className="card black" dangerouslySetInnerHTML={{__html: this.props.children.text.replace(/_/g, "________")}} />
				</div>
				{this.props.selected && this.props.selected.map((card) => (
					<div key={card} className="card-wrapper">
						<div className="card white" dangerouslySetInnerHTML={{__html: card}} />
					</div>
				))}
			</Fragment>
		)
	}
}

BlackCard.propTypes = {
	children: PropTypes.shape({
		pick: PropTypes.number,
		text: PropTypes.string,
	}),
	selected: PropTypes.arrayOf(PropTypes.string),
}

export default BlackCard
