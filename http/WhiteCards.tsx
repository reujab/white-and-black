import * as React from "react"

interface Props {
	czar: boolean
	czarSelection: string[][]
	hand: string[]
	highlighted: string | number
	onClick: (number) => void
}

class WhiteCards extends React.Component<Props> {
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
				{this.props.czarSelection && this.props.czarSelection.map((cards, i) => (
					<div key={i} className="selection-wrapper">
						{cards.map((card, j) => (
							<div key={card === "" ? j : card} className="card-wrapper">
								<div
									className={`card white ${this.props.highlighted === i ? "highlighted" : ""} ${this.props.czar && card ? "" : "disabled"}`}
									dangerouslySetInnerHTML={{ __html: card }}
									onClick={() => this.props.czar && card && this.props.onClick(i)}
								/>
							</div>
						))}
					</div>
				)) || this.props.hand && this.props.hand.map((card, i) => (
					<div key={card === "_" ? i : card} className="card-wrapper">
						<div
							className={`card white ${this.props.highlighted === card ? "highlighted" : ""}`}
							dangerouslySetInnerHTML={{ __html: card === "_" ? "________" : card }}
							onClick={() => this.props.onClick(card)}
						/>
					</div>
				))}
			</div>
		)
	}
}

export default WhiteCards
