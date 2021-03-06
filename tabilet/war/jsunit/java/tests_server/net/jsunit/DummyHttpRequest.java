package net.jsunit;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletInputStream;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.security.Principal;
import java.util.*;

public class DummyHttpRequest implements HttpServletRequest {
    protected Map parametersToValues;
    protected Map<String, Object> attributesToValues = new HashMap<String, Object>();
    private String ipAddress;
    private String host;
    private List<Cookie> cookies = new ArrayList<Cookie>();

    public DummyHttpRequest(Map parametersToValues) {
        this.parametersToValues = parametersToValues;
    }

    public DummyHttpRequest() {
        this(new HashMap());
    }

    public void addCookie(Cookie cookie) {
        cookies.add(cookie);
    }

    public String getAuthType() {
        return null;
    }

    public Cookie[] getCookies() {
        return cookies.toArray(new Cookie[cookies.size()]);
    }

    public long getDateHeader(String name) {
        return 0;
    }

    public String getHeader(String name) {
        return null;
    }

    public Enumeration getHeaders(String name) {
        return null;
    }

    public Enumeration getHeaderNames() {
        return null;
    }

    public int getIntHeader(String name) {
        return 0;
    }

    public String getMethod() {
        return null;
    }

    public String getPathInfo() {
        return null;
    }

    public String getPathTranslated() {
        return null;
    }

    public String getContextPath() {
        return null;
    }

    public String getQueryString() {
        return null;
    }

    public String getRemoteUser() {
        return null;
    }

    public boolean isUserInRole(String role) {
        return false;
    }

    public Principal getUserPrincipal() {
        return null;
    }

    public String getRequestedSessionId() {
        return null;
    }

    public String getRequestURI() {
        return null;
    }

    public StringBuffer getRequestURL() {
        return null;
    }

    public String getServletPath() {
        return null;
    }

    public HttpSession getSession(boolean create) {
        return null;
    }

    public HttpSession getSession() {
        return null;
    }

    public boolean isRequestedSessionIdValid() {
        return false;
    }

    public boolean isRequestedSessionIdFromCookie() {
        return false;
    }

    public boolean isRequestedSessionIdFromURL() {
        return false;
    }

    public Object getAttribute(String name) {
        return attributesToValues.get(name);
    }

    public Enumeration getAttributeNames() {
        return null;
    }

    public String getCharacterEncoding() {
        return null;
    }

    public void setCharacterEncoding(String env) throws UnsupportedEncodingException {
    }

    public int getContentLength() {
        return 0;
    }

    public String getContentType() {
        return null;
    }

    public ServletInputStream getInputStream() throws IOException {
        return null;
    }

    public String getParameter(String name) {
        Object object = parametersToValues.get(name);
        if (object instanceof String) return (String) object;
        if (object instanceof String[]) return ((String[]) object)[0];
        return null;
    }

    public Enumeration getParameterNames() {
        return null;
    }

    public String[] getParameterValues(String name) {
        Object object = parametersToValues.get(name);
        if (object instanceof String) return new String[]{(String) object};
        if (object instanceof String[]) return (String[]) object;
        return null;
    }

    public Map getParameterMap() {
        return null;
    }

    public String getProtocol() {
        return null;
    }

    public String getScheme() {
        return null;
    }

    public String getServerName() {
        return null;
    }

    public int getServerPort() {
        return 0;
    }

    public BufferedReader getReader() throws IOException {
        return null;
    }

    public String getRemoteAddr() {
        return ipAddress;
    }

    public String getRemoteHost() {
        return host;
    }

    public void setAttribute(String name, Object object) {
        attributesToValues.put(name, object);
    }

    public void removeAttribute(String name) {
    }

    public Locale getLocale() {
        return null;
    }

    public Enumeration getLocales() {
        return null;
    }

    public boolean isSecure() {
        return false;
    }

    public RequestDispatcher getRequestDispatcher(String path) {
        return null;
    }

    public String getRealPath(String path) {
        return null;
    }

    public boolean isRequestedSessionIdFromUrl() {
        return false;
    }

    public int getRemotePort() {
        return 0;
    }

    public String getLocalName() {
        return null;
    }

    public String getLocalAddr() {
        return null;
    }

    public int getLocalPort() {
        return 0;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public void setHost(String host) {
        this.host = host;
    }
}
