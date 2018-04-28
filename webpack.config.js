const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'development',
	entry: './src/index.ts',
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				loader: 'ts-loader'
			},
			{
				test: /\.(scss|css)$/,

				use: ExtractTextPlugin.extract({
					use: [
						{
							loader: 'css-loader',
							options: {
								sourceMap: true
							}
						},
						{
							loader: 'sass-loader',
							options: {
								sourceMap: true
							}
						}
					],
					fallback: 'style-loader'
				})
			}
        ]
	},
    resolve: {
      extensions: [".ts", ".js"],
      modules: [
        path.resolve(__dirname, 'src'),
        path.resolve(__dirname, 'assets'),
        'node_modules'
      ]
    },
	plugins: [
        new CopyWebpackPlugin([
            {
                from: 'src/static',
                to: '.'
            }
        ]),
		new ExtractTextPlugin('styles.css.[contentHash].css')
	],
	devServer: {
        host: '192.168.1.107',
		contentBase: path.resolve(__dirname, 'dist')
	}
};
