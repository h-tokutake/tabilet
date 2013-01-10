package com.appspot.tabilet.PlaceDataModel;

import java.util.ArrayList;

public class PlaceListJson {
	private ArrayList<String> idList;
	private ArrayList<String> placeNameList;

	/* getter */
	public final ArrayList<String> getIdList() {
		return idList;
	}
	public final ArrayList<String> getPlaceNameList() {
		return placeNameList;
	}

	/* setter */
	public final void setIdList(ArrayList<String> idList) {
		this.idList = idList;
	}
	public final void setPlaceNameList(ArrayList<String> placeNameList) {
		this.placeNameList = placeNameList;
	}
}
