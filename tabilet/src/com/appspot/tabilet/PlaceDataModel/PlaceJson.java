package com.appspot.tabilet.PlaceDataModel;

public class PlaceJson {
	private String placeName = "";
	private String location = "";
	private String siteUrl = "";
	private String description = "";

	/* getter */
	public String getPlaceName() {
		return this.placeName;
	}
	public String getLocation() {
		return this.location;
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
	public void setLocation(String location) {
		this.location = location;
	}
	public void setSiteUrl(String siteUrl) {
		this.siteUrl = siteUrl;
	}
	public void setDescription(String description) {
		this.description = description;
	}
}
