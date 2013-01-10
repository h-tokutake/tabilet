package com.appspot.tabilet.Controller;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;

public class UserFilter implements Filter {

	@Override
	public void init(FilterConfig arg0) throws ServletException {}

	@Override
	public void destroy() {}

	@Override
	public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain) throws IOException, ServletException {

		UserService userService = UserServiceFactory.getUserService();
		if (userService != null && userService.isUserLoggedIn()) {
			User user = userService.getCurrentUser();
			req.setAttribute("user", user);

			/* ニックネームを保存する */
			if(user.getNickname() != null && !"".equals(user.getNickname())) {
				req.setAttribute("nickname", user.getNickname());
			} else if (user.getEmail() != null && !"".equals(user.getEmail())) {
				req.setAttribute("nickname", user.getEmail());
			} else {
				req.setAttribute("nickname", user.getUserId());
			}
		}
		chain.doFilter(req, resp);
	}
}
