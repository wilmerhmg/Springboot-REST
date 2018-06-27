var Login = angular.module('LoginApp', []);

Login.controller('AuthCtrl', ['$scope', '$http', '$window', '$timeout', function ($scope, $http, $window, $timeout) {
	$scope.login = {user: '', password: '', remember: false};
	
	$('input').iCheck({
		checkboxClass: 'icheckbox_square-blue', radioClass: 'iradio_square-blue', increaseArea: '20%'
	}).on('ifChecked', function (event) {
		$timeout(function () {
			$scope.login.remember = true;
		});
	}).on('ifUnchecked', function (event) {
		$timeout(function () {
			$scope.login.remember = false;
		});
	});
	
	$scope.authentication = function () {
		$http.post(CONST.URL('login/auth'), $scope.login).then(function (data) {
			$response = JSON.CAST(data.data);
			if ($response.data._is_login) {
				$window.location.href = CONST.URL('dashboard');
			} else {
				alert("Usuario o contraseña incorrectos");
			}
		}, function (reason) {
			console.log(reason);
			alert("Servicio no disponible, verifique conexion a internet\nCode: " + reason.statusText);
		});
	}
	
}]);