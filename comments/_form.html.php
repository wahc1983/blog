
<form action="<?php echo $formAction; ?>" method="post" style="border:0px;">
     <table>
       <tr>
         <td>Comment</td>
         <td><textarea name="comment[content]"><?php echo $comment[ 'content' ]; ?></textarea>
         </td>
       </tr>
       <tr>
         <td colspan="2"><input type="submit" value="Save" name="save" /> | <a href="comment.php">Cancel</a></td>
       </tr>
     </table>
</form>
