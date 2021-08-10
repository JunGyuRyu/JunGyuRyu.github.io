package com.controller;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.model.MemberDAO;
import com.model.MemberDTO;

@WebServlet("/loginService")
public class loginService extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void service(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		String id = request.getParameter("id");
		String pw = request.getParameter("pw");

		MemberDAO dao = new MemberDAO();
		MemberDTO dto = new MemberDTO(id, pw);
		MemberDTO info = dao.login(dto);

		if (info != null) {
			Cookie cookie1 = new Cookie("id", info.getId());
			Cookie cookie2 = new Cookie("pw", info.getPw());
			Cookie cookie3 = new Cookie("tel", info.getTel());

			response.addCookie(cookie1);
			response.addCookie(cookie2);
			response.addCookie(cookie3);

			response.sendRedirect("loginSuccess.jsp");

		} else {
			response.sendRedirect("login.jsp");
		}
	}

}
