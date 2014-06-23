//CommonDialogs

var CommonDialogs = (function() {

	//---------------
	// constructor
	//---------------

	function CommonDialogs (){

		$(".close_all_dialogs").bind("tap", function(){
			$.mobile.changePage("#itinerary_edit_screen_summary");
		});

		//----------------
		// private methods
		//----------------

		//確認用ダイアログ
		this.__confirm = function (message, callback) {
			$("#confirm_dialog_message").empty().append(message);
			$("#confirm_dialog_ok").one("tap", function(){
				callback();
			});
			$.mobile.changePage("#confirm_dialog");
			return;
		}

		//情報表示用ダイアログ
		this.__info = function (message, callback) {
			$("#info_dialog_message").empty().append(message);
			$("#info_dialog_ok").one("tap", function(){
				callback();
			});
			$.mobile.changePage("#info_dialog");
			return;
		}

		//エラー表示用ダイアログ
		this.__error = function (message) {
			$("#error_dialog_message").empty().append(message);
			$("#error_dialog_ok").one("tap", function(){
				$.mobile.changePage("#itinerary_edit_screen_main");
			});
			$.mobile.changePage("#error_dialog");
			return;
		}

		//待ち時間用ダイアログ
		this.__wait = function (message) {
			$("#wait_dialog_message").empty().append(message);
			$.mobile.changePage("#wait_dialog");
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


