dashboardApp.controller('sedes_ctrl', ['$scope', '$http', '$timeout', '$uibModal', sedes_ctrl]);

function sedes_ctrl($scope, $http, $timeout, $uibModal) {
	var btn_admin     = '<div class="btn-group" role="group"><button type="button" class="btn btn-primary btn-xs admin_sede"><li class="glyphicon glyphicon-edit"></li></button><button type="button" class="btn btn-danger btn-xs drop_sede"><li class="glyphicon glyphicon-trash"></li></button></div>';
	var modalInstance = {};
	$scope.sede       = {};
	
	var Table_sede = $('#lista-sede').dataTable({
		processing: true,
		serverSide: true,
		responsive: true,
		order: [[0, 'asc'], [1, 'asc'], [2, 'asc']],
		ajax: {
			url: CONST.URL('principal/sede_listar'), "type": "POST"
		},
		columns: [{data: 'nom_municipio'}, {data: 'nom_sede'}, {data: 'sigla_sede'},
			{class: "text-center", searchable: false, orderable: false, data: null, defaultContent: btn_admin}],
		rowCallback: function (row, data) {
			$(row).find('button.admin_sede').on('click', function () {
				$(row).parent().find('tr').removeClass('selected');
				$(row).addClass('selected');
				$timeout(function () {
					$scope.sede = Object.assign({}, data);
					$scope.adm_sede();
				});
			});
			
			$(row).find('button.drop_sede').on('click', function () {
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
	
	$scope.adm_sede = function (usu) {
		$scope.sede   = usu || $scope.sede;
		modalInstance = $uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: CONST.URL('principal/view/form_sede'),
			size: 'sm',
			controller: 'sede_ctrl',
			scope: $scope
		});
		
		modalInstance.result.then(function (response) {
			Table_sede.fnDraw(false);
		}, function () {
			console.info('Modal dismissed at: ' + new Date());
		});
	};
	
	$scope.eliminar = function (data) {
		$http({
			url: CONST.URL('principal/sede_eliminar'),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			method: 'POST',
			data: $.param(data)
		}).then(function (data) {
			Notify(data.data);
			Table_sede.fnDraw(false);
		}, function (data) {
			console.log(data);
		});
	};
	
	$('.actualizar_sede').unbind('click').on('click', function (e) {
		Table_sede.fnDraw(false);
	});
}

dashboardApp.controller('sede_ctrl', ['$scope', '$http', '$uibModalInstance', '$timeout', sede_ctrl]);

function sede_ctrl($scope, $http, $uibModalInstance, $timeout) {
	$scope.sede = $scope.sede || {};
	$scope.ok   = function () {
		$scope.SAVING = true;
		var Sede      = Object.assign({}, $scope.sede);
		
		$http({
			url: CONST.URL('principal/sede_guardar'),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			method: 'POST',
			data: $.param(Sede)
		}).then(function (data) {
			Notify(data.data);
			if (!data.data.error) {
				$scope.sede.id_sede = data.data.data;
				$uibModalInstance.close($scope.sede);
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
	
	$timeout(function () {
		$("#sede_municipio_id").select2({
			placeholder: "Buscar Municipio...", minimumInputLength: 2, multiple: false, ajax: {
				url: CONST.URL("principal/ajax_buscar_mpio"),
				dataType: 'json',
				type: 'POST',
				quietMillis: 500,
				data: function (term, page) {
					return {
						q: term, page: page
					};
				},
				results: function (data, page) {
					var more = (page * 10) < data.total;
					return {results: data.data, more: more};
				}
			}, initSelection: function (element, callback) {
				var id = $(element).val();
				if (id !== "") {
					$.ajax(CONST.URL("personas/ajax_buscar_mpio"), {
						dataType: "json", type: 'POST', data: "id=" + id
					}).done(function (data) {
						callback(data.data[0]);
					});
				}
			}, formatResult: function (repo) {
				var markup = '<div class="row-fluid"><b>' + repo.nom_municipio.capitalize() + '</b></div><div class="row-fluid"><small><small>' + repo.ref.capitalize() + '</small></small></div>';
				return markup;
			}, formatSelection: function (repo) {
				$timeout(function () {
					$scope.municipio_id = repo.id;
				});
				return repo.nombre;
			}
		});
	});
	
	$scope.$watch('sede.municipio_id', function (newVal, oldVal) {
		$("#sede_municipio_id").select2('val', newVal);
	});
	
}