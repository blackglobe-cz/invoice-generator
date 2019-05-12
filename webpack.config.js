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
		publicPath: '/dist/',
	},
	plugins: [
		...plugins,
		new HtmlWebpackPlugin({
      template: 'index.html',
      // bundlePath: '/bundle.js',
			targetStatic: process.targetStatic,
			// inject: false,
		})
	],
	resolve: resolve,
	module: moduleRules,
	devServer: {
		hot: true,
		port: 7000,
		historyApiFallback: true,
		contentBase: path.join(__dirname, './dist'),
		// contentBase: path.join(__dirname, '.'),
	},
}

module.exports = devConfig