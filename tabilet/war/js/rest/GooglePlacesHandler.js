//GooglePlacesHandler

var GooglePlacesHandler = (function(){
	var result;

	//---------------
	// constructor
	//---------------

	function GooglePlacesHandler (map){

		this.__search = function (keyword, callback){
			var location = map.getCenter();
			var radius = 50000;

			var request = {
				location: location,
				radius: '50000'
			};

			var service = new google.maps.places.PlacesService(map);
			service.search(request, function(results, status){
				if (status == google.maps.places.PlacesServiceStatus.OK) {
					result = results[0];
					callback();
				}
			}, function(e,f,g){
				result = null;
			});
		}

		this.__getPlaceAddress = function (){
			if (json == null) return null;
			return '(' + result.geometry.location.lat + ',' + result.geometry.location.lng + ')';
		}

		this.__getPlaceName = function (){
			if (json == null) return null;
			return result.name;
		}
	}

	//--------------
	//    public
	//--------------

	GooglePlacesHandler.prototype = {
			search : function(lat, lng, keyword, callback) { this.__search(lat, lng, keyword, callback); },
			getPlaceAddress : function() { this.__getPlaceAddress(); },
			getPlaceName : function() { this.__getPlaceName(); },
	};

	return GooglePlacesHandler;
}());
