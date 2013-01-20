//WaypointEditDialogクラス

var WaypointEditDialog = (function(){
	var position_dirty_flag = false;
	var smallMapCanvas;
	var mainView;

	//---------------
	// constructor
	//---------------

	var WaypointEditDialog = function(view){
		mainView = view;
		$("#waypoint_edit_screen_map_canvas").css("height", window.innerHeight * 0.9 - 130);
		$("#waypoint_edit_screen_map_canvas").css("width", window.innerWidth * 0.9 - 30);
		smallMapCanvas = new MapCanvas("waypoint_edit_screen_map_canvas", mainView);
		$("#itinerary_edit_screen_waypoint_edit").hide();

		smallMapCanvas.setClickMapEvent(function(latlng_str) {
			$("#waypoint_edit_place_position").val(latlng_str);
			if($("#waypoint_edit_place_name").val() == "") $("#waypoint_edit_place_name").val(latlng_str);
			position_dirty_flag = true;
		});
		$("#waypoint_edit_button_search_position").button({
			icons: { primary: "ui-icon-search"},
			text : false
		}).click(function(){
			if ($("#waypoint_edit_place_name").val() == "") return;
			smallMapCanvas.setLocation($("#waypoint_edit_place_name").val(), "", function(latlng_str){
				$("#waypoint_edit_place_position").val(latlng_str);
				$("#waypoint_edit_place_siteurl").val("");
				$("#waypoint_edit_place_description").val("");
				$("#waypoint_edit_button_place_url").button("disable");
				smallMapCanvas.refresh();
			});
			return false;
		});
		$("#waypoint_edit_button_place_url").button({
			icons: { primary: "ui-icon-extlink"},
			text : false
		}).click(function(){
			window.open($("#waypoint_edit_place_siteurl").val());
			return false;
		}).button("disable");

		$("#itinerary_edit_screen_place_edit").hide();
	}

	// public methods

	WaypointEditDialog.prototype.open = function (target) {
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
			title   : "地点入力",
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
					$('.ui-dialog-buttonpane').find('button:contains("地点登録")').button("disable");
					$('.ui-dialog-buttonpane').find('button:contains("地点削除")').button("disable");
				}
			},
			close   : function() {
				if(place_name_obj.val() == "") {
					mainView.deleteRow(place_name_obj.closest(".waypoint"));
				}
			},
			resize  : function() { smallMapCanvas.refresh(); },
			buttons : [
				{
					text: "現在地表示",
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
					text: "地点登録",
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
								title   : "地点登録",
								autoOpen: true,
								modal   : true,
								width   : 600,
								buttons : [
									{
										text: "OK",
										click: function() {
											if($("#place_edit_place_name").val() == "") {
												mainView.getCommonDialog().error("地名を入力してください。");
												$("#place_edit_place_name").focus();
											} else {
												var msg = '地点 "' + $("#place_edit_place_name").val() + '" を登録します。よろしいですか？';
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
							mainView.getCommonDialog().error("地名を入力してください。");
							$("#waypoint_edit_place_name").focus();
						} else if(position_dirty_flag) {
							mainView.getCommonDialog().error("この地点は登録されていません。");
						} else {
							var msg = '地点 "' + $("#waypoint_edit_place_name").val() + '" を削除します。よろしいですか？';
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

	// private methods
	function openDialogSearchWebsite (search_word) {
		window.open("http://www.google.com/search?q=" + search_word, 'google_search_website');
	}

	function ajaxToGetPlaceList () {
		$("#place_list_menu").html("");
		$("#place_list_menu").append('<li>登録地点一覧読み込み中・・・</li>');
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
					mainView.getCommonDialog().ok('地点保存完了', '地点 "' + place_name + '" を保存しました。');
				} else {
					mainView.getCommonDialog().error('地点 "' + place_name + '" の保存に失敗しました。');
				}
			},
			error: function() {
				mainView.getCommonDialog().error('地点 "' + place_name + '" の保存に失敗しました。');
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
					mainView.getCommonDialog().ok('地点保存完了', '地点 "' + place_name + '" を削除しました。');
				} else {
					mainView.getCommonDialog().error('地点 "' + place_name + '" の削除に失敗しました。');
				}
			},
			error: function() {
				mainView.getCommonDialog().error('地点 "' + place_name + '" の削除に失敗しました。');
			}
		});
	}

	return WaypointEditDialog;
}());

