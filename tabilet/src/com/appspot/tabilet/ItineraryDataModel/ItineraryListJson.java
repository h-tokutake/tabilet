package com.appspot.tabilet.ItineraryDataModel;

import java.util.ArrayList;

public class ItineraryListJson {
	private ArrayList<String> idList;
	private ArrayList<String> depDateList;
	private ArrayList<String> depTimeList;
	private ArrayList<String> summaryList;
	private ArrayList<String> originList;
	private ArrayList<String> destinationList;

	public final ArrayList<String> getIdList() {
		return idList;
	}
	public final void setIdList(ArrayList<String> idList) {
		this.idList = idList;
	}
	public final ArrayList<String> getDepDateList() {
		return depDateList;
	}
	public final void setDepDateList(ArrayList<String> depDateList) {
		this.depDateList = depDateList;
	}
	public final ArrayList<String> getDepTimeList() {
		return depTimeList;
	}
	public final void setDepTimeList(ArrayList<String> depTimeList) {
		this.depTimeList = depTimeList;
	}
	public final ArrayList<String> getSummaryList() {
		return summaryList;
	}
	public final void setSummaryList(ArrayList<String> summaryList) {
		this.summaryList = summaryList;
	}
	public final ArrayList<String> getOriginList() {
		return originList;
	}
	public final void setOriginList(ArrayList<String> originList) {
		this.originList = originList;
	}
	public final ArrayList<String> getDestinationList() {
		return destinationList;
	}
	public final void setDestinationList(ArrayList<String> destinationList) {
		this.destinationList = destinationList;
	}
}
