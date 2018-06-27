dashboardApp.controller('calificaciones_ctrl', ['$scope', '$http', '$timeout', '$uibModal', calificaciones_ctrl]);

function calificaciones_ctrl($scope, $http, $timeout, $uibModal) {
	var btn_admin       = '<div class="btn-group" role="group"><button type="button" class="btn btn-primary btn-xs admin_calificacion"><li class="glyphicon glyphicon-edit"></li></button><button type="button" class="btn btn-danger btn-xs drop_calificacion"><li class="glyphicon glyphicon-trash"></li></button></div>';
	var modalInstance   = {};
	$scope.calificacion = {};
	
	var Table_calificacion = $('#lista-calificacion').dataTable({
		processing: true,
		serverSide: true,
		responsive: true,
		ajax: {
			url: CONST.URL('principal/calificacion_listar'), "type": "POST"
		},
		columns: [{data: 'calificacion', orderable: false}, {data: 'min', orderable: false, searchable: false},
			{data: 'max', orderable: false, searchable: false},
			{class: "text-center", searchable: false, orderable: false, data: null, defaultContent: btn_admin}],
		rowCallback: function (row, data) {
			$(row).find('button.admin_calificacion').on('click', function () {
				$(row).parent().find('tr').removeClass('selected');
				$(row).addClass('selected');
				$timeout(function () {
					$scope.calificacion = Object.assign({}, data);
					$scope.adm_calificacion();
				});
			});
			
			$(row).find('button.drop_calificacion').on('click', function () {
				$(row).parent().find('tr').removeClass('selected');
				$(row).addClass('selected');
				
				new PNotify({
					title: 'Confirmación necesaria',
					text: '¿Estás seguro en eliminar el rango de calificacion: ' + data.calificacion + '?, Este proceso es irreversible.',
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
	
	$scope.adm_calificacion = function (usu) {
		$scope.calificacion = usu || $scope.calificacion;
		modalInstance       = $uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: CONST.URL('principal/view/form_calificacion'),
			size: 'sm',
			controller: 'calificacion_ctrl',
			scope: $scope
		});
		
		modalInstance.result.then(function (response) {
			Table_calificacion.fnDraw(false);
		}, function () {
			console.info('Modal dismissed at: ' + new Date());
		});
	};
	
	$scope.eliminar = function (data) {
		$http({
			url: CONST.URL('principal/calificacion_eliminar'),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			method: 'POST',
			data: $.param(data)
		}).then(function (data) {
			Notify(data.data);
			Table_calificacion.fnDraw(false);
		}, function (data) {
			console.log(data);
		});
	};
	
	$('.actualizar_calificacion').unbind('click').on('click', function (e) {
		Table_calificacion.fnDraw(false);
	});
}

dashboardApp.controller('calificacion_ctrl', ['$scope', '$http', '$uibModalInstance', calificacion_ctrl]);

function calificacion_ctrl($scope, $http, $uibModalInstance) {
	$scope.calificacion = $scope.calificacion || {};
	$scope.ok           = function () {
		$scope.SAVING    = true;
		var Calificacion = Object.assign({}, $scope.calificacion);
		
		$http({
			url: CONST.URL('principal/calificacion_guardar'),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			method: 'POST',
			data: $.param(Calificacion)
		}).then(function (data) {
			Notify(data.data);
			if (!data.data.error) {
				$scope.calificacion.id_escala = data.data.data;
				$uibModalInstance.close($scope.calificacion);
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