<?php
  if ( isset( $_GET[ 'deactivate' ] ) ) {
    header( 'HTTP/1.0 404 Not Found' );
    exit(0);
  }
  
  ini_set( 'display_errors', '1' );
  ini_set( 'display_startup_errors', '1' );

//include database configuration
include '../db/config.php';
//selecting records
$sql="select id, title, content from blogs";
//query the database
if ($result = $objMysqli->query($sql)) {
    $numR=$result->num_rows;

}
//count how many records found
if($numR>0){ //check if more than 0 record found

?>

<table border='1'>
<tr>
<th>Title</th>
<th>Content</th>
<th colspan="3">Actions</th>
</tr>

<?php
while($blog = $result->fetch_assoc()) {
?>

<tr>
<td><?php echo $blog[ 'title' ]; ?></td>
<td><?php echo $blog[ 'content' ]; ?></td>
<td>
<a href="show.php?id=<?php echo $blog[ 'id' ]; ?>&method=show">Show</a>
</td>
<td>
<a href="edit.php?id=<?php echo $blog[ 'id' ]; ?>&method=edit">Edit</a>
</td>
<td>
<a href="actions.php?id=<?php echo $blog[ 'id' ]; ?>&method=destroy" >Destroy</a>
</td>
</tr>

<?php
}
?>
</table>
<?php
   $result->free();
}else{ //if no records found

echo "No records found.";

}
$objMysqli->close();
?>
<br/>
<a href="new.php?method=new">New blog</a>

