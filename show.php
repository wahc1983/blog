<?php
  ini_set( 'display_errors', '1' );
  ini_set( 'display_startup_errors', '1' );

//include database configuration
include 'db/config.php';
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
</tr>

<?php
while($row = $result->fetch_assoc()) {
extract($row);
?>

<tr>
<td><?php echo $title; ?></td>
<td><?php echo $content; ?></td>
<td>
<a href="edit.php?id=<?php echo $id; ?>&method=edit">Edit</a>
</td>
<td>
<a href="actions.php?id=<?php echo $id; ?>&method=destroy" >Destroy</a>
</td>
</tr>

<?php
}
?>
</table>
<?php
}else{ //if no records found

echo "No records found.";

}
$result->free();
$objMysqli->close();
?>
<br/>
<a href="new.php?method=new">New blog</a>

