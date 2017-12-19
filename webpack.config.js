const shell = require("shelljs")

shell.mkdir("-p", "dist")
shell.ln("-sf", "../favicon.png", "dist/favicon.png")
shell.ln("-sf", "../favicon.jpg", "dist/favicon.jpg")

module.exports = {
	devtool: "source-map",
	entry: {
		index: "./src/index.jsx",
	},
	output: {
		filename: "[name].js",
		path: `${__dirname}/dist`,
	},
	module: {
		rules: [
			{
				test: /\.sass$/,
				use: [
					"style-loader",
					"css-loader?sourceMap&minimize",
					"sass-loader?sourceMap",
				],
			},
			{
				test: /\.jsx$/,
				use: "babel-loader?presets=react",
			},
		],
	},
}
