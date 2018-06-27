dashboardApp.controller('menu_ctrl', ['$scope', '$http', '$window', '$uibModal', '$timeout', menu]);

function menu($scope, $http, $window, $uibModal, $timeout) {
	$scope.user       = $window.CONST.USER;
	var modalInstance = {};
	
	$('body').toggleClass('oculto');
	
	
	$http.get(CONST.URL('principal/inet')).then(function (value) {
		PNotify.removeAll();
	}, function (reason) {
		PNotify.removeAll();
	});
	
	new PNotify({
		title: 'Un momento por favor',
		text: '<img src="' + CONST.URL('assets/img/secure_loading_en.gif') + '" class="img-responsive pull-left">' + 'Verificando conexión con servidor. Para poder continuar debe esperar a que se cierre esta notificación.',
		styling: 'bootstrap3',
		type: 'success',
		addclass: "stack-bottomleft",
		delay: 180000
	});
	
	$scope.cambioClave = function () {
		modalInstance = $uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: CONST.URL('principal/view/form_clave'),
			size: 'sm',
			controller: 'clave_ctrl',
			scope: $scope
		});
		
		modalInstance.result.then(function (response) {
			console.log(response);
		}, function () {
			console.info('Modal dismissed at: ' + new Date());
		});
	}
	
}

dashboardApp.controller('clave_ctrl', ['$scope', '$http', '$window', '$uibModalInstance', '$timeout', clave]);

function clave($scope, $http, $window, $uibModalInstance, $timeout) {
	var options = {
		uploadUrl: CONST.URL('usuarios/avatar'),
		overwriteInitial: true,
		maxFileSize: 1024,
		showClose: false,
		showRemove: false,
		showCaption: false,
		showBrowse: false,
		showUpload: false,
		showCancel: false,
		browseOnZoneClick: true,
		defaultPreviewContent: '<img src="' + CONST.URL('assets/img/avatars/' + $scope.user.avatar) + '" alt="Avatar" class="momo-avatar"><h6 class="text-muted">Click aquí para cambiar (1Mb Max)</h6>',
		allowedFileExtensions: ["jpg", "png", "gif", "jpeg"],
		fileActionSettings: {
			showUpload: false, showZoom: false, showRemove: false
		},
		previewTemplates: {
			image: '<img src="{data}" class="kv-preview-data file-preview-image momo-avatar" title="{caption}" alt="{caption}" {style}>',
			other: '{footer}'
		}
	};
	
	$timeout(function () {
		$("#input-user").fileinput(options);
		$("#input-user").on('fileuploaded', function (event, data, previewId, index) {
			setTimeout(function () {
				$('#input-user').fileinput('reset');
				$('#input-user').fileinput('refresh', {defaultPreviewContent: '<img src="' + CONST.URL('assets/img/avatars/' + $scope.user.avatar) + '" alt="Avatar" class="momo-avatar"><h6 class="text-muted">Click aquí para cambiar (1Mb Max)</h6>'});
			}, 1000);
		}).on('fileuploaded', function (event, data, previewId, index) {
			$timeout(function () {
				$scope.user.avatar = data.response.data;
			});
		}).on('fileloaded', function (event, file, previewId, index, reader) {
			$('#input-user').fileinput('upload');
		});
	});
	
	$scope.ok = function () {
		$scope.SAVING = true;
		var Usuario   = Object.assign({}, $scope.usuario);
		
		$http({
			url: CONST.URL('usuarios/clave'),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			method: 'POST',
			data: $.param(Usuario)
		}).then(function (data) {
			Notify(data.data);
			if (!data.data.error) {
				$uibModalInstance.close($scope.usuario);
			}
			$scope.SAVING = false;
		}, function (data) {
			console.log(data);
			$scope.SAVING = false;
		});
		
	};
	
	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
	
}