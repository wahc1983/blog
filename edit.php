<?php

include 'db/config.php';

$_id=$_REQUEST[ 'id' ];
$method=$_REQUEST[ 'method' ];

$sql="select * from blogs where id='$_id'";
//echo $sql;

if ($result = $objMysqli->query($sql)) {
   // $numR=$result->num_rows;

    $row = $result->fetch_assoc();
    $title = $row[ 'title' ];
    $content = $row[ 'content' ];

}

include '_form.html.php';





