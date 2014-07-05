//PlaceEditMenu

var PlaceEditMenu = (function() {

	var mainView;
	var smallMapCanvas;

	//---------------
	// constructor
	//---------------

	function PlaceEditMenu (view, mapCanvas) {
		mainView = view;
		smallMapCanvas = mapCanvas;
		$("#listview_place_list").listview();

		//現在地表示
		$("#action_show_here").bind("tap", function(){
			mainView.getCommonDialogs().wait("現在位置を探索中・・・");
			smallMapCanvas.getCurrentPosition(function(waypoint_location) {
				$("#place_name_1").val("現在地");
				$("#place_name_2").val("現在地");
				$("#place_name").val("現在地");
				$("#waypoint_location").val(waypoint_location);
				$("#waypoint_description").val("");
				$("#waypoint_url").val("");
				smallMapCanvas.refresh();
				$.mobile.changePage("#page_place_map");
			});
		});

		//地点情報一覧
		$("#action_place_list").bind("tap", function(){
			mainView.getCommonDialogs().confirm("編集中の地点情報は破棄されます。続行しますか？", function(){
				ajaxToGetPlaceList();
			});
			return false;
		});

		//変更破棄
		$("#action_place_refresh").bind("tap", function(){
			mainView.getCommonDialogs().confirm("編集中の地点情報は破棄されます。続行しますか？", function(){
				if($("#place_name").val() == "") {
					submitForm("place_edit", "get");
				} else {
					submitPostToPlaceEdit($("#place_name").val(), "place_edit");
				}
			});
			return false;
		});

		//地点情報保存
		$("#action_place_save").bind("tap", function(){
			if ($("#place_name").val() === "") {
				mainView.getCommonDialogs().error('地名が入力されていません。');
				return false;
			}
			mainView.getCommonDialogs().confirm("地点情報を登録します。続行しますか？", function(){
				ajaxToSavePlaceData();
			});
			return false;
		});

		//行程削除
		$("#action_place_delete").bind("tap", function(event) {
			mainView.getCommonDialogs().confirm("地点情報を保存します。続行しますか？", function(){
				ajaxToDeletePlaceData();
			});
			return false;
		});
	}

	// public methods


	//private methods
	function ajaxToGetPlaceList () {
		mainView.getCommonDialogs().wait("地点情報を読み込んでいます。<br />しばらくお待ちください・・・");

		$.ajax({
			dataType: "json",
			type: "GET",
			cache: false,
			url: "place_edit",
			success: openPlaceListMenu,
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				var msg = '地点情報の読み込みに失敗しました。<br />XMLHttpRequest = ' + XMLHttpRequest.status;
				msg += '<br />textStatus = ' + textStatus;
				msg += '<br />errorThrown = ' + errorThrown.message;
				mainView.getCommonDialogs().error(msg);
			}
		});
	}

	function openPlaceListMenu (data) {
		$("#listview_place_list").empty();
		if(data == null) return false;
		for(var i=0; i<data.idList.length; i++) {
			var list_item_tag = '<li><a href="#" name="' + data.idList[i] + '">'
				+ data.placeNameList[i] + '</a></li>';
			$("#listview_place_list")
				.append(list_item_tag)
				.find("li").eq(i).bind("tap", function(e) {
					var selected_place_name = $.trim($(this).text());
					ajaxToGetPlaceData(selected_place_name);
					return false;
				});
		}
		$("#listview_place_list").append('<li><a href="#" class="goto_place_edit">閉じる</a></li>');
		$(".goto_place_edit").bind("tap", function(){
			$.mobile.changePage("#page_place_edit");
		});
		$("#listview_place_list").listview("refresh");
		$.mobile.changePage("#dialog_place_list");
	}

	function ajaxToGetPlaceData (place_name) {
		$.ajax({
			dataType: "json",
			data: { place_name: place_name, place_operation: "place_get" },
			type: "POST",
			cache: false,
			url: "place_edit",
			success: function(data) {
				$("#waypoint_url").val(data.siteUrl);
				$("#waypoint_description").val(data.description);
				$("#waypoint_location").val(data.location);
				$("#place_name_1").val($.trim(data.placeName));
				$("#place_name_2").val($.trim(data.placeName));
				$("#place_name").val($.trim(data.placeName));
				smallMapCanvas.setLocation('', $("#waypoint_location").val(), function(latlng_str){
					smallMapCanvas.addPlaceDescription($("#waypoint_description").val());
					smallMapCanvas.refresh();
					$.mobile.changePage("#page_place_map");
				});
				return false;
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				var msg = '地点情報の読み込みに失敗しました。<br />XMLHttpRequest = ' + XMLHttpRequest.status;
				msg += '<br />textStatus = ' + textStatus;
				msg += '<br />errorThrown = ' + errorThrown.message;
				mainView.getCommonDialogs().error(msg);
			}
		});
	}

	function makePlaceDataJson (place_operation) {
		var json = {
			place_name: $.trim($("#place_name").val()),
			waypoint_location: $("#waypoint_location").val(),
			waypoint_url: $.trim($("#waypoint_url").val()),
			waypoint_description: $("#waypoint_description").val(),
			place_operation: place_operation
		};

		return json;
	}

	function ajaxToSavePlaceData () {
		var place_data_json = makePlaceDataJson("place_save");

		$.ajax({
			dataType: "json",
			data: place_data_json,
			type: "POST",
			cache: false,
			url: "place_edit",
			success: function(result){
				if(result.returnCode == "0") {
					mainView.getCommonDialogs().info('"' + place_data_json.place_name + '" を登録しました。', function() {
						$("#place_name_1").val(place_data_json.place_name);
						$("#place_name_2").val(place_data_json.place_name);
						$.mobile.changePage("#page_place_map");
					});
				} else {
					mainView.getCommonDialogs().error('"' + place_data_json.place_name + '" の登録に失敗しました。<br />returnCode = ' + result.returnCode);
				}
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				var msg = '"' + place_data_json.place_name + '" の登録に失敗しました。<br />XMLHttpRequest = ' + XMLHttpRequest.status;
				msg += '<br />textStatus = ' + textStatus;
				msg += '<br />errorThrown = ' + errorThrown.message;
				mainView.getCommonDialogs().error(msg);
			}
		});
	}

	function ajaxToDeletePlaceData () {
		var place_data_json = makePlaceDataJson("place_delete");

		$.ajax({
			dataType: "json",
			data: place_data_json,
			type: "POST",
			cache: false,
			url: "place_edit",
			success: function(result){
				if(result.returnCode == "0") {
					mainView.getCommonDialogs().info('"' + place_data_json.place_name + '" を削除しました。', function() {
						$.mobile.changePage("#page_place_map");
					});
				} else {
					mainView.getCommonDialogs().error('"' + place_data_json.place_name + '" の削除に失敗しました。<br />returnCode = ' + result.returnCode);
				}
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				var msg = '"' + place_data_json.place_name + '" の削除に失敗しました。<br />XMLHttpRequest = ' + XMLHttpRequest.status;
				msg += '<br />textStatus = ' + textStatus;
				msg += '<br />errorThrown = ' + errorThrown.message;
				mainView.getCommonDialogs().error(msg);
			}
		});
	}

	return PlaceEditMenu;
}());
