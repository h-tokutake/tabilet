package com.appspot.tabilet.ItineraryDataModel;

import java.util.ArrayList;

import javax.jdo.annotations.IdentityType;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;

@PersistenceCapable(identityType = IdentityType.APPLICATION, detachable="true")
class ItineraryData extends ItinerarySkeletonData {

	@Persistent private String depTime = "";
	@Persistent private ArrayList<String> dwellTimeList;
	@Persistent private ArrayList<String> waypointCommentList;

	ItineraryData(){
		super();
	}
	ItineraryData(ItinerarySkeletonData skeleton){
		super(skeleton);
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
		this.dwellTimeList = source.getDwellTimeList();
		this.waypointCommentList = source.getWaypointCommentList();
	}
	final boolean isDuplicateOf(ItineraryData other) {
		return (this.isOwnedBy(other.getOwnerId()) && this.getSummary().equals(other.getSummary()) && !this.getId().equals(other.getId()));
	}

	/* getter */
	final String getDepTime() {
		return depTime;
	}
	final ArrayList<String> getDwellTimeList() {
		return dwellTimeList;
	}
	final ArrayList<String> getWaypointCommentList() {
		return waypointCommentList;
	}

	/* setter */
	final void setDepTime(String depTime) {
		this.depTime = depTime;
	}
	final void setDwellTimeList(ArrayList<String> dwellTimeList) {
		this.dwellTimeList = dwellTimeList;
	}
	final void setWaypointCommentList(ArrayList<String> waypointCommentList) {
		this.waypointCommentList = waypointCommentList;
	}


}
