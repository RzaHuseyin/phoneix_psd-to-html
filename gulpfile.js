var gulp           = require('gulp'),
		gutil          = require('gulp-util' ),
		sass           = require('gulp-sass'),
		browserSync    = require('browser-sync'),
		concat         = require('gulp-concat'),
		uglify         = require('gulp-uglify'),
		cleanCSS       = require('gulp-clean-css'),
		rename         = require('gulp-rename'),
		del            = require('del'),
		imagemin       = require('gulp-imagemin'),
		cache          = require('gulp-cache'),
		autoprefixer   = require('gulp-autoprefixer'),
		ftp            = require('vinyl-ftp'),
		notify         = require("gulp-notify"),
		rsync          = require('gulp-rsync');

gulp.task('js',  function() {
	return gulp.src([
		'src/js/script.js', 
		])
	.pipe(concat('scripts.min.js'))
	.pipe(uglify()) 
	.pipe(gulp.dest('dist/js'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'dist'
		},
		notify: false,
	});
});

gulp.task('sass', function() {
	return gulp.src('src/sass/*.sass')
	.pipe(sass({outputStyle: 'expand'}).on("error", notify.onError()))
	.pipe(rename({suffix: '.min', prefix : ''}))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleanCSS()) 
	.pipe(gulp.dest('dist/css'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', ['sass','js','copyHtml', 'browser-sync'], function() {
	gulp.watch('src/sass/*.sass', ['sass']);
	gulp.watch([ 'src/js/script.js'], ['js']);
	gulp.watch('src/*.html', ['copyHtml']);
});

gulp.task('imagemin', function() {
	return gulp.src('src/image/*')
	.pipe(imagemin())
	.pipe(gulp.dest('dist/image')); 
});
gulp.task('copyHtml', function() {
	return gulp.src('src/*.html')
	.pipe(gulp.dest('dist'))
	.pipe(browserSync.reload({stream: true}));
	
});


gulp.task('build', ['removedist', 'imagemin'], function() {

	var buildFiles = gulp.src([
		'src/*.html',
		]).pipe(gulp.dest('dist'));

	// var buildCss = gulp.src([
	// 	'src/css/**/*',
	// 	]).pipe(gulp.dest('dist/css'));

	// var buildJs = gulp.src([
	// 	'src/js/scripts.min.js',
	// 	]).pipe(gulp.dest('dist/js'));

	var buildFonts = gulp.src([
		'src/css/font/*',
		]).pipe(gulp.dest('dist/css/font'));

});

gulp.task('deploy', function() {

	var conn = ftp.create({
		host:      'hostname.com',
		user:      'username',
		password:  'userpassword',
		parallel:  10,
		log: gutil.log
	});

	var globs = [
	'dist/**',
	'dist/.htaccess',
	];
	return gulp.src(globs, {buffer: false})
	.pipe(conn.dest('/path/to/folder/on/server'));

});

gulp.task('rsync', function() {
	return gulp.src('dist/**')
	.pipe(rsync({
		root: 'dist/',
		hostname: 'username@yousite.com',
		destination: 'yousite/public_html/',
		archive: true,
		silent: false,
		compress: true
	}));
});

gulp.task('removedist', function() { return del.sync('dist'); });
gulp.task('clearcache', function () { return cache.clearAll(); });

gulp.task('default', ['watch']);