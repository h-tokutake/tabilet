var messages = {
	DIALOG_CONFIRM : { ja: '確認', en: 'Confirm' },
	DIALOG_ERROR : { ja: 'エラー', en: 'Error' },
	DIALOG_SAVE_COMPLETED : { ja: '保存完了', en: 'Completed saving' },
	DIALOG_DELETE_COMPLETED : { ja: '削除完了', en: 'Completed deleting' },
	DIALOG_EDIT_PLACE : {ja : '地点情報入力', en : 'Edit place info' },
	BUTTON_SHOW_HERE : { ja : '現在地表示', en : 'Show here' },
	BUTTON_SAVE_PLACE : { ja : '地点保存', en : 'Save place info' },
	BUTTON_DELETE_PLACE : { ja : '地点削除', en : 'Delete place info' },
	BUTTON_OK : { ja : 'OK', en : 'OK' },
	BUTTON_CANCEL : { ja : 'キャンセル', en : 'Cancel' },
	CONFIRM_SAVE_ITINERARY : { ja : '行程 "%1%" を保存します。よろしいですか？', en : '' },
	CONFIRM_DELETE_ITINERARY : { ja : '行程 "%1%" を削除します。よろしいですか？', en : '' },
	CONFIRM_SAVE_PLACE : { ja : '地点 "%1%" の情報を保存します。よろしいですか？', en : '' },
	CONFIRM_DELETE_PLACE : { ja : '地点 "%1%" の情報を削除します。よろしいですか？', en : '' },
	COMPLETE_SAVE_ITINERARY : { ja : '行程 "%1%" を保存しました。', en : '' },
	COMPLETE_DELETE_ITINERARY : { ja : '行程 "%1%" を削除しました。', en : '' },
	COMPLETE_SAVE_PLACE : { ja : '地点 "%1%" の情報を保存しました。', en : '' },
	COMPLETE_DELETE_PLACE : { ja : '地点 "%1%" の情報を削除しました。', en : '' },
	FAIL_SAVE_ITINERARY : { ja : '行程 "%1%" の保存に失敗しました。', en : '' },
	FAIL_DELETE_ITINERARY : { ja : '行程 "%1%" の削除に失敗しました。', en : '' },
	FAIL_SAVE_PLACE : { ja : '地点 "%1%" の情報の保存に失敗しました。', en : '' },
	FAIL_DELETE_PLACE : { ja : '地点 "%1%" の情報の削除に失敗しました。', en : '' },
	FAIL_GET_ROUTE : { ja : '経路情報の取得に失敗しました。', en : '' },
	FAIL_GET_POSITION : { ja : '位置情報の取得に失敗しました。', en : '' }
}

function getRegion () {
	return 'ja';
	// return 'en';
}

function getMsg (option, param) {
	if (param != '') {
		return messages[option][getRegion()].replace('%1%', param);
	} else {
		return messages[option][getRegion()];
	}
}
