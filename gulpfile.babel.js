/**
 *   Albert :: Gulp Build System
 * =============================================================================
 */
import browserSync from 'browser-sync';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';

const $ = gulpLoadPlugins();

/**
 *   Default :: Development :: Watch For Changes And Reload
 * -----------------------------------------------------------------------------
 */
gulp.task('default', ['build'], () => {
  browserSync({
    notify: false,
    logPrefix: 'Albert',
    server: {
      baseDir: ['app']
    },
    port: 3113
  });
  gulp.watch(['app/**/*.html'], browserSync.reload);
  gulp.watch(['src/pug/**/*.pug'], ['pug']);
  gulp.watch(['src/sass/**/*.scss'], ['sass']);
});

/**
 *   Build :: Build Application
 * -----------------------------------------------------------------------------
 */
gulp.task('build', ['vendor:css', 'vendor:js', 'pug', 'sass']);

/**
 *   Vendor JS :: Copy Vendor JavaScript
 * -----------------------------------------------------------------------------
 */
gulp.task('vendor:js', () =>
  gulp.src([
    'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
    'node_modules/jquery/dist/jquery.slim.min.js'
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
 *   Pug :: Compile HTML
 * -----------------------------------------------------------------------------
 */
gulp.task('pug', () =>
  gulp.src([
    'src/pug/**/*.pug',
    '!src/pug/**/_*.pug'
  ])
    .pipe($.pug())
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
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.stream())
);
