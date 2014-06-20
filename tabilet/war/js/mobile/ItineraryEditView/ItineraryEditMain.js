$(function () {
	var view = new ItineraryEditView();
});

//ItineraryEditView

var ItineraryEditView = (function(){
	var MAX_WAYPOINTS = 10;
	var MIN_WAYPOINTS = 2;
	var waypointEditMain;
	var mainMenu;
	var mapCanvas;
	var dialog;
	var dirty_flag = false;

	//------------------
	//  constructor
	//------------------
	function ItineraryEditView() {
		dialog = new CommonDialogs();
		mainMenu = new ItineraryEditMenu(this);
		mapCanvas = new MapCanvas("itinerary_edit_screen_map_canvas", this);
		resizeMap();
		$( window ).resize(function(){
			resizeMap();
		});
		$("#itinerary_edit_screen_map").bind("pageshow", function(){
			__updateDirections(true, false, function() {
				resizeMap();
			});
		});
		$("#waypoint_listview").sortable({
			items : 'li.list_sortable',
			axis : 'y',
			disabled : false,
			revert : true,
			tolerance : 'pointer'
		});
		$("#waypoint_listview").bind("sortupdate", function(){
			$("#waypoint_listview").listview("refresh");
		});
		waypointEditMain = new WaypointEditMain(this);
	}

	//------------------------
	//  MapCanvas interfaces
	//------------------------
	function resizeMap () {
		var header_height = $("#itinerary_edit_screen_header").outerHeight();
		$("#itinerary_edit_screen_map_canvas").css("height", window.innerHeight - header_height);
		$("#itinerary_edit_screen_map_canvas").css("width", window.innerWidth);
		mapCanvas.refresh();
	}

	function __updateDirections (set_dirty_flag, force_update_flag, callback) {
		var place_names = [];
		var place_urls = [];
		var place_descriptions = [];
		var place_deptimes = [];
		var waypoints = [];
		var dwell_times = [];
		var waypoint_obj = $(".waypoint_edit")

		for(var i=0; i<waypoint_obj.length; i++) {
			var place_name     = waypoint_obj.eq(i).find(".waypoint_place_name").html();
			if (place_name != "" && place_name != undefined) {
				place_names.push(place_name);
				var place_position = waypoint_obj.eq(i).find(".place_position").val();
				var latlng = stringToLatLng(place_position);
				if(latlng == null){
					waypoints.push({location: place_name});
				} else {
					waypoints.push({location: latlng});
				}
				var place_url = waypoint_obj.eq(i).find(".place_siteurl").val();
				place_urls.push(place_url);
				var place_description = waypoint_obj.eq(i).find(".place_description").val();
				place_descriptions.push(place_description);
				var date_time = waypoint_obj.eq(i).find(".waypoint_depdate").html() + 'T' + waypoint_obj.eq(i).find(".waypoint_deptime").html();
				place_deptimes[i] = Date.parse(date_time);
				date_time = waypoint_obj.eq(i).find(".waypoint_arrdate").html() + 'T' + waypoint_obj.eq(i).find(".waypoint_arrtime").html();
				if (place_deptimes[i] == '' || isNaN(place_deptimes[i]) || place_deptimes[i] === null) {
					if (i == 0) {
						place_deptimes[i] = Date.now();
					} else {
						place_deptimes[i] = Date.parse(date_time);
					}
				}
				if (place_deptimes[i] < Date.parse(date_time)) {
					waypoint_obj.eq(i).find(".waypoint_arrdate").html(waypoint_obj.eq(i).find(".waypoint_deptime").html());
					waypoint_obj.eq(i).find(".waypoint_arrtime").html(waypoint_obj.eq(i).find(".waypoint_deptime").html());
				}
			}
		}
		mapCanvas.setPlaceDepTimes(place_deptimes);
		mapCanvas.setPlaceNames(place_names);
		mapCanvas.setPlaceUrls(place_urls);
		mapCanvas.setPlaceDescriptions(place_descriptions);
		mapCanvas.setWaypoints(waypoints);
		mapCanvas.showDirections(function() {
			__updateArrDepDateTime(false);
			if(callback != null) callback();
		});

		dirty_flag |= set_dirty_flag;
	}

	// private methods
	function __updateArrDepDateTime(force_update){
		var waypoint_obj = $(".waypoint_edit");
		var arrDateTime = mapCanvas.getArrDateTimeString();
		var depDateTime = mapCanvas.getDepDateTimeString();

		for(var i=0; i<waypoint_obj.length; i++) {
			if (arrDateTime[i] != null) {
				var arrDateTimeSplit = arrDateTime[i].split('T');
				var arrDate = arrDateTimeSplit[0];
				var arrTime = arrDateTimeSplit[1];
				waypoint_obj.eq(i).find(".waypoint_arrdate").html(arrDate);
				waypoint_obj.eq(i).find(".waypoint_arrtime").html(arrTime);
			}
//			if (depDateTime[i] != null) {
//				var depDateTimeSplit = depDateTime[i].split('T');
//				var depDate = depDateTimeSplit[0];
//				var depTime = depDateTimeSplit[1];
//			}
//			if(force_update || waypoint_obj.eq(i).find(".waypoint_deptime").html() === '' ||
//					waypoint_obj.eq(i).find(".waypoint_arrtime").html() > waypoint_obj.eq(i).find(".waypoint_deptime").html()) {
//				waypoint_obj.eq(i).find(".waypoint_deptime").html(depDateTime[i]);
//			}
		}
	}

	ItineraryEditView.prototype = {
		getCommonDialogs : function() { return dialog },
		getMainMenu : function() { return mainMenu },
		updateDirections : function (set_dirty_flag, callback) {
			__updateDirections(set_dirty_flag, false, callback);
		}
	};

	return ItineraryEditView;
}());
