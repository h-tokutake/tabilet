package com.appspot.tabilet.Controller;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.appspot.tabilet.ItineraryDataModel.ItineraryDataHandler;

@SuppressWarnings("serial")
public class ItineraryListServlet extends HttpServlet {
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {

		ItineraryDataHandler handler = new ItineraryDataHandler();
		try {
			handler.loadAll();
			resp = handler.sendAll(resp);
		} catch (Exception e) {
			handler.getResult().setReturnCode(1);
		} finally {
			handler.close();
		}
	}
}
