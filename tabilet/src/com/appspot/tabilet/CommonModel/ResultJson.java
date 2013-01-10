package com.appspot.tabilet.CommonModel;

public class ResultJson {
	private int returnCode;
	private String strInfo;

	public ResultJson() {
		this.returnCode = -1;
		this.strInfo = "";
	}

	/* getter */
	public final int getReturnCode() {
		return this.returnCode;
	}
	public final String getStrInfo() {
		return this.strInfo;
	}

	/* setter */
	public final void setReturnCode(int returnCode) {
		this.returnCode = returnCode;
	}
	public final void setStrInfo(String strInfo) {
		this.strInfo = strInfo;
	}
}
