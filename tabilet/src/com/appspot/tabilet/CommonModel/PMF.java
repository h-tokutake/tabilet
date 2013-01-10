package com.appspot.tabilet.CommonModel;

import javax.jdo.JDOHelper;
import javax.jdo.PersistenceManagerFactory;

public final class PMF {
	private static final PersistenceManagerFactory pmfInterface = JDOHelper.getPersistenceManagerFactory("transactions-optional");
	public PMF() { }
	public static PersistenceManagerFactory get(){
		return pmfInterface;
	}

}
