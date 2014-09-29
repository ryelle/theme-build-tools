/* jshint node:true */
module.exports = function(grunt) {
	var path = require('path'),
		WP_DIR = '/srv/www/wordpress-trunk',
		THEME_NAME = 'theme-name',
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
					// Any source files that should not be in the built package
					'node_modules',
					'sass', // Remove source Sass
					'js/src', // Remove source JS
					'.sass-cache'
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
						'!.DS_Store',
						'!.gitignore',
						'!.sass-cache',
						'!Gruntfile.js',
						'!node_modules',
						'!package.json'
					],
					dest: BUILD_DIR
				}]
			}
		},

		sass: {
			dev: {
				options: {
					noCache: false,
					sourcemap: true
				},
				expand: true,
				cwd: SOURCE_DIR + 'sass/',
				dest: SOURCE_DIR,
				ext: '.css',
				src: [ 'style.scss', 'editor-style.scss' ]
			},
			dist: {
				options: {
					noCache: true,
					sourcemap: false
				},
				expand: true,
				cwd: SOURCE_DIR + 'sass/',
				dest: BUILD_DIR,
				ext: '.css',
				src: [ 'style.scss', 'editor-style.scss' ]
			}
		},

		concat: {
			dev: {
				src: [ SOURCE_DIR + 'js/src/*.js' ],
				dest: SOURCE_DIR + 'js/' + THEME_NAME + '.js'
			},
			dist: {
				src: [ SOURCE_DIR + 'js/src/*.js' ],
				dest: BUILD_DIR + 'js/' + THEME_NAME + '.js'
			}
		},

		makepot: {
			dev: {
				options: {
					cwd: SOURCE_DIR,
					domainPath: '/languages',
					mainFile: 'style.css',
					potFilename: THEME_NAME + '.pot',
					potHeaders: {
						poedit: true,
						'x-poedit-keywordslist': true
					},
					type: 'wp-theme',
					updateTimestamp: false
				}
			},
			dist: {
				options: {
					cwd: BUILD_DIR,
					domainPath: '/languages',
					mainFile: 'style.css',
					potFilename: THEME_NAME + '.pot',
					potHeaders: {
						poedit: true,
						'x-poedit-keywordslist': true
					},
					type: 'wp-theme',
					updateTimestamp: false
				}
			}
		},

		wp_theme_check: {
			options: {
				path: WP_DIR
			},
			dist: {
				options: {
					// Strip the trailing slash from BUILD_DIR.
					theme: THEME_NAME + '/' + BUILD_DIR.substr(0, str.length - 1);
				}
			}
		},

		compress: {
			main: {
				options: {
					archive: THEME_NAME + '.zip'
				},
				files: [
					{expand: true, cwd: BUILD_DIR, src: ['**'], dest: '/'}
				]
			}
		},

		// Watch in the SOURCE_DIR and compile to source, for rapid development
		watch: {
			css: {
				files: [SOURCE_DIR + 'sass/**'],
				tasks: ['sass:dist']
			},
			js: {
				files: [SOURCE_DIR + 'js/src/**'],
				tasks: ['concat:dev']
			}
		}
	});

	// Register tasks.

	// Build task.
	grunt.registerTask('dev',     ['sass:dev', 'concat:dev', 'makepot:dev']);
	grunt.registerTask('build',   ['clean:all', 'copy:all', 'sass:dist', 'concat:dist', 'clean:dist']);
	grunt.registerTask('test',    ['wp_theme_check:dist']);

	// Build the theme, generate the .POT file, then test. If successful, zip the theme for upload.
	grunt.registerTask('publish', ['build', 'makepot:dist', 'test', 'compress:main']);

	// Default task.
	//  Defaults to 'dev' for quick development (builds into src dir),
	//  allowing for small tweaks without rebuilding the entire theme.
	grunt.registerTask('default', ['dev']);

};
