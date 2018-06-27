dashboardApp.controller('semilleros_ctrl', ['$scope', '$http', '$timeout', '$uibModal', semilleros_ctrl]);

function semilleros_ctrl($scope, $http, $timeout, $uibModal) {
	var btn_admin     = '<div class="btn-group" role="group"><button type="button" class="btn btn-primary btn-xs admin_semillero"><li class="glyphicon glyphicon-edit"></li></button><button type="button" class="btn btn-danger btn-xs drop_semillero"><li class="glyphicon glyphicon-trash"></li></button></div>';
	var modalInstance = {};
	$scope.semillero      = {};
	
	var Table_Semillero = $('#lista-semillero').dataTable({
		"processing": true,
		"serverSide": true,
		"order": [[0, 'asc']],
		"ajax": {
			"url": CONST.URL('investigacion/semillero_listar'), "type": "POST"
		},
		"columns": [{data: 'nom_semillero'}, {data: 'sigla_semillero'}, {data: 'nom_grupo'},
			{class: "text-center", searchable: false, orderable: false, data: null, defaultContent: btn_admin}],
		rowCallback: function (row, data) {
			$(row).find('button.admin_semillero').on('click', function () {
				$(row).parent().find('tr').removeClass('selected');
				$(row).addClass('selected');
				$timeout(function () {
					$scope.semillero = Object.assign({}, data);
					$scope.adm_semillero();
				});
			});
			
			$(row).find('button.drop_semillero').on('click', function () {
				$(row).parent().find('tr').removeClass('selected');
				$(row).addClass('selected');
				
				new PNotify({
					title: 'Confirmación necesaria',
					text: '¿Estás seguro en eliminar el semillero: ' + data.sigla_semillero + '?. Este proceso es irreversible.',
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
	
	$scope.adm_semillero = function (usu) {
		$scope.semillero  = usu || $scope.semillero;
		modalInstance = $uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: CONST.URL('principal/view/form_semilleros'),
			size: 'sm',
			controller: 'semillero_ctrl',
			scope: $scope
		});
		
		modalInstance.result.then(function (response) {
			Table_Semillero.fnDraw(false);
		}, function () {
			console.info('Modal dismissed at: ' + new Date());
		});
	};
	
	$scope.eliminar = function (data) {
		$http({
			url: CONST.URL('investigacion/semillero_eliminar'),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			method: 'POST',
			data: $.param(data)
		}).then(function (data) {
			Notify(data.data);
			Table_Semillero.fnDraw(false);
		}, function (data) {
			console.log(data);
		});
	};
	
	$('.actualizar_semillero').unbind('click').on('click', function (e) {
		Table_Semillero.fnDraw(false);
	});
}

dashboardApp.controller('semillero_ctrl', ['$scope', '$http', '$uibModalInstance', '$timeout', semillero_ctrl]);

function semillero_ctrl($scope, $http, $uibModalInstance, $timeout) {
	$scope.ok = function () {
		$scope.SAVING  = true;
		var Semillero      = Object.assign({}, $scope.semillero);		
		$http({
			url: CONST.URL('investigacion/semillero_guardar'),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			method: 'POST',
			data: $.param(Semillero)
		}).then(function (data) {
			Notify(data.data);
			if (!data.data.error) {
				$scope.semillero.id_semillero = data.data.data;
				$uibModalInstance.close($scope.semillero);
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
		$("#semillero_grupo_id").select2({
			placeholder: "Buscar grupo...", minimumInputLength: 0, multiple: false, ajax: {
				url: CONST.URL("investigacion/find2grupo"),
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
					$.ajax(CONST.URL("investigacion/find2grupo"), {
						dataType: "json", type: 'POST', data: "id=" + id
					}).done(function (data) {
						callback(data.data[0]);
					});
				}
			}, formatResult: function (repo) {
				var markup = '<div class="row-fluid">' + repo.nom_grupo + '</div><div class="row-fluid"><small><small>' + repo.sigla_grupo + '</small></small></div>';
				return markup;
			}, formatSelection: function (repo) {
				$timeout(function () {
					$scope.semillero.grupo_id = $("#semillero_grupo_id").val();
				});
				return repo.nom_grupo;
			}
		});
	});
	
	$scope.$watch('semillero.grupo_id', function (newVal, oldVal) {
		$("#semillero_grupo_id").select2('val', newVal);
	});
	
}