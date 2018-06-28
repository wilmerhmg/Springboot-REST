'use strict';
const gulp     = require('gulp');
const concat   = require('gulp-concat');
const uglify   = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const clear    = require('clear');
const gulpy    = require('gulp-notify');

const PACK = {
	dashboard: {
		js: [
			'js/libs/angular.min.js',
			'js/libs/ui-bootstrap-custom-2.5.0.js',
			'js/libs/ui-bootstrap-custom-tpls-2.5.0.js',
			'js/libs/angular-animate.min.js',
			'js/libs/angular-route.min.js',
			'js/libs/angular-tinymce.js',
			'js/libs/jQuery-2.1.4.min.js',
			'js/libs/bootstrap.min.js',
			'js/libs/jquery.dataTables.js',
			'js/libs/dataTables.bootstrap.min.js',
			'js/libs/jquery.slimscroll.min.js',
			'js/libs/fastclick.min.js',
			'js/libs/AdminLTE.js',
			'js/libs/AdminLTE.settings.js',
			'js/libs/polyfill.js',
			'js/libs/pnotify.custom.min.js',
			'js/libs/select2.min.js',
			'js/Angular.app.dashboard.js',
			'js/Dashboard.services.js',
			'js/dashboard.controllers/*_ctrl.js'],
		css: [
			'css/bootstrap.css',
			'css/font-awesome.min.css',
			'css/ionicons.min.css',
			'css/dataTables.bootstrap.css',
			'css/select2.min.css',
			'css/google.fonts.css',
			'css/AdminLTE.css',
			'css/skins/_all-skins.css',
			'css/pnotify.custom.min.css'
		], info: {
			js: {
				route: 'js/', name: 'dashboard.min.js', task: 'js'
			}, css: {
				route: 'css/', name: 'dashboard.min.css', task: 'css'
			}
		}
	}
};

/*TASK DASHBOARD*/
gulp.task(PACK.dashboard.info.js.task, function () {
	clear();
	gulp.src(PACK.dashboard.js)
		.pipe(concat(PACK.dashboard.info.js.name))
		.pipe(uglify())
		.pipe(gulp.dest(PACK.dashboard.info.js.route))
		.pipe(gulpy({ message: "Se ha compilado: "+PACK.dashboard.info.js.task, onLast: true }));
});

gulp.task(PACK.dashboard.info.css.task, function () {
	clear();
	gulp.src(PACK.dashboard.css)
		.pipe(concat(PACK.dashboard.info.css.name))
		.pipe(cleanCSS())
		.pipe(gulp.dest(PACK.dashboard.info.css.route))
		.pipe(gulpy({ message: "Se ha compilado: "+PACK.dashboard.info.css.task, onLast: true }));
});
/*#TASK DASHBOARD#*/

gulp.task('compile', function () {
	for (var i in PACK) {
		console.info(i, 'observando:', PACK[i].info.js.task);
		gulp.watch(PACK[i].js, [PACK[i].info.js.task]);

		console.info(i, 'observando:', PACK[i].info.css.task);
		gulp.watch(PACK[i].css, [PACK[i].info.css.task]);
	}
});
