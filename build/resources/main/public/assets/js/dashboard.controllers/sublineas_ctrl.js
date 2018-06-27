dashboardApp.controller('sublineas_ctrl', ['$scope', '$http', '$timeout', '$uibModal', sublineas_ctrl]);

function sublineas_ctrl($scope, $http, $timeout, $uibModal) {
	var btn_admin     = '<div class="btn-group" role="group"><button type="button" class="btn btn-primary btn-xs admin_sublinea"><li class="glyphicon glyphicon-edit"></li></button><button type="button" class="btn btn-danger btn-xs drop_sublinea"><li class="glyphicon glyphicon-trash"></li></button></div>';
	var modalInstance = {};
	$scope.sublinea   = {};
	
	var Table_sublinea = $('#lista-sublinea').dataTable({
		processing: true,
		serverSide: true,
		responsive: true,
		order: [[0, 'asc'], [1, 'asc']],
		ajax: {
			url: CONST.URL('investigacion/sublinea_listar'), "type": "POST"
		},
		columns: [{data: 'nom_linea', visible: false, orderable:false}, {data: 'des_programa', orderable: false},
			{data: 'des_sublinea', orderable: false},
			{class: "text-center", searchable: false, orderable: false, data: null, defaultContent: btn_admin}],
		rowCallback: function (row, data) {
			$(row).find('button.admin_sublinea').on('click', function () {
				$(row).parent().find('tr').removeClass('selected');
				$(row).addClass('selected');
				$timeout(function () {
					$scope.sublinea = Object.assign({}, data);
					$scope.adm_sublinea();
				});
			});
			
			$(row).find('button.drop_sublinea').on('click', function () {
				$(row).parent().find('tr').removeClass('selected');
				$(row).addClass('selected');
				
				new PNotify({
					title: 'Confirmación necesaria',
					text: '¿Estás seguro en eliminar la sub-linea: ' + data.des_sublinea + '?, Este proceso es irreversible.',
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
		},
		drawCallback: function (settings) {
			var api  = this.api();
			var rows = api.rows({page: 'current'}).nodes();
			var last = null;
			
			api.column(0, {page: 'current'}).data().each(function (group, i) {
				if (last !== group) {
					$(rows).eq(i).before('<tr class="success"><td colspan="3"><strong>LINEA: ' + group + '</strong></td></tr>');
					last = group;
				}
			});
		}
	});
	
	$scope.adm_sublinea = function (usu) {
		$scope.sublinea = usu || $scope.sublinea;
		modalInstance   = $uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: CONST.URL('principal/view/form_sublineas'),
			size: 'md',
			controller: 'sublinea_ctrl',
			scope: $scope
		});
		
		modalInstance.result.then(function (response) {
			Table_sublinea.fnDraw(false);
		}, function () {
			console.info('Modal dismissed at: ' + new Date());
		});
	};
	
	$scope.eliminar = function (data) {
		$http({
			url: CONST.URL('investigacion/sublinea_eliminar'),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			method: 'POST',
			data: $.param(data)
		}).then(function (data) {
			Notify(data.data);
			Table_sublinea.fnDraw(false);
		}, function (data) {
			console.log(data);
		});
	};
	
	$('.actualizar_sublinea').unbind('click').on('click', function (e) {
		Table_sublinea.fnDraw(false);
	});
}

dashboardApp.controller('sublinea_ctrl', ['$scope', '$http', '$uibModalInstance', '$timeout', sublinea_ctrl]);

function sublinea_ctrl($scope, $http, $uibModalInstance, $timeout) {
	$scope.sublinea = $scope.sublinea || {};
	
	$scope.ok = function () {
		$scope.SAVING = true;
		var Linea     = Object.assign({}, $scope.sublinea);
		
		$http({
			url: CONST.URL('investigacion/sublinea_guardar'),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			method: 'POST',
			data: $.param(Linea)
		}).then(function (data) {
			Notify(data.data);
			if (!data.data.error) {
				$scope.sublinea.id_sublinea = data.data.data;
				$uibModalInstance.close($scope.sublinea);
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
		$("#sublinea_linea_id").select2({
			placeholder: "Buscar linea...", minimumInputLength: 0, multiple: false, ajax: {
				url: CONST.URL("investigacion/find2linea"),
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
					$.ajax(CONST.URL("investigacion/find2linea"), {
						dataType: "json", type: 'POST', data: "id=" + id
					}).done(function (data) {
						callback(data.data[0]);
					});
				}
			}, formatResult: function (repo) {
				var markup = '<div class="row-fluid">' + repo.nom_linea + '</div><div class="row-fluid"><small><small>' + repo.abr + ' - ' + repo.nom_unidad.capitalize() + '</small></small></div>';
				return markup;
			}, formatSelection: function (repo) {
				$timeout(function () {
					$scope.sublinea.linea_id = repo.id;
				});
				return repo.nom_linea;
			}
		});
	});
	
	$scope.$watch('linea.programa_id', function (newVal, oldVal) {
		$("#linea_programa_id").select2('val', newVal);
	});
	
}