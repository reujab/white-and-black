const UglifyJS = require("uglifyjs-webpack-plugin")
const shell = require("shelljs")
const webpack = require("webpack")

shell.mkdir("-p", "dist")
shell.ln("-sf", "../favicon.png", "dist/favicon.png")

module.exports = {
	devtool: "source-map",
	entry: {
		index: "./src/Index.jsx",
		game: "./src/Game.jsx",
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
	plugins: process.env.NODE_ENV === "production" ? [
		new webpack.DefinePlugin({
			"process.env.NODE_ENV": JSON.stringify("production"),
		}),
		new UglifyJS(),
	] : [],
}
