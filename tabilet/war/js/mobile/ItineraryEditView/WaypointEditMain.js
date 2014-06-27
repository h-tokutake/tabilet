//WaypointEditMain

var WaypointEditMain = (function(){
	var position_dirty_flag = false;
	var smallMapCanvas;
	var mainView;
	var originalObj;

	//---------------
	// constructor
	//---------------

	var WaypointEditMain = function(view){
		mainView = view;
		smallMapCanvas = new MapCanvas("place_map_canvas", mainView);

		smallMapCanvas.setClickMapEvent(function(latlng_str) {
			$("#waypoint_location").val(latlng_str);
			if($("#place_name_2").val() == "") {
				$("#place_name_1").val(latlng_str);
				$("#place_name_2").val(latlng_str);
			}
			position_dirty_flag = true;
		});
		$(".action_waypoint_edit").bind("tap", function(){
			originalObj = $(this);
			$("#place_name_1").val($.trim(originalObj.find(".waypoint_name").eq(0).text()));
			$("#place_name_2").val($.trim(originalObj.find(".waypoint_name").eq(0).text()));
			$("#waypoint_depdate").val($.trim(originalObj.find(".waypoint_depdate").eq(0).text()));
			$("#waypoint_deptime").val($.trim(originalObj.find(".waypoint_deptime").eq(0).text()));
			$("#waypoint_location").val(originalObj.find(".waypoint_location").eq(0).val());
			$("#waypoint_url").val(originalObj.find(".waypoint_url").eq(0).val());
			$("#waypoint_description").val(originalObj.find(".waypoint_description").eq(0).val());
			$(".action_waypoint_set").attr("name", "waypoint_operation_edit");
			$.mobile.changePage("#page_place_edit");
		});
		$(".action_waypoint_delete").bind("tap", function(){
			var that = $(this);
			mainView.getCommonDialogs().confirm(that.closest("li").find(".waypoint_name").eq(0).text() + "を旅程から削除します。", function(){
				that.closest("li").remove();
				$("#listview_itinerary_edit").listview('refresh');
				$("#listview_itinerary_edit").sortable('refresh');
				mainView.updateDirections(true, function() {
					$.mobile.changePage("#page_itinerary_edit");
				});
			});
		});
		$(".action_waypoint_create").bind("tap", function(){
			originalObj = $(this);
			$("#place_name_1").val("");
			$("#place_name_2").val("");
			$(".action_waypoint_set").attr("name", "waypoint_operation_create");
			mainView.updateDirections(true, function() {
				$.mobile.changePage("#page_place_edit");
			});
		});
		$(".action_waypoint_cancel").bind("tap", function(){
			$.mobile.changePage("#page_itinerary_edit");
		});
		$(".action_waypoint_set").bind("tap", function(){
			if ($(this).attr("name") == "waypoint_operation_create"){
				originalObj.closest("li").before('<li class="list_sortable"></li>');
				var newObj = originalObj.closest("li").prev("li");
				var newTag = document.createElement('a');
				newTag.setAttribute('href', '#');
				newTag.setAttribute('class', 'action_waypoint_edit');
				newTag.setAttribute('data-transition', 'slide');
				newObj.append(newTag);

				newTag = document.createElement('a');
				newTag.setAttribute('href', '#');
				newTag.setAttribute('class', 'action_waypoint_delete');
				newTag.setAttribute('data-transition', 'slide');
				newTag.textContent = '削除';
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

				newObj.find(".action_waypoint_edit").bind("tap", function(){
					originalObj = $(this);
					$("#place_name_1").val($.trim(originalObj.find(".waypoint_name").eq(0).text()));
					$("#place_name_2").val($.trim(originalObj.find(".waypoint_name").eq(0).text()));
					$("#waypoint_depdate").val($.trim(originalObj.find(".waypoint_depdate").eq(0).text()));
					$("#waypoint_deptime").val($.trim(originalObj.find(".waypoint_deptime").eq(0).text()));
					$("#waypoint_location").val(originalObj.find(".waypoint_location").eq(0).val());
					$("#waypoint_url").val(originalObj.find(".waypoint_url").eq(0).val());
					$("#waypoint_description").val(originalObj.find(".waypoint_description").eq(0).val());
					$(".action_waypoint_set").attr("name", "waypoint_operation_edit");
					$.mobile.changePage("#page_place_edit");
				});
				newObj.find(".action_waypoint_delete").bind("tap", function(){
					var that = $(this);
					mainView.getCommonDialogs().confirm(that.closest("li").find(".waypoint_name").eq(0).text() + "を旅程から削除します。", function(){
						that.closest("li").remove();
						$("#listview_itinerary_edit").listview('refresh');
						$("#listview_itinerary_edit").sortable('refresh');
						mainView.updateDirections(true, function() {
							$.mobile.changePage("#page_itinerary_edit");
						});
					});
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
			updateMap("#place_name_2", "");
		});
		$("#place_name_2").bind("change", function(){
			$("#place_name_1").val($("#place_name_2").val());
			updateMap("#place_name_1", "");
		});
		$("#page_place_map").bind("pageshow", function(){
			resizeMap();
			updateMap("#place_name_1", $("#waypoint_location").val());
		});
		$(window).resize(function(){
			resizeMap();
			updateMap("#place_name_1", $("#waypoint_location").val());
		});
	}

	// public methods

	function resizeMap () {
		var header_height = $("#header_place_edit").outerHeight();
		var footer_height = $("#footer_place_edit").outerHeight();
		$("#place_map_canvas").css("height", window.innerHeight - header_height - footer_height);
		$("#place_map_canvas").css("width", window.innerWidth);
	}

	function updateMap (place_name, latlng) {
		smallMapCanvas.setLocation($(place_name).val(), latlng, function(latlng_str){
			$("#waypoint_location").val(latlng_str);
			smallMapCanvas.refresh();
		});
	}

	return WaypointEditMain;
}());

