package com.appspot.tabilet.PlaceDataModel;

import javax.jdo.annotations.IdentityType;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;

import com.appspot.tabilet.CommonModel.Data;

@PersistenceCapable(identityType = IdentityType.APPLICATION, detachable="true")
class PlaceData extends Data {

	@Persistent private String placeName = "";
	@Persistent private String placePosition = "";
	@Persistent private String siteUrl = "";

	/* コンストラクタ */
	PlaceData(){
	}
	PlaceData(String placeName, String placePosition, String siteUrl) {
		this.placeName     = placeName;
		this.placePosition = placePosition;
		this.siteUrl       = siteUrl;
	}

	/* method */
	final boolean equals(PlaceData other){
		//TODO
		return true;
	}
	final boolean isDuplicateOf(PlaceData other) {
		return (this.getPlaceName().equals(other.getPlaceName()) && !this.getId().equals(other.getId()));
	}

	/* getter */
	final String getPlaceName() {
		return this.placeName;
	}
	final String getPlacePosition() {
		return this.placePosition;
	}
	final String getSiteUrl() {
		return this.siteUrl;
	}

	/* setter */
	final void setPlaceName(String placeName){
		this.placeName = placeName;
	}
	final void setPlacePosition(String placePosition) {
		this.placePosition = placePosition;
	}
	final void setSiteUrl(String siteUrl) {
		this.siteUrl = siteUrl;
	}
}
