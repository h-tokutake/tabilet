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

		//エラー表示用ダイアログ
		this.__error = function (message) {
			$("#error_dialog_message").empty().append(message);
			$.mobile.changePage("#error_dialog");
			return;
		}
	}

	//--------------
	//    public
	//--------------

	CommonDialogs.prototype = {
		confirm : function(title, content, callback) { this.__confirm(title, content, callback); },
		error   : function(title, content, callback) { this.__error  (title, content, callback); }
	};

	return CommonDialogs;
}());


