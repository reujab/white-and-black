import PropTypes from "prop-types"
import React from "react"

class WhiteCards extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			selected: null,
		}
	}

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
						{cards.map((card) => (
							<div key={card} className="card-wrapper">
								<div
									className={`card white ${this.state.selected === i ? "selected" : ""} ${this.props.czar ? "" : "disabled"}`}
									dangerouslySetInnerHTML={{__html: card}}
									onClick={() => this.props.czar && (this.state.selected === card ? this.props.onSelect(card) : this.setState({selected: i}))}
								/>
							</div>
						))}
					</div>
				)) || this.props.hand && this.props.hand.map((card, i) => (
					<div key={card === "_" ? i : card} className="card-wrapper">
						<div
							className={`card white ${this.state.selected === card ? "selected" : ""}`}
							dangerouslySetInnerHTML={{__html: card === "_" ? "________" : card}}
							onClick={() => this.state.selected === card ? this.props.onSelect(card) : this.setState({selected: card})}
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
	onSelect: PropTypes.func.isRequired,
}

export default WhiteCards
