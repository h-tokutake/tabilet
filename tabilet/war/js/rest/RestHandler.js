//RestHandler

var RestHandler = (function(){
	var req = new XMLHttpRequest();

	//---------------
	// constructor
	//---------------

	function RestHandler (baseUrl){
		var method = 'GET';
		var url = baseUrl;
		var hasParams = false;

		this.__setHeader = function (){
			req.setRequestHeader('Content-Type', 'Application/json');
			return;
		}

		this.__setParam = function (paramName, paramValue){
			if (hasParams == true) {
				url += '&';
			} else {
				url += '?';
				hasParams = true;
			}
			url += paramName + '=' + encodeURIComponent(paramValue);
			return;
		}

		this.__setParam2 = function (paramName, paramValue){
			if (hasParams == true) {
				url += '&';
			} else {
				url += '?';
				hasParams = true;
			}
			url += paramName + '=' + encodeURI(paramValue);
		}

		this.__send = function (callback, error_callback){
			req.open(method, url, false);
//			this.__setHeader();
//			req.send();
			$.ajax({
				cache : false,
				type : method,
				url : url,
				timeout : 7000,
				dataType : 'json',
				success : callback,
				error : error_callback
			});
		}
	}

	//--------------
	//    public
	//--------------

	RestHandler.prototype = {
		setParam : function(paramName, paramValue) { this.__setParam(paramName, paramValue); },
		setParam2 : function(paramName, paramValue) { this.__setParam2(paramName, paramValue); },
		send : function(callback, error_callback) { this.__send(callback, error_callback); },
	};

	return RestHandler;
}());
