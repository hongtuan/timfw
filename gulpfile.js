const gulp = require('gulp');
const del = require('del');
const through = require('through2');
const zip = require('gulp-zip');
const moment = require('moment');

const buildPath = 'build';
const buildName = `timfw_${moment().format('YYYYMMDDHHmm')}`;

gulp.task('clean',function(){
  return del(['./build/*','*.zip']);
});

gulp.task('updateVersion',function(){
  return gulp.src(`./${buildPath}/version.info`)
    .pipe(through.obj(function(file, encode, cb) {
      //console.log(file.contents.toString(),encode);
      let verInfo = 'version:1.1.0\r\n';
      verInfo += `build time:${moment().format('YYYY-MM-DD HH:mm:ss')}`;
      // update file content here.
      file.contents = new Buffer(verInfo);
      this.push(file);
      cb();
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('buildZip',function(){
  const items = [
    'app_api/**',
    'app_client/**',
    'app_server/**',
    'client/**',
    'utils/**',
    'logs/**',
    '.env',
    'package.json',
    'expserver.js',
    'version.info',
  ];
  return gulp.src(items,{base:'./'})
    .pipe(zip(`${buildName}.zip`))
    .pipe(gulp.dest(`./${buildPath}`));
});

function doUpdateTask(){
  console.log('update file to remote host...');
  const cp = require('child_process');
  const path = require('path');
  const usPath = path.join(__dirname,`${buildPath}/ruc.cmd`);
  const usWorkPath = path.join(__dirname,buildPath);
  const ef = cp.execFile(usPath,[usWorkPath,`${buildName}.zip`]);
  ef.stdout.on('data', (stdOut) => {
    console.log(stdOut);
  });

  ef.stderr.on('data', (stdErr) => {
    console.log(stdErr);
  });

  ef.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    console.log('update over.');
  });
}

gulp.task('default',['updateVersion','buildZip'],function(){
  doUpdateTask();
});
