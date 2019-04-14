const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const config = require('./config')

module.exports = {
	devtool: config.debug ? 'eval' : false,
	mode: 'development',
	entry: [
		'./src/index',
	],
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'bundle.js',
		publicPath: '/dist/',
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new CopyWebpackPlugin([
			{ from: 'src/locales/', to: 'locales/' },
		], {})
	],
	resolve: {
		extensions: ['.js', '.jsx'],
		modules: [
			'node_modules',
			path.resolve(__dirname, 'src')
		],
	},
	module: {
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
					'sass-loader'
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
	},
	devServer: {
		hot: true,
		port: 7000,
		historyApiFallback: true,
		contentBase: path.join(__dirname, '.'),
	},
}