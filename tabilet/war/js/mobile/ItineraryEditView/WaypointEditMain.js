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
			$("#waypoint_place_name_1").val(originalObj.find(".waypoint_place_name").eq(0).html());
			$("#waypoint_place_name_2").val(originalObj.find(".waypoint_place_name").eq(0).html());
			$("#waypoint_depdate").val(originalObj.find(".waypoint_depdate").eq(0).html());
			$("#waypoint_deptime").val(originalObj.find(".waypoint_deptime").eq(0).html());
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
				newObj.append('<a href="#" class="waypoint_edit" data-transition="slide"></a>');
				newObj.append('<a href="#" class="waypoint_delete">削除</a>');
				newObj.find('a').eq(0).append('<p></p>');
				newObj.find('a').eq(0).append('<p>到着日時:&nbsp;</p>');
				newObj.find('a > p').eq(0).append('<strong></strong>');
				newObj.find('a > p > strong').append('<div class="waypoint_place_name"></div>');
				newObj.find('a > p').eq(1).append('<div class="waypoint_arrdate"></div>');
				newObj.find('a > p').eq(1).append('<div class="waypoint_arrtime"></div>');
				newObj.find('a > p').eq(1).append('&nbsp;出発日時：&nbsp;');
				newObj.find('a > p').eq(1).append('<div class="waypoint_depdate"></div>');
				newObj.find('a > p').eq(1).append('<div class="waypoint_deptime"></div>');				newObj.find('a > p').eq(1).append('<input type="hidden" class="place_position" name="place_position" value="" />');
				newObj.find('a > p').eq(1).append('<input type="hidden" class="place_siteurl" name="place_siteurl" value="" />');
				newObj.find('a > p').eq(1).append('<input type="hidden" class="place_description" name="place_description" value="" />');
				newObj.find(".waypoint_edit").bind("tap", function(){
					originalObj = $(this);
					$("#waypoint_place_name_1").val(originalObj.find(".waypoint_place_name").eq(0).html());
					$("#waypoint_place_name_2").val(originalObj.find(".waypoint_place_name").eq(0).html());
					$("#waypoint_depdate").val(originalObj.find(".waypoint_depdate").eq(0).html());
					$("#waypoint_deptime").val(originalObj.find(".waypoint_deptime").eq(0).html());
					$("#place_position").val(originalObj.find(".place_position").eq(0).val());
					$("#place_siteurl").val(originalObj.find(".place_siteurl").eq(0).val());
					$("#place_description").val(originalObj.find(".place_description").eq(0).val());
					$(".waypoint_edit_set").attr("name", "waypoint_operation_edit");
					$.mobile.changePage("#waypoint_edit_screen_datetime");
				});
				newObj.find(".waypoint_delete").bind("tap", function(){
					var that = $(this);
					mainView.getCommonDialogs().confirm(that.closest("li").find(".waypoint_place_name").eq(0).html() + "を旅程から削除します。", function(){
						that.closest("li").remove();
						$("#waypoint_listview").listview('refresh');
						$("#waypoint_listview").sortable('refresh');
						$.mobile.changePage("#itinerary_edit_screen_main");
					});
				});
				originalObj = newObj;
			}
			originalObj.find(".waypoint_place_name").eq(0).html($("#waypoint_place_name_2").val());
			originalObj.find(".waypoint_depdate").eq(0).html($("#waypoint_depdate").val());
			originalObj.find(".waypoint_deptime").eq(0).html($("#waypoint_deptime").val());
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

	WaypointEditMain.prototype.open = function (target) {
		var place_name_obj = target;
		var place_position_obj = target.siblings(".place_position");
		var place_siteurl_obj = target.siblings(".place_siteurl");
		var place_description_obj = target.siblings(".place_description");

		$("#waypoint_edit_place_siteurl").val(place_siteurl_obj.val());
		if(place_siteurl_obj.val() != "") {
			$("#waypoint_edit_button_place_url").button("enable");
		} else {
			$("#waypoint_edit_button_place_url").button("disable");
		}
		$("#waypoint_edit_place_description").val(place_description_obj.val());
		$("#waypoint_edit_place_position").val(place_position_obj.val());
		$("#waypoint_edit_place_name").val(place_name_obj.val());
		$("#itinerary_edit_screen_waypoint_edit").show().dialog({
			title   : "地点情報入力",
			autoOpen: true,
			modal   : true,
			height  : window.innerHeight * 0.9,
			width   : "90%",
			zIndex  : 0,
			open    : function() {
				if(mainView.isLoggedIn()) {
					$("#waypoint_edit_button_place_list").button({
						icons: { primary: "ui-icon-triangle-1-s" },
						text : false
					}).click(function(){
						ajaxToGetPlaceList();
						return false;
					});
				} else {
					$("#waypoint_edit_button_place_list").hide();
				}
				if($("#waypoint_edit_place_name").val() != "") {
					smallMapCanvas.setLocation($("#waypoint_edit_place_name").val(), $("#waypoint_edit_place_position").val(), function(latlng_str) {
						$("#waypoint_edit_place_position").val(latlng_str);
						smallMapCanvas.addPlaceDescription($("#waypoint_edit_place_description").val());
						smallMapCanvas.refresh();
					});
				} else {
					smallMapCanvas.getDefaultPosition(function(latlng_str) {
						$("#waypoint_edit_place_position").val(latlng_str);
						smallMapCanvas.refresh();
					});
				}
				$("#waypoint_edit_place_name").focus().change(function(){
					$("#waypoint_edit_place_description").val("");
					$("#waypoint_edit_place_siteurl").val("");
					$("#waypoint_edit_button_place_url").button("disable");
					position_dirty_flag = true;
				});
				position_dirty_flag = false;

				if(!mainView.isLoggedIn()) {
					$('.ui-dialog-buttonpane').find('button:contains("地点保存")').button("disable");
					$('.ui-dialog-buttonpane').find('button:contains("地点削除")').button("disable");
				}
			},
			close   : function() {
				if(place_name_obj.val() == "") {
					mainView.deleteRow(place_name_obj.closest(".waypoint"));
				}
			},
			resizeStop  : function() {
				$("#waypoint_edit_screen_map_canvas").css("height", $(this).dialog("option", "height") - 130);
				$("#waypoint_edit_screen_map_canvas").css("width", $(this).dialog("option", "width") - 30);
				smallMapCanvas.refresh();
			},
			buttons : [
				{
					text: getMsg('BUTTON_SHOW_HERE'),
					click: function() {
						smallMapCanvas.getCurrentPosition(function(place_position) {
							$("#waypoint_edit_place_name"    ).val("現在地");
							$("#waypoint_edit_place_position").val(place_position);
							$("#waypoint_edit_place_description").val("");
							$("#waypoint_edit_place_siteurl").val("");
							$("#waypoint_edit_button_place_url").button("disable");
							smallMapCanvas.refresh();
							position_dirty_flag = true;
						});
						return false;
					}
				},
				{
					text: "地点保存",
					click: function() {
						if(!mainView.isLoggedIn()) {
							mainView.getCommonDialog().error("ログインしてください。");
						} else {
							$("#place_edit_button_search_url").button({
								icons : {
									primary : "ui-icon-newwin"
								},
								text : false
							}).click(function(){
								openDialogSearchWebsite($("#place_edit_place_name").val());
								return false;
							});
							$("#place_edit_place_name").val($("#waypoint_edit_place_name").val());
							$("#place_edit_place_position").val($("#waypoint_edit_place_position").val());
							$("#place_edit_place_siteurl").val($("#waypoint_edit_place_siteurl").val());
							$("#place_edit_place_description").val($("#waypoint_edit_place_description").val());
							$("#itinerary_edit_screen_place_edit").show().dialog({
								title   : "地点情報入力",
								autoOpen: true,
								modal   : true,
								width   : 600,
								buttons : [
									{
										text: "OK",
										click: function() {
											if($("#place_edit_place_name").val() == "") {
												mainView.getCommonDialog().error("名称が入力されていません。");
												$("#place_edit_place_name").focus();
											} else {
												var msg = '地点 "' + $("#place_edit_place_name").val() + '" の情報を保存します。よろしいですか？';
												mainView.getCommonDialog().confirm(true, msg, function(){
													ajaxToSavePlaceData(
														$("#place_edit_place_name").val(),
														$("#place_edit_place_position").val(),
														$("#place_edit_place_siteurl").val(),
														$("#place_edit_place_description").val()
													);
													$("#waypoint_edit_place_name").val($("#place_edit_place_name").val());
													$("#waypoint_edit_place_description").val($("#place_edit_place_description").val());
													$("#waypoint_edit_place_siteurl").val($("#place_edit_place_siteurl").val());
													if($("#place_edit_place_siteurl").val() != "") {
														$("#waypoint_edit_button_place_url").button("enable");
													} else {
														$("#waypoint_edit_button_place_url").button("disable");
													}
													position_dirty_flag = false;
												});
											}
											$(this).dialog("close");
											return false;
										}
									},
									{
										text: "キャンセル",
										click: function() {
											$(this).dialog("close");
											return false;
										}
									}
								]
							});
						}
						return false;
					}
				},
				{
					text: "地点削除",
					click: function() {
						if(!mainView.isLoggedIn()) {
							mainView.getCommonDialog().error("ログインしてください。");
						} else
						if($("#waypoint_edit_place_name").val() == "") {
							mainView.getCommonDialog().error("名称が入力されていません。");
							$("#waypoint_edit_place_name").focus();
						} else if(position_dirty_flag) {
							mainView.getCommonDialog().error("地点情報の保存に失敗しました。");
						} else {
							var msg = '地点 "' + $("#waypoint_edit_place_name").val() + '" の情報の保存に失敗しました。';
							mainView.getCommonDialog().confirm(true, msg, function(){
								ajaxToDeletePlaceData($("#waypoint_edit_place_name").val());
							});
						}
						return false;
					}
				},
				{
					text: "OK",
					click: function() {
						place_name_obj.val($("#waypoint_edit_place_name").val());
						place_position_obj.val($("#waypoint_edit_place_position").val());
						place_siteurl_obj.val($("#waypoint_edit_place_siteurl").val());
						place_description_obj.val($("#waypoint_edit_place_description").val());
						$(this).dialog("close");
						place_name_obj.change();
						place_name_obj.next().focus();
						return false;
					}
				},
				{
					text: "キャンセル",
					click: function() {
						$(this).dialog("close");
						return false;
					}
				}
			]
		});
	}

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

	function openDialogSearchWebsite (search_word) {
		window.open("http://www.google.com/search?q=" + search_word, 'google_search_website');
	}

	function ajaxToGetPlaceList () {
		$("#place_list_menu").html("");
		$("#place_list_menu").append('<li>地点情報一覧を読み込んでいます・・・</li>');
		var menu = $("#place_list_menu").show().position({
			my: "left top",
			at: "left bottom",
			of: "#waypoint_edit_place_name"
		});
		$.ajax({
			dataType: "json",
			type: "GET",
			cache: false,
			url: "place_edit",
			success: function(data) {
				$("#place_list_menu").html("");
				if(data == null) return false;
				for(var i=0; i<data.idList.length; i++) {
					var list_item_tag = '<li class="selectable"><a href="#">' + data.placeNameList[i] + '</a></li>';
					$("#place_list_menu")
						.append(list_item_tag)
						.find("li").eq(i).click(function(e) {
							ajaxToGetPlaceData($(e.target).text());
							return false;
						});
				}
			},
			complete: function() {
				$( document ).one( "click", function() {
					menu.hide();
					return false;
				});
			}
		});
	}

	function ajaxToGetPlaceData (place_name) {
		$.ajax({
			dataType: "json",
			data: { place_name: place_name, place_operation: "place_get" },
			type: "POST",
			cache: false,
			url: "place_edit",
			success: function(data) {
				$("#waypoint_edit_place_siteurl").val(data.siteUrl);
				if(data.siteUrl != "") {
					$("#waypoint_edit_button_place_url").button("enable");
				} else {
					$("#waypoint_edit_button_place_url").button("disable");
				}
				$("#waypoint_edit_place_description").val(data.description);
				$("#waypoint_edit_place_position").val(data.placePosition);
				$("#waypoint_edit_place_name").val(data.placeName).click();
				smallMapCanvas.setLocation($("#waypoint_edit_place_name").val(), $("#waypoint_edit_place_position").val(), function(latlng_str){
					$("#waypoint_edit_place_position").val(latlng_str);
					smallMapCanvas.addPlaceDescription($("#waypoint_edit_place_description").val());
					smallMapCanvas.refresh();
				});
				position_dirty_flag = false;
				return false;
			},
			error: function(req, status, error) {
				return false;
			}
		});
	}

	function ajaxToSavePlaceData (place_name, place_position, place_siteurl, place_description) {
		$.ajax({
			dataType: "json",
			data: {
				place_name: place_name,
				place_position: place_position,
				place_siteurl: place_siteurl,
				place_description: place_description,
				place_operation: "place_save"
			},
			type: "POST",
			cache: false,
			url: "place_edit",
			success: function(result){
				if(result.returnCode == "0") {
					mainView.getCommonDialog().ok('保存完了', '地点 "' + place_name + '" の情報を保存しました。');
				} else {
					mainView.getCommonDialog().error('地点 "' + place_name + '" の情報の保存に失敗しました。');
				}
			},
			error: function() {
				mainView.getCommonDialog().error('地点 "' + place_name + '" の情報の保存に失敗しました。');
			}
		});
	}

	function ajaxToDeletePlaceData (place_name) {
		$.ajax({
			dataType: "json",
			data: { place_name: place_name, place_operation: "place_delete" },
			type: "POST",
			cache: false,
			url: "place_edit",
			success: function(result){
				if(result.returnCode == "0") {
					mainView.getCommonDialog().ok('削除完了', '地点 "' + place_name + '" の情報を削除しました。');
				} else {
					mainView.getCommonDialog().error('地点 "' + place_name + '" の情報の削除に失敗しました。');
				}
			},
			error: function() {
				mainView.getCommonDialog().error('地点 "' + place_name + '" の情報の削除に失敗しました。');
			}
		});
	}

	return WaypointEditMain;
}());

