package com.appspot.tabilet.PlaceDataModel;

public class PlaceJson {
	private String placeName = "";
	private String placePosition = "";
	private String siteUrl = "";
	private String description = "";

	/* getter */
	public String getPlaceName() {
		return this.placeName;
	}
	public String getPlacePosition() {
		return this.placePosition;
	}
	public String getSiteUrl() {
		return this.siteUrl;
	}
	public String getDescription() {
		return this.description;
	}

	/* setter */
	public void setPlaceName(String placeName) {
		this.placeName = placeName;
	}
	public void setPlacePosition(String placePosition) {
		this.placePosition = placePosition;
	}
	public void setSiteUrl(String siteUrl) {
		this.siteUrl = siteUrl;
	}
	public void setDescription(String description) {
		this.description = description;
	}
}
