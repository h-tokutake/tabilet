//RestHandler

var RestHandler = (function(){
	var req = new XMLHttpRequest();

	//---------------
	// constructor
	//---------------

	function RestHandler (baseUrl){
		var method = 'GET';
		var url = baseUrl + '?';

		this.__setHeader = function (){
			req.setRequestHeader('Content-Type', 'Application/json');
			return;
		}

		this.__setParam = function (paramName, paramValue){
			url += '&' + paramName + '=' + encodeURIComponent(paramValue);
			return;
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
		send : function(callback, error_callback) { this.__send(callback, error_callback); },
	};

	return RestHandler;
}());
