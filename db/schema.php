<?php
  $host = 'localhost';
  $username = 'root';
  $passwd = '1234abcd';
  $dbname = 'myblog';
  
  $objMysqli = new mysqli( $host, $username, $passwd, $dbname );

// Check connection
  if ( $objMysqli->connect_errno ) {
    echo 'Failed Connection!<br />' . "\n";
    echo 'ERROR ' . $objMysqli->connect_errno . ' (' . $objMysqli->sqlstate . ') : ' . $objMysqli->connect_error;
    exit( 0 );
  }

  // Create table
$sql="CREATE TABLE blogs(
id INT NOT NULL AUTO_INCREMENT, 
PRIMARY KEY(id),
title varchar(255),
content text)";

// Execute query
if (mysqli_query($objMysqli,$sql))
  {
  echo "Table blogs created successfully";
  }
else
  {
  echo "Error creating table blogs: " . mysqli_error($objMysqli);
  }
  
  
  // Create table
$sql="CREATE TABLE comments(
id INT NOT NULL AUTO_INCREMENT, 
PRIMARY KEY(id),
blog_id INT NOT NULL default 0,
content text)";

// Execute query
if (mysqli_query($objMysqli,$sql))
  {
  echo "Table comments created successfully";
  }
else
  {
  echo "Error creating table comments: " . mysqli_error($objMysqli);
  }

  $objMysqli->close();
