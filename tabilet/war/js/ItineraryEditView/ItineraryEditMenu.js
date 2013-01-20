//ItineraryEditMenuクラス

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
			$("#itinerary_edit_menu_login").show().position({
				my: "left top",
				at: "left bottom",
				of: "#itinerary_edit_menu_main_login"
			});
			$( document ).click();
			$( document ).one( "click", function() {
				$("#itinerary_edit_menu_login").hide();
			});
			return false;
		});
		$("#itinerary_edit_menu_main_create_itinerary").button({
			icons : { primary : "ui-icon-document" },
			text : true
		}).click(function(){
			var msg = '旅程 "' + $("#itinerary_edit_itinerary_summary").val() + '" へのすべての変更が破棄されます。よろしいですか？';
			mainView.getCommonDialog().confirm(mainView.getDirtyFlag(), msg, function(){
				submitForm("itinerary_edit", "get");
			});
			return false;
		});
		$("#itinerary_edit_menu_main_move_ItineraryListView").button({
			icons : { primary : "ui-icon-folder-open" },
			text : true
		}).click(function(){
			$( document ).click();
			var msg = '旅程 "' + $("#itinerary_edit_itinerary_summary").val() + '" へのすべての変更が破棄されます。よろしいですか？';
			mainView.getCommonDialog().confirm(mainView.getDirtyFlag(), msg, ajaxToGetItineraryList);
			return false;
		});
		$("#itinerary_edit_menu_main_save_itinerary").button({
			icons : { primary : "ui-icon-disk" },
			text : true
		}).click(function(){
			if ($("#itinerary_edit_itinerary_summary").val() === "") {
				mainView.getCommonDialog().error('旅程の概要が未入力です。');
			} else {
				var msg = '旅程 "' + $("#itinerary_edit_itinerary_summary").val() + '" を保存します。よろしいですか？';
				mainView.getCommonDialog().confirm(true, msg, function(){
					ajaxToSaveItineraryData();
				});
			}
			return false;
		});
		$("#itinerary_edit_menu_main_refresh_ItineraryEditView").button({
			icons : { primary : "ui-icon-refresh" },
			text : true
		}).click(function(){
			var msg = '旅程 "' + $("#itinerary_edit_itinerary_summary").val() + '" へのすべての変更が破棄されます。よろしいですか？';
			mainView.getCommonDialog().confirm(mainView.getDirtyFlag(), msg, function(){
				if($("#itinerary_edit_itinerary_id").val() == "") {
					submitForm("itinerary_edit", "get");
				} else {
					submitPostToItineraryEdit($("#itinerary_edit_itinerary_id").val(), "itinerary_edit");
				}
			});
			return false;
		});
		$("#itinerary_edit_menu_main_delete_itinerary").button({
			icons : { primary : "ui-icon-trash" },
			text : true
		}).click(function(event) {
			var msg = '旅程 "' + $("#itinerary_edit_itinerary_summary").val() + '" が削除されます。よろしいですか？';
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

		$("#itinerary_edit_menu_login").menu().hide();
		$(document.body).append($(document.createElement("ul")).attr("id", "place_list_menu"));
		$("#place_list_menu").menu().hide();

		$("#itinerary_edit_menu_main_save_itinerary").button("disable");
		$("#itinerary_edit_menu_main_refresh_ItineraryEditView").button("disable");
		if($("#itinerary_edit_itinerary_id").val() == "") $("#itinerary_edit_menu_main_delete_itinerary").button("disable");

		$(document.body).append($(document.createElement("ul")).attr("id", "itinerary_list_menu"));
		$("#itinerary_list_menu").menu().hide();
		$("#itinerary_list_menu").html("");
		$("#itinerary_list_menu").append('<li>旅程一覧読み込み中・・・</li>');

		$("#title_logo").click(function(){
			window.open("http://www.tabilet.net/", "_top");
			return false;
		});

		__checkLoggedIn();
	}

	// public methods

	ItineraryEditMenu.prototype = {
		enableSaveMenu : function () {
			$("#itinerary_edit_menu_main_save_itinerary").button("enable");
			$("#itinerary_edit_menu_main_refresh_ItineraryEditView").button("enable");
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
		var menu = $("#itinerary_list_menu").show().position({
			my: "left top",
			at: "left bottom",
			of: "#itinerary_edit_menu_main_move_ItineraryListView"
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
		var dwellTimeList = [];

		$(".waypoint").each(function(){
			placeNameList.push($(this).find(".place_name").val());
			placePositionList.push($(this).find(".place_position").val());
			placeUrlList.push($(this).find(".place_siteurl").val());
			placeDescriptionList.push($(this).find(".place_description").val());
			dwellTimeList.push($(this).find(".dwell_time").val());
		});

		var json = {
			itinerary_operation   : itinerary_operation,
			itinerary_id          : $("#itinerary_edit_itinerary_id").val(),
			itinerary_summary     : $("#itinerary_edit_itinerary_summary").val(),
			itinerary_description : $("#itinerary_edit_itinerary_description").val(),
			itinerary_depdate     : $("#itinerary_edit_itinerary_depdate").val(),
			itinerary_deptime     : $("#itinerary_edit_itinerary_deptime").val(),
			place_name            : placeNameList,
			place_position        : placePositionList,
			place_siteurl         : placeUrlList,
			place_description     : placeDescriptionList,
			dwell_time            : dwellTimeList
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
					mainView.getCommonDialog().ok('旅程保存完了', '旅程 "' + itinerary_data_json.itinerary_summary + '" を保存しました。');
					mainView.setItineraryId(result.strInfo);
					mainView.setDirtyFlag(false);
					__disableSaveMenu();
				} else {
					mainView.getCommonDialog().error('旅程 "' + itinerary_data_json.itinerary_summary + '" の保存に失敗しました。');
				}
			},
			error: function() {
				mainView.getCommonDialog().error('旅程 "' + itinerary_data_json.itinerary_summary + '" の保存に失敗しました。');
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
					mainView.getCommonDialog().ok('旅程削除完了', '旅程 "' + itinerary_data_json.itinerary_summary + '" を削除しました。', function(){
						submitForm("itinerary_edit", "get");
					});
				} else {
					mainView.getCommonDialog().error('旅程 "' + itinerary_data_json.itinerary_summary + '" の削除に失敗しました。');
				}
			},
			error: function() {
				mainView.getCommonDialog().error('旅程 "' + itinerary_data_json.itinerary_summary + '" の削除に失敗しました。');
			}
		});
	}

	function __disableSaveMenu(){
		$("#itinerary_edit_menu_main_save_itinerary").button("disable");
		$("#itinerary_edit_menu_main_refresh_ItineraryEditView").button("disable");
		$("#itinerary_edit_menu_main_delete_itinerary").button("enable");
		__checkLoggedIn();
	}

	function __checkLoggedIn(){
		if(!mainView.isLoggedIn()) {
			$("#itinerary_edit_menu_main_save_itinerary").button("disable");
			$("#itinerary_edit_menu_main_refresh_ItineraryEditView").button("disable");
			$("#itinerary_edit_menu_main_delete_itinerary").button("disable");
			$("#itinerary_edit_menu_main_move_ItineraryListView").button("disable");
		}
	}

	function openItineraryListMenu (data) {
		$("#itinerary_list_menu").html("");
		if(data == null) return false;
		for(var i=0; i<data.idList.length; i++) {
			var list_item_tag = '<li class="selectable"><a href="#" name="' + data.idList[i] + '">'
				+ data.depDateTimeList[i].replace(/T/, ' ') + ' @ ' + data.summaryList[i] + '</a></li>';
			$("#itinerary_list_menu")
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
