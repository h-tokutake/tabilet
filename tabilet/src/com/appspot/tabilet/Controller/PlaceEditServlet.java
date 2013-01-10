package com.appspot.tabilet.Controller;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.appspot.tabilet.PlaceDataModel.PlaceDataHandler;

@SuppressWarnings("serial")
public class PlaceEditServlet extends HttpServlet {
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {

		PlaceDataHandler handler = new PlaceDataHandler();
		try {
			handler.loadAll();
			resp = handler.sendAll(resp);
		} catch (Exception e) {
			handler.getResult().setReturnCode(1);
		} finally {
			handler.close();
		}
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {

		PlaceDataHandler handler = new PlaceDataHandler();

		String operation = req.getParameter("place_operation");
		try {
			String placeName = req.getParameter("place_name");
			handler.loadOne(placeName);
			if("place_save".equals(operation)){
				handler.receive(req);
				handler.save();
			} else
			if("place_delete".equals(operation)){
				handler.delete();
			} else
			if("place_get".equals(operation)){
				resp = handler.sendOne(resp);
			}
		} catch (Exception e) {
			handler.getResult().setReturnCode(1);
		} finally {
			handler.close();
		}
		if("place_save".equals(operation) || "place_delete".equals(operation)){
			resp = handler.sendResult(resp);
		}
	}
}
