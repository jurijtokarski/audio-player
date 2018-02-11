const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

const plugins = [
	new ExtractTextPlugin("style.css", { allChunks: true }),
];

if (process.env.NODE_ENV === "production") {
	plugins.push(new UglifyJsPlugin({
		test: /\.js($|\?)/i
	}));
}

module.exports = {
	entry: "./src/index.js",
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				use: {
					loader: "babel-loader",
				},
			},
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					loader: "css-loader",
					options: {
						modules: true,
						camelCase: true,
						localIdentName: "[folder]-[local]",
						minimize: process.env.NODE_ENV === "production",
					},
				}),
			},
		],
	},
	plugins: plugins,
	output: {
		path: path.resolve(__dirname, "build"),
		filename: "index.js",
	},
	devServer: {
		contentBase: path.join(__dirname, "build"),
		port: 4232,
	},
};