var dashboardApp = angular.module('dashboardApp', ['ngRoute', 'ngAnimate', 'ui.bootstrap']);

dashboardApp.run(['AUX_TABLES', function (AUX_TABLES) {

}]);
dashboardApp.config(['$routeProvider', '$locationProvider', RUTAS]);

function RUTAS($routeProvider, $locationProvider) {
	$routeProvider.when('/', {
		templateUrl: CONST.URL('welcome.html')
	}).when('/personas', {
		templateUrl: CONST.URL('persona/adm_persona.html'), controller: 'personas_ctrl'
	}).when('/activos', {
		templateUrl: CONST.URL('activo/adm_activo.html'), controller: 'activos_ctrl'
	}).when('/asignaciones', {
		templateUrl: CONST.URL('asignacion/adm_asignacion.html'), controller: 'asignaciones_ctrl'
	}).otherwise({
		templateUrl: CONST.URL('default.html')
	});
}

dashboardApp.filter('fristCap', function () {
	return function (input, $scope) {
		if (input != null) {
			input = input.toLowerCase();
			return input.substring(0, 1).toUpperCase() + input.substring(1);
		}
		return "";
	}
});
