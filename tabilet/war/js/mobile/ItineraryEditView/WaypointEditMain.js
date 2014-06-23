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
		smallMapCanvas = new MapCanvas("waypoint_edit_screen_map_canvas", mainView);

		smallMapCanvas.setClickMapEvent(function(latlng_str) {
			$("#place_position").val(latlng_str);
			if($("#waypoint_place_name_2").val() == "") {
				$("#waypoint_place_name_1").val(latlng_str);
				$("#waypoint_place_name_2").val(latlng_str);
			}
			position_dirty_flag = true;
		});
		$(".waypoint_edit").bind("tap", function(){
			originalObj = $(this);
			$("#waypoint_place_name_1").val(originalObj.find(".waypoint_place_name").eq(0).text());
			$("#waypoint_place_name_2").val(originalObj.find(".waypoint_place_name").eq(0).text());
			$("#waypoint_depdate").val(originalObj.find(".waypoint_depdate").eq(0).text());
			$("#waypoint_deptime").val(originalObj.find(".waypoint_deptime").eq(0).text());
			$(".waypoint_edit_set").attr("name", "waypoint_operation_edit");
			$.mobile.changePage("#waypoint_edit_screen_datetime");
		});
		$(".waypoint_create").bind("tap", function(){
			originalObj = $(this);
			$("#waypoint_place_name_1").val("");
			$("#waypoint_place_name_2").val("");
			$(".waypoint_edit_set").attr("name", "waypoint_operation_create");
			$.mobile.changePage("#waypoint_edit_screen_datetime");
		});
		$(".waypoint_edit_cancel").bind("tap", function(){
			$.mobile.changePage("#itinerary_edit_screen_main");
		});
		$(".waypoint_edit_set").bind("tap", function(){
			if ($(this).attr("name") == "waypoint_operation_create"){
				originalObj.closest("li").before('<li class="list_sortable"></li>');
				var newObj = originalObj.closest("li").prev("li");
				var newTag = document.createElement('a');
				newTag.setAttribute('href', '#');
				newTag.setAttribute('class', 'waypoint_edit');
				newTag.setAttribute('data-transition', 'slide');
				newObj.append(newTag);

				newTag = document.createElement('a');
				newTag.setAttribute('href', '#');
				newTag.setAttribute('class', 'waypoint_delete');
				newTag.setAttribute('data-transition', 'slide');
				newTag.textContent = '削除';
				newObj.append(newTag);

				newTag = document.createElement('div');
				newTag.setAttribute('class', 'waypoint_place_name');
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
				newTag.setAttribute('class', 'place_position');
				newTag.setAttribute('name', 'place_position');
				newTag.setAttribute('value', '');
				newObj.find('a').eq(0).append(newTag);

				newTag = document.createElement('input');
				newTag.setAttribute('type', 'hidden');
				newTag.setAttribute('class', 'place_siteurl');
				newTag.setAttribute('name', 'place_siteurl');
				newTag.setAttribute('value', '');
				newObj.find('a').eq(0).append(newTag);

				newTag = document.createElement('input');
				newTag.setAttribute('type', 'hidden');
				newTag.setAttribute('class', 'place_description');
				newTag.setAttribute('name', 'place_description');
				newTag.setAttribute('value', '');
				newObj.find('a').eq(0).append(newTag);

				newObj.find(".waypoint_edit").bind("tap", function(){
					originalObj = $(this);
					$("#waypoint_place_name_1").val($.trim(originalObj.find(".waypoint_place_name").eq(0).text()));
					$("#waypoint_place_name_2").val($.trim(originalObj.find(".waypoint_place_name").eq(0).text()));
					$("#waypoint_depdate").val($.trim(originalObj.find(".waypoint_depdate").eq(0).text()));
					$("#waypoint_deptime").val($.trim(originalObj.find(".waypoint_deptime").eq(0).text()));
					$("#place_position").val(originalObj.find(".place_position").eq(0).val());
					$("#place_siteurl").val(originalObj.find(".place_siteurl").eq(0).val());
					$("#place_description").val(originalObj.find(".place_description").eq(0).val());
					$(".waypoint_edit_set").attr("name", "waypoint_operation_edit");
					$.mobile.changePage("#waypoint_edit_screen_datetime");
				});
				newObj.find(".waypoint_delete").bind("tap", function(){
					var that = $(this);
					mainView.getCommonDialogs().confirm(that.closest("li").find(".waypoint_place_name").eq(0).text() + "を旅程から削除します。", function(){
						that.closest("li").remove();
						$("#waypoint_listview").listview('refresh');
						$("#waypoint_listview").sortable('refresh');
						$.mobile.changePage("#itinerary_edit_screen_main");
					});
				});
				originalObj = newObj;
			}
			originalObj.find(".waypoint_place_name").eq(0).text($.trim($("#waypoint_place_name_2").val()));
			originalObj.find(".waypoint_depdate").eq(0).text($.trim($("#waypoint_depdate").val()));
			originalObj.find(".waypoint_deptime").eq(0).text($.trim($("#waypoint_deptime").val()));
			originalObj.find(".place_position").eq(0).val($("#place_position").val());
			originalObj.find(".place_siteurl").eq(0).val($("#place_siteurl").val());
			originalObj.find(".place_description").eq(0).val($("#place_description").val());
			$("#waypoint_listview").listview('refresh');
			$("#waypoint_listview").sortable('refresh');
			mainView.updateDirections(true, function() {
				$.mobile.changePage("#itinerary_edit_screen_main");
			});
		});
		$("#waypoint_place_name_1").bind("change", function(){
			$("#waypoint_place_name_2").val($("#waypoint_place_name_1").val());
			updateMap("#waypoint_place_name_2", "");
		});
		$("#waypoint_place_name_2").bind("change", function(){
			$("#waypoint_place_name_1").val($("#waypoint_place_name_2").val());
			updateMap("#waypoint_place_name_1", "");
		});
		$("#waypoint_edit_screen_location").bind("pageshow", function(){
			resizeMap();
			updateMap("#waypoint_place_name_1", $("#place_position").val());
		});
		$(window).resize(function(){
			resizeMap();
			updateMap("#waypoint_place_name_1", $("#place_position").val());
		});
	}

	// public methods

	function resizeMap () {
		var header_height = $("#waypoint_edit_screen_header").outerHeight();
		var footer_height = $("#waypoint_edit_screen_footer").outerHeight();
		$("#waypoint_edit_screen_map_canvas").css("height", window.innerHeight - header_height - footer_height);
		$("#waypoint_edit_screen_map_canvas").css("width", window.innerWidth);
	}

	function updateMap (place_name, latlng) {
		smallMapCanvas.setLocation($(place_name).val(), latlng, function(latlng_str){
			$("#place_position").val(latlng_str);
			smallMapCanvas.refresh();
		});
	}

	return WaypointEditMain;
}());

