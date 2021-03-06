//WaypointEditMain

var WaypointEditMain = (function(){
	var position_dirty_flag = false;
	var smallMapCanvas;
	var mainView;
	var placeMenu;
	var originalObj;
	var method_search_place = 'method_google_maps';

	//---------------
	// constructor
	//---------------

	var WaypointEditMain = function(view){
		mainView = view;
		smallMapCanvas = new MapCanvas("place_map_canvas", mainView);
		placeMenu = new PlaceEditMenu(view, smallMapCanvas);

		smallMapCanvas.setClickMapEvent(function(latlng_str) {
			$("#waypoint_location").val(latlng_str);
			if($("#place_name_2").val() == "") {
				$("#place_name_1").val(latlng_str);
				$("#place_name_2").val(latlng_str);
				$("#place_name").val(latlng_str);
			}
			position_dirty_flag = true;
		});
		$(".select_waypoint_action").unbind("click").bind("click", function(){
			originalObj = $(this);
			var header_waypoint_action = originalObj.find(".waypoint_name").eq(0).text();
			$("#header_waypoint_action").text(header_waypoint_action);
			$("#action_waypoint_edit").unbind("click").one("click", function(){
				openEditWaypoint();
			});
			$("#action_waypoint_delete").unbind("click").one("click", function(){
				mainView.getCommonDialogs().confirm(originalObj.closest("li").find(".waypoint_name").eq(0).text() + "を旅程から削除します。", function(){
					originalObj.closest("li").remove();
					$("#listview_itinerary_edit").listview('refresh');
					$("#listview_itinerary_edit").sortable('refresh');
					mainView.updateDirections(true, function() {
						$.mobile.changePage("#page_itinerary_edit");
					});
				});
			});
			$.mobile.changePage("#dialog_waypoint_action", {transition: 'pop', role: 'dialog'});
		});
		$(".action_waypoint_create").unbind("click").bind("click", function(){
			originalObj = $(this);
			$("#place_name_1").val("");
			$("#place_name_2").val("");
			$("#place_name").val("");

			var now = new Date();
			$("#waypoint_depdate").val(toDateString2(now));
			$("#waypoint_deptime").val(toTimeString(now));
			var tmp = $("#waypoint_deptime").val().split(':');
			$("#waypoint_deptime").val(tmp[0] + ':' + tmp[1]);

			$(".action_waypoint_set").attr("name", "waypoint_operation_create");
			$.mobile.changePage("#page_place_map");
		});
		$(".action_waypoint_cancel").unbind("click").bind("click", function(){
			$.mobile.changePage("#page_itinerary_edit");
		});
		$(".action_waypoint_set").unbind("click").bind("click", function(){
			if ($(this).attr("name") == "waypoint_operation_create"){
				var newObj = document.createElement('li');
				newObj.setAttribute('class', 'list_sortable');
				newObj.setAttribute('data-icon', 'false');
				originalObj.closest("li").before(newObj);
				newObj = $(newObj);

				var newTag = document.createElement('a');
				newTag.setAttribute('href', '#');
				newTag.setAttribute('class', 'select_waypoint_action');
				newObj.append(newTag);

				newTag = document.createElement('div');
				newTag.setAttribute('class', 'waypoint_name');
				newObj.find('a').eq(0).append(newTag);
				newObj.find('a').eq(0).append('&nbsp;到着：&nbsp;');

				newTag = document.createElement('div');
				newTag.setAttribute('class', 'waypoint_arrdate');
				newObj.find('a').eq(0).append(newTag);

				newTag = document.createElement('div');
				newTag.setAttribute('class', 'waypoint_arrtime');
				newObj.find('a').eq(0).append(newTag);
				newObj.find('a').eq(0).append('<br>&nbsp;出発：&nbsp;');

				newTag = document.createElement('div');
				newTag.setAttribute('class', 'waypoint_depdate');
				newObj.find('a').eq(0).append(newTag);

				newTag = document.createElement('div');
				newTag.setAttribute('class', 'waypoint_deptime');
				newObj.find('a').eq(0).append(newTag);

				newTag = document.createElement('input');
				newTag.setAttribute('type', 'hidden');
				newTag.setAttribute('class', 'waypoint_location');
				newTag.setAttribute('name', 'waypoint_location');
				newTag.setAttribute('value', '');
				newObj.find('a').eq(0).append(newTag);

				newTag = document.createElement('input');
				newTag.setAttribute('type', 'hidden');
				newTag.setAttribute('class', 'waypoint_url');
				newTag.setAttribute('name', 'waypoint_url');
				newTag.setAttribute('value', '');
				newObj.find('a').eq(0).append(newTag);

				newTag = document.createElement('input');
				newTag.setAttribute('type', 'hidden');
				newTag.setAttribute('class', 'waypoint_description');
				newTag.setAttribute('name', 'waypoint_description');
				newTag.setAttribute('value', '');
				newObj.find('a').eq(0).append(newTag);

				newObj.find(".select_waypoint_action").unbind("click").bind("click", function(){
					originalObj = $(this);
					var header_waypoint_action = originalObj.find(".waypoint_name").eq(0).text();
					$("#header_waypoint_action").text(header_waypoint_action);
					$("#action_waypoint_edit").unbind("click").one("click", function(){
						openEditWaypoint();
					});
					$("#action_waypoint_delete").unbind("click").one("click", function(){
						mainView.getCommonDialogs().confirm(originalObj.closest("li").find(".waypoint_name").eq(0).text() + "を旅程から削除します。", function(){
							originalObj.closest("li").remove();
							$("#listview_itinerary_edit").listview('refresh');
							$("#listview_itinerary_edit").sortable('refresh');
							mainView.updateDirections(true, function() {
								$.mobile.changePage("#page_itinerary_edit");
							});
						});
					});
					$.mobile.changePage("#dialog_waypoint_action", {transition: 'pop', role: 'dialog'});
				});
				originalObj = newObj;
			}
			originalObj.find(".waypoint_name").eq(0).text($.trim($("#place_name_2").val()));
			originalObj.find(".waypoint_depdate").eq(0).text($.trim($("#waypoint_depdate").val()));
			originalObj.find(".waypoint_deptime").eq(0).text($.trim($("#waypoint_deptime").val()));
			originalObj.find(".waypoint_location").eq(0).val($("#waypoint_location").val());
			originalObj.find(".waypoint_url").eq(0).val($("#waypoint_url").val());
			originalObj.find(".waypoint_description").eq(0).val($("#waypoint_description").val());
			$("#listview_itinerary_edit").listview('refresh');
			$("#listview_itinerary_edit").sortable('refresh');
			mainView.updateDirections(true, function() {
				$.mobile.changePage("#page_itinerary_edit");
			});
		});
		$("#place_name_1").bind("change", function(){
			$("#place_name_2").val($("#place_name_1").val());
			$("#place_name").val($("#place_name_1").val());
		});
		$("#place_name_2").bind("change", function(){
			$("#place_name_1").val($("#place_name_2").val());
			$("#place_name").val($("#place_name_2").val());
		});
		$("#page_place_map").bind("pageshow", function(){
			resizeMap();
			updateMap("#place_name_1", $("#waypoint_location").val());
		});
		$("#method_google_maps_2").unbind("click").bind("click", function(){
			resizeMap();
			method_search_place = 'method_google_maps';
			updateMap("#place_name_2", "");
		});
		$("#method_rakuten_travel_2").unbind("click").bind("click", function(){
			resizeMap();
			method_search_place = 'method_rakuten_travel';
			updateMap("#place_name_2", "");
		});
		$(window).resize(function(){
			resizeMap();
			updateMap("#place_name_1", $("#waypoint_location").val());
		});
	}

	// public methods

	function resizeMap () {
		var header_height = $("#header_place_edit").outerHeight() + $("#place_name_2").outerHeight() + $("#method_google_maps_2").outerHeight() + 20;
		var footer_height = $("#footer_place_edit").outerHeight();
		$("#place_map_canvas").css("height", window.innerHeight - header_height - footer_height);
		$("#place_map_canvas").css("width", window.innerWidth);
	}

	function updateMap (place_name, latlng) {
		switch (method_search_place){
		case 'method_google_places' :
			var googlePlaces = new GooglePlacesHandler(smallMapCanvas);
			googlePlaces.search($(place_name).val(), function(){
				var target_name = googlePlaces.getPlaceName();
				var target_address = googlePlaces.getPlaceAddress();
				if (target_name == null || target_address == null) return;
				$("#place_name_1").val(target_name);
				$("#place_name_2").val(target_name);
				$("#place_name").val(target_name);
				smallMapCanvas.setLocation(target_address, target_address, function(latlng_str){
					$("#waypoint_location").val(latlng_str);
					smallMapCanvas.refresh();
				}, function(){});
			});
			break;
		case 'method_rakuten_travel' :
			var rakutenAPI = new RakutenAPIHandler('楽天トラベルキーワード検索');
			rakutenAPI.search($(place_name).val(), function(){
				var target_name = rakutenAPI.getHotelName();
				var target_address = rakutenAPI.getHotelAddress();
				if (target_name == null || target_address == null) return;
				$("#place_name_1").val(target_name);
				$("#place_name_2").val(target_name);
				$("#place_name").val(target_name);
				smallMapCanvas.setLocation(target_address, target_address, function(latlng_str){
					$("#waypoint_location").val(latlng_str);
					smallMapCanvas.refresh();
				}, function(){});
			});
			break;
		case 'method_google_maps' :
			smallMapCanvas.setLocation($(place_name).val(), latlng, function(latlng_str){
				$("#waypoint_location").val(latlng_str);
				smallMapCanvas.refresh();
			}, function(){});
			break;
		default :
			break;
		}
	}

	function openEditWaypoint () {
		$("#place_name_1").val($.trim(originalObj.find(".waypoint_name").eq(0).text()));
		$("#place_name_2").val($.trim(originalObj.find(".waypoint_name").eq(0).text()));
		$("#place_name").val($.trim(originalObj.find(".waypoint_name").eq(0).text()));
		$("#waypoint_depdate").val($.trim(originalObj.find(".waypoint_depdate").eq(0).text()));
		$("#waypoint_deptime").val($.trim(originalObj.find(".waypoint_deptime").eq(0).text()));
		$("#waypoint_location").val(originalObj.find(".waypoint_location").eq(0).val());
		$("#waypoint_url").val(originalObj.find(".waypoint_url").eq(0).val());
		$("#waypoint_description").val(originalObj.find(".waypoint_description").eq(0).val());
		$(".action_waypoint_set").attr("name", "waypoint_operation_edit");
		$.mobile.changePage("#page_place_map");
	}

	return WaypointEditMain;
}());

