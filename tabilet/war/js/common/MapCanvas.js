//MapCanvas

var MapCanvas = (function(){
	var mainView;

	function DirectionsRequestHolder() {
		this.origin = "";
		this.destination = "";
		this.waypoints = [];
		this.travelMode = "";

		this.getRequest = function() {
			return {
				origin: this.origin,
				destination: this.destination,
				travelMode: this.travelMode,
				waypoints: this.waypoints
			};
		};
	}

	//---------------
	// constructor
	//---------------

	function MapCanvas (map_canvas_id, view){
		mainView = view;
		var canvasId = map_canvas_id;
		var centerPosition = new google.maps.LatLng(35.681382, 139.766084);

		var mapOptions = {
				zoom : 14, center : centerPosition, mapTypeId : google.maps.MapTypeId.ROADMAP
		};

		var mapDiv = document.getElementById(map_canvas_id);
		var map = new google.maps.Map(mapDiv, mapOptions);

		var directionsDisplay = new google.maps.DirectionsRenderer();
		directionsDisplay.setMap(map);

		var marker = new google.maps.Marker();
		var geocoder = new google.maps.Geocoder();
		var infoWnd = new google.maps.InfoWindow();

		var placeNames = [];
		var placeUrls = [];
		var placeDescriptions = [];
		var waypoints = [];
		var dwellTimes = [];
		var placeDepTimes = [];
		var directionResult = null;

		var arrDateTimeString = [];
		var depDateTimeString = [];

		var firstShow = true;

		google.maps.event.addListener(map, "center_changed", function(event){
			firstShow = false;
		});

		//----------------
		// private methods
		//----------------
		this.__getTravelMode = function () {
			return google.maps.TravelMode.DRIVING;
		}

		this.__getDirectionsCallback = function (result, status) {
			if (status === google.maps.DirectionsStatus.OK) {

				var arrTimeInMs = "";

				var k=0;
				arrDateTimeString[0] = "";
				for(var i=0; i<result.routes.length; i++){
					for(var j=0; j<result.routes[i].legs.length; j++){
						result.routes[i].legs[j].start_address = "<h3>" + placeNames[k] + "</h3>" +
							'<p><a href="' + placeUrls[k] + '" target="_blank">' + placeUrls[k] + '</a></p>' +
							'<p>' + placeDescriptions[k] + '</p>';
						if (i == result.routes.length - 1 && j == result.routes[i].legs.length - 1) {
							result.routes[i].legs[j].end_address = "<h3>" + placeNames[k + 1] + "</h3>" +
							'<p><a href="' + placeUrls[k + 1] + '" target="_blank">' + placeUrls[k + 1] + '</a></p>' +
							'<p>' + placeDescriptions[k + 1] + '</p>';
						}
						arrTimeInMs = this.__setDepTimeInfo(result.routes[i].legs[j], dwellTimes, placeDepTimes, k++);
					}
				}
				if(directionsDisplay != null) {
					directionsDisplay.setDirections(result);
				}
			} else {
				mainView.getCommonDialog().error(getMsg('FAIL_GET_ROUTE'));
			}
		}

		this.__setDepTimeInfo = function (leg, dwell_times, placeDepTimes, row_index) {
			var infoStr = "";
			if (row_index === 0) {
				infoStr = "";
				arrDateTimeString[row_index + 1] = toDateTimeString(new Date(placeDepTimes[row_index + 1]));
				infoStr += arrDateTimeString[row_index] + " 到着";
			}
			depDateTimeString[row_index] = toDateTimeString(new Date(placeDepTimes[row_index]));
			infoStr += "<br>" + depDateTimeString[row_index] + " 出発";
			leg.start_address += infoStr;

			arrDateTimeString[row_index + 1] = toDateTimeString(new Date(placeDepTimes[row_index] + leg.duration.value * 1000));
			leg.end_address += "<br>" + arrDateTimeString[row_index + 1] + " 到着";
			depDateTimeString[row_index + 1] = "";
		}

		this.__createMarker = function (latlng, msg){
			marker.setMap(null);
			marker.setPosition(latlng);
			google.maps.event.addListener(map, 'idle', function() {
				if(marker.getPosition() == null) return;
				this.setCenter(marker.getPosition());
				google.maps.event.clearListeners(this, 'idle');
			});
			marker.setMap(map);

			infoWnd.setContent('<h3>' + msg + '</h3>');

			google.maps.event.addListener(marker, "click", function(){
				infoWnd.open(map, this);
			});
		}

		this.__refresh = function (){
			var center = map.getCenter();
			google.maps.event.trigger(map, 'resize');
			map.setCenter(center);
		}

		this.__setPlaceNames = function (argPlaceNames) {
			placeNames = argPlaceNames;
		}

		this.__setPlaceUrls = function (argPlaceUrls) {
			placeUrls = argPlaceUrls;
		}

		this.__setPlaceDescriptions = function (argPlaceDescriptions) {
			placeDescriptions = argPlaceDescriptions;
		}

		this.__addPlaceDescription = function (argPlaceDescription) {
			infoWnd.setContent(infoWnd.getContent() + argPlaceDescription);
		}

		this.__setWaypoints = function (argWaypoints) {
			waypoints = argWaypoints;
		}

		this.__setDwellTimes = function (argDwellTimes) {
			dwellTimes = argDwellTimes;
		}
		
		this.__setPlaceDepTimes = function (argPlaceDepTimes) {
			placeDepTimes = argPlaceDepTimes;
		}

		this.__getArrDateTimeString = function () {
			return arrDateTimeString;
		}

		this.__getDepDateTimeString = function () {
			return depDateTimeString;
		}

		this.__showDirections = function (callback) {
			var request = new DirectionsRequestHolder();
			request.waypoints = waypoints;
			if(request.waypoints.length <= 1) return;

			request.origin = request.waypoints.shift().location;
			request.destination = request.waypoints.pop().location;
			request.travelMode = this.__getTravelMode();

			var directionsService = new google.maps.DirectionsService();
			var that = this;
			directionsService.route(request.getRequest(), function(result, status) {
				directionResult = result;
				that.__getDirectionsCallback(result, status);
				callback();
			});
		}

		this.__updateTimeline = function (){
			if(directionResult === null) return;
			this.__getDirectionsCallback(directionResult, google.maps.DirectionsStatus.OK);
		}

		this.__setLocation = function (place_name, latlng_str, callback){
			var latlng = stringToLatLng(latlng_str);
			if(latlng == "" || latlng == null){
				if(place_name == "" || place_name == null) return;

				var that = this;
				geocoder.geocode(
					{ "address" : place_name },
					function(georesults, status){
						if(status == google.maps.GeocoderStatus.OK){
							var latlng = georesults[0].geometry.location;
							that.__createMarker(latlng, place_name);
							map.setCenter(latlng);
							if(callback != null) callback(latlng.toString());
						} else {
							mainView.getCommonDialog().error(getMsg('FAIL_GET_POSITION'));
						}
					}
				);
			} else {
				if(place_name == "" || place_name == null) place_name = latlng;
				this.__createMarker(latlng, place_name);
				map.setCenter(latlng);
				if(callback != null) callback(latlng.toString());
			}
		}

		this.__setClickMapEvent = function (callback){
			var that = this;
			google.maps.event.addListener(map, "click", function(event){
				that.__createMarker(event.latLng, event.latLng.toString());
				this.setCenter(event.latLng);
				if(callback != null) callback(event.latLng.toString());
			});
		}

		this.__getCurrentPosition = function (callback){
			try {
				var geo = navigator.geolocation;
			} catch (e) {}
			if (geo == null) return;

			var count = 0;
			var that = this;
			var watchId = geo.watchPosition(function(position) {
				if (position.coords.accuracy < 300) {
					geo.clearWatch(watchId);
					var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
					that.__createMarker(latlng, "現在地");
					map.setCenter(latlng);
					if(callback != null) callback(latlng.toString());
					return;
				}
				if(count++ >= 5){
					geo.clearWatch(watchId);
					return;
				}
			}, function(e) {
				geo.clearWatch(watchId);
				return;
			}, {
				enableHighAccuracy : true
			});
		}

		this.__getDefaultPosition = function (callback){
			if(firstShow == true) {
				this.__getCurrentPosition(callback);
			} else {
				callback("");
			}
		}
	}
	
	//--------------
	//    public
	//--------------

	MapCanvas.prototype = {
		refresh : function() { this.__refresh(); },
		setPlaceNames : function(argPlaceNames) { this.__setPlaceNames(argPlaceNames); },
		setPlaceUrls : function(argPlaceUrls) { this.__setPlaceUrls(argPlaceUrls); },
		setPlaceDescriptions : function(argPlaceDescriptions) { this.__setPlaceDescriptions(argPlaceDescriptions); },
		addPlaceDescription : function(argPlaceDescription) { this.__addPlaceDescription(argPlaceDescription); },
		setWaypoints : function(argWaypoints) { this.__setWaypoints(argWaypoints); },
		setDwellTimes : function(argDwellTimes) { this.__setDwellTimes(argDwellTimes); },
		setPlaceDepTimes : function(argPlaceDepTimes) { this.__setPlaceDepTimes(argPlaceDepTimes); },
		getArrDateTimeString : function() { return this.__getArrDateTimeString(); },
		getDepDateTimeString : function() { return this.__getDepDateTimeString(); },
		showDirections : function(callback) { this.__showDirections(callback); },
		updateTimeline : function() { this.__updateTimeline(); },
		setLocation : function(place_name, latlng_str, callback) { this.__setLocation(place_name, latlng_str, callback); },
		setClickMapEvent : function(callback) { this.__setClickMapEvent(callback); },
		getCurrentPosition : function(callback) { this.__getCurrentPosition(callback); },
		getDefaultPosition : function(callback) { this.__getDefaultPosition(callback); },
	};

	return MapCanvas;
}());
