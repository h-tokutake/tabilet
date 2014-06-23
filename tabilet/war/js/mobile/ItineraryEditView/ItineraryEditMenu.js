//ItineraryEditMenu

var ItineraryEditMenu = (function() {

	var mainView;

	//---------------
	// constructor
	//---------------

	function ItineraryEditMenu (view) {
		mainView = view;

		//新規作成
		$("#itinerary_edit_menu_main_create_itinerary").bind("tap", function(){
			mainView.getCommonDialogs().confirm("編集中の行程データは破棄されます。続行しますか？", function(){
				submitForm("itinerary_edit", "get");
			});
			return false;
		});

		//行程一覧
		$("#itinerary_edit_menu_main_move_ItineraryListView").bind("tap", function(){
			mainView.getCommonDialogs().confirm("編集中の行程データは破棄されます。続行しますか？", function(){
				ajaxToGetItineraryList();
			});
			return false;
		});

		//変更破棄
		$("#itinerary_edit_menu_main_refresh_ItineraryEditView").bind("tap", function(){
			mainView.getCommonDialogs().confirm("編集中の行程データは破棄されます。続行しますか？", function(){
				if($("#itinerary_edit_itinerary_id").val() == "") {
					submitForm("itinerary_edit", "get");
				} else {
					submitPostToItineraryEdit($("#itinerary_edit_itinerary_id").val(), "itinerary_edit");
				}
			});
			return false;
		});

		//行程保存
		$("#itinerary_edit_menu_main_save_itinerary").bind("tap", function(){
			if ($("#itinerary_edit_itinerary_summary").val() === "") {
				mainView.getCommonDialogs().error('行程のタイトルが入力されていません。');
				return false;
			}
			mainView.getCommonDialogs().confirm("行程データを保存します。続行しますか？", function(){
				ajaxToSaveItineraryData();
			});
			return false;
		});

		//行程削除
		$("#itinerary_edit_menu_main_delete_itinerary").bind("tap", function(event) {
			mainView.getCommonDialogs().confirm("行程データを保存します。続行しますか？", function(){
				ajaxToDeleteItineraryData();
			});
			return false;
		});
	}

	// public methods


	//private methods
	function ajaxToGetItineraryList () {
		mainView.getCommonDialogs().wait("行程データを読み込んでいます。<br />しばらくお待ちください・・・");
		var that = this;
		$.ajax({
			dataType: "json",
			type: "GET",
			cache: false,
			url: "itinerary_list",
			success: openItineraryListMenu,
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				var msg = '行程データの読み込みに失敗しました。<br />XMLHttpRequest = ' + XMLHttpRequest.status;
				msg += '<br />textStatus = ' + textStatus;
				msg += '<br />errorThrown = ' + errorThrown.message;
				mainView.getCommonDialogs().error(msg);
			}
		});
	}

	function openItineraryListMenu (data) {
		$("#itinerary_list_menu").empty();
		if(data == null) return false;
		for(var i=0; i<data.idList.length; i++) {
			var list_item_tag = '<li><a href="#" name="' + data.idList[i] + '">'
				+ data.depDateList[i] + ' ' + data.depTimeList[i] + ' @ ' + data.summaryList[i] + '</a></li>';
			$("#itinerary_list_menu")
				.append(list_item_tag)
				.find("li").eq(i).bind("tap", function(e) {
					var selected_itinerary_id = $(e.target).find("a").context.name;
					submitPostToItineraryEdit(selected_itinerary_id, "itinerary_edit");
					return false;
				});
		}
		$("#itinerary_list_menu").append('<li><a href="#" class="close_all_dialogs">閉じる</a></li>');
		$(".close_all_dialogs").bind("tap", function(){
			$.mobile.changePage("#itinerary_edit_screen_summary");
		});
		$.mobile.changePage("#itinerary_list_dialog");
		$("#itinerary_list_menu").listview("refresh");
	}

	function submitPostToItineraryEdit (itinerary_id, itinerary_operation) {
		$(document.createElement("form"))
			.attr("action", "itinerary_edit")
			.attr("method", "post")
			.append('<input type="hidden" name="itinerary_id" value="' + itinerary_id + '"></input>')
			.append('<input type="hidden" name="itinerary_operation" value="' + itinerary_operation + '"></input>')
			.submit();
	}

	function makeItineraryDataJson (itinerary_operation) {
		var placeNameList = [];
		var placePositionList = [];
		var placeUrlList = [];
		var placeDescriptionList = [];
		var placeDepDateList = [];
		var placeDepTimeList = [];

		$(".waypoint_edit").each(function(){
			placeNameList.push($.trim($(this).find(".waypoint_place_name").text()));
			placePositionList.push($(this).find(".place_position").val());
			placeUrlList.push($(this).find(".place_siteurl").val());
			placeDescriptionList.push($(this).find(".place_description").val());
			placeDepDateList.push($.trim($(this).find(".waypoint_depdate").text()));
			placeDepTimeList.push($.trim($(this).find(".waypoint_deptime").text()));
		});

		var json = {
			itinerary_operation   : itinerary_operation,
			itinerary_id          : $("#itinerary_edit_itinerary_id").val(),
			itinerary_summary     : $("#itinerary_edit_itinerary_summary").val(),
			itinerary_description : $("#itinerary_edit_itinerary_description").val(),
			waypoint_place_name   : placeNameList,
			place_position        : placePositionList,
			place_siteurl         : placeUrlList,
			place_description     : placeDescriptionList,
			waypoint_depdate      : placeDepDateList,
			waypoint_deptime      : placeDepTimeList
		};

		return json;
	}

	function ajaxToSaveItineraryData () {
		var itinerary_data_json = makeItineraryDataJson("itinerary_save");
		var that = this;
		$.ajax({
			dataType: "json",
			data: itinerary_data_json,
			type: "POST",
			cache: false,
			url: "itinerary_edit",
			success: function(result){
				if(result.returnCode == "0") {
					mainView.getCommonDialogs().info('行程 "' + itinerary_data_json.itinerary_summary + '" を保存しました。', function() {
						mainView.setItineraryId(result.strInfo);
						$.mobile.changePage("#itinerary_edit_screen_main");
//						mainView.setDirtyFlag(false);
//						__disableSaveMenu();
					});
				} else {
					mainView.getCommonDialogs().error('行程 "' + itinerary_data_json.itinerary_summary + '" の保存に失敗しました。<br />returnCode = ' + result.returnCode);
				}
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				var msg = '行程 "' + itinerary_data_json.itinerary_summary + '" の保存に失敗しました。<br />XMLHttpRequest = ' + XMLHttpRequest.status;
				msg += '<br />textStatus = ' + textStatus;
				msg += '<br />errorThrown = ' + errorThrown.message;
				mainView.getCommonDialogs().error(msg);
			}
		});
	}

	function ajaxToDeleteItineraryData () {
		var itinerary_data_json = makeItineraryDataJson("itinerary_delete");
		var that = this;
		$.ajax({
			dataType: "json",
			data: itinerary_data_json,
			type: "POST",
			cache: false,
			url: "itinerary_edit",
			success: function(result){
				if(result.returnCode == "0") {
					mainView.getCommonDialogs().info('行程 "' + itinerary_data_json.itinerary_summary + '" を削除しました。', function(){
						submitForm("itinerary_edit", "get");
					});
				} else {
					mainView.getCommonDialogs().error('行程 "' + itinerary_data_json.itinerary_summary + '" の削除に失敗しました。');
				}
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				var msg = '行程 "' + itinerary_data_json.itinerary_summary + '" の削除に失敗しました。<br />XMLHttpRequest = ' + XMLHttpRequest.status;
				msg += '<br />textStatus = ' + textStatus;
				msg += '<br />errorThrown = ' + errorThrown.message;
				mainView.getCommonDialogs().error(msg);
			}
		});
	}

	return ItineraryEditMenu;
}());
