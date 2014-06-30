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
		mapCanvas = new MapCanvas("itinerary_map_canvas", this);
		__updateDirections(true, false, function() {
			resizeMap();
		});
		$( window ).resize(function(){
			resizeMap();
		});
		$("#page_itinerary_map").bind("pageshow", function(){
			__updateDirections(true, false, function() {
				resizeMap();
			});
		});
		$("#listview_itinerary_edit").sortable({
			items : 'li.list_sortable',
			axis : 'y',
			disabled : false,
			revert : true,
			tolerance : 'pointer'
		});
		$("#listview_itinerary_edit").bind("sortupdate", function(){
			$("#listview_itinerary_edit").listview("refresh");
			__updateDirections(true, false);
		});
		$("#itinerary_summary").bind("change", function(){
			$("#itinerary_summary_2").val($.trim($("#itinerary_summary").val()));
		});
		$("#itinerary_summary_2").bind("change", function(){
			$("#itinerary_summary").val($.trim($("#itinerary_summary_2").val()));
		});
		$("#itinerary_summary_2").val($.trim($("#itinerary_summary").val()));

		waypointEditMain = new WaypointEditMain(this);
	}

	//------------------------
	//  MapCanvas interfaces
	//------------------------
	function resizeMap () {
		var header_height = $("#header_itinerary_edit").outerHeight();
		$("#itinerary_map_canvas").css("height", window.innerHeight - header_height);
		$("#itinerary_map_canvas").css("width", window.innerWidth);
		mapCanvas.refresh();
	}

	function __updateDirections (set_dirty_flag, force_update_flag, callback) {
		var place_names = [];
		var place_urls = [];
		var place_descriptions = [];
		var place_deptimes = [];
		var waypoints = [];
		var waypoint_obj = $(".select_waypoint_action")

		for(var i=0; i<waypoint_obj.length; i++) {
			var place_name     = $.trim(waypoint_obj.eq(i).find(".waypoint_name").text());
			if (place_name != "" && place_name != undefined) {
				place_names.push(place_name);
				var place_position = waypoint_obj.eq(i).find(".waypoint_location").val();
				var latlng = stringToLatLng(place_position);
				if(latlng == null){
					waypoints.push({location: place_name});
				} else {
					waypoints.push({location: latlng});
				}
				var place_url = waypoint_obj.eq(i).find(".waypoint_url").val();
				place_urls.push(place_url);
				var place_description = waypoint_obj.eq(i).find(".waypoint_description").val();
				place_descriptions.push(place_description);
				var date_time = $.trim(waypoint_obj.eq(i).find(".waypoint_depdate").text()) + 'T' + $.trim(waypoint_obj.eq(i).find(".waypoint_deptime").text());
				place_deptimes[i] = Date.parse(date_time);
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
		var waypoint_obj = $(".select_waypoint_action");
		var arrDateTime = mapCanvas.getArrDateTimeString();
		var depDateTime = mapCanvas.getDepDateTimeString();

		for(var i=0; i < waypoint_obj.length; i++) {
			if (arrDateTime[i] != null && arrDateTime[i] != '') {
				var tmp = $.trim(arrDateTime[i]).split(' ');
				waypoint_obj.eq(i).find(".waypoint_arrdate").text(tmp[0]);
				waypoint_obj.eq(i).find(".waypoint_arrtime").text(tmp[1]);
			}
			if (depDateTime[i] != null && depDateTime[i] != '') {
				var tmp = $.trim(depDateTime[i]).split(' ');
				waypoint_obj.eq(i).find(".waypoint_depdate").text(tmp[0]);
				waypoint_obj.eq(i).find(".waypoint_deptime").text(tmp[1]);
			}
		}
	}

	function __setItineraryId(itineraryId) {
		$("#itinerary_id").val(itineraryId);
	}

	ItineraryEditView.prototype = {
		getCommonDialogs : function() { return dialog },
		getMainMenu : function() { return mainMenu },
		updateDirections : function (set_dirty_flag, callback) {
			__updateDirections(set_dirty_flag, false, callback);
		},
		setItineraryId : function(itineraryId) { __setItineraryId(itineraryId); },
	};

	return ItineraryEditView;
}());
