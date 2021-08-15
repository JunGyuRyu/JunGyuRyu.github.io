<!DOCTYPE html>
<html>
<body>
<?php header("Content-Type: text/html; charset=UTF-8");
session_start(); ?>
<?php if( (!isset($_SESSION['id'])) && (!isset($_SESSION['nickname'])) ){?>
<a href="join.html">회원가입</a><br>
<a href="login.html">로그인</a><br>
<?php } else {?>
<a href="logout.php">로그아웃</a><br>
<?php } ?>
</body>
</html>
