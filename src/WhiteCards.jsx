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
		return (
			<div
				style={"orientation" in window ? {
					WebkitOverflowScrolling: "touch",
					overflow: "auto",
					paddingBottom: 5, // padding for iOS inline scroll bar
					whiteSpace: "nowrap",
				} : {}}
			>
				{this.props.children.map((card, i) => (
					<div key={card === "_" ? i : card /* HACK: allow multiple blank cards */} className="card-wrapper">
						<div
							className={`card white ${this.state.selected === card ? "selected" : ""}`}
							dangerouslySetInnerHTML={{__html: card === "_" ? "________" : card}}
							onClick={() => this.state.selected === card ? this.props.onSelect(card) : this.setState({selected: card})}
						/>
					</div>
				))}
			</div>
		)
	}
}

WhiteCards.propTypes = {
	children: PropTypes.arrayOf(PropTypes.string).isRequired,
	onSelect: PropTypes.func.isRequired,
}

export default WhiteCards
