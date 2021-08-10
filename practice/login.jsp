<%@ page language="java" contentType="text/html; charset=EUC-KR"
	pageEncoding="EUC-KR"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="EUC-KR">
<title>Insert title here</title>
<link rel="stylesheet" type="text/css" href="myCSS.css">
</head>
<body>
	<form action="oginService" method="post">
		<div>
			<fieldset>
				<legend>
					<h1>로그인 페이지</h1>
				</legend>
				<table>
					<tr>
						<td>아이디</td>
						<td><input placeholder="아이디 입력" type="text" name="id"></td>
					</tr>
					<tr>
						<td>비밀번호</td>
						<td><input placeholder="비밀번호 입력" type="password" name="pw"></td>
					</tr>
					<tr>
						<td colspan="2">
						<input type="submit" value="로그인">
						<input type="reset" value="초기화">
						</td>
					</tr>
				</table>
			</fieldset>
		</div>
	</form>
</body>
</html>