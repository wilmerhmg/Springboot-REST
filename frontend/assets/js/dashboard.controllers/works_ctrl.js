dashboardApp.controller('works_ctrl', ['$scope', '$http', '$timeout', '$uibModal', works_ctrl]);

function works_ctrl($scope, $http, $timeout, $uibModal) {
	var btn_admin     = '<div class="btn-group" role="group"><button type="button" class="btn btn-primary btn-xs admin_work"><li class="glyphicon glyphicon-edit"></li></button><button type="button" class="btn btn-danger btn-xs drop_work"><li class="glyphicon glyphicon-trash"></li></button></div>';
	var modalInstance = {};
	$scope.work       = {};
	
	function getEstado(IO) {
		if(IO=='1'){
			return "<span class='label label-primary'>Propuesta</span>";
		}
		if(IO=='2'){
			return "<span class='label label-primary'>Viabilizado</span>";
		}
		if(IO=='3'){
			return "<span class='label label-primary'>Finalizado</span>";
		}
		if(IO=='4'){
			return "<span class='label label-success'>Publicado</span>";
		}
	}
	
	var Table_work = $('#lista-work').dataTable({
		processing: true,
		serverSide: true,
		responsive: true,
		order: [[0, 'asc']],
		ajax: {
			url: CONST.URL('investigacion/listar'), "type": "POST"
		},
		columns: [{data: 'titulo'},
			{class: "text-center", searchable: false, orderable: false, data: null, defaultContent: btn_admin}],
		columnDefs: [{
			render: function (data, type, row) {
				var cad_html = (data) ? data : "";
				for (var i in row) {
					row[i] = row[i] || '';
				}
				cad_html = "<div class='row'>" + "<div class='col-xs-12 text-center'>" + "<b>" + row.titulo.toUpperCase() + "</b>" + "</div>" + "<div class='col-xs-6 text-right'>" + "<b>Modalidad:</b> " + row.descripcion.toUpperCase() + "</div>" + "<div class='col-xs-6 text-left'>" + "<b>Programa:</b> " + row.des_programa.toUpperCase() + "</div>" + "</div>" + ((row.des_sublinea.length) ? "<div class='row'>" + "<div class='col-xs-6 text-right'>" + "<b>Linea: </b>" + row.nom_linea.toUpperCase() + "</div>" + "<div class='col-xs-6 text-left'>" + "<b>Sub-linea: </b>" + row.des_sublinea.toUpperCase() + "</div>" + "</div>" + "<div class='row'>" + "<div class='col-xs-12 text-center'>" + "<b>" + row.nom_grupo.toUpperCase() + "</b>" + "</div>" + "<div class='col-xs-4 text-right'>" + "<b>Sede: </b>" + row.sigla_sede.toUpperCase() + "</div>" + "<div class='col-xs-4 text-center'>" + "<b>Fecha Inicio: </b>" + row.inicio + "</div>" + "<div class='col-xs-4 text-left'>" + "<b>Fecha Culminaci&oacute;n: </b>" + row.fin + "</div>" + "</div>" : '') + "<div class='row'>" + "<div class='col-xs-6 text-right'>" + "<b>Mencion: </b>" + row.calificacion + " - " + row.mencion + "</div>" + "<div class='col-xs-6 text-left'>" + "<b>Estado: </b>" + (getEstado(row.estado)) + "</div>" + "</div>";
				return cad_html;
			}, targets: 0
		}],
		rowCallback: function (row, data) {
			$(row).find('button.admin_work').on('click', function () {
				$(row).parent().find('tr').removeClass('selected');
				$(row).addClass('selected');
				$timeout(function () {
					$scope.work              = Object.assign({}, data);
					$scope.work.inicio       = ($scope.work.inicio) ? $scope.work.inicio.toDate() : null;
					$scope.work.fin          = ($scope.work.fin) ? $scope.work.fin.toDate() : null;
					$scope.work.calificacion = ($scope.work.calificacion) ? $scope.work.calificacion.toNum() : null;
					$scope.adm_work();
				});
			});
			
			$(row).find('button.drop_work').on('click', function () {
				$(row).parent().find('tr').removeClass('selected');
				$(row).addClass('selected');
				
				new PNotify({
					title: 'Confirmación necesaria',
					text: '¿Estás seguro en eliminar el trabajo: ' + data.titulo + '?, Este proceso es irreversible.',
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
	
	$scope.adm_work = function (usu) {
		$scope.work   = usu || $scope.work;
		modalInstance = $uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: CONST.URL('principal/view/form_works'),
			size: 'super-lg',
			controller: 'work_ctrl',
			scope: $scope
		});
		
		modalInstance.result.then(function (response) {
			Table_work.fnDraw(false);
		}, function () {
			console.info('Modal dismissed at: ' + new Date());
		});
	};
	
	$scope.eliminar = function (data) {
		$http({
			url: CONST.URL('investigacion/eliminar'),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			method: 'POST',
			data: $.param(data)
		}).then(function (data) {
			Notify(data.data);
			Table_work.fnDraw(false);
		}, function (data) {
			console.log(data);
		});
	};
	
	$('.actualizar_work').unbind('click').on('click', function (e) {
		Table_work.fnDraw(false);
	});
}

dashboardApp.controller('work_ctrl', ['$scope', '$http', '$uibModalInstance', '$timeout', '$uibModal', work_ctrl]);

function work_ctrl($scope, $http, $uibModalInstance, $timeout, $uibModal) {
	$scope.work             = $scope.work || {};
	$scope.tinymceOptions   = {
		plugins: 'table lists link'
	};
	$scope.work.invest      = ($scope.work.invest == '1');
	$scope.work.integrantes = [];
	
	$scope.ok = function () {
		$scope.SAVING = true;
		var Work      = Object.assign({}, $scope.work);
		Work.inicio   = (Work.inicio) ? Work.inicio.getSimple() : null;
		Work.fin      = (Work.fin) ? Work.fin.getSimple() : null;
		
		$http({
			url: CONST.URL('investigacion/guardar'),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			method: 'POST',
			data: $.param(Work)
		}).then(function (data) {
			Notify(data.data);
			if (!data.data.error) {
				$scope.work.id_trabajo = data.data.data;
				$uibModalInstance.close($scope.work);
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
		$("#work_director_id").select2({
			placeholder: "Buscar persona...", minimumInputLength: 2, multiple: false, ajax: {
				url: CONST.URL("personas/buscar_persona"),
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
					$.ajax(CONST.URL("personas/buscar_persona"), {
						dataType: "json", type: 'POST', data: "id=" + id
					}).done(function (data) {
						callback(data.data[0]);
					});
				}
			}, formatResult: function (repo) {
				var markup = '<div class="row-fluid"><b>' + repo.full_name.capitalize() + '</b></div><div class="row-fluid"><small><small>' + repo.id + '</small></small></div>';
				return markup;
			}, formatSelection: function (repo) {
				$timeout(function () {
					$scope.work.director_id = repo.id;
				});
				return repo.full_name;
			}
		});
		$("#work_programa_id").select2({
			placeholder: "Buscar programa...", minimumInputLength: 0, multiple: false, ajax: {
				url: CONST.URL("principal/find2programa"),
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
					$.ajax(CONST.URL("principal/find2programa"), {
						dataType: "json", type: 'POST', data: "id=" + id
					}).done(function (data) {
						callback(data.data[0]);
					});
				}
			}, formatResult: function (repo) {
				var markup = '<div class="row-fluid"><b>' + repo.des_programa + '</b></div><div class="row-fluid"><small><small>' + repo.des_nivel.capitalize() + '</small></small></div>';
				return markup;
			}, formatSelection: function (repo) {
				$timeout(function () {
					$scope.work.programa_id = repo.id;
				});
				return repo.des_programa;
			}
		});
		$("#work_grupo_id").select2({
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
					$scope.work.grupo_id     = repo.id;
				});
				return repo.nom_grupo;
			}
		}).on('change',function (e) {
			$timeout(function () {
				$scope.work.semillero_id = null;
			})
		});
		$("#work_semillero_id").select2({
			placeholder: "Buscar semillero...", minimumInputLength: 0, multiple: false, ajax: {
				url: CONST.URL("investigacion/find2semillero"),
				dataType: 'json',
				type: 'POST',
				quietMillis: 500,
				data: function (term, page) {
					return {
						q: term, page: page, grupo_id: $("#work_grupo_id").val()
					};
				},
				results: function (data, page) {
					var more = (page * 10) < data.total;
					return {results: data.data, more: more};
				}
			}, initSelection: function (element, callback) {
				var id = $(element).val();
				if (id !== "") {
					$.ajax(CONST.URL("investigacion/find2semillero"), {
						dataType: "json", type: 'POST', data: "id=" + id
					}).done(function (data) {
						callback(data.data[0]);
					});
				}
			}, formatResult: function (repo) {
				var markup = '<div class="row-fluid">' + repo.nom_semillero + '</div><div class="row-fluid"><small>' + repo.sigla_semillero + '</small></div>';
				return markup;
			}, formatSelection: function (repo) {
				$timeout(function () {
					$scope.work.semillero_id = $("#work_semillero_id").val();
				});
				return repo.nom_semillero;
			}
		});
		$("#work_linea_id").select2({
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
					$scope.work.linea_id = repo.id;
				});
				return repo.nom_linea;
			}
		});
		$("#work_sublinea_id").select2({
			placeholder: "Buscar sub-linea...", minimumInputLength: 0, multiple: false, ajax: {
				url: CONST.URL("investigacion/find2sublinea"),
				dataType: 'json',
				type: 'POST',
				quietMillis: 500,
				data: function (term, page) {
					return {
						q: term, page: page, linea_id: $("#work_linea_id").val()
					};
				},
				results: function (data, page) {
					var more = (page * 10) < data.total;
					return {results: data.data, more: more};
				}
			}, initSelection: function (element, callback) {
				var id = $(element).val();
				if (id !== "") {
					$.ajax(CONST.URL("investigacion/find2sublinea"), {
						dataType: "json", type: 'POST', data: "id=" + id
					}).done(function (data) {
						callback(data.data[0]);
					});
				}
			}, formatResult: function (repo) {
				var markup = '<div class="row-fluid"><small>' + repo.des_sublinea + '</small></div>';
				return markup;
			}, formatSelection: function (repo) {
				$timeout(function () {
					$scope.work.sublinea_id = repo.id;
				});
				return repo.des_sublinea;
			}
		});
	});
	
	$scope.$watch('work.director_id', function (newVal, oldVal) {
		$("#work_director_id").select2('val', newVal);
	});
	
	$scope.$watch('work.programa_id', function (newVal, oldVal) {
		$("#work_programa_id").select2('val', newVal);
	});
	
	$scope.$watch('work.grupo_id', function (newVal, oldVal) {
		$("#work_grupo_id").select2('val', newVal);
	});
	
	$scope.$watch('work.semillero_id', function (newVal, oldVal) {
		$("#work_semillero_id").select2('val', newVal);
	});
	$scope.$watch('work.linea_id', function (newVal, oldVal) {
		$("#work_linea_id").select2('val', newVal);
	});
	
	$scope.$watch('work.sublinea_id', function (newVal, oldVal) {
		$("#work_sublinea_id").select2('val', newVal);
	});
	
	
	$scope.crear_director = function () {
		$scope.persona = {};
		modalInstance  = $uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: CONST.URL('principal/view/form_persona'),
			controller: 'persona_ctrl',
			scope: $scope
		});
		
		modalInstance.result.then(function (response) {
			$scope.work.director_id = response.ide_persona;
		}, function () {
			console.info('Modal dismissed at: ' + new Date());
		});
	};
	
	$scope.add_integrante = function () {
		$scope.integrante = {};
		modalInstance     = $uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: CONST.URL('principal/view/form_works_integrator'),
			controller: 'integrante_ctrl',
			size: 'sm',
			scope: $scope
		});
		
		modalInstance.result.then(function (response) {
			$scope.work.integrantes.push(response);
		}, function () {
			console.info('Modal dismissed at: ' + new Date());
		});
	};
	
	$scope.drop_integrante = function (it) {
		if ($scope.work.integrantes[it].id_integrante) {
			$http({
				url: CONST.URL('investigacion/integrante_delete'),
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				method: 'POST',
				data: $.param($scope.work.integrantes[it])
			}).then(function (data) {
				Notify(data.data);
				if (!data.data.error) {
					$scope.work.integrantes.splice(it, 1);
				}
			}, function (data) {
				console.log(data);
				$scope.SAVING = false;
			});
		} else {
			$scope.work.integrantes.splice(it, 1);
		}
	};
	
	$http({
		url: CONST.URL('investigacion/getModalidades'),
		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		method: 'POST'
	}).then(function (data) {
		$scope.MDS = data.data;
		$("#work_clas_id").select2({
			data: data.data, placeholder: "Seleccionar modalidad..."
		}).on('change', function (e) {
			$timeout(function () {
				$scope.work.clas_id = $("#work_clas_id").select2('data').id;
				$scope.work.invest  = ($("#work_clas_id").select2('data').invest == '1');
			})
		});
	}, function (data) {
		console.log(data);
		$scope.SAVING = false;
	});
	
	if ($scope.work.id_trabajo) {
		$http({
			url: CONST.URL('investigacion/integrantes'),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			method: 'POST',
			data: $.param({trabajo_id: $scope.work.id_trabajo})
		}).then(function (data) {
			$scope.work.integrantes = data.data;
		}, function (data) {
			console.log(data);
			$scope.SAVING = false;
		});
	}
}

dashboardApp.controller('integrante_ctrl', ['$scope', '$http', '$uibModalInstance', '$timeout', '$uibModal',
                                            integrante_ctrl]);

function integrante_ctrl($scope, $http, $uibModalInstance, $timeout, $uibModal) {
	$scope.integrante = $scope.integrante || {};
	
	
	$scope.ok = function () {
		$uibModalInstance.close($scope.integrante);
	};
	
	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
	
	$scope.crear_investigador = function () {
		$scope.persona = {};
		modalInstance  = $uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: CONST.URL('principal/view/form_persona'),
			controller: 'persona_ctrl',
			scope: $scope
		});
		
		modalInstance.result.then(function (response) {
			$("#integrante_persona_id").select2('val', response.ide_persona);
		}, function () {
			console.info('Modal dismissed at: ' + new Date());
		});
	};
	
	$timeout(function () {
		$("#integrante_persona_id").select2({
			placeholder: "Buscar persona...", minimumInputLength: 2, multiple: false, ajax: {
				url: CONST.URL("personas/buscar_persona"),
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
					$.ajax(CONST.URL("personas/buscar_persona"), {
						dataType: "json", type: 'POST', data: "id=" + id
					}).done(function (data) {
						callback(data.data[0]);
					});
				}
			}, formatResult: function (repo) {
				var markup = '<div class="row-fluid"><b>' + repo.full_name.capitalize() + '</b></div><div class="row-fluid"><small><small>' + repo.id + '</small></small></div>';
				return markup;
			}, formatSelection: function (repo) {
				$timeout(function () {
					$scope.integrante.persona_id = $("#integrante_persona_id").val();
					$scope.integrante.full_name  = $("#integrante_persona_id").select2('data')['full_name'];
				});
				return repo.full_name;
			}
		});
	});
}