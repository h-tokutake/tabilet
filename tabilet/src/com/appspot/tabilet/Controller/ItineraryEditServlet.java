package com.appspot.tabilet.Controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.*;

import com.appspot.tabilet.ItineraryDataModel.ItineraryDataHandler;
import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;

@SuppressWarnings("serial")
public class ItineraryEditServlet extends HttpServlet {
    private static final Map<String, String> openIdProviders;
    static {
        openIdProviders = new HashMap<String, String>();
        openIdProviders.put("Google"    , "https://www.google.com/accounts/o8/id");
        openIdProviders.put("YahooJAPAN", "yahoo.co.jp");
        openIdProviders.put("Yahoo"     , "yahoo.com");
        openIdProviders.put("mixi"      , "mixi.jp");
        openIdProviders.put("AOL"       , "aol.com");
        openIdProviders.put("MyOpenId"  , "myopenid.com");
    }

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {

		UserService userService = UserServiceFactory.getUserService();
		User user = userService.getCurrentUser();
		Set<String> attributes = new HashSet<String>();

		if (user != null) {
			req.setAttribute("logout_url", userService.createLogoutURL(req.getRequestURI()));
		}
		for (String providerName : openIdProviders.keySet()) {
			String providerUrl = openIdProviders.get(providerName);
			String loginUrl = userService.createLoginURL(req.getRequestURI(), null, providerUrl, attributes);
			req.setAttribute(providerName, loginUrl);
		}

		dispatchScreen(req, resp);
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
		throws ServletException, IOException {

		String itineraryId = req.getParameter("itinerary_id");
		String operation = req.getParameter("itinerary_operation");
		ItineraryDataHandler handler = new ItineraryDataHandler();
		HttpSession session = req.getSession();

		try {
			handler.loadOne(itineraryId);
			if("itinerary_edit".equals(operation)){
				handler.sendOne(session);
			} else
			if("itinerary_delete".equals(operation)){
				handler.delete();
			} else
			if("itinerary_save".equals(operation)){
				handler.receive(req);
				if(!handler.checkDuplicate()) {
					handler.save();
				}
			}
		} catch (Exception e) {
			handler.getResult().setReturnCode(1);
		} finally {
			handler.close();
		}
		if("itinerary_edit".equals(operation)){
			dispatchScreen(req, resp);
			session.invalidate();
		} else
			resp = handler.sendResult(resp);
	}

	private void dispatchScreen(HttpServletRequest req, HttpServletResponse resp)
		throws ServletException, IOException {

		String userAgent = req.getHeader("user-agent");
		RequestDispatcher dispatcher;

		if (userAgent.indexOf("iPhone") != -1 ||
			userAgent.indexOf("iPad") != -1 ||
			userAgent.indexOf("Android") != -1 ||
			userAgent.indexOf("Windows Phone") != -1)
		{
			dispatcher = getServletContext().getRequestDispatcher("/WEB-INF/mobile/ItineraryEditView.jsp");
		}
		else
		{
			dispatcher = getServletContext().getRequestDispatcher("/WEB-INF/mobile/ItineraryEditView.jsp");
		}
		dispatcher.forward(req, resp);
	}
}
