dashboardApp.controller('modalidades_ctrl', ['$scope', '$http', '$timeout', '$uibModal', modalidades_ctrl]);

function modalidades_ctrl($scope, $http, $timeout, $uibModal) {
	var btn_admin     = '<div class="btn-group" role="group"><button type="button" class="btn btn-primary btn-xs admin_modalidad"><li class="glyphicon glyphicon-edit"></li></button><button type="button" class="btn btn-danger btn-xs drop_modalidad"><li class="glyphicon glyphicon-trash"></li></button></div>';
	var modalInstance = {};
	$scope.modalidad  = {};
	
	var Table_modalidad = $('#lista-modalidad').dataTable({
		processing: true,
		serverSide: true,
		responsive: true,
		order: [[0, 'asc']],
		ajax: {
			url: CONST.URL('principal/modalidad_listar'), "type": "POST"
		},
		columns: [{data: 'descripcion'},
			{class: "text-center", searchable: false, orderable: false, data: null, defaultContent: btn_admin}],
		rowCallback: function (row, data) {
			$(row).find('button.admin_modalidad').on('click', function () {
				$(row).parent().find('tr').removeClass('selected');
				$(row).addClass('selected');
				$timeout(function () {
					$scope.modalidad = Object.assign({}, data);
					$scope.adm_modalidad();
				});
			});
			
			$(row).find('button.drop_modalidad').on('click', function () {
				$(row).parent().find('tr').removeClass('selected');
				$(row).addClass('selected');
				
				new PNotify({
					title: 'Confirmación necesaria',
					text: '¿Estás seguro en eliminar la modalidad: ' + data.descripcion + '?, Este proceso es irreversible.',
					icon: 'glyphicon glyphicon-question-sign',
					hide: false,
					styling: 'bootstrap3',
					confirm: {
						confirm: true, buttons: [{
							text: 'Cancelar', addClass: 'pull-left', click: function (notice) {
								notice.remove();
							}
						}, {
							text: 'Eliminar', click: function (notice) {
								notice.remove();
								$scope.eliminar(data);
							}
						}]
					},
					buttons: {
						closer: false, sticker: false
					},
					history: {
						history: false
					},
					addclass: 'stack-modal',
					stack: {'dir1': 'down', 'dir2': 'right', 'modal': true}
				});
			});
		}
	});
	
	$scope.adm_modalidad = function (usu) {
		$scope.modalidad = usu || $scope.modalidad;
		modalInstance    = $uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: CONST.URL('principal/view/form_modalidad'),
			size: 'sm',
			controller: 'modalidad_ctrl',
			scope: $scope
		});
		
		modalInstance.result.then(function (response) {
			Table_modalidad.fnDraw(false);
		}, function () {
			console.info('Modal dismissed at: ' + new Date());
		});
	};
	
	$scope.eliminar = function (data) {
		$http({
			url: CONST.URL('principal/modalidad_eliminar'),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			method: 'POST',
			data: $.param(data)
		}).then(function (data) {
			Notify(data.data);
			Table_modalidad.fnDraw(false);
		}, function (data) {
			console.log(data);
		});
	};
	
	$('.actualizar_modalidad').unbind('click').on('click', function (e) {
		Table_modalidad.fnDraw(false);
	});
}

dashboardApp.controller('modalidad_ctrl', ['$scope', '$http', '$uibModalInstance', modalidad_ctrl]);

function modalidad_ctrl($scope, $http, $uibModalInstance) {
	$scope.modalidad = $scope.modalidad || {};
	$scope.coleccion = [];
	
	$scope.ok = function () {
		$scope.SAVING = true;
		var Modalidad = Object.assign({}, $scope.modalidad);
		
		$http({
			url: CONST.URL('principal/modalidad_guardar'),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			method: 'POST',
			data: $.param(Modalidad)
		}).then(function (data) {
			Notify(data.data);
			if (!data.data.error) {
				$scope.modalidad.id_clas = data.data.data;
				$uibModalInstance.close($scope.modalidad);
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
	
	$http({
		url: CONST.URL('principal/get_coleccion'),
		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		method: 'POST'
	}).then(function (data) {
		if (data.data.error) {
			Notify(data.data);
		} else {
			$scope.coleccion = data.data.data;
		}
	}, function (data) {
		console.log(data);
	});
	
}