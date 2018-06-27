dashboardApp.controller('paises_ctrl', ['$scope', '$http', '$timeout', '$uibModal', paises]);

function paises($scope, $http, $timeout, $uibModal) {
	var btn_admin     = '<div class="btn-group" role="group"><button type="button" class="btn btn-primary btn-xs admin_pais"><li class="glyphicon glyphicon-edit"></li></button><button type="button" class="btn btn-danger btn-xs drop_pais"><li class="glyphicon glyphicon-trash"></li></button></div>';
	var modalInstance = {};
	$scope.pais       = {};
	
	var Table_pais = $('#lista-pais').dataTable({
		processing: true,
		serverSide: true,
		responsive: true,
		order: [[1, 'asc']],
		ajax: {
			url: CONST.URL('principal/pais_listar'), "type": "POST"
		},
		columns: [{data: 'abrev'}, {data: 'nom_pais'},
			{class: "text-center", searchable: false, orderable: false, data: null, defaultContent: btn_admin}],
		rowCallback: function (row, data) {
			$(row).find('button.admin_pais').on('click', function () {
				$(row).parent().find('tr').removeClass('selected');
				$(row).addClass('selected');
				$timeout(function () {
					$scope.pais = Object.assign({}, data);
					$scope.adm_pais();
				});
			});
			
			$(row).find('button.drop_pais').on('click', function () {
				$(row).parent().find('tr').removeClass('selected');
				$(row).addClass('selected');
				
				new PNotify({
					title: 'Confirmación necesaria',
					text: '¿Estás seguro en eliminar el pais: ' + data.nom_pais + '?, Este proceso es irreversible.',
					icon: 'glyphicon glyphicon-question-sign',
					hide: false,
					styling: 'bootstrap3',
					confirm: {
						confirm: true, buttons: [{
							text: 'Cancelar', addClass: 'pull-left', click: function (notice) {
								notice.remove()
							}
						}, {
							text: 'Eliminar', click: function (notice) {
								notice.remove()
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
	
	$scope.adm_pais = function (usu) {
		$scope.pais   = usu || $scope.pais;
		modalInstance = $uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: CONST.URL('principal/view/form_pais'),
			size: 'sm',
			controller: 'pais_ctrl',
			scope: $scope
		});
		
		modalInstance.result.then(function (response) {
			Table_pais.fnDraw(false);
		}, function () {
			console.info('Modal dismissed at: ' + new Date());
		});
	};
	
	$scope.eliminar = function (data) {
		$http({
			url: CONST.URL('principal/pais_eliminar'),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			method: 'POST',
			data: $.param(data)
		}).then(function (data) {
			Notify(data.data);
			Table_pais.fnDraw(false);
		}, function (data) {
			console.log(data);
		});
	};
	
	$('.actualizar_pais').unbind('click').on('click', function (e) {
		Table_pais.fnDraw(false);
	});
}

dashboardApp.controller('pais_ctrl', ['$scope', '$http', '$uibModalInstance', pais]);

function pais($scope, $http, $uibModalInstance) {
	$scope.ok = function () {
		$scope.SAVING = true;
		var Pais      = Object.assign({}, $scope.pais);
		
		$http({
			url: CONST.URL('principal/pais_guardar'),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			method: 'POST',
			data: $.param(Pais)
		}).then(function (data) {
			Notify(data.data);
			if (!data.data.error) {
				$scope.pais.cod_pais = data.data.data;
				$uibModalInstance.close($scope.pais);
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

/*Deptos Controllers*/
dashboardApp.controller('deptos_ctrl', ['$scope', '$http', '$timeout', '$uibModal', deptos]);

function deptos($scope, $http, $timeout, $uibModal) {
	var btn_admin     = '<div class="btn-group" role="group"><button type="button" class="btn btn-primary btn-xs admin_depto"><li class="glyphicon glyphicon-edit"></li></button><button type="button" class="btn btn-danger btn-xs drop_depto"><li class="glyphicon glyphicon-trash"></li></button></div>';
	var modalInstance = {};
	$scope.depto      = {};
	
	var Table_depto = $('#lista-depto').dataTable({
		processing: true,
		serverSide: true,
		responsive: true,
		order: [[0, 'asc'], [1, 'asc']],
		ajax: {
			url: CONST.URL('principal/depto_listar'), "type": "POST"
		},
		columns: [{data: 'nom_pais'}, {data: 'nom_dep'},
			{class: "text-center", searchable: false, orderable: false, data: null, defaultContent: btn_admin}],
		rowCallback: function (row, data) {
			$(row).find('button.admin_depto').on('click', function () {
				$(row).parent().find('tr').removeClass('selected');
				$(row).addClass('selected');
				$timeout(function () {
					$scope.depto = Object.assign({}, data);
					$scope.adm_depto();
				});
			});
			
			$(row).find('button.drop_depto').on('click', function () {
				$(row).parent().find('tr').removeClass('selected');
				$(row).addClass('selected');
				
				new PNotify({
					title: 'Confirmación necesaria',
					text: '¿Estás seguro en eliminar el departamento: ' + data.nom_depto + '?, Este proceso es irreversible.',
					icon: 'glyphicon glyphicon-question-sign',
					hide: false,
					styling: 'bootstrap3',
					confirm: {
						confirm: true, buttons: [{
							text: 'Cancelar', addClass: 'pull-left', click: function (notice) {
								notice.remove()
							}
						}, {
							text: 'Eliminar', click: function (notice) {
								notice.remove()
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
	
	$scope.adm_depto = function (usu) {
		$scope.depto  = usu || $scope.depto;
		modalInstance = $uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: CONST.URL('principal/view/form_depto'),
			size: 'sm',
			controller: 'depto_ctrl',
			scope: $scope
		});
		
		modalInstance.result.then(function (response) {
			Table_depto.fnDraw(false);
		}, function () {
			console.info('Modal dismissed at: ' + new Date());
		});
	};
	
	$scope.eliminar = function (data) {
		$http({
			url: CONST.URL('principal/depto_eliminar'),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			method: 'POST',
			data: $.param(data)
		}).then(function (data) {
			Notify(data.data);
			Table_depto.fnDraw(false);
		}, function (data) {
			console.log(data);
		});
	};
	
	$('.actualizar_depto').unbind('click').on('click', function (e) {
		Table_depto.fnDraw(false);
	});
}

dashboardApp.controller('depto_ctrl', ['$scope', '$http', '$uibModal', '$uibModalInstance', '$timeout', depto]);

function depto($scope, $http, $uibModal, $uibModalInstance, $timeout) {
	$scope.depto = $scope.depto || {};
	$scope.ok    = function () {
		$scope.SAVING = true;
		var Depto     = Object.assign({}, $scope.depto);
		
		$http({
			url: CONST.URL('principal/depto_guardar'),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			method: 'POST',
			data: $.param(Depto)
		}).then(function (data) {
			Notify(data.data);
			if (!data.data.error) {
				$scope.depto.cod_dep = data.data.data;
				$uibModalInstance.close($scope.depto);
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
		$("#depto_cod_pais").select2({
			placeholder: "Buscar pais...", minimumInputLength: -1, multiple: false, ajax: {
				url: CONST.URL("principal/buscar2pais"),
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
					$.ajax(CONST.URL("principal/buscar2pais"), {
						dataType: "json", type: 'POST', data: "id=" + id
					}).done(function (data) {
						callback(data.data[0]);
					});
				}
			}, formatResult: function (repo) {
				var markup = '<div class="row-fluid">' + repo.nom_pais.capitalize() + '</div>';
				return markup;
			}, formatSelection: function (repo) {
				$timeout(function () {
					console.log("Seleccionando: ", repo);
					$scope.depto.cod_pais = repo.id;
				});
				return repo.nom_pais;
			}
		});
	});
	
	$scope.$watch('depto.cod_pais', function (newVal, oldVal) {
		console.log('Waching depto.pais:', newVal);
		$("#depto_cod_pais").select2('val', newVal);
	});
	
	$scope.crear_2_pais = function (usu) {
		$scope.pais   = usu || $scope.pais;
		modalInstance = $uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: CONST.URL('principal/view/form_pais'),
			size: 'sm',
			controller: 'pais_ctrl',
			scope: $scope
		});
		
		modalInstance.result.then(function (response) {
			console.log('Retorno', response);
			$scope.depto.cod_pais = response.cod_pais;
		}, function () {
			console.info('Modal dismissed at: ' + new Date());
		});
	}
	
}


/*mpios controller*/
dashboardApp.controller('mpios_ctrl', ['$scope', '$http', '$timeout', '$uibModal', mpios]);

function mpios($scope, $http, $timeout, $uibModal) {
	var btn_admin     = '<div class="btn-group" role="group"><button type="button" class="btn btn-primary btn-xs admin_mpio"><li class="glyphicon glyphicon-edit"></li></button><button type="button" class="btn btn-danger btn-xs drop_mpio"><li class="glyphicon glyphicon-trash"></li></button></div>';
	var modalInstance = {};
	$scope.mpio       = {};
	
	var Table_mpio = $('#lista-mpio').dataTable({
		processing: true,
		serverSide: true,
		responsive: true,
		order: [[0, 'asc'], [1, 'asc'], [2, 'asc']],
		ajax: {
			url: CONST.URL('principal/mpio_listar'), "type": "POST"
		},
		columns: [{data: 'nom_pais'}, {data: 'nom_dep'}, {data: 'nom_municipio'},
			{class: "text-center", searchable: false, orderable: false, data: null, defaultContent: btn_admin}],
		rowCallback: function (row, data) {
			$(row).find('button.admin_mpio').on('click', function () {
				$(row).parent().find('tr').removeClass('selected');
				$(row).addClass('selected');
				$timeout(function () {
					$scope.mpio = Object.assign({}, data);
					$scope.adm_mpio();
				});
			});
			
			$(row).find('button.drop_mpio').on('click', function () {
				$(row).parent().find('tr').removeClass('selected');
				$(row).addClass('selected');
				
				new PNotify({
					title: 'Confirmación necesaria',
					text: '¿Estás seguro en eliminar el municipio: ' + data.nom_municipio + '?, Este proceso es irreversible.',
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
	
	$scope.adm_mpio = function (usu) {
		$scope.mpio   = usu || $scope.mpio;
		modalInstance = $uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: CONST.URL('principal/view/form_mpio'),
			size: 'sm',
			controller: 'mpio_ctrl',
			scope: $scope
		});
		
		modalInstance.result.then(function (response) {
			Table_mpio.fnDraw(false);
		}, function () {
			console.info('Modal dismissed at: ' + new Date());
		});
	};
	
	$scope.eliminar = function (data) {
		$http({
			url: CONST.URL('principal/mpio_eliminar'),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			method: 'POST',
			data: $.param(data)
		}).then(function (data) {
			Notify(data.data);
			Table_mpio.fnDraw(false);
		}, function (data) {
			console.log(data);
		});
	};
	
	$('.actualizar_mpio').unbind('click').on('click', function (e) {
		Table_mpio.fnDraw(false);
	});
}

dashboardApp.controller('mpio_ctrl', ['$scope', '$http', '$uibModal', '$uibModalInstance', '$timeout', mpio]);

function mpio($scope, $http, $uibModal, $uibModalInstance, $timeout) {
	$scope.mpio = $scope.mpio || {};
	$scope.ok = function () {
		$scope.SAVING = true;
		var Mpio      = Object.assign({}, $scope.mpio);
		
		$http({
			url: CONST.URL('principal/mpio_guardar'),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			method: 'POST',
			data: $.param(Mpio)
		}).then(function (data) {
			Notify(data.data);
			if (!data.data.error) {
				$scope.mpio.cod_municipio = data.data.data;
				$uibModalInstance.close($scope.mpio);
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
		$("#mpio_cod_dep").select2({
			placeholder: "Buscar departamento...", minimumInputLength: -1, multiple: false, ajax: {
				url: CONST.URL("principal/buscar2depto"),
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
					$.ajax(CONST.URL("principal/buscar2depto"), {
						dataType: "json", type: 'POST', data: "id=" + id
					}).done(function (data) {
						callback(data.data[0]);
					});
				}
			}, formatResult: function (repo) {
				var markup = '<div class="row-fluid">' + repo.nom_dep.capitalize() + '</div>';
				return markup;
			}, formatSelection: function (repo) {
				$timeout(function () {
					$scope.mpio.cod_dep = repo.id;
				});
				return repo.nom_dep;
			}
		});
	});
	
	$scope.$watch('mpio.cod_dep', function (newVal, oldVal) {
		$("#mpio_cod_dep").select2('val', newVal);
	});
	
	$scope.crear_2_depto = function (usu) {
		$scope.depto   = usu || $scope.depto;
		modalInstance = $uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: CONST.URL('principal/view/form_depto'),
			size: 'sm',
			controller: 'depto_ctrl',
			scope: $scope
		});
		
		modalInstance.result.then(function (response) {
			console.log('Retorno', response);
			$scope.mpio.cod_dep = response.cod_dep;
		}, function () {
			console.info('Modal dismissed at: ' + new Date());
		});
	}
	
}