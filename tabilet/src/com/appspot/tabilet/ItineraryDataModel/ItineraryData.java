package com.appspot.tabilet.ItineraryDataModel;

import java.util.ArrayList;

import javax.jdo.annotations.IdentityType;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;

@PersistenceCapable(identityType = IdentityType.APPLICATION, detachable="true")
class ItineraryData extends ItinerarySkeletonData {

	@Persistent private String depDate = "";
	@Persistent private String depTime = "";
	@Persistent private ArrayList<String> placeDepDateList;
	@Persistent private ArrayList<String> placeDepTimeList;
	@Persistent private ArrayList<String> waypointCommentList;

	ItineraryData(){
		super();
		this.placeDepDateList = new ArrayList<String>();
		this.placeDepTimeList = new ArrayList<String>();
		this.waypointCommentList = new ArrayList<String>();
	}
	ItineraryData(ItinerarySkeletonData skeleton){
		super(skeleton);
		this.placeDepDateList = new ArrayList<String>();
		this.placeDepTimeList = new ArrayList<String>();
		this.waypointCommentList = new ArrayList<String>();
	}

	/* method */
	ItinerarySkeletonData getSkeleton(){
		ItinerarySkeletonData skeleton = new ItinerarySkeletonData();
		skeleton.setSummary(this.getSummary());
		skeleton.setDescription(this.getDescription());
		skeleton.setPlaceNameList(this.getPlaceNameList());
		skeleton.setPlacePositionList(this.getPlacePositionList());
		return skeleton;
	}
	final boolean equals(ItineraryData other){
		//TODO
		return true;
	}
	final void setAll(ItineraryData source) {
		super.setAll(source);
		this.placeDepDateList = source.getPlaceDepDateList();
		this.placeDepTimeList = source.getPlaceDepTimeList();
		this.waypointCommentList = source.getWaypointCommentList();
	}
	final void upgrade() {
		//Here, implement some functions to upgrade data format.
	}
	final boolean isDuplicateOf(ItineraryData other) {
		return (this.isOwnedBy(other.getOwnerId()) && this.getSummary().equals(other.getSummary()) && !this.getId().equals(other.getId()));
	}
	final String getDepDate() {
		return this.depDate.replace('T', ' ');
	}
	final String getDepTime() {
		return this.depTime.replace('T', ' ');
	}
	final void setDepDate(String depDate) {
		this.depDate = depDate;
	}
	final void setDepTime(String depTime) {
		this.depTime = depTime;
	}

	/* getter */
	final ArrayList<String> getPlaceDepDateList() {
		return placeDepDateList;
	}
	final ArrayList<String> getPlaceDepTimeList() {
		return placeDepTimeList;
	}
	final ArrayList<String> getWaypointCommentList() {
		return waypointCommentList;
	}

	/* setter */
	final void setPlaceDepDateList(ArrayList<String> placeDepDateList) {
		this.placeDepDateList = placeDepDateList;
		this.setDepDate(placeDepDateList.get(0));
	}
	final void setPlaceDepTimeList(ArrayList<String> placeDepTimeList) {
		this.placeDepTimeList = placeDepTimeList;
		this.setDepTime(placeDepTimeList.get(0));
	}
	final void setWaypointCommentList(ArrayList<String> waypointCommentList) {
		this.waypointCommentList = waypointCommentList;
	}


}
