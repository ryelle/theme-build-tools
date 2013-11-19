##What is this?

It's a grunt setup I use to build WordPress themes. This version compiles SCSS. It's also super-beta.

##Why?

So I don't have to repeatedly try to create a zip file that magically doesn't have `.DS_Store` in it. Also, this ensures I also don't accidentally add any grunt config, `node_modules`, or sass/less files.

##How do I use it?

This isn't really being released for other people, mostly so I can track my own changes. But, if you want to grab it to help with your process, that's awesome. Here's how I use it.

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

###What's actually going on?

The gruntfile's default task is `build`, which is `'clean:all', 'copy:all', 'sass:dist', 'clean:dist'`. This deletes the build directory, copies over all the source files (except a few excluded), runs Sass which compiles to `build/style.css`, and then goes back and deletes any source files that weren't excluded from the copy (this step can later be removed).

The other task registered here is `publish`, which does all of `build`, and then creates a .zip file of the theme. 

###More about style.css + starter themes

In this case I started with [_s](https://github.com/Automattic/_s/) + [sassy_s](https://github.com/sabreuse/sassy_s). Since `sassy_s/style.scss` is designed to compile down to `/style.css`, it makes sense to remove style.css in the source directory.
