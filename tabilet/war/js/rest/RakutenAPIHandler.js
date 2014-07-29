//RakutenAPIHandler

var RakutenAPIHandler = (function(){
	var rest;
	var json;

	//---------------
	// constructor
	//---------------

	function RakutenAPIHandler (option){
		var baseUrl;
		switch (option) {
		case '楽天トラベルキーワード検索':
			baseUrl = 'https://app.rakuten.co.jp/services/api/Travel/KeywordHotelSearch/20131024';
			break;
		default:
			break;
		}

		rest = new RestHandler(baseUrl);
		rest.setParam('applicationId', '1057408142721800215');
		rest.setParam('format', 'json');
//		rest.setParam('callback', '?');

		this.__search = function (keyword, callback){
			rest.setParam('keyword', keyword);
			rest.send(function(data){
				json = data;
				callback();
			}, function(e,f,g){
				json = null;
				callback();
			});
		}

		this.__getHotels = function (){
			if (json == null) return null;
			return json.hotels;
		}

		this.__getHotelAddress = function (){
			if (json == null) return null;
			return json.hotels[0].hotel[0].hotelBasicInfo.address1 + json.hotels[0].hotel[0].hotelBasicInfo.address2;
		}

		this.__getHotelName = function (){
			if (json == null) return null;
			return json.hotels[0].hotel[0].hotelBasicInfo.hotelName;
		}
	}

	//--------------
	//    public
	//--------------

	RakutenAPIHandler.prototype = {
		search : function(keyword, callback) { this.__search(keyword, callback); },
		getHotels : function() { return this.__getHotels(); },
		getHotelAddress : function() { return this.__getHotelAddress(); },
		getHotelName : function() { return this.__getHotelName(); },
	};

	return RakutenAPIHandler;
}());
