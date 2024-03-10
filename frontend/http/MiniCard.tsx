import * as React from "react"

interface Props {
	children: number
	color: string
}

class MiniCard extends React.Component<Props> {
	render() {
		return (
			<div
				style={{
					alignItems: "center",
					display: "inline-flex",
					marginRight: 25,
				}}
			>
				<div
					style={{
						background: this.props.color,
						border: "1px solid black",
						borderRadius: 3,
						display: "inline-block",
						height: 30,
						marginRight: 5,
						width: 20,
					}}
				/>
				{this.props.children}
			</div>
		)
	}
}

export default MiniCard
