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

