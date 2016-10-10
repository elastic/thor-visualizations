const gulp = require('gulp');
const less = require('gulp-less');
const babel = require('gulp-babel');
const path = require('path');
const Rsync = require('rsync');
const pkg = require('./package.json');
const mkdirp = require('mkdirp');
const webpack = require('gulp-webpack');

const syncDestinations = [
  // '../alerts/node_modules/' + pkg.name,
  '../thor/node_modules/' + pkg.name
];

const include = [
  'package.json',
  'README.md',
  'dist',
  'css'
];

const exclude = [
  'src',
  'examples',
  'gulpfile.js',
  'node_modules',
  '.eslintrc',
  '.git'
];

Object.keys(pkg.devDependencies).forEach((name) => {
  exclude.push(path.join('node_modules', name));
});

Object.keys(pkg.peerDependencies).forEach((name) => {
  exclude.push(path.join('node_modules', name));
});

function syncPluginTo(dest, done) {
  return new Promise((resolve, reject) => {
    mkdirp(dest, function (err) {
      if (err) return reject(err);

      const source = path.resolve(__dirname) + '/';
      const rsync = new Rsync();

      rsync.source(source)
      .destination(dest)
      .flags('uav')
      .recursive(true)
      .set('delete')
      .include(include)
      .exclude(exclude)
      .output(function (data) {
        process.stdout.write(data.toString('utf8'));
      });

      rsync.execute(function (err) {
        if (err) {
          console.log(err);
          return reject(err);
        }
        resolve();
      });
    });
  });
}

gulp.task('sync', function (done) {
  Promise.all(syncDestinations.map(syncPluginTo)).then(() => done()).catch(done);
});

gulp.task('js', () => {
  return gulp.src('src/lib/**/*.js')
  .pipe(babel({
    presets: ['react', 'es2015-loose', 'stage-1'],
    plugins: ['add-module-exports', 'dev-expression']
  })).pipe(gulp.dest('dist'));
});

gulp.task('webpack', () => {
  return gulp.src('src/examples/app.js')
    .pipe(webpack({
      watch: true,
      devtool: 'eval-source-map',
      output: {
        filename: '[name].js'
      },
      module: {
        loaders: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel',
            query: {
              presets: ['react', 'es2015-loose', 'stage-1']
            }
          },
          { test: /\.less$/, loader: 'style!css!less' }
        ]
      }
    }))
    .pipe(gulp.dest('examples/'));
});


gulp.task('less', () => {
  const options = {
    paths: [ path.join(__dirname, 'less', 'includes') ]
  };
  return gulp.src('./src/less/main.less')
    .pipe(less())
    .pipe(gulp.dest('./css'));
});
gulp.task('build', ['js', 'less']);

gulp.task('dev', ['build', 'sync'], () => {
  gulp.watch('src/lib/**/*.js', ['js']);
  gulp.watch('src/less/**/*.less', ['less']);
  gulp.watch(['package.json', 'dist/**/*', 'css/**/*'], ['sync']);
});

gulp.task('default', ['build', 'sync']);

