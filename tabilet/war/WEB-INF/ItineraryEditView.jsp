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
<meta name="viewport" content="width=device-width" />
<link rel="stylesheet" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.9.0/themes/le-frog/jquery-ui.css" type="text/css" media="all" />
<link href="/css/timepicker.css" rel="stylesheet" type="text/css" />
<link href="/css/style.css" rel="stylesheet" type="text/css" />
<script type="text/JavaScript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js"></script>
<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.9.0/jquery-ui.min.js"></script>
<script type="text/javascript" src="https://www.google.com/jsapi"></script>
<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=true"></script>
<script type="text/JavaScript" src="/js/lib/jquery.ui.touch-punch.min.js"></script>
<script type="text/JavaScript" src="/js/lib/globalize.js"></script>
<script type="text/JavaScript" src="/js/lib/cultures/globalize.culture.ja.js"></script>
<script type="text/JavaScript" src="/js/lib/cultures/globalize.culture.ja-JP.js"></script>
<script type="text/JavaScript" src="/js/lib/timepicker.js"></script>
<script type="text/JavaScript" src="/js/common/CommonFunctions.js" charset="utf-8"></script>
<script type="text/JavaScript" src="/js/common/CommonDialogs.js" charset="utf-8"></script>
<script type="text/JavaScript" src="/js/common/MapCanvas.js" charset="utf-8"></script>
<script type="text/JavaScript" src="/js/ItineraryEditView/ItineraryEditMenu.js" charset="utf-8"></script>
<script type="text/JavaScript" src="/js/ItineraryEditView/WaypointEditDialog.js" charset="utf-8"></script>
<script type="text/JavaScript" src="/js/ItineraryEditView/ItineraryEditMain.js" charset="utf-8"></script>
<title>タブレットで旅をする - Tabilet</title>
</head>
<body>

<!-- タイトル -->
<label id="title_logo">Tabilet</label>

<!-- メニュー欄表示 -->
<div id="itinerary_edit_menu_main">
	<button id="itinerary_edit_menu_main_create_itinerary"          class="menu_main">新規作成</button>
	<button id="itinerary_edit_menu_main_move_ItineraryListView"    class="menu_main">行程一覧</button>
	<button id="itinerary_edit_menu_main_refresh_ItineraryEditView" class="menu_main">変更破棄</button>
	<button id="itinerary_edit_menu_main_save_itinerary"            class="menu_main">行程保存</button>
	<button id="itinerary_edit_menu_main_delete_itinerary"          class="menu_main">行程削除</button>
<!--
	<button id="itinerary_edit_menu_main_export_calendar"           class="menu_main">カレンダー</button>
-->
</div>

<div id="itinerary_edit_login_info">
	<input type="hidden" id="user_id" name="user_id" value="<c:out value="${nickname}" />"></input>
	<button id="itinerary_edit_menu_main_login"                     class="menu_main">
		<c:if test="${not empty user}"><c:out value="${nickname}" /></c:if>
		<c:if test="${empty user}">ゲスト</c:if>
	</button>
</div>

<!-- タブメニュー -->
<div id="itinerary_edit_menu_tabs">
	<ul>
		<li><a href="#itinerary_edit_screen_main" id="itinerary_edit_menu_main_move_ItineraryEditView">行程編集</a></li>
		<li><a href="#itinerary_edit_screen_map_canvas"  id="itinerary_edit_menu_main_show_map">地図表示</a></li>
	</ul>

	<!-- 地図表示 -->
	<div id="itinerary_edit_screen_map_canvas" class="map_canvas"></div>

	<!-- 行程入力欄を表示 -->
	<div id="itinerary_edit_screen_main">
		<form id="itinerary_edit_form" action="itinerary_edit" method="post">
			<input type="hidden" name="itinerary_operation" value="itinerary_save"></input>
			<input type="hidden"
				id="itinerary_edit_itinerary_id"
				name="itinerary_id"
				value="<c:out value="${itinerary_id}" />"
			></input>
			<label for="itinerary_edit_itinerary_summary" accesskey="s">コースタイトル : </label>
			<input type="text"
				id="itinerary_edit_itinerary_summary"
				class="summary"
				name="itinerary_summary"
				value="<c:out value="${itinerary_summary}" />"
			></input>
			<br />
			<label for="itinerary_edit_itinerary_description" accesskey="d">行程概要 : </label>
			<textarea
				id="itinerary_edit_itinerary_description"
				class="description"
				name="itinerary_description"
			><c:out value="${itinerary_description}" /></textarea>
			<br />
			<label for="itinerary_edit_itinerary_deptime" accesskey="t">出発日時 : </label>
			<input type="text"
				id="itinerary_edit_itinerary_deptime"
				class="datetime"
				name="itinerary_deptime"
				value="<c:out value="${itinerary_deptime}" />"
			></input>

			<br />
			<label>目的地リスト</label>
			<c:forEach var="place_name" items="${place_name_list}" varStatus="status">
				<div class="waypoint movable"><table><tr><td>
					<buttonset><button class="button_delete_place">削除</button><button class="button_insert_place">挿入</button></buttonset><input type="hidden"
						class="place_position"
						name="place_position"
						value="<c:if test="${not empty place_position_list}"><c:out value="${place_position_list[status.index]}" /></c:if>"
					></input><input type="hidden"
						class="place_siteurl"
						name="place_siteurl"
						value="<c:if test="${not empty place_siteurl_list}"><c:out value="${place_siteurl_list[status.index]}" /></c:if>"
					><input type="hidden"
						class="place_description"
						name="place_description"
						value="<c:if test="${not empty place_description_list}"><c:out value="${place_description_list[status.index]}" /></c:if>"
					><input type="text"
						class="place_name"
						name="place_name"
						value="<c:if test="${not empty place_name}"><c:out value="${place_name}" /></c:if>"
					></input></td><td class="waypoint_column_datetime"><input type="text" class="place_arrtime" readonly="readonly"></input></td>
					<td> ～ </td>
					<td class="waypoint_column_datetime"><input type="text"
						class="place_deptime"
						name="place_deptime"
						value="<c:if test="${not empty place_deptime_list}"><c:out value="${place_deptime_list[status.index]}" /></c:if>"
					></input></td></tr></table>
				</div>
			</c:forEach>
			<div class="waypoint"><table><tr><td>
				<buttonset><button class="button_delete_place" disabled>削除</button><button class="button_insert_place">追加</button></buttonset>
			</td></tr></table></div>
		</form>
	</div>

</div>

<!-- 経由地編集画面 -->
<div id="itinerary_edit_screen_waypoint_edit">
	<input type="text" id="waypoint_edit_place_name" name="waypoint_place_name" value=""></input><button id="waypoint_edit_button_place_list">保存地点一覧</button>
	<input type="hidden" id="waypoint_edit_place_position" name="waypoint_place_position" value=""></input>
	<input type="hidden" id="waypoint_edit_place_siteurl" name="waypoint_place_siteurl" value=""></input>
	<input type="hidden" id="waypoint_edit_place_description" name="waypoint_place_description" value=""></input>
	<button id="waypoint_edit_button_search_position">位置検索</button>
	<button id="waypoint_edit_button_place_url">ホームページを開く</button>
	<div id="waypoint_edit_screen_map_canvas" class="map_canvas"></div>
</div>

<!-- 地点情報登録画面 -->
<div id="itinerary_edit_screen_place_edit">
	<table>
		<tr><td><label for="place_edit_place_name">名称：</label><input type="text" id="place_edit_place_name" value=""></input>
		<button id="place_edit_button_search_url">Googleで検索する</button>
		<input type="hidden" id="place_edit_place_position" name="place_position" value=""></input></td></tr>
		<tr><td><label for="place_edit_place_siteurl">URL：</label><input type="text" id="place_edit_place_siteurl" value=""></input></td></tr>
		<tr><td><label for="place_edit_place_description">コメント：</label><textarea id="place_edit_place_description" class="description" value=""></textarea></td></tr>
	</table>
</div>

<!-- ログイン画面 -->
<ul id="itinerary_edit_menu_login">
	<c:if test="${not empty logout_url}"><li><a href="<c:out value="${logout_url}" />">ログアウト</a></li></c:if>
	<li><a href="<c:out value="${Google}"     />">Googleでログイン</a></li>
	<li><a href="<c:out value="${YahooJAPAN}" />">Yahoo!JAPANでログイン</a></li>
	<li><a href="<c:out value="${Yahoo}"      />">Yahoo!でログイン</a></li>
	<li><a href="<c:out value="${mixi}"       />">mixiでログイン</a></li>
	<li><a href="<c:out value="${AOL}"        />">AOLでログイン</a></li>
	<li><a href="<c:out value="${MyOpenId}"   />">MyOpenId.comでログイン</a></li>
</ul>

</body>
</html>
