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
		$("#itinerary_edit_screen_map_canvas").css("height", window.innerHeight - $("#itinerary_edit_screen_header").get(0).offsetHeight * 2 - 80);
		$("#itinerary_edit_screen_map_canvas").css("width", window.innerWidth);
		mapCanvas = new MapCanvas("itinerary_edit_screen_map_canvas", this);
		$( window ).resize(function(){
			$("#itinerary_edit_screen_map_canvas").css("height", window.innerHeight - $("#itinerary_edit_screen_header").get(0).offsetHeight * 2 - 80);
			$("#itinerary_edit_screen_map_canvas").css("width", window.innerWidth);
			mapCanvas.refresh();
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

	ItineraryEditView.prototype = {
		getCommonDialogs : function() { return dialog },
		getMainMenu : function() { return mainMenu }
	};

	return ItineraryEditView;
}());
