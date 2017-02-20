
    var settings = require('./settings.json');
    var gulp = require('gulp');
    var sass = require('gulp-sass');
    var notify = require('gulp-notify');
    var plumber = require('gulp-plumber');
    var del = require('del');
    var imagemin = require('gulp-imagemin');
    var cssnano = require('gulp-cssnano');
    var uglify = require('gulp-uglify');
    var gutil = require('gulp-util');
    var sourcemaps = require('gulp-sourcemaps');
    var jshint = require('gulp-jshint');
    var run = require('run-sequence');
    var moduleImporter = require('sass-module-importer');
    var replace = require('gulp-replace-task');
    var autoprefixer = require('gulp-autoprefixer');
    var include = require('gulp-include');




    /*
     *  Default
     */
    gulp.task("default", ["build"]);





    /*
     *  Build
     */
    gulp.task("build", function(callback){

        // Build for production
        if(gutil.env.type === 'production'){
            gutil.log(gutil.colors.white.bgGreen('Started Production Build'));
            run(
                'clean',
                'html',
                'styles',
                'scripts',
                'images',
                'other',
                callback
            );
        }

        // Build for dev and watch
        else {
            gutil.log(gutil.colors.white.bgGreen('Started Development Build'));
            run(
                'clean',
                'html',
                'styles',
                'scripts',
                'images',
                'other',
                'watch',
                callback
            );
        }
    });





    /*
     *  Watch
     */
    gulp.task("watch", function(callback){

        gulp.watch(settings.paths.watch.html, ['html']);
        gutil.log('Watching HTML');

        gulp.watch(settings.paths.watch.styles, ['styles']);
        gutil.log('Watching Styles');

        gulp.watch(settings.paths.watch.scripts, ['scripts']);
        gutil.log('Watching Scripts');

        gulp.watch(settings.paths.watch.images, ['images']);
        gutil.log('Watching Images');

        gulp.watch(settings.paths.watch.other, ['other']);
        gutil.log('Watching Other');

    });





    /*
     *  Generate HTML
     */
    gulp.task("html", function(){
        gutil.log(gutil.colors.green('HTML Build'));
        return gulp.src(settings.paths.input.html)
			.pipe(plumber({ errorHandler: handleError }))
            .pipe(replace({ patterns: [ settings.replacements.global, settings.replacements.html ] }))
			.pipe(gulp.dest(settings.paths.output.html))
			.pipe(plumber.stop());
    });




    /*
     *  Generate CSS
     */
    gulp.task("styles", function(){
        gutil.log(gutil.colors.green('Styles Build'));
        return gulp.src(settings.paths.input.styles)
			.pipe(plumber({ errorHandler: handleError }))
            .pipe(sourcemaps.init())
            .pipe(sass({ importer: moduleImporter(),  }).on('error', handleError))
            .pipe(replace({ patterns: [ settings.replacements.global, settings.replacements.styles ] }))
            .pipe(autoprefixer({
                browsers: ['last 2 versions'],
                cascade: false
            }))

            // Only minify if production
            .pipe(gutil.env.type === 'production' ? cssnano() : gutil.noop())

            // Only do sourcemap if development
            .pipe(gutil.env.type === 'production' ? gutil.noop() : sourcemaps.write(settings.paths.output.maps))

			.pipe(gulp.dest(settings.paths.output.styles))
			.pipe(plumber.stop());
    });





    /*
     *  Optimise Images
     */
    gulp.task("images", function(){
        gutil.log(gutil.colors.green('Images Build'));

        // In production warning
        if(gutil.env.type !== 'production') gutil.log(gutil.colors.yellow('WARNING: No images were compress in development build'));

        return gulp.src(settings.paths.input.images)
			.pipe(plumber({ errorHandler: handleError }))

            // Only compress images if production
            .pipe(gutil.env.type === 'production' ? imagemin({ progressive: true, interlaced: true }) : gutil.noop())

			.pipe(gulp.dest(settings.paths.output.images))
			.pipe(plumber.stop());
    });





    /*
     *  Scripts
     */
    gulp.task("scripts", function(){
        gutil.log(gutil.colors.green('Scripts Build'));
        return gulp.src(settings.paths.input.scripts)
			.pipe(plumber({ errorHandler: handleError }))
            .pipe(replace({ patterns: [ settings.replacements.global, settings.replacements.scripts ] }))
            .pipe(sourcemaps.init())
            .pipe(jshint())
            .pipe(jshint.reporter('jshint-stylish'))
			.pipe(include())

            // Only compress images if production
            .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())

            // Only do sourcemap if development
            .pipe(gutil.env.type === 'production' ? gutil.noop() : sourcemaps.write(settings.paths.output.maps))

			.pipe(gulp.dest(settings.paths.output.scripts))
			.pipe(plumber.stop());
    });





    /*
     *  Other Files
     */
    gulp.task("other", function(){
        gutil.log(gutil.colors.green('Other Build'));
        return gulp.src(settings.paths.input.other)
			.pipe(gulp.dest(settings.paths.output.other));
    });





    /*
     *  Cleanup
     */
    gulp.task("clean", function(){
        var dryRun = false;
        var deleteDist = del.sync(settings.paths.clean.dist, {dryRun: dryRun});
        var deleteHTML = del.sync(settings.paths.clean.html, {dryRun: dryRun});
        var deleteStyles = del.sync(settings.paths.clean.styles, {dryRun: dryRun});
        var deleteScripts = del.sync(settings.paths.clean.scripts, {dryRun: dryRun});
        var deleteImages = del.sync(settings.paths.clean.images, {dryRun: dryRun});
        var deleteOther = del.sync(settings.paths.clean.other, {dryRun: dryRun});

        deleteDist !== "undefined" ? gutil.log(gutil.colors.white.bgRed('Deleted: ' + deleteDist)) : '';
        deleteHTML !== "undefined" ? gutil.log(gutil.colors.white.bgRed('Deleted: ' + deleteHTML)) : '';
        deleteStyles !== "undefined" ? gutil.log(gutil.colors.white.bgRed('Deleted: ' + deleteStyles)) : '';
        deleteScripts !== "undefined" ? gutil.log(gutil.colors.white.bgRed('Deleted: ' + deleteScripts)) : '';
        deleteImages !== "undefined" ? gutil.log(gutil.colors.white.bgRed('Deleted: ' + deleteImages)) : '';
        deleteOther !== "undefined" ? gutil.log(gutil.colors.white.bgRed('Deleted: ' + deleteOther)) : '';

        return;
    });






    /*
     *  Handle Error
     */
    var handleError = function(err){
		gutil.log(gutil.colors.white.bgRed('/////////////////////////// ## START ## /////////////////////////////////'));
		gutil.log(gutil.colors.red(err));
		gutil.log(gutil.colors.white.bgRed('/////////////////////////// ## END ## /////////////////////////////////'));
		notify().write(err);
        return this.emit('end');
	}
