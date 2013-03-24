//CommonDialogs

var CommonDialogs = (function() {

	//---------------
	// constructor
	//---------------

	function CommonDialogs (){
		this.dialogObj = $(document.createElement("div")).attr("id", "dialog_object");
		$(document.body).append(this.dialogObj);
	}

	//----------------
	//   public
	//----------------

	CommonDialogs.prototype = {
		error : function (msg) {
			this.ok(getMsg('DIALOG_CONFIRM'), msg);
		},
		ok : function (title, msg, callback) {
			this.dialogObj.text(msg).dialog({
				title   : title,
				autoOpen: true,
				modal   : true,
				resizable: false,
				width    : "600px",
				buttons  : {
					"OK" : function(e){
						if(callback != null) callback();
						$(this).dialog("close");
						return false;
					},
				}
			});
		},
		confirm : function (dirty_flag, msg, callback){
			if(!dirty_flag) {
				callback();
				return;
			}
			this.dialogObj
				.text(msg)
				.dialog({
					title    : getMsg('DIALOG_CONFIRM'),
					autoOpen : false,
					modal    : true,
					resizable: false,
					width    : "600px",
					buttons  : [{
						text  : getMsg('BUTTON_OK'),
						click : function(){
							$(this).dialog("close");
							callback();
							return false;
						}
					},
					{
						text : getMsg('BUTTON_CANCEL'),
						click : function(){
							$(this).dialog("close");
							return false;
						}
					}]
				}).dialog("open");
		}
	};
	
	return CommonDialogs;
}());


