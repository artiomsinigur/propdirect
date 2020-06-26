const { src, dest, watch, series, parallel } = require("gulp");
const sass = require("gulp-sass");
const gulpStylelint = require("gulp-stylelint");
const browserSync = require("browser-sync").create();
const rename = require("gulp-rename");
const del = require("del");
const concat = require("gulp-concat");
const imagemin = require("gulp-imagemin");
const uglify = require("gulp-uglify-es").default;
const autoprefixer = require("gulp-autoprefixer");

// Compile sass into css
function style() {
  return (
    src("./public/sass/**/*.scss")
      .pipe(
        // Linter that helps to avoid errors and enforce conventions in styles
        gulpStylelint({
          failAfterError: false,
          reporters: [
            {
              formatter: "string",
              console: true,
            },
          ],
        })
      )
      .pipe(sass().on("error", sass.logError))
      .pipe(concat("style.css"))
      .pipe(dest("./public/css"))
      // Stream changes to all browser
      .pipe(browserSync.stream())
  );
}

// Add vendor prefixes to CSS
function cssAutoprefixer() {
  return src("./public/css/style.css")
    .pipe(autoprefixer())
    .pipe(dest("./public/css"));
}

// Watch sass files when change
function watcher() {
  browserSync.init({
    server: {
      baseDir: "./public",
    },
  });
  watch("./public/sass/**/*.scss", style);
  watch("./public/*.html").on("change", browserSync.reload);
  watch("./public/js/*.js").on("change", browserSync.reload);
}

// Minify the js files
function jsMinify() {
  return src("./public/js/*.js")
    .pipe(concat("production.js"))
    .pipe(uglify())
    .pipe(rename("production.min.js"))
    .pipe(dest("./public/js/build"));
}

// Optimize the images
function imgMinify() {
  return src("./public/img/*")
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 80, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(dest("./public/img/compressed"));
}

// Clean old folders and files
function clean() {
  return del([
    "./public/js/build",
    "./public/img/compressed",
  ]);
}

module.exports = {
  style,
  watch: watcher,
  imageMin: series(clean, imgMinify),
  build: series(clean, parallel(jsMinify, series(style, cssAutoprefixer))),
};
