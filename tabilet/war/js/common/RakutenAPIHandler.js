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

		this.__search = function (keyword){
			rest.setParam('keyword', keyword);
			rest.send(function(data){
				json = data;
			}, function(e,f,g){
				json = null;
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

	RakutenAPIHandler.prototype.search = function (keyword){ this.__search(keyword); };
	RakutenAPIHandler.prototype.getHotels = function (){ return this.__getHotels(); };
	RakutenAPIHandler.prototype.getHotelAddress = function (){ return this.__getHotelAddress(); };
	RakutenAPIHandler.prototype.getHotelName = function (){ return this.__getHotelName(); };

	return RakutenAPIHandler;
}());
