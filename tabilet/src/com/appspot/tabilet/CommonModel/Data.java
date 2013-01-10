package com.appspot.tabilet.CommonModel;

import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.IdentityType;
import javax.jdo.annotations.Inheritance;
import javax.jdo.annotations.InheritanceStrategy;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;

@PersistenceCapable(identityType = IdentityType.APPLICATION, detachable="true")
@Inheritance(strategy = InheritanceStrategy.SUBCLASS_TABLE)
public class Data {
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
	@PrimaryKey() protected Key id;

	@Persistent private String ownerId = "";
	@Persistent private String creationTime = "";
	@Persistent private String modificationTime = "";
	@Persistent private String summary = "";
	@Persistent private String description = "";

	public Data(){
		//TODO
	}

	/* method */
	public final boolean isOwnedBy(String userId){
		return userId.equals(this.ownerId);
	}
	public final boolean isCreatedBefore(String dateTime){
		//TODO
		return true;
	}
	public final boolean isCreatedAfter(String dateTime){
		//TODO
		return true;
	}
	public final boolean isModifiedBefore(String dateTime){
		//TODO
		return true;
	}
	public final boolean isModifiedAfter(String dateTime){
		//TODO
		return true;
	}
	public boolean equals(Data other){
		//TODO
		return true;
	}
	public void setAll(Data source) {
		this.ownerId = source.getOwnerId();
		this.creationTime = source.getCreationTime();
		this.modificationTime = source.getModificationTime();
		this.summary = source.getSummary();
		this.description = source.getDescription();
	}

	/* getter */
	public final String getId() {
		if(id == null) return "";
		return KeyFactory.keyToString(id);
	}
	public final String getOwnerId() {
		return ownerId;
	}
	public final String getCreationTime() {
		return creationTime;
	}
	public final String getModificationTime() {
		return modificationTime;
	}
	public final String getSummary() {
		return summary;
	}
	public final String getDescription() {
		return description;
	}

	/* setter */
	public final void setOwnerId(String userId) {
		this.ownerId = userId;
	}
	public final void setSummary(String summary) {
		this.summary = summary;
	}
	public final void setDescription(String description) {
		this.description = description;
	}
}
