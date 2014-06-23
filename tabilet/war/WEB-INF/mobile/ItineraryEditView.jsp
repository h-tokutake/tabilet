<%@page import="java.util.*"%>
<%@page import="com.appspot.tabilet.CommonModel.*"%>
<%@page import="com.appspot.tabilet.ItineraryDataModel.*"%>
<%@page import="com.appspot.tabilet.PlaceDataModel.*"%>
<%@page import="com.appspot.tabilet.Controller.*"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<link type="text/css" rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/jquerymobile/1.4.2/jquery.mobile.min.css" />
<link rel="stylesheet" href="/themes/EmeraldBlue.min.css" />
<link rel="stylesheet" href="/themes/jquery.mobile.icons.min.css" />
<link type="text/css" rel="stylesheet" href="/css/mobile.css" />

<script type="text/JavaScript" src="https://www.google.com/jsapi"></script>
<script type="text/JavaScript" src="http://maps.google.com/maps/api/js?sensor=true"></script>
<script type="text/JavaScript" src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script type="text/JavaScript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.4/jquery-ui.min.js"></script>
<script type="text/JavaScript" src="/js/lib/jquery.ui.touch-punch.min.js"></script>

<script type="text/JavaScript" src="/js/lib/globalize.js"></script>
<script type="text/JavaScript" src="/js/lib/cultures/globalize.culture.ja.js"></script>
<script type="text/JavaScript" src="/js/lib/cultures/globalize.culture.ja-JP.js"></script>
<script type="text/JavaScript" src="/js/mobile/common/CommonFunctions.js" charset="utf-8"></script>
<script type="text/JavaScript" src="/js/mobile/common/Localization.js" charset="utf-8"></script>
<script type="text/JavaScript" src="/js/mobile/common/CommonDialogs.js" charset="utf-8"></script>
<script type="text/JavaScript" src="/js/mobile/common/MapCanvas.js" charset="utf-8"></script>
<script type="text/JavaScript" src="/js/mobile/ItineraryEditView/ItineraryEditMenu.js" charset="utf-8"></script>
<script type="text/JavaScript" src="/js/mobile/ItineraryEditView/WaypointEditMain.js" charset="utf-8"></script>
<script type="text/JavaScript" src="/js/mobile/ItineraryEditView/ItineraryEditMain.js" charset="utf-8"></script>
<script type="text/JavaScript" src="//ajax.googleapis.com/ajax/libs/jquerymobile/1.4.2/jquery.mobile.min.js"></script>

<title>タブレットで旅をする - Tabilet</title>
</head>
<body>

<div data-role="page" id="itinerary_edit_screen_summary" data-theme="b">
	<div data-role="header" data-position="inline" data-id="itinerary_edit_screen_header" data-position="fixed">
		<a href="#itinerary_edit_main_menu" data-role="button" data-icon="bars"
			data-iconpos="notext" data-transition="slidedown" data-rel="dialog">MENU</a>
		<h1>Tabilet</h1>
		<input type="hidden" id="user_id" name="user_id" value="<c:out value="${nickname}" />"></input>
		<a href="#itinerary_edit_menu_login" data-role="button" data-icon="user"
			data-iconpos="notext" data-transition="slidedown" data-rel="dialog">USER</a>

		<div data-role="navbar">
			<ul>
				<li><a href="#itinerary_edit_screen_summary" class="ui-btn-active">行程概要</a></li>
				<li><a href="#itinerary_edit_screen_main">行程編集</a></li>
				<li><a href="#itinerary_edit_screen_map">地図表示</a></li>
			</ul>
		</div>
	</div>

	<form id="itinerary_edit_form" action="itinerary_edit" method="post">
		<input type="hidden" name="itinerary_operation" value="itinerary_save"></input>
		<input type="hidden" id="itinerary_edit_itinerary_id" name="itinerary_id"
			value="<c:out value="${itinerary_id}" />" />
			<input type="text" data-mini="true" id="itinerary_edit_itinerary_summary"
				class="summary" name="itinerary_summary" placeholder="行程のタイトルを入れてください"
				value="<c:out value="${itinerary_summary}" />" />
			<textarea data-mini="true" id="itinerary_edit_itinerary_description" class="description"
				name="itinerary_description" rows="4" placeholder="行程の概要を入れてください"
				><c:out value="${itinerary_description}" /></textarea>
			</div>
		</div>
	</form>
</div>

<div data-role="page" id="itinerary_edit_screen_main" data-theme="b">
	<div data-role="header" data-position="inline" data-id="itinerary_edit_screen_header" data-position="fixed">
		<a href="#itinerary_edit_main_menu" data-role="button" data-icon="bars"
			data-iconpos="notext" data-transition="slidedown" data-rel="dialog">MENU</a>
		<h1>Tabilet</h1>
		<input type="hidden" id="user_id" name="user_id" value="<c:out value="${nickname}" />"></input>
		<a href="#itinerary_edit_menu_login" data-role="button" data-icon="user"
			data-iconpos="notext" data-transition="slidedown" data-rel="dialog">USER</a>

		<div data-role="navbar">
			<ul>
				<li><a href="#itinerary_edit_screen_summary">行程概要</a></li>
				<li><a href="#itinerary_edit_screen_main" class="ui-btn-active">行程編集</a></li>
				<li><a href="#itinerary_edit_screen_map">地図表示</a></li>
			</ul>
		</div>
	</div>

	<!-- 行程入力欄を表示 -->
	<form id="itinerary_edit_form" action="itinerary_edit" method="post">
		<input type="hidden" id="itinerary_edit_itinerary_operation" name="itinerary_operation" value="itinerary_save" />
		<input type="hidden" id="itinerary_edit_itinerary_id" name="itinerary_id" value="<c:out value="${itinerary_id}" />" />

		<ul data-role="listview" data-split-icon="delete" id="waypoint_listview">
			<c:forEach var="place_name" items="${place_name_list}" varStatus="status">
				<li class="list_sortable"><a href="#" class="waypoint_edit" data-transition="slide">
					<div class="waypoint_place_name">
						<c:if test="${not empty place_name}"><c:out value="${place_name}" /></c:if>
					</div>
					&nbsp;到着：&nbsp;
					<div class="waypoint_arrdate">
						<c:if test="${not empty place_arrdate_list}"><c:out value="${place_arrdate_list[status.index]}" /></c:if>
					</div>
					<div class="waypoint_arrtime">
						<c:if test="${not empty place_arrtime_list}"><c:out value="${place_arrtime_list[status.index]}" /></c:if>
					</div>
					<br>&nbsp;出発：&nbsp;
					<div class="waypoint_depdate">
						<c:if test="${not empty place_depdate_list}"><c:out value="${place_depdate_list[status.index]}" /></c:if>
					</div>
					<div class="waypoint_deptime">
						<c:if test="${not empty place_deptime_list}"><c:out value="${place_deptime_list[status.index]}" /></c:if>
					</div>
					<input type="hidden" class="place_position" name="place_position"
						value="<c:if test="${not empty place_position_list}"><c:out value="${place_position_list[status.index]}" /></c:if>" />
					<input type="hidden" class="place_siteurl" name="place_siteurl"
						value="<c:if test="${not empty place_siteurl_list}"><c:out value="${place_siteurl_list[status.index]}" /></c:if>" />
					<input type="hidden" class="place_description" name="place_description"
						value="<c:if test="${not empty place_description_list}"><c:out value="${place_description_list[status.index]}" /></c:if>" />
				</a><a href="#" class="waypoint_delete">削除</a></li>
			</c:forEach>
			<li><a href="#" class="waypoint_create" data-transition="slide">
				<p>クリックして立寄地の情報を入力してください</p>
			</a></li>
		</ul>
	</form>
</div>

<div data-role="page" id="itinerary_edit_screen_map" data-theme="b">
	<div data-role="header" data-position="inline" id="itinerary_edit_screen_header" data-id="itinerary_edit_screen_header" data-position="fixed">
		<a href="#itinerary_edit_main_menu" data-role="button" data-icon="bars"
			data-iconpos="notext" data-transition="slidedown" data-rel="dialog">MENU</a>
		<h1>Tabilet</h1>
		<input type="hidden" id="user_id" name="user_id" value="<c:out value="${nickname}" />"></input>
		<a href="#itinerary_edit_menu_login" data-role="button" data-icon="user"
			data-iconpos="notext" data-transition="slidedown" data-rel="dialog">USER</a>

		<div data-role="navbar">
			<ul>
				<li><a href="#itinerary_edit_screen_summary">行程概要</a></li>
				<li><a href="#itinerary_edit_screen_main">行程編集</a></li>
				<li><a href="#itinerary_edit_screen_map" class="ui-btn-active">地図表示</a></li>
			</ul>
		</div>
	</div>

	<!-- 地図表示 -->
	<div id="itinerary_edit_screen_map_canvas" class="map_canvas"></div>
</div>

<!-- 地点情報編集画面 -->
<div data-role="page" id="waypoint_edit_screen_datetime" data-theme="b">
	<div data-role="header" data-id="waypoint_edit_screen_header" data-position="fixed">
		<input type="text" name="waypoint_place_name_1" id="waypoint_place_name_1" value="" />
		<div data-role="navbar">
			<ul>
				<li><a href="#waypoint_edit_screen_datetime" class="ui-btn-active">到着/出発日時設定</a></li>
				<li><a href="#waypoint_edit_screen_location">位置設定</a></li>
			</ul>
		</div>
	</div>
	<ul data-role="listview">
		<li data-role="list-divider">出発: </li>
		<li><div class="ui-grid-a">
			<div class="ui-block-a">
				<input type="date" name="waypoint_depdate" id="waypoint_depdate" value=""/>
			</div>
			<div class="ui-block-b">
				<input type="time" name="waypoint_deptime" id="waypoint_deptime" value=""/>
			</div>
		</div></li>
	</ul>
	<div data-role="footer" data-id="waypoint_edit_screen_footer" data-position="fixed">
		<div class="ui-grid-a">
			<div class="ui-block-a"><button type="button" class="waypoint_edit_set" name="">設定</button></div>
			<div class="ui-block-b"><button type="button" class="waypoint_edit_cancel">キャンセル</button></div>
		</div>
	</div>
</div>

<div data-role="page" id="waypoint_edit_screen_location" data-theme="b">
	<div data-role="header" data-id="waypoint_edit_screen_header" id="waypoint_edit_screen_header" data-position="fixed">
		<input type="text" name="waypoint_place_name_2" id="waypoint_place_name_2" value="" />
		<div data-role="navbar">
			<ul>
				<li><a href="#waypoint_edit_screen_datetime">到着/出発日時設定</a></li>
				<li><a href="#waypoint_edit_screen_location" class="ui-btn-active">位置設定</a></li>
			</ul>
		</div>
	</div>
	<input type="hidden" id="place_position" value="" />
	<input type="hidden" id="place_siteurl" value="" />
	<input type="hidden" id="place_description" value="" />
	<div id="waypoint_edit_screen_map_canvas" class="map_canvas"></div>
	<div data-role="footer" data-id="waypoint_edit_screen_footer" id="waypoint_edit_screen_footer" data-position="fixed">
		<div class="ui-grid-a">
			<div class="ui-block-a"><button type="button" class="waypoint_edit_set" name="">設定</button></div>
			<div class="ui-block-b"><button type="button" class="waypoint_edit_cancel">キャンセル</button></div>
		</div>
	</div>
</div>

<div data-role="page" id="itinerary_edit_main_menu" data-theme="b">
	<div data-role="content">
		<ul data-role="listview">
			<li><a href="#" data-rel="back" id="itinerary_edit_menu_main_create_itinerary">新規作成</a></li>
			<li><a href="#" data-rel="back" id="itinerary_edit_menu_main_move_ItineraryListView">行程一覧</a></li>
			<li><a href="#" data-rel="back" id="itinerary_edit_menu_main_refresh_ItineraryEditView">変更破棄</a></li>
			<li><a href="#" data-rel="back" id="itinerary_edit_menu_main_save_itinerary">行程保存</a></li>
			<li><a href="#" data-rel="back" id="itinerary_edit_menu_main_delete_itinerary">行程削除</a></li>
			<li><a href="#" data-rel="back">閉じる</a></li>
		</ul>
	</div>
</div>

<!-- ログイン画面 -->
<div data-role="page" id="itinerary_edit_menu_login" data-theme="b">
	<div data-role="content">
		<ul data-role="listview">
			<c:if test="${not empty logout_url}"><li><a href="<c:out value="${logout_url}" />" rel="external">ログアウト</a></li></c:if>
			<li><a href="<c:out value="${Google}"     />" rel="external">Googleでログイン</a></li>
			<li><a href="<c:out value="${YahooJAPAN}" />" rel="external">Yahoo!JAPANでログイン</a></li>
			<li><a href="<c:out value="${Yahoo}"      />" rel="external">Yahoo!でログイン</a></li>
			<li><a href="<c:out value="${mixi}"       />" rel="external">mixiでログイン</a></li>
			<li><a href="<c:out value="${AOL}"        />" rel="external">AOLでログイン</a></li>
			<li><a href="<c:out value="${MyOpenId}"   />" rel="external">MyOpenId.comでログイン</a></li>
			<li><a href="#" data-rel="back">キャンセル</a></li>
		</ul>
	</div>
</div>

<!-- 確認用ダイアログ -->
<div data-role="dialog" id="confirm_dialog" data-theme="b">
	<div data-role="content">
		<p id="confirm_dialog_message"></p>
		<div class="ui-grid-a">
			<div class="ui-block-a">
				<a href="#" data-role="button" id="confirm_dialog_ok">OK</a>
			</div>
			<div class="ui-block-b">
				<a href="#" data-role="button" id="confirm_dialog_cancel" class="close_all_dialogs">キャンセル</a>
			</div>
		</div>
	</div>
</div>

<!-- 情報表示用ダイアログ -->
<div data-role="dialog" id="info_dialog" data-theme="b">
	<div data-role="content">
		<p id="info_dialog_message"></p>
		<a href="#" data-role="button" id="info_dialog_ok">OK</a>
	</div>
</div>

<!-- エラー用ダイアログ -->
<div data-role="dialog" id="error_dialog" data-theme="b">
	<div data-role="content">
		<p id="error_dialog_message"></p>
		<a href="#" data-role="button" id="error_dialog_ok">OK</a>
	</div>
</div>

<!-- 待ち時間用ダイアログ -->
<div data-role="dialog" id="wait_dialog" data-theme="b">
	<div data-role="content">
		<p id="wait_dialog_message"></p>
	</div>
</div>

<!-- 行程一覧画面 -->
<div data-role="dialog" id="itinerary_list_dialog" data-theme="b">
	<div data-role="content">
		<ul data-role="listview" id="itinerary_list_menu"></ul>
	</div>
</div>

</body>
</html>
