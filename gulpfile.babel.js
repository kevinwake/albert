/**
 *   Albert :: Gulp Build System
 * =============================================================================
 */
import browserSync from 'browser-sync';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';

const $ = gulpLoadPlugins();
const AUTOPREFIXER_BROWSERS = [
  'Android >= 4.4',
  'last 3 Chrome versions',
  'last 3 Edge versions',
  'Explorer >= 11',
  'last 3 Firefox versions',
  'iOS >= 8',
  'OperaMini >= 8',
  'Safari >= 9'
];

/**
 *   Default :: Development :: Watch For Changes And Reload
 * -----------------------------------------------------------------------------
 */
gulp.task('default', ['dist'], () => {
  browserSync({
    notify: false,
    logPrefix: 'Albert',
    server: {
      baseDir: ['app']
    }
  });
  gulp.watch(['app/**/*.html'], browserSync.reload);
  gulp.watch(['src/jade/**/*.jade'], ['jade']);
  gulp.watch(['src/sass/**/*.scss'], ['sass']);
});

/**
 *   Dist :: Build Distribution Files
 * -----------------------------------------------------------------------------
 */
gulp.task('dist', ['vendor:css', 'vendor:js', 'jade', 'sass']);

/**
 *   Vendor JS :: Copy Vendor JavaScript
 * -----------------------------------------------------------------------------
 */
gulp.task('vendor:js', () =>
  gulp.src([
    'node_modules/bootstrap/dist/js/bootstrap.min.js',
    'node_modules/jquery/dist/jquery.min.js'
  ])
    .pipe(gulp.dest('app/js'))
);

/**
 *   Vendor CSS :: Copy Vendor Stylesheets
 * -----------------------------------------------------------------------------
 */
gulp.task('vendor:css', () =>
  gulp.src([
    'node_modules/bootstrap/dist/css/bootstrap.min.css'
  ])
    .pipe(gulp.dest('app/css'))
);

/**
 *   Jade :: Compile HTML
 * -----------------------------------------------------------------------------
 */
gulp.task('jade', () =>
  gulp.src([
    'src/jade/**/*.jade',
    '!src/jade/**/_*.jade'
  ])
    .pipe($.jade().on('error', $.util.log))
    .pipe($.if('!**/{index,404}.html', $.rename(function (path) {
      path.dirname += '/' + path.basename;
      path.basename = 'index';
      path.extname = '.html';
    })))
    .pipe(gulp.dest('app'))
);

/**
 *   Sass :: Compile and Prefix Stylesheet
 * -----------------------------------------------------------------------------
 */
gulp.task('sass', () =>
  gulp.src('src/sass/**/*.scss')
    .pipe($.sass({ precision: 4 }).on('error', $.sass.logError))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.stream())
);
