module.exports = function(grunt) {

  var webpackConfig = require("./webpack.config.js");

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    webpack: {
      main: {
        // webpack options
        entry: "./client/entry.js",
        output: {
          output: {
            path: __dirname,
            filename: "bundle.js"
          }
        },

        stats: {
            // Configure the console output
            colors: false,
            modules: true,
            reasons: true
        },
        // stats: false disables the stats output

        storeStatsTo: "xyz", // writes the status to a variable named xyz
        // you may use it later in grunt i.e. <%= xyz.hash %>

        progress: false, // Don't show progress
        // Defaults to true

        failOnError: false, // don't report error to grunt if webpack find errors
        // Use this if webpack errors are tolerable and grunt should continue

        watch: true, // use webpacks watcher
        // You need to keep the grunt process alive

        keepalive: true, // don't finish the grunt task
        // Use this in combination with the watch option
      }
    },
    "webpack-dev-server": {
			options: {
				webpack: webpackConfig,
				publicPath: "/" + webpackConfig.output.publicPath,
        contentBase: 'client/',
			},
			start: {
				keepAlive: true,
				webpack: {
          inline: true,
					devtool: "eval",
					debug: true
				}
			}
		}
  });

  grunt.loadNpmTasks('grunt-webpack');

  // Default task(s).
  grunt.registerTask("default", ["webpack-dev-server:start"]);

};
