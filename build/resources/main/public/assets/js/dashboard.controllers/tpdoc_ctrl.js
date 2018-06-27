dashboardApp.controller('tpdoc_ctrl', ['$scope', '$http', '$timeout', '$uibModal', tpdoc_ctrl]);

function tpdoc_ctrl($scope, $http, $timeout, $uibModal) {
	var btn_admin     = '<div class="btn-group" role="group"><button type="button" class="btn btn-primary btn-xs admin_documento"><li class="glyphicon glyphicon-edit"></li></button><button type="button" class="btn btn-danger btn-xs drop_documento"><li class="glyphicon glyphicon-trash"></li></button></div>';
	var modalInstance = {};
	$scope.documento  = {};
	
	var Table_documento = $('#lista-identificacion').dataTable({
		processing: true,
		serverSide: true,
		responsive: true,
		order: [[1, 'asc']],
		ajax: {
			url: CONST.URL('principal/doc_listar'), "type": "POST"
		},
		columns: [{data: 'siglas'}, {data: 'nom_doc'},
			{class: "text-center", searchable: false, orderable: false, data: null, defaultContent: btn_admin}],
		rowCallback: function (row, data) {
			$(row).find('button.admin_documento').on('click', function () {
				$(row).parent().find('tr').removeClass('selected');
				$(row).addClass('selected');
				$timeout(function () {
					$scope.documento = Object.assign({}, data);
					$scope.adm_identificacion();
				});
			});
			
			$(row).find('button.drop_documento').on('click', function () {
				$(row).parent().find('tr').removeClass('selected');
				$(row).addClass('selected');
				
				new PNotify({
					title: 'Confirmación necesaria',
					text: '¿Estás seguro en eliminar el tipo de documento: ' + data.nom_doc + '?, Este proceso es irreversible.',
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
	
	$scope.adm_identificacion = function (usu) {
		$scope.documento = usu || $scope.documento;
		modalInstance    = $uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: CONST.URL('principal/view/form_doc'),
			size: 'sm',
			controller: 'doc_ctrl',
			scope: $scope
		});
		
		modalInstance.result.then(function (response) {
			Table_documento.fnDraw(false);
		}, function () {
			console.info('Modal dismissed at: ' + new Date());
		});
	};
	
	$scope.eliminar = function (data) {
		$http({
			url: CONST.URL('principal/doc_eliminar'),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			method: 'POST',
			data: $.param(data)
		}).then(function (data) {
			Notify(data.data);
			Table_documento.fnDraw(false);
		}, function (data) {
			console.log(data);
		});
	};
	
	$('.actualizar_identificacion').unbind('click').on('click', function (e) {
		Table_documento.fnDraw(false);
	});
}

dashboardApp.controller('doc_ctrl', ['$scope', '$http', '$uibModalInstance', doc_ctrl]);

function doc_ctrl($scope, $http, $uibModalInstance) {
	$scope.documento = $scope.documento || {};
	$scope.ok = function () {
		$scope.SAVING = true;
		var Doc      = Object.assign({}, $scope.documento);
		
		$http({
			url: CONST.URL('principal/doc_guardar'),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			method: 'POST',
			data: $.param(Doc)
		}).then(function (data) {
			Notify(data.data);
			if (!data.data.error) {
				$scope.documento.tipo_doc = data.data.data;
				$uibModalInstance.close($scope.documento);
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