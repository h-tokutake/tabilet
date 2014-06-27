package com.appspot.tabilet.PlaceDataModel;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.jdo.Query;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import net.arnx.jsonic.JSON;

import com.appspot.tabilet.CommonModel.Data;
import com.appspot.tabilet.CommonModel.DataHandler;

public class PlaceDataHandler extends DataHandler {

	public PlaceDataHandler() {
		super(new PlaceData());
	}

	public PlaceDataHandler(PlaceData data) {
		super(data);
	}

	public final void loadOne(String placeName) {
		Query query = getPm().newQuery(PlaceData.class);
		query.setFilter("ownerId == paramUserId && placeName == paramPlaceName");
		query.declareParameters("String paramUserId, String paramPlaceName");
		@SuppressWarnings("unchecked")
		List<Data> dataList = (List<Data>) query.execute(this.getUserId(), placeName);
		if(dataList.size() > 0) {
			PlaceData data = this.getPm().detachCopy((PlaceData) dataList.get(0));
			this.setData(data);
		}
	}

	public final void loadAll() throws Exception {
		Query query = getPm().newQuery(PlaceData.class);
		query.setFilter("ownerId == paramUserId");
		query.declareParameters("String paramUserId");
		@SuppressWarnings("unchecked")
		List<PlaceData> dataList = (List<PlaceData>) query.execute(this.getUserId());
		this.setDataList(new ArrayList<Data>(dataList));
	}

	public final void save() throws Exception {
		if(this.getData() == null) return;
		this.getPm().makePersistent(this.getData());
		this.getResult().setReturnCode(0);
	}

	public final void delete() throws Exception {
		if(this.getData() == null) return;
		this.getPm().deletePersistent(this.getData());
		this.getResult().setReturnCode(0);
	}

	public final void receive(HttpServletRequest req){
		@SuppressWarnings("unchecked")
		Map<String, String[]> paramMap = req.getParameterMap();
		for(Entry<String, String[]> entry : paramMap.entrySet()){
			if ("place_name".equals(entry.getKey())){
				((PlaceData) this.getData()).setPlaceName(entry.getValue()[0]);
			} else
			if ("waypoint_location".equals(entry.getKey())){
				((PlaceData) this.getData()).setLocation(entry.getValue()[0]);
			} else
			if ("waypoint_url".equals(entry.getKey())) {
				((PlaceData) this.getData()).setSiteUrl(entry.getValue()[0]);
			} else
			if ("waypoint_description".equals(entry.getKey())) {
				((PlaceData) this.getData()).setDescription(entry.getValue()[0]);
			}
		}
	}

	public final void sendOne(HttpSession session) {}

	public final HttpServletResponse sendOne(HttpServletResponse resp) throws Exception {
		PlaceJson json = new PlaceJson();
		json.setPlaceName(((PlaceData) this.getData()).getPlaceName());
		json.setLocation(((PlaceData) this.getData()).getLocation());
		json.setSiteUrl(((PlaceData) this.getData()).getSiteUrl());
		json.setDescription(((PlaceData) this.getData()).getDescription());

		resp.setContentType("application/json; charset=UTF-8");
		JSON.encode(json, resp.getOutputStream());
		return resp;
	}

	public final HttpServletResponse sendAll(HttpServletResponse resp) throws Exception {
		ArrayList<String> placeIdList       = new ArrayList<String>();
		ArrayList<String> placeNameList     = new ArrayList<String>();

		Iterator<Data> iter = this.getDataList().iterator();
		while(iter.hasNext()){
			PlaceData data = (PlaceData) iter.next();
			placeIdList.add(data.getId());
			placeNameList.add(data.getPlaceName());
		}

		PlaceListJson json = new PlaceListJson();
		json.setIdList(placeIdList);
		json.setPlaceNameList(placeNameList);

		resp.setContentType("application/json; charset=UTF-8");
		JSON.encode(json, resp.getOutputStream());
		return resp;
	}
}

