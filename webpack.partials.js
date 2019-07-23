const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const config = require(`./config/${process.targetStatic ? 'static' : 'dev'}`)

const entry = ['./src/index']
const plugins = [
	new webpack.HotModuleReplacementPlugin(),
	new CopyWebpackPlugin([
		{ from: 'src/locales/', to: 'locales/' },
	], {})
]
const resolve = {
	extensions: ['.js', '.jsx'],
	modules: [
		'node_modules',
		path.resolve(__dirname, 'src')
	],
}
const moduleRules = {
	rules: [
		{
			test: /\.jsx?$/,
			use: ['babel-loader'],
			include: path.join(__dirname, 'src'),
		},
		{
			test: /\.scss$/,
			use: [
				'style-loader',
				{
					loader: 'css-loader',
					options: {
						url: function(url, resourcePath) {
							// resourcePath - path to css file
							return url.includes('./dist/fonts')
						},
					},
				},
				{
					loader: 'sass-loader',
					options: {
		        includePaths: ['./node_modules'],
		      },
				},
			],
		},
		{
			test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
			use: [{
				loader: 'file-loader',
				options: {
					name: '[name].[ext]',
					outputPath: 'fonts/',
				},
			}],
		},
		// {
		// 	test: /\.json$/,
		// 	use: [{
		// 		loader: 'json-loader',
		// 		options: {
		// 			outputPath: 'locales/',
		// 		},
		// 	}],
		// },
	],
}

module.exports = {
	entry,
	plugins,
	resolve,
	moduleRules,
}