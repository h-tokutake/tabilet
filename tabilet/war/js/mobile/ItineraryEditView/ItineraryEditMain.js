$(function () {
	var view = new ItineraryEditView();
});

//ItineraryEditView

var ItineraryEditView = (function(){
	var MAX_WAYPOINTS = 10;
	var MIN_WAYPOINTS = 2;
	var waypointDialog;
	var mainMenu;
	var mapCanvas;
	var dialog;
	var dirty_flag = false;

	//------------------
	//  constructor
	//------------------
	function ItineraryEditView() {
		$("#itinerary_edit_screen_map_canvas").css("height", window.innerHeight - $("#itinerary_edit_screen_header").get(0).offsetHeight * 2 - 80);
		$("#itinerary_edit_screen_map_canvas").css("width", window.innerWidth);
		mapCanvas = new MapCanvas("itinerary_edit_screen_map_canvas", this);
	}

	return ItineraryEditView;
}());
