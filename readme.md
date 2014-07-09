##What is this?

It's a grunt setup for building WordPress themes.

###What's in it?

[grunt-contrib-sass](https://www.npmjs.org/package/grunt-contrib-sass), [grunt-contrib-concat](https://www.npmjs.org/package/grunt-contrib-concat), [grunt-contrib-watch](https://www.npmjs.org/package/grunt-contrib-watch), [grunt-contrib-clean](https://www.npmjs.org/package/grunt-contrib-clean), [grunt-contrib-copy](https://www.npmjs.org/package/grunt-contrib-copy), [grunt-contrib-compress](https://www.npmjs.org/package/grunt-contrib-compress), [grunt-wp-theme-check](https://github.com/ryelle/grunt-wp-theme-check)

Check out the [Gruntfile](https://github.com/ryelle/Grunt-Theme-Builder/blob/master/Gruntfile.js) to see the exact tasks, or one of the following projects where I use this:

- [Museum's Gruntfile](https://github.com/ryelle/museum/blob/master/Gruntfile.js), modified for LESS (css preprocessor).
- [Umbra's Gruntfile](https://github.com/ryelle/umbra/blob/master/Gruntfile.js) (actively in development, has both `dist` and `dev` targets for rapid building into src directory) 

###Requirements

**For Sass**: [You'll need ruby and the sass gem installed](https://www.npmjs.org/package/grunt-contrib-sass#sass-task).

**For Theme Check**: You'll need [my version of the Theme Check plugin](https://github.com/ryelle/theme-check), as it includes the WP-CLI command that the grunt task looks for.

###The Tasks

#### `build`

	'clean:all', 'copy:all', 'concat:dist', 'sass:dist', 'clean:dist'

This wipes the `BUILD_DIR`, copies all `SOURCE_DIR` files (with exceptions), concatenates the theme's javascript, processes the sass files into `style.css` and `editor-style.css`, then cleans up any remaining files that shouldn't be in build.

#### `publish`

	'build', 'wp_theme_check:theme', 'compress:main'

This does everything `build` does, then runs theme-check, and if that passes (or if you `--force` it), runs compress, which builds the theme zip.

---

##Why?

Mostly because I can. So I don't have to repeatedly try to create a zip file that magically doesn't have `.DS_Store` in it. Also, this ensures I also don't accidentally add any grunt config, `node_modules`, or sass/less files.

##How do I use it?

This isn't really being released for other people, mostly so I can track my own changes. But, if you want to grab it to help with your process, that's awesome. Here's how I use it.

###Starter theme

I usually start with [_s](https://github.com/Automattic/_s/) + [sassy_s](https://github.com/sabreuse/sassy_s) (or something in LESS). Since `sassy_s/style.scss` is designed to compile down to `/style.css`, it makes sense to remove style.css in the source directory, so you won't have duplicate themes in the theme list. In this case, however, we're compiling `src/sassy_s/style.css` to `build/style.css`.

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

Since WordPress is smart enough to look into folders for your theme, it'll find your theme's `style.css` in the build directory, and display that as the available theme. Activating the theme will run it out of the build directory, and assuming you use the core functions for all your linking of things (`get_template_directory_uri`, etc), everything will work just fine.

Do all your work in the src directory, and build to see it. Eventually I'll have a watch task that works for files in addition to Sass.
