import PropTypes from "prop-types"
import React from "react"

class WhiteCards extends React.Component {
	render() {
		/* eslint-disable indent */
		return (
			<div
				style={"orientation" in window ? {
					WebkitOverflowScrolling: "touch",
					overflow: "auto",
					paddingBottom: 5, // padding for iOS inline scroll bar
					whiteSpace: "nowrap",
				} : {}}
			>
				{this.props.czarSelection && this.props.czarSelection.map((cards, i) => (
					<div key={cards} className="selection-wrapper">
						{cards.map((card, j) => (
							<div key={card === "" ? j : card} className="card-wrapper">
								<div
									className={`card white ${this.props.highlighted === i ? "highlighted" : ""} ${this.props.czar && card ? "" : "disabled"}`}
									dangerouslySetInnerHTML={{__html: card}}
									onClick={() => this.props.czar && card && this.props.onClick(i)}
								/>
							</div>
						))}
					</div>
				)) || this.props.hand && this.props.hand.map((card, i) => (
					<div key={card === "_" ? i : card} className="card-wrapper">
						<div
							className={`card white ${this.props.highlighted === card ? "highlighted" : ""}`}
							dangerouslySetInnerHTML={{__html: card === "_" ? "________" : card}}
							onClick={() => this.props.onClick(card)}
						/>
					</div>
				))}
			</div>
		)
		/* eslint-enable */
	}
}

WhiteCards.propTypes = {
	czar: PropTypes.bool.isRequired,
	czarSelection: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
	hand: PropTypes.arrayOf(PropTypes.string).isRequired,
	highlighted: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
	]),
	onClick: PropTypes.func.isRequired,
}

export default WhiteCards
