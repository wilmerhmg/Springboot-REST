function getParameterByName(name) {
	name      = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"), results = regex.exec(location.search);
	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

$(function () {
	$("#Az").on('click', function (event) {
		$(".avanzado").toggleClass('hidden');
	});
	
	$.ajax({
		url: CONST.URL('search/modalidades'), dataType: 'json', type: 'POST'
	}).success(function (data) {
		$("[name='clas_id']").val(getParameterByName('clas_id')).select2({
			data: data, placeholder: "Seleccionar modalidad..."
		});
	});
	
	$("[name='q']").val(getParameterByName('q'));
	$("[name='sede_id']").val(getParameterByName('sede_id'));
	$("[name='mencion_id']").val(getParameterByName('mencion_id'));
	
	$("[name='director_id']").val(getParameterByName('director_id')).select2({
		placeholder: "Buscar persona...", minimumInputLength: 2, multiple: false, ajax: {
			url: CONST.URL("search/poly"),
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
				$.ajax(CONST.URL("search/poly"), {
					dataType: "json", type: 'POST', data: "id=" + id
				}).done(function (data) {
					callback(data.data[0]);
				});
			}
		}, formatResult: function (repo) {
			var markup = '<div class="row-fluid"><b>' + repo.full_name.capitalize() + '</b></div><div class="row-fluid"><small><small>' + repo.id + '</small></small></div>';
			return markup;
		}, formatSelection: function (repo) {
			return repo.full_name;
		}
	});
	$("[name='programa_id']").val(getParameterByName('programa_id')).select2({
		placeholder: "Buscar programa...", minimumInputLength: 0, multiple: false, ajax: {
			url: CONST.URL("search/find2programa"),
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
				$.ajax(CONST.URL("search/find2programa"), {
					dataType: "json", type: 'POST', data: "id=" + id
				}).done(function (data) {
					callback(data.data[0]);
				});
			}
		}, formatResult: function (repo) {
			var markup = '<div class="row-fluid"><b>' + repo.des_programa + '</b></div><div class="row-fluid"><small><small>' + repo.des_nivel.capitalize() + '</small></small></div>';
			return markup;
		}, formatSelection: function (repo) {
			return repo.des_programa;
		}
	});
	$("[name='grupo_id']").val(getParameterByName('grupo_id')).select2({
		placeholder: "Buscar grupo...", minimumInputLength: 0, multiple: false, ajax: {
			url: CONST.URL("search/find2grupo"),
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
				$.ajax(CONST.URL("search/find2grupo"), {
					dataType: "json", type: 'POST', data: "id=" + id
				}).done(function (data) {
					callback(data.data[0]);
				});
			}
		}, formatResult: function (repo) {
			var markup = '<div class="row-fluid">' + repo.nom_grupo + '</div><div class="row-fluid"><small><small>' + repo.sigla_grupo + '</small></small></div>';
			return markup;
		}, formatSelection: function (repo) {
			return repo.nom_grupo;
		}
	});
	$("[name='semillero_id']").val(getParameterByName('semillero_id')).select2({
		placeholder: "Buscar semillero...", minimumInputLength: 0, multiple: false, ajax: {
			url: CONST.URL("search/find2semillero"),
			dataType: 'json',
			type: 'POST',
			quietMillis: 500,
			data: function (term, page) {
				return {
					q: term, page: page, grupo_id: $("[name='grupo_id']").val()
				};
			},
			results: function (data, page) {
				var more = (page * 10) < data.total;
				return {results: data.data, more: more};
			}
		}, initSelection: function (element, callback) {
			var id = $(element).val();
			if (id !== "") {
				$.ajax(CONST.URL("search/find2semillero"), {
					dataType: "json", type: 'POST', data: "id=" + id
				}).done(function (data) {
					callback(data.data[0]);
				});
			}
		}, formatResult: function (repo) {
			var markup = '<div class="row-fluid">' + repo.nom_semillero + '</div><div class="row-fluid"><small>' + repo.sigla_semillero + '</small></div>';
			return markup;
		}, formatSelection: function (repo) {
			return repo.nom_semillero;
		}
	});
	$("[name='linea_id']").val(getParameterByName('linea_id')).select2({
		placeholder: "Buscar linea...", minimumInputLength: 0, multiple: false, ajax: {
			url: CONST.URL("search/find2linea"),
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
				$.ajax(CONST.URL("search/find2linea"), {
					dataType: "json", type: 'POST', data: "id=" + id
				}).done(function (data) {
					callback(data.data[0]);
				});
			}
		}, formatResult: function (repo) {
			var markup = '<div class="row-fluid">' + repo.nom_linea + '</div><div class="row-fluid"><small><small>' + repo.abr + ' - ' + repo.nom_unidad.capitalize() + '</small></small></div>';
			return markup;
		}, formatSelection: function (repo) {
			return repo.nom_linea;
		}
	});
	$("[name='sublinea_id']").val(getParameterByName('sublinea_id')).select2({
		placeholder: "Buscar sub-linea...", minimumInputLength: 0, multiple: false, ajax: {
			url: CONST.URL("search/find2sublinea"),
			dataType: 'json',
			type: 'POST',
			quietMillis: 500,
			data: function (term, page) {
				return {
					q: term, page: page, linea_id: $("[name='linea_id']").val()
				};
			},
			results: function (data, page) {
				var more = (page * 10) < data.total;
				return {results: data.data, more: more};
			}
		}, initSelection: function (element, callback) {
			var id = $(element).val();
			if (id !== "") {
				$.ajax(CONST.URL("search/find2sublinea"), {
					dataType: "json", type: 'POST', data: "id=" + id
				}).done(function (data) {
					callback(data.data[0]);
				});
			}
		}, formatResult: function (repo) {
			var markup = '<div class="row-fluid"><small>' + repo.des_sublinea + '</small></div>';
			return markup;
		}, formatSelection: function (repo) {
			return repo.des_sublinea;
		}
	});
});