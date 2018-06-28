if (!String.prototype.equals) {
	String.prototype.equals = function (str) {
		return (this == str);
	};
}

if (!String.prototype.toNum) {
	String.prototype.toNum = function () {
		var neg = (this.indexOf("-") == 0) ? -1 : 1;
		var ent = this.replace(/\s+/gi, ''), dec;
		ent     = ent.split('.');
		if (ent.length > 1) {
			dec = ent[ent.length - 1].replace(/\D/g, '');
			ent.pop();
			for (var i in ent) {
				ent[i] = ent[i].replace(/\D/g, '');
			}
			return parseFloat((ent.join('') + '.' + dec).toString()) * neg || 0;
		}
		return parseFloat(this.replace(/\D/g, '')) * neg || 0;
	};
	Number.prototype.toNum = function () {
		return this;
	};
}

Date.prototype.getSimple = function () {
	return [this.getFullYear(), this.getMonth() + 1, this.getDate()].join('-');
};

String.prototype.toDate = function () {
	var fecha = new Date();
	fecha.setFullYear(this.split('-')[0], this.split('-')[1].toNum() - 1, this.split('-')[2]);
	return fecha;
};

String.prototype.capitalize = function () {
	var input = this;
	input     = input.toLowerCase();
	input     = input.split(' ');
	for (var i in input) {
		if (input[i].length) {
			input[i] = input[i].substring(0, 1).toUpperCase() + input[i].substring(1);
		}
	}
	return input.join(' ');
};

if (typeof Object.assign != 'function') {
	Object.assign = function (target, varArgs) {
		'use strict';
		if (target == null) {
			throw new TypeError('Cannot convert undefined or null to object');
		}
		var to = Object(target);
		for (var index = 1; index < arguments.length; index++) {
			var nextSource = arguments[index];
			if (nextSource != null) {
				for (var nextKey in nextSource) {
					if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
						to[nextKey] = nextSource[nextKey];
					}
				}
			}
		}
		return to;
	};
}

String.prototype.isNumeric = function () {
	var b = this && this.toString();
	return !Array.isArray(this) && b - parseFloat(b) + 1 >= 0
};


JSON.CAST = function (O) {
	for (var v in O) {
		if ((typeof O[v] == 'object' || Array.isArray(O[v])) && O[v] != null) {
			O[v] = JSON.CAST(O[v]);
		} else if (typeof O[v] == "string") {
			O[v] = O[v].isNumeric() ? O[v].toNum() : O[v];
		}
	}
	return O;
};

if (!Array.prototype.includes) {
	Array.prototype.includes = function (searchElement /*, fromIndex*/) {
		'use strict';
		var O   = Object(this);
		var len = parseInt(O.length) || 0;
		if (len === 0) {
			return false;
		}
		var n = parseInt(arguments[1]) || 0;
		var k;
		if (n >= 0) {
			k = n;
		} else {
			k = len + n;
			if (k < 0) {
				k = 0;
			}
		}
		var currentElement;
		while (k < len) {
			currentElement = O[k];
			if (searchElement === currentElement || (searchElement !== searchElement && currentElement !== currentElement)) {
				return true;
			}
			k++;
		}
		return false;
	};
}


Storage.prototype.setObject = function (key, value) {
	this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function (key) {
	var value = this.getItem(key);
	return value && JSON.parse(value);
}

function Notify(DATA) {
	var type  = DATA.error ? 'error' : 'success';
	var title = DATA.error ? ('Oops!, ' + DATA.error) : ('Operación Culminada');
	var msg   = DATA.error ? DATA.message : "Todas las peticiones se han procesado sin problemas.";
	var time  = DATA.error ? 10000 : 3000;
	
	new PNotify({
		title: title, text: msg, styling: 'bootstrap3', type: type, addclass: "stack-bottomleft", delay: time
	});
}