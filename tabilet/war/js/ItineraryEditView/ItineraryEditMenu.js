//ItineraryEditMenu

var ItineraryEditMenu = (function() {

	var mainView;

	//---------------
	// constructor
	//---------------

	function ItineraryEditMenu (view) {
		mainView = view;

		//新規作成
		$("#action_itinerary_clear").bind("tap", function(){
			mainView.getCommonDialogs().confirm("編集中の行程データは破棄されます。続行しますか？", function(){
				submitForm("itinerary_edit", "get");
			});
			return false;
		});

		//行程一覧
		$("#action_itinerary_list").bind("tap", function(){
			mainView.getCommonDialogs().confirm("編集中の行程データは破棄されます。続行しますか？", function(){
				ajaxToGetItineraryList();
			});
			return false;
		});

		//変更破棄
		$("#action_itinerary_refresh").bind("tap", function(){
			mainView.getCommonDialogs().confirm("編集中の行程データは破棄されます。続行しますか？", function(){
				if($("#itinerary_id").val() == "") {
					submitForm("itinerary_edit", "get");
				} else {
					submitPostToItineraryEdit($("#itinerary_id").val(), "itinerary_edit");
				}
			});
			return false;
		});

		//行程保存
		$("#action_itinerary_save").bind("tap", function(){
			if ($("#itinerary_summary").val() === "") {
				mainView.getCommonDialogs().error('行程のタイトルが入力されていません。');
				return false;
			}
			mainView.getCommonDialogs().confirm("行程データを保存します。続行しますか？", function(){
				ajaxToSaveItineraryData();
			});
			return false;
		});

		//行程削除
		$("#action_itinerary_delete").bind("tap", function(event) {
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
		$("#listview_itinerary_list").empty();
		if(data == null) return false;

		var newObj;
		var newTag;
		for(var i=0; i<data.idList.length; i++) {
			newObj = document.createElement('a');
			newObj.setAttribute('href', '#');
			newObj.setAttribute('name', data.idList[i]);

			newTag = document.createElement('div');
			newTag.setAttribute('class', 'itinerary_summary');
			$(newTag).append(data.summaryList[i]);
			$(newObj).append(newTag);

			var dateTimeTag = document.createElement('p');
			dateTimeTag.setAttribute('class', 'ui-li-aside');

			newTag = document.createElement('div');
			newTag.setAttribute('class', 'itinerary_depdate');
			$(newTag).append(data.depDateList[i]);
			$(dateTimeTag).append(newTag);

			newTag = document.createElement('div');
			newTag.setAttribute('class', 'itinerary_deptime');
			$(newTag).append(data.depTimeList[i]);
			$(dateTimeTag).append(newTag);
			$(newObj).append(dateTimeTag);

			newTag = newObj;
			newObj = document.createElement('li');
			$(newObj).append(newTag);

			$("#listview_itinerary_list").append(newObj)
			$(newObj).bind("tap", function(e) {
				var selected_itinerary_id = $(e.target).closest("a").attr("name");
				submitPostToItineraryEdit(selected_itinerary_id, "itinerary_edit");
				return false;
			});
		}
		newObj = document.createElement('li');
		newObj.setAttribute('data-icon', 'back');
		newObj.setAttribute('data-iconpos', 'left');
		newTag = document.createElement('a');
		newTag.setAttribute('href', '#');
		newTag.setAttribute('class', 'goto_itinerary_edit');
		$(newTag).append('閉じる');
		$(newObj).append(newTag);

		$("#listview_itinerary_list").append(newObj);
		$(".goto_itinerary_edit").bind("tap", function(){
			$.mobile.changePage("#page_itinerary_edit");
		});
		$.mobile.changePage("#dialog_itinerary_list");
		$("#listview_itinerary_list").listview("refresh");
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

		$(".select_waypoint_action").each(function(){
			placeNameList.push($.trim($(this).find(".waypoint_name").text()));
			placePositionList.push($(this).find(".waypoint_location").val());
			placeUrlList.push($(this).find(".waypoint_url").val());
			placeDescriptionList.push($(this).find(".waypoint_description").val());
			placeDepDateList.push($.trim($(this).find(".waypoint_depdate").text()));
			placeDepTimeList.push($.trim($(this).find(".waypoint_deptime").text()));
		});

		var json = {
			itinerary_operation   : itinerary_operation,
			itinerary_id          : $("#itinerary_id").val(),
			itinerary_summary     : $("#itinerary_summary").val(),
			itinerary_description : $("#itinerary_description").val(),
			waypoint_name   : placeNameList,
			waypoint_location        : placePositionList,
			waypoint_url         : placeUrlList,
			waypoint_description     : placeDescriptionList,
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
						$.mobile.changePage("#page_itinerary_edit");
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
