##What is this?

It's a grunt setup for building WordPress themes, mainly. It also includes these other automation tools:

- Codesniffer ruleset

###What's in it?

[grunt-contrib-sass](https://www.npmjs.org/package/grunt-contrib-sass), [grunt-contrib-concat](https://www.npmjs.org/package/grunt-contrib-concat), [grunt-contrib-watch](https://www.npmjs.org/package/grunt-contrib-watch), [grunt-contrib-clean](https://www.npmjs.org/package/grunt-contrib-clean), [grunt-contrib-copy](https://www.npmjs.org/package/grunt-contrib-copy), [grunt-contrib-compress](https://www.npmjs.org/package/grunt-contrib-compress), [grunt-wp-theme-check](https://github.com/ryelle/grunt-wp-theme-check), [grunt-wp-i18n](https://www.npmjs.org/package/grunt-wp-i18n)

Check out the [Gruntfile](https://github.com/ryelle/Grunt-Theme-Builder/blob/master/Gruntfile.js) to see the exact tasks, or one of the following projects where I use this:

- [Museum's Gruntfile](https://github.com/ryelle/museum/blob/master/Gruntfile.js), modified for LESS (css preprocessor).
- [Umbra's Gruntfile](https://github.com/ryelle/umbra/blob/master/Gruntfile.js) (actively in development, has both `dist` and `dev` targets for rapid building into src directory)

###Requirements

**For Sass**: [You'll need ruby and the sass gem installed](https://www.npmjs.org/package/grunt-contrib-sass#sass-task).

**For Theme Check**: You'll need [my version of the Theme Check plugin](https://github.com/ryelle/theme-check), as it includes the WP-CLI command that the grunt task looks for.

###The Tasks

#### The `dev` tasks

All of my tasks have a 'dev' and a 'dist' version. The dev versions send processed files back to the src directory, which allows for rapid development without needing to rebuild the whole theme. I find that I use this during the first 85% of theme building, then switch my default task to 'build' for the next steps.

#### The named tasks

#### `build`

	'clean:all', 'copy:all', 'sass:dist', 'concat:dist', 'clean:dist'

This wipes the `BUILD_DIR`, copies all `SOURCE_DIR` files (with exceptions), processes the sass files into `style.css` and `editor-style.css`, concatenates the theme's javascript, then cleans up any remaining files that shouldn't be in build.

#### `test`

	wp_theme_check:dist

Run Theme Check against the build directory.

#### `publish`

	'build', 'makepot:dist', 'test', 'compress:main'

This does everything `build` does, generates the .POT file, then runs theme-check. If the theme passes (or if you `--force` it), runs compress, which builds the theme zip.

#### `dev`

	'sass:dev', 'concat:dev', 'makepot:dev'

This runs the Sass process, concatenates the javascript, and generates a .POT file into the source directory.

---

##Why?

Mostly because I can. So I don't have to repeatedly try to create a zip file that magically doesn't have `.DS_Store` in it. Also, this ensures I also don't accidentally add any grunt config, `node_modules`, or sass/less files.

##How do I use it?

###Starter theme

I usually start with [_s](https://github.com/Automattic/_s/) + the '_sassify!' option. Since `/sass/style.scss` is designed to compile down to your main `/style.css`, it makes sense to remove style.css in the source directory (it will be built with Grunt). In this case, however, we're building `src/sass/style.css` to `build/style.css`.

###Directory Structure

I assume the directory structure is:

	theme-name/
	--- Gruntfile.js
	--- package.json
	--- node_modules/
	------- all the things
	--- src/
	------- your theme files, with sass/etc
	------- NO style.css
	--- build/
	------- your theme files, all compiled & ready to run.
	------- a compiled style.css

Since WordPress is smart enough to look into folders for your theme, it'll find your theme's `style.css` in the build directory, and display that as the available theme. Activating the theme will run it out of the build directory (theme-name/build as your theme slug), and assuming you use the core functions for all your linking of things (`get_template_directory_uri`, etc), everything will work just fine.
