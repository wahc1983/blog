<?php
while($comment = $result->fetch_assoc()) {
?>
   <tr>
   <td><?php echo $comment[ 'content' ]; ?></td>
    <td><a href="comments.php?action=show&id=<?php echo $comment[ 'id' ]; ?>">Show</a></td>
    <td><a href="comments.php?action=edit&id=<?php echo $comment[ 'id' ]; ?>">Edit</a></td>
    <td><a href="comments.php?action=delete&id=<?php echo $comment[ 'id' ]; ?>" >Delete</a></td>
   </tr>

<?php
}
?>