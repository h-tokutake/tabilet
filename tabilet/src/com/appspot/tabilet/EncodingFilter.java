package com.appspot.tabilet;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

public class EncodingFilter implements Filter {
	private String encoding = null;
	
	public void init(FilterConfig config) throws ServletException {
		encoding = config.getInitParameter("encoding");
	}

	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws ServletException, IOException {
		request.setCharacterEncoding(encoding);
		chain.doFilter(request, response);
	}
	
	public void destroy() {
		encoding = null;
	}
}
