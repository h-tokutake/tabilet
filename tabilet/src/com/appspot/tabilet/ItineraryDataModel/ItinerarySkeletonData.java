package com.appspot.tabilet.ItineraryDataModel;

import java.util.ArrayList;

import javax.jdo.annotations.IdentityType;
import javax.jdo.annotations.Inheritance;
import javax.jdo.annotations.InheritanceStrategy;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;

import com.appspot.tabilet.CommonModel.Data;

@PersistenceCapable(identityType = IdentityType.APPLICATION, detachable="true")
@Inheritance(strategy = InheritanceStrategy.SUBCLASS_TABLE)
class ItinerarySkeletonData extends Data {

	@Persistent private ArrayList<String> placeNameList;
	@Persistent private ArrayList<String> placePositionList;
	@Persistent private ArrayList<String> placeUrlList;
	@Persistent private ArrayList<String> placeDescriptionList;

	ItinerarySkeletonData(){
		super();
	}
	ItinerarySkeletonData(
		ArrayList<String> placeNameList,
		ArrayList<String> placePositionList,
		ArrayList<String> placeUrlList,
		ArrayList<String> placeDescriptionList
	){
		super();
		this.placeNameList     = placeNameList;
		this.placePositionList = placePositionList;
		this.placeUrlList      = placeUrlList;
		this.placeDescriptionList = placeDescriptionList;
	}
	ItinerarySkeletonData(ItinerarySkeletonData skeleton){
		super();
		this.setSummary(skeleton.getSummary());
		this.setDescription(skeleton.getDescription());
		this.setPlaceNameList(skeleton.getPlaceNameList());
		this.setLocationList(skeleton.getLocationList());
		this.setPlaceUrlList(skeleton.getPlaceUrlList());
		this.setPlaceDescriptionList(skeleton.getPlaceDescriptionList());
	}

	/* method */
	final void setSkeleton(ItinerarySkeletonData skeleton){
		this.setSummary(skeleton.getSummary());
		this.setDescription(skeleton.getDescription());
		this.setPlaceNameList(skeleton.getPlaceNameList());
		this.setLocationList(skeleton.getLocationList());
		this.setPlaceUrlList(skeleton.getPlaceUrlList());
		this.setPlaceDescriptionList(skeleton.getPlaceDescriptionList());
	}

	final String getOriginName(){
		if (this.placeNameList.size() == 0) return "";
		return this.placeNameList.get(0);
	}

	final String getOriginPosition(){
		if (this.placePositionList.size() == 0) return "";
		return this.placePositionList.get(0);
	}

	final String getDestinationName(){
		if (this.placeNameList.size() <= 1) return "";
		return this.placeNameList.get(this.placeNameList.size() - 1);
	}

	final String getDestinationPosition(){
		if (this.placePositionList.size() <= 1) return "";
		return this.placePositionList.get(this.placePositionList.size() - 1);
	}

	final String getPlaceName(int index){
		return this.placeNameList.get(index);
	}

	final String getLocation(int index){
		return this.placePositionList.get(index);
	}

	final void setPlaceName(int index, String placeName){
		this.placeNameList.set(index, placeName);
	}

	final void setLocation(int index, String location){
		this.placePositionList.set(index, location);
	}

	final void addPlaceName(String placeName){
		this.placeNameList.add(placeName);
	}

	final void addLocation(String location){
		this.placePositionList.add(location);
	}

	final void removePlaceName(int index){
		this.placeNameList.remove(index);
	}

	final void removeLocation(int index){
		this.placePositionList.remove(index);
	}
	void setAll(ItinerarySkeletonData source) {
		super.setAll(source);
		this.placeNameList = source.getPlaceNameList();
		this.placePositionList = source.getLocationList();
	}

	/* getter */
	final ArrayList<String> getPlaceNameList(){
		return this.placeNameList;
	}
	final ArrayList<String> getLocationList(){
		return this.placePositionList;
	}
	final ArrayList<String> getPlaceUrlList() {
		return this.placeUrlList;
	}
	final ArrayList<String> getPlaceDescriptionList() {
		return this.placeDescriptionList;
	}

	/* setter */
	final void setPlaceNameList(ArrayList<String> placeNameList) {
		this.placeNameList = placeNameList;
	}
	final void setLocationList(ArrayList<String> placePositionList) {
		this.placePositionList = placePositionList;
	}
	final void setPlaceUrlList(ArrayList<String> placeUrlList) {
		this.placeUrlList = placeUrlList;
	}
	final void setPlaceDescriptionList(ArrayList<String> placeDescriptionList) {
		this.placeDescriptionList = placeDescriptionList;
	}
}
