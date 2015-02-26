<?php
  while ( $blog = $result->fetch_assoc() ) {
?>
  <tr>
    <td><?php echo $blog[ 'title' ]; ?></td>
    <td><?php echo $blog[ 'content' ]; ?></td>
    <td><a href="blogs.php?action=show&id=<?php echo $blog[ 'id' ]; ?>">Show</a></td>
    <td><a href="blogs.php?action=edit&id=<?php echo $blog[ 'id' ]; ?>">Edit</a></td>
    <td><a href="blogs.php?action=delete&id=<?php echo $blog[ 'id' ]; ?>" >Delete</a></td>
  </tr>
<?php } ?>
