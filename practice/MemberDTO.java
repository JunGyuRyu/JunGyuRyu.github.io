package com.model;

public class MemberDTO {
	private String id;
	private String pw;
	private String tel;

	public MemberDTO(String id, String pw, String tel) {
		this.id = id;
		this.pw = pw;
		this.tel = tel;
	}

	public MemberDTO(String id, String pw) {
		this.id = id;
		this.pw = pw;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getPw() {
		return pw;
	}

	public void setPw(String pw) {
		this.pw = pw;
	}

	public String getTel() {
		return tel;
	}

	public void setTel(String tel) {
		this.tel = tel;
	}

}