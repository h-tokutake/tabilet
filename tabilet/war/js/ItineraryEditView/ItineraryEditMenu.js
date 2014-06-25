//ItineraryEditMenu

var ItineraryEditMenu = (function() {

	var mainView;

	//---------------
	// constructor
	//---------------

	function ItineraryEditMenu (view) {
		mainView = view;

		$("#itinerary_edit_menu_main_export_calendar").button({
			icons : { primary : "ui-icon-calendar"},
			text : true
		}).click(function(){
			submitForm("calendar", "get");
			return false;
		});
		$("#itinerary_edit_menu_main_login").button({
			icons : { primary : "ui-icon-person" },
			text : true
		}).click(function(){
			$("#dialog_login_menu").show().position({
				my: "left top",
				at: "left bottom",
				of: "#itinerary_edit_menu_main_login"
			});
			$( document ).click();
			$( document ).one( "click", function() {
				$("#dialog_login_menu").hide();
			});
			return false;
		});
		$("#action_itinerary_clear").button({
			icons : { primary : "ui-icon-document" },
			text : true
		}).click(function(){
			var msg = '行程 "' + $("#itinerary_summary").val() + '" の変更が破棄されます。よろしいですか？';
			mainView.getCommonDialog().confirm(mainView.getDirtyFlag(), msg, function(){
				submitForm("itinerary_edit", "get");
			});
			return false;
		});
		$("#action_itinerary_list").button({
			icons : { primary : "ui-icon-folder-open" },
			text : true
		}).click(function(){
			$( document ).click();
			var msg = '行程 "' + $("#itinerary_summary").val() + '" の変更が破棄されます。よろしいですか？';
			mainView.getCommonDialog().confirm(mainView.getDirtyFlag(), msg, ajaxToGetItineraryList);
			return false;
		});
		$("#action_itinerary_save").button({
			icons : { primary : "ui-icon-disk" },
			text : true
		}).click(function(){
			if ($("#itinerary_summary").val() === "") {
				mainView.getCommonDialog().error($("#itinerary_summary").text() + 'が入力されていません。');
				return false;
			}
			var msg = '行程 "' + $("#itinerary_summary").val() + '" を保存します。よろしいですか？';
			mainView.getCommonDialog().confirm(true, msg, function(){
				ajaxToSaveItineraryData();
			});
			return false;
		});
		$("#action_itinerary_refresh").button({
			icons : { primary : "ui-icon-refresh" },
			text : true
		}).click(function(){
			var msg = '行程 "' + $("#itinerary_summary").val() + '" を保存します。よろしいですか？';
			mainView.getCommonDialog().confirm(mainView.getDirtyFlag(), msg, function(){
				if($("#itinerary_id").val() == "") {
					submitForm("itinerary_edit", "get");
				} else {
					submitPostToItineraryEdit($("#itinerary_id").val(), "itinerary_edit");
				}
			});
			return false;
		});
		$("#action_itinerary_delete").button({
			icons : { primary : "ui-icon-trash" },
			text : true
		}).click(function(event) {
			var msg = '行程 "' + $("#itinerary_summary").val() + '" を保存します。よろしいですか？';
			mainView.getCommonDialog().confirm(true, msg, function(){
				ajaxToDeleteItineraryData();
			});
			return false;
		});
		$("#itinerary_edit_menu_main").buttonset();

		$("#itinerary_edit_menu_main_show_map").click(function(){
			mainView.updateDirections(false, function() {
				mainView.getMapCanvas().refresh();
			});
			return false;
		});
		$("#itinerary_edit_menu_tabs").tabs();

		$("#dialog_login_menu").menu().hide();
		$(document.body).append($(document.createElement("ul")).attr("id", "place_list_menu"));
		$("#place_list_menu").menu().hide();

		$("#action_itinerary_save").button("disable");
		$("#action_itinerary_refresh").button("disable");
		if($("#itinerary_id").val() == "") $("#action_itinerary_delete").button("disable");

		$(document.body).append($(document.createElement("ul")).attr("id", "listview_itinerary_list"));
		$("#listview_itinerary_list").menu().hide();
		$("#listview_itinerary_list").html("");
		$("#listview_itinerary_list").append('<li>行程一覧を読み込んでいます・・・</li>');

		$("#title_logo").click(function(){
			window.open("http://www.tabilet.net/", "_top");
			return false;
		});

		__checkLoggedIn();
	}

	// public methods

	ItineraryEditMenu.prototype = {
		enableSaveMenu : function () {
			$("#action_itinerary_save").button("enable");
			$("#action_itinerary_refresh").button("enable");
			__checkLoggedIn();
		},
		disableSaveMenu : function () {
			__disableSaveMenu();
		},
		enableMapMenu : function () {
//			$("#itinerary_edit_menu_main_show_map").button("enable");
			$("#itinerary_edit_menu_tabs").tabs({ disabled: false });
		},
		disableMapMenu : function () {
//			$("#itinerary_edit_menu_main_show_map").button("disable");
			$("#itinerary_edit_menu_tabs").tabs({ disabled: [ 1 ] });
		}
	};

	//private methods

	function submitPostToItineraryEdit (itinerary_id, itinerary_operation) {
		$(document.createElement("form"))
			.attr("action", "itinerary_edit")
			.attr("method", "post")
			.append('<input type="hidden" name="itinerary_id" value="' + itinerary_id + '"></input>')
			.append('<input type="hidden" name="itinerary_operation" value="' + itinerary_operation + '"></input>')
			.submit();
	}

	function ajaxToGetItineraryList () {
		var menu = $("#listview_itinerary_list").show().position({
			my: "left top",
			at: "left bottom",
			of: "#action_itinerary_list"
		});
		$.ajax({
			dataType: "json",
			type: "GET",
			cache: false,
			url: "itinerary_list",
			success: openItineraryListMenu,
			complete: function() {
				$( document ).one( "click", function() {
					menu.hide();
					return false;
				});
			}
		});
	}

	function makeItineraryDataJson (itinerary_operation) {
		var placeNameList = [];
		var placePositionList = [];
		var placeUrlList = [];
		var placeDescriptionList = [];
		var placeDepTimeList = [];

		$(".waypoint").each(function(){
			placeNameList.push($(this).find(".place_name").val());
			placePositionList.push($(this).find(".waypoint_location").val());
			placeUrlList.push($(this).find(".waypoint_url").val());
			placeDescriptionList.push($(this).find(".waypoint_description").val());
			placeDepTimeList.push($(this).find(".place_deptime").val());
		});

		var json = {
			itinerary_operation   : itinerary_operation,
			itinerary_id          : $("#itinerary_id").val(),
			itinerary_summary     : $("#itinerary_summary").val(),
			itinerary_description : $("#itinerary_description").val(),
			place_name            : placeNameList,
			waypoint_location        : placePositionList,
			waypoint_url         : placeUrlList,
			waypoint_description     : placeDescriptionList,
			place_deptime         : placeDepTimeList
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
					mainView.getCommonDialog().ok('保存完了', '行程 "' + itinerary_data_json.itinerary_summary + '" を保存しました。');
					mainView.setItineraryId(result.strInfo);
					mainView.setDirtyFlag(false);
					__disableSaveMenu();
				} else {
					mainView.getCommonDialog().error('行程 "' + itinerary_data_json.itinerary_summary + '" の保存に失敗しました。(1)');
				}
			},
			error: function() {
				mainView.getCommonDialog().error('行程 "' + itinerary_data_json.itinerary_summary + '" の保存に失敗しました。(2)');
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
					mainView.getCommonDialog().ok('削除完了', '行程 "' + itinerary_data_json.itinerary_summary + '" を削除しました。', function(){
						submitForm("itinerary_edit", "get");
					});
				} else {
					mainView.getCommonDialog().error('行程 "' + itinerary_data_json.itinerary_summary + '" の削除に失敗しました。');
				}
			},
			error: function() {
				mainView.getCommonDialog().error('行程 "' + itinerary_data_json.itinerary_summary + '" の削除に失敗しました。');
			}
		});
	}

	function __disableSaveMenu(){
		$("#action_itinerary_save").button("disable");
		$("#action_itinerary_refresh").button("disable");
		$("#action_itinerary_delete").button("enable");
		__checkLoggedIn();
	}

	function __checkLoggedIn(){
		if(!mainView.isLoggedIn()) {
			$("#action_itinerary_save").button("disable");
			$("#action_itinerary_refresh").button("disable");
			$("#action_itinerary_delete").button("disable");
			$("#action_itinerary_list").button("disable");
		}
	}

	function openItineraryListMenu (data) {
		$("#listview_itinerary_list").html("");
		if(data == null) return false;
		for(var i=0; i<data.idList.length; i++) {
			var list_item_tag = '<li class="selectable"><a href="#" name="' + data.idList[i] + '">'
				+ data.depDateTimeList[i].replace(/T/, ' ') + ' @ ' + data.summaryList[i] + '</a></li>';
			$("#listview_itinerary_list")
				.append(list_item_tag)
				.find("li").eq(i).click(function(e) {
					var selected_itinerary_id = $(e.target).find("a").attr("name");
					if(e.target.tagName == "A") selected_itinerary_id = $(e.target).attr("name");
					submitPostToItineraryEdit(selected_itinerary_id, "itinerary_edit");
					return false;
				});
		}
	}

	return ItineraryEditMenu;
}());
