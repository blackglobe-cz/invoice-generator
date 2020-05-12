const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const package = require('./package.json')
const {
	entry,
	plugins,
	resolve,
	moduleRules,
} = require('./webpack.partials')

const staticConfig = {
	devtool: false,
	// devtool: 'eval',
	mode: 'production',
	entry: entry,
	output: {
		path: path.join(__dirname, 'static'),
		filename: 'bundle.js',
		publicPath: '',
	},
	plugins: [
		...plugins,
		new HtmlWebpackPlugin({
      template: 'index.html',
      bundlePath: './bundle.js',
			targetStatic: true,
			inject: false,
			version: package.version,
		}),
		new CopyWebpackPlugin([ { from: 'src/fonts', to: './fonts', } ])
	],
	resolve: resolve,
	module: moduleRules,
}

module.exports = staticConfig