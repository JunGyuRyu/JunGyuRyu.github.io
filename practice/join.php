<?php 
header("Content-Type: text/html; charset=UTF-8");
$conn = new mysqli("localhost","root","","web");
mysqli_query($conn,'SET NAMES utf8');
$id = $_POST['id'];
$password = $_POST['password'];
$nickname = $_POST['nickname'];
$sql = "insert into member (id,password,nickname) values('$id','$password','$nickname')";
$res = $conn->query($sql);
echo "<script>location.href='login.html';</script>";
?>