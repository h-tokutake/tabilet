package com.appspot.tabilet.CommonModel;

import java.io.IOException;
import java.util.ArrayList;

import javax.jdo.PersistenceManager;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;

import net.arnx.jsonic.JSON;
import net.arnx.jsonic.JSONException;

public abstract class DataHandler {
	private ArrayList<Data> dataList;
	private ResultJson result;
	private PersistenceManager pm;
	private String userId = "";

	/* constructor */
	public DataHandler(Data data){
		UserService userService = UserServiceFactory.getUserService();
		if(userService.isUserLoggedIn()) {
			this.userId = userService.getCurrentUser().getUserId();
			data.setOwnerId(this.userId);
		} else {
			data.setOwnerId("");
		}

		this.dataList = new ArrayList<Data>();
		this.dataList.add(data);
		this.pm = PMF.get().getPersistenceManager();
		this.result = new ResultJson();
	}

	/* methods */
	public final boolean hasSomeData(){
		return (this.dataList.size() != 0);
	}

	public final ResultJson getResult() {
		return this.result;
	}

	public final HttpServletResponse sendResult(HttpServletResponse resp) {
		resp.setContentType("application/json; charset=UTF-8");
		try {
			JSON.encode(this.result, resp.getOutputStream());
		} catch (JSONException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return resp;
	}

	public final void close() {
		this.pm.close();
	}

	/* getter */
	public final Data getData(){;
		return this.dataList.get(0);
	}
	public final ArrayList<Data> getDataList(){
		return this.dataList;
	}
	public final PersistenceManager getPm() {
		return this.pm;
	}
	public final String getUserId() {
		return userId;
	}

	/* setter */
	public final void setData(Data data){
		this.dataList.set(0, data);
	}
	public final void setDataList(ArrayList<Data> dataList) {
		this.dataList = dataList;
	}

	/* abstract methods */
	public abstract void loadOne(String key) throws Exception;;
	public abstract void loadAll() throws Exception;
	public abstract void save() throws Exception;
	public abstract void delete() throws Exception;
	public abstract void receive(HttpServletRequest req);
	public abstract void sendOne(HttpSession session);
	public abstract HttpServletResponse sendOne(HttpServletResponse resp) throws Exception;
	public abstract HttpServletResponse sendAll(HttpServletResponse resp) throws Exception;
}
