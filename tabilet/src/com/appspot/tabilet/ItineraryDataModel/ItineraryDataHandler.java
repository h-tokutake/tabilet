package com.appspot.tabilet.ItineraryDataModel;

import java.util.ArrayList;
import java.util.Arrays;
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
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;

public class ItineraryDataHandler extends DataHandler {

	public ItineraryDataHandler() {
		super(new ItineraryData());
	}

	public ItineraryDataHandler(ItineraryData data) {
		super(data);
	}

	public final void loadOne(String id) throws Exception {
		if(id == null || "".equals(id)) return;
		ItineraryData data = null;
		Key key = KeyFactory.stringToKey(id);
		data = this.getPm().getObjectById(ItineraryData.class, key);
		if(data == null) return;
		this.setData(this.getPm().detachCopy(data));
	}

	public final void loadAll() throws Exception {
		Query query = this.getPm().newQuery(ItineraryData.class);
		query.setFilter("ownerId == paramUserId");
		query.setOrdering("depTime desc");
		query.declareParameters("String paramUserId");
		@SuppressWarnings("unchecked")
		List<ItineraryData> dataList = (List<ItineraryData>) query.execute(this.getUserId());
		this.setDataList(new ArrayList<Data>(dataList));
	}

	public final void save() throws Exception {
		if(this.getData() == null) return;
		this.getPm().makePersistent(this.getData());
		this.getResult().setReturnCode(0);
		this.getResult().setStrInfo(this.getData().getId());
	}

	public final void delete() throws Exception {
		if(this.getData() == null) return;
		this.getPm().deletePersistent(this.getData());
		this.getResult().setReturnCode(0);
		this.getResult().setStrInfo(this.getData().getId());
	}

	public final boolean checkDuplicate() throws Exception {
		Query query = this.getPm().newQuery(ItineraryData.class);
		query.setFilter("ownerId == paramUserId && summary == paramSummary");
		query.declareParameters("String paramUserId, String paramSummary");
		@SuppressWarnings("unchecked")
		List<ItineraryData> itineraryDataList = (List<ItineraryData>) query.execute(this.getUserId(), this.getData().getSummary());
		if(itineraryDataList.size() == 0) return false;
		Iterator<ItineraryData> iter = itineraryDataList.iterator();
		while(iter.hasNext()) {
			ItineraryData existingData = iter.next();
			if(existingData.isDuplicateOf((ItineraryData) this.getData())) {
				this.getResult().setReturnCode(1);
				return true;
			}
		}
		return false;
	}

	public final void receive(HttpServletRequest req){
		String[] placeNameList = {};
		String[] placePositionList = {};
		String[] placeUrlList = {};
		String[] placeDescriptionList = {};
		String[] dwellTimeList = {};

		@SuppressWarnings("unchecked")
		Map<String, String[]> paramMap = req.getParameterMap();
		for(Entry<String, String[]> entry : paramMap.entrySet()){
			if ("itinerary_summary".equals(entry.getKey())){
				this.getData().setSummary(entry.getValue()[0]);
			} else
			if("itinerary_description".equals(entry.getKey())){
				this.getData().setDescription(entry.getValue()[0]);
			} else
			if("itinerary_deptime".equals(entry.getKey())){
				((ItineraryData) this.getData()).setDepTime(entry.getValue()[0]);
			} else
			if("place_name[]".equals(entry.getKey())){
				placeNameList = entry.getValue();
			} else
			if("place_position[]".equals(entry.getKey())){
				placePositionList = entry.getValue();
			} else
			if("place_siteurl[]".equals(entry.getKey())){
				placeUrlList = entry.getValue();
			} else
			if("place_description[]".equals(entry.getKey())){
				placeDescriptionList = entry.getValue();
			} else
			if("dwell_time[]".equals(entry.getKey())){
				dwellTimeList = entry.getValue();
			}
		}
		((ItinerarySkeletonData) this.getData()).setPlaceNameList(new ArrayList<String>(Arrays.asList(placeNameList)));
		((ItinerarySkeletonData) this.getData()).setPlacePositionList(new ArrayList<String>(Arrays.asList(placePositionList)));
		((ItinerarySkeletonData) this.getData()).setPlaceUrlList(new ArrayList<String>(Arrays.asList(placeUrlList)));
		((ItinerarySkeletonData) this.getData()).setPlaceDescriptionList(new ArrayList<String>(Arrays.asList(placeDescriptionList)));
		((ItineraryData) this.getData()).setDwellTimeList(new ArrayList<String>(Arrays.asList(dwellTimeList)));
	}

	public final void sendOne(HttpSession session){
		String id          = "";
		String summary     = "";
		String description = "";
		String depTime     = "";
		ArrayList<String> placeNameList     = new ArrayList<String>();
		ArrayList<String> placePositionList = new ArrayList<String>();
		ArrayList<String> placeUrlList      = new ArrayList<String>();
		ArrayList<String> placeDescriptionList = new ArrayList<String>();
		ArrayList<String> dwellTimeList     = new ArrayList<String>();

		if(this.getData() != null){
			ItineraryData data = (ItineraryData) this.getData();
			id          = data.getId();
			summary     = data.getSummary();
			description = data.getDescription();
			depTime     = data.getDepTime();
			placeNameList     = data.getPlaceNameList();
			placePositionList = data.getPlacePositionList();
			placeUrlList      = data.getPlaceUrlList();
			placeDescriptionList = data.getPlaceDescriptionList();
			dwellTimeList     = data.getDwellTimeList();
		}
		session.setAttribute("itinerary_id"         , id         );
		session.setAttribute("itinerary_summary"    , summary    );
		session.setAttribute("itinerary_description", description);
		session.setAttribute("itinerary_deptime"    , depTime    );
		session.setAttribute("place_name_list"      , placeNameList.toArray()    );
		session.setAttribute("place_position_list"  , placePositionList.toArray());
		session.setAttribute("place_siteurl_list"   , placeUrlList.toArray()     );
		session.setAttribute("place_description_list", placeDescriptionList.toArray());
		session.setAttribute("dwell_time_list"      , dwellTimeList.toArray()    );
	}

	public final HttpServletResponse sendOne(HttpServletResponse resp) throws Exception { return resp; }

	public final HttpServletResponse sendAll(HttpServletResponse resp) throws Exception {
		ArrayList<String> itineraryIdList          = new ArrayList<String>();
		ArrayList<String> itinerarySummaryList     = new ArrayList<String>();
		ArrayList<String> itineraryDeptimeList     = new ArrayList<String>();
		ArrayList<String> itineraryOriginList      = new ArrayList<String>();
		ArrayList<String> itineraryDestinationList = new ArrayList<String>();

		Iterator<Data> iter = this.getDataList().iterator();
		while(iter.hasNext()){
			ItineraryData data = (ItineraryData) iter.next();
			itineraryIdList.add(data.getId());
			itinerarySummaryList.add(data.getSummary());
			itineraryDeptimeList.add(data.getDepTime());
			itineraryOriginList.add(data.getOriginName());
			itineraryDestinationList.add(data.getDestinationName());
		}

		ItineraryListJson json = new ItineraryListJson();
		json.setIdList(itineraryIdList);
		json.setSummaryList(itinerarySummaryList);
		json.setDepDateTimeList(itineraryDeptimeList);
		json.setOriginList(itineraryOriginList);
		json.setDestinationList(itineraryDestinationList);

		resp.setContentType("application/json; charset=UTF-8");
		JSON.encode(json, resp.getOutputStream());
		return resp;
	}
}
