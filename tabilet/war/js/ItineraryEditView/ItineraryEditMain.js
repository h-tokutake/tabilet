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
		dialog = new CommonDialogs();
		mainMenu = new ItineraryEditMenu(this);
		$("#itinerary_map_canvas").css("height", window.innerHeight - $("#itinerary_edit_menu_main").get(0).offsetHeight * 2 - 80);
		$("#itinerary_map_canvas").css("width", window.innerWidth - 40);
		mapCanvas = new MapCanvas("itinerary_map_canvas", this);
		$( window ).resize(function(){
			$("#itinerary_map_canvas").css("height", window.innerHeight - $("#itinerary_edit_menu_main").get(0).offsetHeight * 2 - 80);
			$("#itinerary_map_canvas").css("width", window.innerWidth - 40);
			mapCanvas.refresh();
		});
		setEvents();
		checkWaypointsLimit();
		this.updateDirections(false);
		dirty_flag = false;
		waypointDialog = new WaypointEditDialog(this);
	}

	//------------------
	//  public methods
	//------------------
	ItineraryEditView.prototype = {
		getMapCanvas : function () {
			return mapCanvas;
		},
		getCommonDialog : function () {
			return dialog;
		},
		getDirtyFlag : function () {
			return dirty_flag;
		},
		setDirtyFlag : function (flag) {
			dirty_flag = flag;
		},
		updateDirections : function (set_dirty_flag, callback) {
			__updateDirections(set_dirty_flag, false, callback);
		},
		updateTimeline : function (set_dirty_flag) {
			__updateTimeline(set_dirty_flag, false);
		},
		deleteRow : function (target) {
			__deleteRow(target);
		},
		setItineraryId : function (itineraryId) {
			__setItineraryId(itineraryId);
		},
		isLoggedIn : function () {
			return ($("#user_id").val() != "");
		}
	};

	//------------------
	//  private methods
	//------------------

	function setEvents() {
		var that = this;
		$( ".place_deptime" ).datetimepicker({
			dateFormat: 'yy/mm/dd',
			separator : ' ',
			timeFormat: 'HH:mm',
			onClose   : function () {
				__updateTimeline(true, false);
			}
		});
		$("#itinerary_summary").change(function(){
			dirty_flag = true;
			if($("#itinerary_summary").val() != '') {
				mainMenu.enableSaveMenu();
			}
		});
		$("#itinerary_description").change(function(){
			dirty_flag = true;
			mainMenu.enableSaveMenu();
		});
		$(".waypoint").each(function(){ setEventsInRow($(this)); });
		$(".button_delete_place").live("click", function(e){
			__deleteRow($(e.target).closest("div"));
			__updateDirections(true, false);
			return false;
		});
		$(".button_insert_place").live("click", function(e){
			insertRow($(e.target).closest("div"));
			$(e.target).closest("div").prev().find(".place_name").focus();
			__updateDirections(true, true);
			return false;
		});
		$(".place_name").live("change", function(){
			if($(this).val() == "") {
				__deleteRow($(this).closest(".waypoint"));
			}
			__updateDirections(true, true);
		}).live("focus", function(e){
			waypointDialog.open($(e.target));
		});
	}

	function setEventsInRow(target){
		var that = this;
		if(target.hasClass("movable")){
			target
				.click(function(e){
					$(e.target).focus();
				})
				.draggable({
					revert: "invalid",
					zIndex: 1,
					start : function(){	$(this).addClass("movable_drag"); },
					stop  : function(){	$(this).removeClass("movable_drag"); }
				})
				.droppable({
					accept: ".movable",
					drop  : function(e,ui){
						$(this).removeClass("movable_drop");
						if($(".waypoint").index(this) < $(".waypoint").index(ui.draggable)){
							insertRow($(this));
							swapRow($(ui.draggable), $(this).prev(".waypoint"));
						} else {
							insertRow($(this).next(".waypoint"));
							swapRow($(ui.draggable), $(this).next(".waypoint"));
						}
						__deleteRow($(ui.draggable));
						__updateDirections(true, true);
					},
					over  : function(){ $(this).addClass   ("movable_drop"); },
					out   : function(){ $(this).removeClass("movable_drop"); }
				});
		}
		target.find(".button_delete_place").button({
			icons : { primary : "ui-icon-circle-close" },
			text : false
		});
		target.find(".button_insert_place").button({
			icons : { primary : "ui-icon-circle-plus" },
			text : false
		});
		target.find(".place_deptime").datetimepicker({
			dateFormat: 'yy/mm/dd',
			separator : ' ',
			timeFormat: 'HH:mm',
			onClose   : function () {
				__updateTimeline(true, false);
			}
		});
	}

	//------------------------
	//  MapCanvas interfaces
	//------------------------
	function __updateDirections (set_dirty_flag, force_update_flag, callback) {
		var place_names = [];
		var place_urls = [];
		var place_descriptions = [];
		var place_deptimes = [];
		var waypoints = [];
		var dwell_times = [];
		var waypoint_obj = $(".waypoint")

		for(var i=0; i<waypoint_obj.length; i++) {
			var place_name     = waypoint_obj.eq(i).find(".place_name").val();
			if (place_name != "" && place_name != undefined) {
				place_names.push(place_name);
				var waypoint_location = waypoint_obj.eq(i).find(".waypoint_location").val();
				var latlng = stringToLatLng(waypoint_location);
				if(latlng == null){
					waypoints.push({location: place_name});
				} else {
					waypoints.push({location: latlng});
				}
				var place_url = waypoint_obj.eq(i).find(".waypoint_url").val();
				place_urls.push(place_url);
				var waypoint_description = waypoint_obj.eq(i).find(".waypoint_description").val();
				place_descriptions.push(waypoint_description);
				place_deptimes[i] = Date.parse(waypoint_obj.eq(i).find(".place_deptime").val());
				if (place_deptimes[i] == '' || isNaN(place_deptimes[i]) || place_deptimes[i] === null) {
					if (i == 0) {
						place_deptimes[i] = Date.now();
					} else {
						place_deptimes[i] = Date.parse(waypoint_obj.eq(i).find(".place_arrtime").val());
					}
				}
				if (place_deptimes[i] < Date.parse(waypoint_obj.eq(i).find(".place_arrtime").val())) {
					waypoint_obj.eq(i).find(".place_arrtime").val(waypoint_obj.eq(i).find(".place_deptime").val());
				}
			}
		}
		mapCanvas.setPlaceDepTimes(place_deptimes);
		mapCanvas.setPlaceNames(place_names);
		mapCanvas.setPlaceUrls(place_urls);
		mapCanvas.setPlaceDescriptions(place_descriptions);
		mapCanvas.setWaypoints(waypoints);
		mapCanvas.showDirections(function() {
			updateArrDepDateTime(force_update_flag);
			if(callback != null) callback();
		});

		if(set_dirty_flag) {
			mainMenu.enableSaveMenu();
		}
		dirty_flag |= set_dirty_flag;
	}

	function __updateTimeline (set_dirty_flag, force_update_flag) {
		var dwell_times = [];
		var place_deptimes = [];
		var waypoint_obj = $(".waypoint");

		for(var i=0; i<waypoint_obj.length; i++) {
			var place_name = waypoint_obj.eq(i).find(".place_name").val();
			if (place_name != "" && place_name != undefined) {
				place_deptimes[i] = Date.parse(waypoint_obj.eq(i).find(".place_deptime").val());
				if (place_deptimes[i] == '' || isNaN(place_deptimes[i]) || place_deptimes[i] === null) {
					if (i == 0) {
						place_deptimes[i] = Date.now();
					} else {
						place_deptimes[i] = Date.parse(waypoint_obj.eq(i).find(".place_arrtime").val());
					}
				}
				if (place_deptimes[i] < Date.parse(waypoint_obj.eq(i).find(".place_arrtime").val())) {
					waypoint_obj.eq(i).find(".place_arrtime").val(waypoint_obj.eq(i).find(".place_deptime").val());
				}
			}
		}
		mapCanvas.setPlaceDepTimes(place_deptimes);
		mapCanvas.updateTimeline();
		updateArrDepDateTime(force_update_flag);

		if(set_dirty_flag) {
			mainMenu.enableSaveMenu();
		}
		dirty_flag |= set_dirty_flag;
	}

	function __setItineraryId(itineraryId) {
		$("#itinerary_id").val(itineraryId);
	}

	function updateArrDepDateTime(force_update){
		var waypoint_obj = $(".waypoint");
		var arrDateTime = mapCanvas.getArrDateTimeString();
		var depDateTime = mapCanvas.getDepDateTimeString();

		for(var i=0; i<waypoint_obj.length; i++) {
			waypoint_obj.eq(i).find(".place_arrtime").val(arrDateTime[i]);
			if(force_update || waypoint_obj.eq(i).find(".place_deptime").val() === '' ||
					waypoint_obj.eq(i).find(".place_arrtime").val() > waypoint_obj.eq(i).find(".place_deptime").val()) {
				waypoint_obj.eq(i).find(".place_deptime").val(depDateTime[i]);
			}
		}
	}

	//-------------------
	//  Row controllers
	//-------------------

	function insertRow(target) {
		target.before('<div class="waypoint movable"></div>');
		target = target.prev();
		target.append('<table><tr><td></td><td class="waypoint_column_datetime"></td><td></td><td class="waypoint_column_datetime"></td></tr></table>');
		target.find("td").eq(0)
			.append('<buttonset><button class="button_delete_place">削除</button><button class="button_insert_place">挿入</button></buttonset>')
			.append('<input type="hidden" class="waypoint_location" name="waypoint_location" value=""></input>')
			.append('<input type="hidden" class="waypoint_url" name="waypoint_url" value=""></input>')
			.append('<input type="hidden" class="waypoint_description" name="waypoint_description" value=""></input>')
			.append('<input type="text" class="place_name" name="place_name" value=""></input>');
		target.find("td").eq(1)
			.append('<input type="text" class="place_arrtime" value="" readonly="readonly"></input>');
		target.find("td").eq(2)
			.append('〜');
		target.find("td").eq(3)
			.append('<input type="text" class="place_deptime" name="place_deptime" value=""></input>');
		setEventsInRow(target);
		checkWaypointsLimit();
	}

	function __deleteRow(target) {
		target.remove();
		checkWaypointsLimit();
	}

	function swapRow(draggable, droppable){
		draggable.find("input").each(function(){
			var value     = $(this).val();
			var className = $(this).attr("class").split(" ", 1);
			var that      = droppable.find("." + className);
			$(this).val($(that).val());
			$(that).val(value);
		});
	}

	function checkWaypointsLimit(){
		if($(".place_name").length >= MAX_WAYPOINTS){
			$(".button_insert_place").button("disable");
		}
		else {
			$(".button_insert_place").button("enable");
		}
		if($(".place_name").length < MIN_WAYPOINTS) {
			mainMenu.disableMapMenu();
		} else {
			mainMenu.enableMapMenu();
		}
	}

	return ItineraryEditView;
}());
