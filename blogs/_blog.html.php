<table border="1">
  <tr>
    <td><b>Title</b></td>
    <td><?php echo $blog[ 'title' ]; ?></td>
  </tr>
  <tr>
    <td><b>Content</b></td>
    <td><?php echo $blog[ 'content' ]; ?></td>
  </tr>
  <tr>
    <td colspan="2">
      <a href="blogs.php?action=edit&id=<?php echo $id; ?>">Edit</a> |
      <?php if ( $action == 'delete' ) { echo '<a href="blogs.php?action=destroy&id=' . $id . '">Yes, Destroy It!</a>'; } else { echo '<a href="blogs.php?action=delete&id=' . $id . '">Delete</a>'; } ?> |
      <a href="blogs.php">Back to List</a>
    </td>
  </tr>
</table>
