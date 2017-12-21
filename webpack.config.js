const shell = require("shelljs")

shell.mkdir("-p", "dist")
shell.ln("-sf", "../favicon.png", "dist/favicon.png")

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
				test: /\.jsx$/,
				use: "babel-loader?presets=react",
			},
			{
				test: /\.sass$/,
				use: [
					"style-loader",
					"css-loader?sourceMap&minimize",
					"sass-loader?sourceMap",
				],
			},
		],
	},
	resolve: {
		extensions: [".js", ".json", ".jsx"],
	},
}
