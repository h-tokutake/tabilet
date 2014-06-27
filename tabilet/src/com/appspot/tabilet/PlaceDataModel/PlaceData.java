package com.appspot.tabilet.PlaceDataModel;

import javax.jdo.annotations.IdentityType;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;

import com.appspot.tabilet.CommonModel.Data;

@PersistenceCapable(identityType = IdentityType.APPLICATION, detachable="true")
class PlaceData extends Data {

	@Persistent private String placeName = "";
	@Persistent private String location = "";
	@Persistent private String siteUrl = "";

	PlaceData(){
	}
	PlaceData(String placeName, String location, String siteUrl) {
		this.placeName     = placeName;
		this.location = location;
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
	final String getLocation() {
		return this.location;
	}
	final String getSiteUrl() {
		return this.siteUrl;
	}

	/* setter */
	final void setPlaceName(String placeName){
		this.placeName = placeName;
	}
	final void setLocation(String location) {
		this.location = location;
	}
	final void setSiteUrl(String siteUrl) {
		this.siteUrl = siteUrl;
	}
}
