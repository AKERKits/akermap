/* global __dirname */
module.exports = (function() {
	'use strict';

	var path = require("path");
	var webpack = require("webpack");
	var AngularWebpackPlugin = require('angular-webpack-plugin');
	var NgAnnotatePlugin = require('ng-annotate-webpack-plugin');

	var clientDir = path.resolve(__dirname, path.join(__dirname, 'client'));

	return {
		cache: true,
		watch: true,
		entry: {
			bootstrap: [
	      "./client/entry.js"
	    ]
		},
		output: {
			path: path.join(__dirname, "assets"),
			publicPath: "assets/",
			filename: "[name].js",
			chunkFilename: "[chunkhash].js"
		},
		module: {
			noParse: [
			//	/angular-translate(\/|\\)angular-translate\.js/,
			],
			loaders: [
				{ test: /\.css$/, loader: "style-loader!css-loader" },
				{ test: /\.json$/, loader: "json" },
				{ test: /images(\/|\\).*\.svg$/, loader: "url-loader" },
				{ test: /modernizr\.js$/, loader: 'imports?this=>window' },
				{ test: /respond\.src\.js$/, loader: 'imports?this=>window' },
				{ test: /ng-table\.js/, loader: 'imports?define=>null'},
				{ test: /templates(\/|\\).*\.html$/, loader: "ngtemplate?relativeTo="+clientDir+"!html" },
				{ test: /\.less$/, loader: "style-loader!css-loader!less-loader" }
			]
		},
		resolve: {
			root: [
				path.resolve('bower_components')
			],
			alias: {
				'pascalprecht.translate': 'angular-translate',
				'uiGmapgoogle-maps': 'angular-google-maps',
				'btford.modal': "angular-modal",
				'ngSanitize': 'angular-sanitize',
				"ng": "angular-translate" // workaround for missing ng-module - this loads angular-translate twice :(
			}
		},
		plugins: [
			new AngularWebpackPlugin(),
		    new webpack.ResolverPlugin(
		        new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
		    ),
		    new webpack.HotModuleReplacementPlugin(),
		    new NgAnnotatePlugin({
		        add: true
			})
		]
	};
})();
