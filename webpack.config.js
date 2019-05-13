const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const config = require(process.targetStatic ? './config/static' : './config/dev')
const {
	entry,
	plugins,
	resolve,
	moduleRules,
} = require('./webpack.partials')

const devConfig = {
	devtool: config.debug ? 'eval' : false,
	mode: 'development',
	entry: entry,
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'bundle.js',
		publicPath: '/',
	},
	plugins: [
		...plugins,
		new HtmlWebpackPlugin({
			filename: path.resolve(__dirname, 'dist/index.html'),
      template: path.resolve(__dirname, 'index.html'),
			targetStatic: process.targetStatic,
		})
	],
	resolve: resolve,
	module: moduleRules,
	devServer: {
		hot: true,
		port: 7000,
		historyApiFallback: true,
		contentBase: path.resolve(__dirname, 'dist'),
		publicPath: '/',
	},
}

module.exports = devConfig