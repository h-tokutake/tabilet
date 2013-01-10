$(function () {
	var view = new ItineraryEditView();
});

//ItineraryEditViewクラス

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
		$("#itinerary_edit_screen_map_canvas").css("height", window.innerHeight - $("#itinerary_edit_menu_main").get(0).offsetHeight - 20);
		mapCanvas = new MapCanvas("itinerary_edit_screen_map_canvas", this);
		$("#itinerary_edit_screen_map_canvas").hide().change(function(){
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
			__updateDirections(set_dirty_flag, callback);
		},
		updateTimeline : function (set_dirty_flag) {
			__updateTimeline(set_dirty_flag);
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
		if ($("#itinerary_edit_itinerary_deptime").val() == "") {
			$("#itinerary_edit_itinerary_deptime").val(toDateTimeString(new Date()));
		}
		$("#itinerary_edit_itinerary_deptime").change(function(){
			__updateTimeline(true);
		});
		$("#itinerary_edit_itinerary_summary").change(function(){
			dirty_flag = true;
			mainMenu.enableSaveMenu();
		});
		$("#itinerary_edit_itinerary_description").change(function(){
			dirty_flag = true;
			mainMenu.enableSaveMenu();
		});
		$(".waypoint").each(function(){ setEventsInRow($(this)); });
		$(".button_delete_place").live("click", function(e){
			__deleteRow($(e.target).closest("div"));
			__updateDirections(true);
			return false;
		});
		$(".button_insert_place").live("click", function(e){
			insertRow($(e.target).closest("div"));
			$(e.target).closest("div").prev().find(".place_name").focus();
			__updateDirections(true);
			return false;
		});
		$(".place_name").live("change", function(){
			if($(this).val() == "") {
				__deleteRow($(this).closest(".waypoint"));
			}
			__updateDirections(true);
		}).live("focus", function(e){
			waypointDialog.open($(e.target));
			return false;
		});
		$(".dwell_time").live("change", function(){
			__updateTimeline(true);
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
						__updateDirections(true);
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
	}

	//------------------------
	//  MapCanvas interfaces
	//------------------------
	function __updateDirections (set_dirty_flag, callback) {
		var place_names = [];
		var place_urls = [];
		var place_descriptions = [];
		var waypoints = [];
		var dwell_times = [];
		var waypoint_obj = $(".waypoint")

		mapCanvas.setDepDateTime(document.getElementById("itinerary_edit_itinerary_deptime").valueAsNumber);

		for(var i=0; i<waypoint_obj.length; i++) {
			var place_name     = waypoint_obj.eq(i).find(".place_name").val();
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
				var dwell_time = waypoint_obj.eq(i).find(".dwell_time")[0].valueAsNumber;
				if (dwell_time === null || isNaN(dwell_time)) {
					dwell_times.push(0);
				} else {
					dwell_times.push(dwell_time);
				}
			}
		}
		dwell_times.pop();
		dwell_times.shift();
		mapCanvas.setDwellTimes(dwell_times);
		mapCanvas.setPlaceNames(place_names);
		mapCanvas.setPlaceUrls(place_urls);
		mapCanvas.setPlaceDescriptions(place_descriptions);
		mapCanvas.setWaypoints(waypoints);
		mapCanvas.showDirections(function() {
			updateArrDepDateTime();
			if(callback != null) callback();
		});

		if(set_dirty_flag) {
			mainMenu.enableSaveMenu();
		}
		dirty_flag |= set_dirty_flag;
	}

	function __updateTimeline (set_dirty_flag) {
		var dwell_times = [];
		var waypoint_obj = $(".waypoint");

		mapCanvas.setDepDateTime(document.getElementById("itinerary_edit_itinerary_deptime").valueAsNumber);

		for(var i=0; i<waypoint_obj.length; i++) {
			var place_name = waypoint_obj.eq(i).find(".place_name").val();
			if (place_name != "" && place_name != undefined) {
				var dwell_time = waypoint_obj.eq(i).find(".dwell_time")[0].valueAsNumber;
				if (dwell_time === null || isNaN(dwell_time)) {
					dwell_times.push(0);
				} else {
					dwell_times.push(dwell_time);
				}
			}
		}
		dwell_times.pop();
		dwell_times.shift();
		mapCanvas.setDwellTimes(dwell_times);
		mapCanvas.updateTimeline();
		updateArrDepDateTime();

		if(set_dirty_flag) {
			mainMenu.enableSaveMenu();
		}
		dirty_flag |= set_dirty_flag;
	}

	function __setItineraryId(itineraryId) {
		$("#itinerary_edit_itinerary_id").val(itineraryId);
	}

	function updateArrDepDateTime(){
		var waypoint_obj = $(".waypoint");
		var arrDateTime = mapCanvas.getArrDateTimeString();
		var depDateTime = mapCanvas.getDepDateTimeString();

		for(var i=0; i<waypoint_obj.length; i++) {
			waypoint_obj.eq(i).find(".waypoint_arrival_datetime"  ).html(arrDateTime[i])
			waypoint_obj.eq(i).find(".waypoint_departure_datetime").html(depDateTime[i]);
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
			.append('<input type="hidden" class="place_position" name="place_position" value=""></input>')
			.append('<input type="hidden" class="place_siteurl" name="place_siteurl" value=""></input>')
			.append('<input type="hidden" class="place_description" name="place_description" value=""></input>')
			.append('<input type="text" class="place_name" name="place_name" value=""></input>')
			.append('<input type="time" class="dwell_time" name="dwell_time" value="00:00"></input>');
		target.find("td").eq(1)
			.append('<div class="waypoint_arrival_datetime"></div>');
		target.find("td").eq(2)
			.append(' ～ ');
		target.find("td").eq(3)
			.append('<div class="waypoint_departure_datetime"></div>');
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
			var className = $(this).attr("class");
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
