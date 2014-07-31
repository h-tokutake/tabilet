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
<link type="text/css" rel="stylesheet" href="/themes/EmeraldBlue.min.css" />
<link type="text/css" rel="stylesheet" href="/themes/jquery.mobile.icons.min.css" />
<link type="text/css" rel="stylesheet" href="/css/style.css" />

<script type="text/JavaScript" src="https://www.google.com/jsapi"></script>
<script type="text/JavaScript" src="http://maps.google.com/maps/api/js?sensor=true"></script>
<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?libraries=places&sensor=true"></script>
<script type="text/JavaScript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script type="text/JavaScript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.4/jquery-ui.min.js"></script>

<script type="text/JavaScript" src="/js/lib/jquery.ui.touch-punch.min.js"></script>
<script type="text/JavaScript" src="/js/lib/globalize.js"></script>
<script type="text/JavaScript" src="/js/lib/cultures/globalize.culture.ja.js"></script>
<script type="text/JavaScript" src="/js/lib/cultures/globalize.culture.ja-JP.js"></script>

<script type="text/JavaScript" src="/js/common/CommonFunctions.js" charset="utf-8"></script>
<script type="text/JavaScript" src="/js/common/Localization.js" charset="utf-8"></script>
<script type="text/JavaScript" src="/js/common/CommonDialogs.js" charset="utf-8"></script>
<script type="text/JavaScript" src="/js/common/MapCanvas.js" charset="utf-8"></script>
<script type="text/JavaScript" src="/js/rest/RestHandler.js" charset="utf-8"></script>
<script type="text/JavaScript" src="/js/rest/RakutenAPIHandler.js" charset="utf-8"></script>
<script type="text/JavaScript" src="/js/rest/GooglePlacesHandler.js" charset="utf-8"></script>
<script type="text/JavaScript" src="/js/ItineraryEditView/PlaceEditMenu.js" charset="utf-8"></script>
<script type="text/JavaScript" src="/js/ItineraryEditView/ItineraryEditMenu.js" charset="utf-8"></script>
<script type="text/JavaScript" src="/js/ItineraryEditView/WaypointEditMain.js" charset="utf-8"></script>
<script type="text/JavaScript" src="/js/ItineraryEditView/ItineraryEditMain.js" charset="utf-8"></script>
<script type="text/JavaScript" src="//ajax.googleapis.com/ajax/libs/jquerymobile/1.4.2/jquery.mobile.min.js"></script>

<title>タブレットで旅をする - Tabilet</title>
</head>
<body>

<input type="hidden" id="user_id" name="user_id" value="<c:out value="${nickname}" />" />
<input type="hidden" id="itinerary_operation" name="itinerary_operation" value="itinerary_save" />
<input type="hidden" id="itinerary_id" name="itinerary_id" value="<c:out value="${itinerary_id}" />" />

<!-- 行程編集画面 -->
<div data-role="page" id="page_itinerary_edit" data-theme="b">
	<div data-role="header" data-position="inline" data-id="header_itinerary_edit" data-position="fixed">
		<a href="#dialog_itinerary_menu" data-role="button" data-icon="grid" data-inline="true"
			data-iconpos="notext" data-transition="slidedown" data-rel="dialog">メニュー</a>
		<h1>Tabilet</h1>

		<div data-role="navbar" data-iconpos='top'>
			<ul>
				<li><a href="#page_itinerary_edit" data-icon='edit' class="ui-btn-active">行程編集</a></li>
				<li><a href="#page_itinerary_map" data-icon='location'>地図表示</a></li>
			</ul>
		</div>
	</div>

	<input type="text" data-mini="true" id="itinerary_summary"
		class="summary" name="itinerary_summary" placeholder="行程のタイトルを入れてください"
		value="<c:out value="${itinerary_summary}" />" />

	<!-- 行程入力欄を表示 -->
	<div data-role="collapsible">
		<h5>概要</h5>
		<textarea data-mini="true" id="itinerary_description" class="description"
		name="itinerary_description" placeholder="行程の概要を入れてください"
		><c:out value="${itinerary_description}" /></textarea>
	</div>
	<ul data-role="listview" data-inset="true" id="listview_itinerary_edit">
		<c:forEach var="waypoint_name" items="${waypoint_name_array}" varStatus="status">
			<li class="list_sortable" data-icon="false"><a href="#" class="select_waypoint_action" data-rel="dialog">
				<div class="waypoint_name"><c:if test="${not empty waypoint_name}"><c:out value="${waypoint_name}" /></c:if></div>
				&nbsp;到着：&nbsp;
				<div class="waypoint_arrdate"></div>
				<div class="waypoint_arrtime"></div>
				<br>&nbsp;出発：&nbsp;
				<div class="waypoint_depdate"><c:if test="${not empty waypoint_depdate_array}"><c:out value="${waypoint_depdate_array[status.index]}" /></c:if></div>
				<div class="waypoint_deptime"><c:if test="${not empty waypoint_deptime_array}"><c:out value="${waypoint_deptime_array[status.index]}" /></c:if></div>
				<input type="hidden" class="waypoint_location" name="waypoint_location"
					value="<c:if test="${not empty waypoint_location_array}"><c:out value="${waypoint_location_array[status.index]}" /></c:if>" />
				<input type="hidden" class="waypoint_url" name="waypoint_url"
					value="<c:if test="${not empty waypoint_url_array}"><c:out value="${waypoint_url_array[status.index]}" /></c:if>" />
				<input type="hidden" class="waypoint_description" name="waypoint_description"
					value="<c:if test="${not empty waypoint_description_array}"><c:out value="${waypoint_description_array[status.index]}" /></c:if>" />
			</a></li>
		</c:forEach>
		<li data-icon="plus"><a href="#" class="action_waypoint_create" data-transition="slide">
			<p>新しい立寄地</p>
		</a></li>
	</ul>
</div>

<!-- 行程地図画面 -->
<div data-role="page" id="page_itinerary_map" data-theme="b">
	<div data-role="header" data-position="inline" id="header_itinerary_edit" data-id="header_itinerary_edit" data-position="fixed">
		<a href="#dialog_itinerary_menu" data-role="button" data-icon="grid" data-inline="true"
			data-iconpos="notext" data-transition="slidedown" data-rel="dialog">メニュー</a>
		<h1>Tabilet</h1>

		<div data-role="navbar" data-iconpos='top'>
			<ul>
				<li><a href="#page_itinerary_edit" data-icon='edit'>行程編集</a></li>
				<li><a href="#page_itinerary_map" data-icon='location' class="ui-btn-active">地図表示</a></li>
			</ul>
		</div>
	</div>

	<input type="text" data-mini="true" id="itinerary_summary_2"
		class="summary" name="itinerary_summary" placeholder="行程のタイトルを入れてください"
		value="<c:out value="${itinerary_summary}" />" />

	<!-- 地図表示 -->
	<div id="itinerary_map_canvas" class="map_canvas"></div>
</div>

<!-- 地点情報編集画面 -->
<div data-role="page" id="page_place_edit" data-theme="b">
	<div data-role="header" data-id="header_place_edit" data-position="fixed">
		<a href="#dialog_place_menu" data-role="button" data-icon="grid" data-inline="true"
			data-iconpos="notext" data-transition="slidedown" data-rel="dialog">メニュー</a>
		<h1>Tabilet</h1>

		<div data-role="navbar">
			<ul>
				<li><a href="#page_place_map" data-icon='location'>位置設定</a></li>
				<li><a href="#page_place_edit" data-icon='clock' class="ui-btn-active">到着/出発日時設定</a></li>
			</ul>
		</div>
	</div>

	<input type="text" data-mini="true" data-inline="true" name="place_name_1" id="place_name_1" readonly />

	<ul data-role="listview">
		<li data-role="list-divider">出発: </li>
		<li><div class="ui-grid-a">
			<div class="ui-block-a">
				<input type="date" name="waypoint_depdate" id="waypoint_depdate" value="2014-06-28"/>
			</div>
			<div class="ui-block-b">
				<input type="time" name="waypoint_deptime" id="waypoint_deptime" value="12:00"/>
			</div>
		</div></li>
	</ul>
	<div data-role="footer" data-id="footer_place_edit" data-position="fixed" data-tap-toggle="false">
		<div class="ui-grid-a">
			<div class="ui-block-a"><button type="button" class="action_waypoint_set" name="" data-icon="check" data-iconpos="top">設定</button></div>
			<div class="ui-block-b"><button type="button" class="action_waypoint_cancel" data-icon="back" data-iconpos="top">キャンセル</button></div>
		</div>
	</div>
</div>

<!-- 地点地図画面 -->
<div data-role="page" id="page_place_map" data-theme="b">
	<div data-role="header" data-id="header_place_edit" id="header_place_edit" data-position="fixed">
		<a href="#dialog_place_menu" data-role="button" data-icon="grid" data-inline="true"
			data-iconpos="notext" data-transition="slidedown" data-rel="dialog">メニュー</a>
		<h1>Tabilet</h1>

		<div data-role="navbar">
			<ul>
				<li><a href="#page_place_map" data-icon='location' class="ui-btn-active">位置設定</a></li>
				<li><a href="#page_place_edit" data-icon='clock'>到着/出発日時設定</a></li>
			</ul>
		</div>
	</div>

	<input type="text" data-mini="true" data-inline="true" name="place_name_2" id="place_name_2"
		placeholder="地名を入力してください" />
	<fieldset data-role="controlgroup" data-type="horizontal" data-mini="true" data-inline="true">
		<a href="#" data-role="button" data-icon="search" id="method_google_maps_2" data-iconpos="left">通常検索</a>
		<a href="#" data-role="button" data-icon="search" id="method_rakuten_travel_2" data-iconpos="left">ホテル検索</a>
	</fieldset>

	<input type="hidden" id="waypoint_location" value="" />
	<input type="hidden" id="waypoint_url" value="" />
	<input type="hidden" id="waypoint_description" value="" />
	<div id="place_map_canvas" class="map_canvas"></div>
	<div data-role="footer" data-id="footer_place_edit" id="footer_place_edit" data-position="fixed" data-tap-toggle="false">
		<div class="ui-grid-a">
			<div class="ui-block-a"><button type="button" class="action_waypoint_set" name="" data-icon="check" data-iconpos="top">設定</button></div>
			<div class="ui-block-b"><button type="button" class="action_waypoint_cancel" data-icon="back" data-iconpos="top">キャンセル</button></div>
		</div>
	</div>
</div>

<!-- 行程メニュー -->
<div data-role="dialog" id="dialog_itinerary_menu" data-theme="b">
	<div data-role="header" class="dialog_header" id="header_itinerary_menu">行程情報メニュー</div>
	<fieldset class="ui-grid-a">
		<div class="ui-block-a">
			<a href="#" data-role="button" data-icon="star" data-iconpos="top" id="action_itinerary_clear">新規作成</a>
		</div>
		<div class="ui-block-b">
			<a href="#" data-role="button" data-icon="bars" data-iconpos="top" id="action_itinerary_list">行程一覧</a>
		</div>
	</fieldset>
	<fieldset class="ui-grid-a">
		<div class="ui-block-a">
			<a href="#" data-role="button" data-icon="refresh" data-iconpos="top" id="action_itinerary_refresh">変更破棄</a>
		</div>
		<div class="ui-block-b">
			<a href="#" data-role="button" data-icon="cloud" data-iconpos="top" id="action_itinerary_save">行程保存</a>
		</div>
	</fieldset>
	<fieldset class="ui-grid-a">
		<div class="ui-block-a">
			<a href="#" data-role="button" data-icon="delete" data-iconpos="top" id="action_itinerary_delete">行程削除</a>
		</div>
		<div class="ui-block-b">
			<c:if test="${empty logout_url}">
				<a href="#dialog_login_menu" data-role="button" data-icon="user" data-iconpos="top" data-transition="slidedown" data-rel="dialog">ログイン</a>
			</c:if>
			<c:if test="${not empty logout_url}">
				<a href="<c:out value="${logout_url}" />" rel="external" data-role="button" data-icon="user" data-iconpos="top">ログアウト</a>
			</c:if>
		</div>
	</fieldset>
	<a href="#" data-role="button" data-icon="back" data-iconpos="left" data-rel="back">閉じる</a>
</div>

<!-- 地点メニュー -->
<div data-role="dialog" id="dialog_place_menu" data-theme="b">
	<div data-role="header" class="dialog_header" id="header_place_menu">地点情報メニュー</div>
	<fieldset class="ui-grid-a">
		<div class="ui-block-a">
			<a href="#" data-role="button" data-icon="navigation" data-iconpos="top" id="action_show_here">現在地表示</a>
		</div>
		<div class="ui-block-b">
			<a href="#" data-role="button" data-icon="bars" data-iconpos="top" id="action_place_list">登録地点一覧</a>
		</div>
	</fieldset>
	<fieldset class="ui-grid-a">
		<div class="ui-block-a">
			<a href="#" data-role="button" data-icon="refresh" data-iconpos="top" id="action_place_refresh">変更破棄</a>
		</div>
		<div class="ui-block-b">
			<a href="#dialog_place_save" data-role="button" data-rel="dialog" data-icon="cloud" data-iconpos="top">地点情報登録</a>
		</div>
	</fieldset>
	<fieldset class="ui-grid-a">
		<div class="ui-block-a">
			<a href="#" data-role="button" data-icon="delete" data-iconpos="top" id="action_place_delete">地点情報削除</a>
		</div>
		<div class="ui-block-b">
			<c:if test="${empty logout_url}">
				<a href="#dialog_login_menu" data-role="button" data-icon="user" data-iconpos="top" data-transition="slidedown" data-rel="dialog">ログイン</a>
			</c:if>
			<c:if test="${not empty logout_url}">
				<a href="<c:out value="${logout_url}" />" rel="external" data-role="button" data-icon="user" data-iconpos="top">ログアウト</a>
			</c:if>
		</div>
	</fieldset>
	<a href="#" data-role="button" data-rel="back" data-icon="back" data-iconpos="left">閉じる</a>
</div>

<!-- ログイン画面 -->
<div data-role="dialog" id="dialog_login_menu" data-theme="b">
	<div data-role="content">
		<ul data-role="listview">
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
<div data-role="dialog" id="dialog_common_confirm" data-theme="b">
	<div data-role="content">
		<p id="message_confirm_dialog"></p>
		<div class="ui-grid-a">
			<div class="ui-block-a">
				<a href="#" data-role="button" id="action_confirm_ok" data-icon="check" data-iconpos="top">OK</a>
			</div>
			<div class="ui-block-b">
				<a href="#" data-role="button" id="action_confirm_cancel" data-icon="back" data-iconpos="top" class="goto_itinerary_edit">キャンセル</a>
			</div>
		</div>
	</div>
</div>

<!-- 情報表示用ダイアログ -->
<div data-role="dialog" id="dialog_common_info" data-theme="b">
	<div data-role="content">
		<p id="message_info_dialog"></p>
		<a href="#" data-role="button" data-icon="check" data-iconpos="top" id="action_info_ok">OK</a>
	</div>
</div>

<!-- エラー用ダイアログ -->
<div data-role="dialog" id="dialog_common_error" data-theme="b">
	<div data-role="content">
		<p id="message_error_dialog"></p>
		<a href="#" data-role="button" data-icon="check" data-iconpos="top" id="action_error_ok" data-rel="back">OK</a>
	</div>
</div>

<!-- 待ち時間用ダイアログ -->
<div data-role="dialog" id="dialog_common_wait" data-theme="b">
	<div data-role="content">
		<p id="message_wait_dialog"></p>
	</div>
</div>

<!-- 行程一覧画面 -->
<div data-role="dialog" id="dialog_itinerary_list" data-theme="b">
	<div data-role="content">
		<ul data-role="listview" id="listview_itinerary_list" data-icon="false"></ul>
	</div>
</div>

<!-- 地点情報一覧画面 -->
<div data-role="dialog" id="dialog_place_list" data-theme="b">
	<div data-role="content">
		<ul data-role="listview" id="listview_place_list" data-icon="false"></ul>
	</div>
</div>

<!-- 登録地名入力用ダイアログ -->
<div data-role="dialog" id="dialog_place_save" data-theme="b">
	<div data-role="content">
		<input type="text" id="place_name" name="place_name" value=""
			placeholder="登録する地名を入力してください" />
		<div class="ui-grid-a">
			<div class="ui-block-a">
				<a href="#" data-role="button" data-icon="check" data-iconpos="top" id="action_place_save">登録</a>
			</div>
			<div class="ui-block-b">
				<a href="#" data-role="button" data-icon="back" data-iconpos="top" class="goto_place_edit">キャンセル</a>
			</div>
		</div>
	</div>
</div>

<!-- 立寄地編集 or 削除確認 -->
<div data-role="dialog" id="dialog_waypoint_action" data-theme="b">
	<div data-role="header" class="dialog_header" id="header_waypoint_action"></div>
	<fieldset class="ui-grid-a">
		<div class="ui-block-a">
			<a href="#" data-role="button" data-icon="edit" data-iconpos="top" id="action_waypoint_edit">編集</a>
		</div>
		<div class="ui-block-b">
			<a href="#" data-role="button" data-icon="delete" data-iconpos="top" id="action_waypoint_delete">削除</a>
		</div>
	</fieldset>
	<a href="#" data-role="button" data-icon="back" data-iconpos="top" data-rel="back">キャンセル</a>
</div>

</body>
</html>
