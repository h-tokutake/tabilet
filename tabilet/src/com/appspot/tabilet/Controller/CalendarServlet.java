package com.appspot.tabilet.Controller;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.oauth.OAuthRequestException;
import com.google.appengine.api.oauth.OAuthService;
import com.google.appengine.api.oauth.OAuthServiceFactory;

@SuppressWarnings("serial")
public class CalendarServlet extends HttpServlet {
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {

		String user = "";
		try {
			OAuthService oauth = OAuthServiceFactory.getOAuthService();
			user = oauth.getCurrentUser().toString();
		} catch (OAuthRequestException e) {
			user = e.toString();
		}

		resp.setContentType("text/html; charset=Shift_JIS");

		PrintWriter out = resp.getWriter();
		out.println("<html>");
		out.println("<head>");
		out.println("<title>ÉJÉåÉìÉ_Å[</title>");
		out.println("</head>");
		out.println("<body>");
		out.println(user);
		out.println("</body>");
		out.println("</html>");
	}
}
