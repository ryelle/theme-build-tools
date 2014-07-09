/* jshint node:true */
module.exports = function(grunt) {
	var path = require('path'),
		SOURCE_DIR = 'src/',
		BUILD_DIR = 'build/';

	// Load tasks.
	require('matchdep').filterDev('grunt-*').forEach( grunt.loadNpmTasks );

	// Project configuration.
	grunt.initConfig({
		clean: {
			all: [BUILD_DIR],
			dist: {
				dot: true,
				expand: true,
				cwd: BUILD_DIR,
				src: [
					'node_modules',
					'sassy_s',
					'README.md',
					'js/src'
				]
			}
		},

		copy: {
			all: {
				files: [{
					dot: true,
					expand: true,
					cwd: SOURCE_DIR,
					src: [
						'**',
						'!**/.{svn,git}/**', // Ignore version control directories.
						'!**/*.map', // Ignore sourcemaps
						'!.sass-cache',
						'!.DS_Store',
						'!package.json',
						'!Gruntfile.js',
						'!node_modules'
					],
					dest: BUILD_DIR
				}]
			}
		},

		sass: {
			dist: {
				options: {
					noCache: true,
					sourcemap: true
				},
				expand: true,
				cwd: SOURCE_DIR + 'sassy_s/',
				dest: BUILD_DIR,
				ext: '.css',
				src: [ 'style.scss', 'editor-style.scss' ]
			}
		},

		compress: {
			main: {
				options: {
					archive: 'theme-name.zip'
				},
				files: [
					{expand: true, cwd: BUILD_DIR, src: ['**'], dest: '/'}
				]
			}
		},

		watch: {
			colors: {
				files: [SOURCE_DIR + 'sassy_s/**'],
				tasks: ['sass:dist']
			}
		}
	});

	// Register tasks.

	// Build task.
	grunt.registerTask('build', ['clean:all', 'copy:all', 'sass:dist', 'clean:dist' ]);
	grunt.registerTask('publish', ['build', 'compress:main']);

	// Default task.
	grunt.registerTask('default', ['build']);

};
