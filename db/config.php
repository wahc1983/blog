<?php
  $host = 'mysql.serversfree.com';
  $username = 'u650082327_wach';
  $passwd = '1234abcd';
  $dbname = 'u650082327_mblog';
  
  $objMysqli = new mysqli( $host, $username, $passwd, $dbname );

// Check connection
  if ( $objMysqli->connect_errno ) {
    echo 'Failed Connection!<br />' . "\n";
    echo 'ERROR ' . $objMysqli->connect_errno . ' (' . $objMysqli->sqlstate . ') : ' . $objMysqli->connect_error;
    exit( 0 );
  }

