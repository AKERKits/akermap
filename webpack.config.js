module.exports = (function() {
	'use strict';

	var path = require("path");
	var webpack = require("webpack");
	var BowerWebpackPlugin = require("bower-webpack-plugin");
	var AngularWebpackPlugin = require('angular-webpack-plugin');

	var clientDir = path.resolve(__dirname, './client');

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
			/angular-translate\/angular-translate\.js/,
		],
		loaders: [
			// required to write "require('./style.css')"
			{ test: /\.css$/,    loader: "style-loader!css-loader" },
			{ test: /map\/styles\/.*\.json$/,    loader: "json" }, // loader for map styles
			{ test: /data\/.*\.json$/,    loader: "json" },
			{ test: /modernizr\.js$/, loader: 'imports?this=>window' },
			{ test: /respond\.src\.js$/, loader: 'imports?this=>window' },
			{ test: /ng-table\.js/, loader: 'imports?define=>null'},

			{ test: /templates\/.*\.html$/, loader: "ngtemplate?relativeTo="+clientDir+"!html" }

			// required for bootstrap icons
			//{ test: /\.woff$/,   loader: "url-loader?prefix=font/&limit=5000&mimetype=application/font-woff" },
			//{ test: /\.ttf$/,    loader: "file-loader?prefix=font/" },
			//{ test: /\.eot$/,    loader: "file-loader?prefix=font/" },
			//{ test: /\.svg$/,    loader: "file-loader?prefix=font/" },

			// required for react jsx
			//{ test: /\.js$/,    loader: "jsx-loader" },
			//{ test: /\.jsx$/,   loader: "jsx-loader?insertPragma=React.DOM" },
		]
	},
	resolve: {
		root: [
			path.resolve('bower_components')
		],
		alias: {
			'ngTable': 'ng-table/dist/ng-table.js',
			'pascalprecht.translate': 'angular-translate',
			'uiGmapgoogle-maps': 'angular-google-maps'
			// Bind version of jquery
			//jquery: "jquery-2.0.3",

			// Bind version of jquery-ui
			//"jquery-ui": "jquery-ui-1.10.3",

			// jquery-ui doesn't contain a index file
			// bind module to the complete module
			//"jquery-ui-1.10.3$": "jquery-ui-1.10.3/ui/jquery-ui.js",
		}
	},
	plugins: [
	new AngularWebpackPlugin(),
    new webpack.ResolverPlugin(
        new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
    ),

    new webpack.HotModuleReplacementPlugin(),


		new webpack.ProvidePlugin({
			// Automtically detect jQuery and $ as free var in modules
			// and inject the jquery library
			// This is required by many jquery plugins
			//jQuery: "jquery",
			//$: "jquery"
			//angular: 'angular',
			//'window.angular': 'angular'
		})

	]
};
})();
