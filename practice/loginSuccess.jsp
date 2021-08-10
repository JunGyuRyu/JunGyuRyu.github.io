<%@ page language="java" contentType="text/html; charset=EUC-KR"
	pageEncoding="EUC-KR"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="EUC-KR">
<title>Insert title here</title>
</head>
<body>
	<%
		Cookie[] cookies = request.getCookies(); // 쿠키 여러 개를 배열 형태로 받아온다.

		for (int i = 0; i < cookies.length; i++) {
			if (!cookies[i].getName().equals("JSESSIONID")) {
				out.print(cookies[i].getName() + " : ");
				out.print(cookies[i].getValue() + "<br>");
			}
		}
	%>
</body>
</html>