     <table border="1">
       <tr>
         <td><b>Comment</b></td>
         <td><?php echo $comment[ 'content' ]; ?></td>
       </tr>
       <td colspan="2">
      <a href="comments.php?action=edit&id=<?php echo $id; ?>">Edit</a> |
      <?php if ( $action == 'delete' ) { echo '<a href="comments.php?action=destroy&id=' . $id . '">Yes, Destroy It!</a>'; } else { echo '<a href="comments.php?action=delete&id=' . $id . '">Delete</a>'; } ?> |
      <a href="comments.php">Back to List</a>
    </td>
       </tr>
     </table>