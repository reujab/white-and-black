import * as React from "react"
import { IBlackCard } from "./common"

interface Props {
	children: IBlackCard
	selected: string[]
}

class BlackCard extends React.Component<Props> {
	render() {
		return this.props.children && (
			<div
				style={{
					WebkitOverflowScrolling: "touch",
					overflow: "auto",
					whiteSpace: "nowrap",
				}}
			>
				<div className="card-wrapper">
					<div className="card black" dangerouslySetInnerHTML={{ __html: this.props.children.text.replace(/_/g, "________") }} />
				</div>
				{this.props.selected && this.props.selected.map((card) => (
					<div key={card} className="card-wrapper">
						<div className="card white" dangerouslySetInnerHTML={{ __html: card }} />
					</div>
				))}
			</div>
		)
	}
}

export default BlackCard
