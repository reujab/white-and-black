import PropTypes from "prop-types"
import React from "react"

class Hand extends React.Component {
	render() {
		return (
			<div
				style={"orientation" in window ? {
					WebkitOverflowScrolling: "touch",
					overflow: "auto",
					paddingBottom: 5, // padding for iOS inline scroll bar
					whiteSpace: "nowrap",
				} : {}}
			>
				{this.props.children.map((card) => (
					<div key={card} className="card-wrapper">
						<div
							className={`card ${this.props.selectedCard === card ? "selected" : ""}`}
							dangerouslySetInnerHTML={{__html: card}}
							onClick={() => this.props.onSelect(card)}
						/>
					</div>
				))}
			</div>
		)
	}
}

Hand.propTypes = {
	children: PropTypes.arrayOf(PropTypes.string).isRequired,
	onSelect: PropTypes.func.isRequired,
	selectedCard: PropTypes.string,
}

export default Hand
