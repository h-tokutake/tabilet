//CommonDialogs

var CommonDialogs = (function() {

	//---------------
	// constructor
	//---------------

	function CommonDialogs (){

		$(".goto_itinerary_edit").bind("click", function(){
			$.mobile.changePage("#page_itinerary_edit");
		});
		$(".goto_place_edit").bind("click", function(){
			$.mobile.changePage("#page_place_edit");
		});

		//----------------
		// private methods
		//----------------

		//確認用ダイアログ
		this.__confirm = function (message, callback) {
			$("#message_confirm_dialog").empty().append(message);
			$("#action_confirm_ok").one("click", function(){
				callback();
			});
			$.mobile.changePage("#dialog_common_confirm");
			return;
		}

		//情報表示用ダイアログ
		this.__info = function (message, callback) {
			$("#message_info_dialog").empty().append(message);
			$("#action_info_ok").one("click", function(){
				callback();
			});
			$.mobile.changePage("#dialog_common_info");
			return;
		}

		//エラー表示用ダイアログ
		this.__error = function (message) {
			$("#message_error_dialog").empty().append(message);
			$.mobile.changePage("#dialog_common_error");
			return;
		}

		//待ち時間用ダイアログ
		this.__wait = function (message) {
			$("#message_wait_dialog").empty().append(message);
			$.mobile.changePage("#dialog_common_wait");
			return;
		}
	}

	//--------------
	//    public
	//--------------

	CommonDialogs.prototype = {
		confirm : function(message, callback) { this.__confirm(message, callback); },
		info    : function(message, callback) { this.__info(message, callback); },
		error   : function(message) { this.__error(message); },
		wait    : function(message) { this.__wait (message); }
	};

	return CommonDialogs;
}());


