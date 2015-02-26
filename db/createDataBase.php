<?php
  $host = 'localhost';
  $username = 'root';
  $passwd = '1234abcd';

  $con=mysqli_connect($host,$username,$passwd);
// Check connection
if (mysqli_connect_errno())
  {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
  }

// Create database
$sql="CREATE DATABASE myblog";
if (mysqli_query($con,$sql))
  {
  echo "Database my_db created successfully";
  }
else
  {
  echo "Error creating database: " . mysqli_error($con);
  }

