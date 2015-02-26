<?php
$method=$_REQUEST["method"];
$id=$_REQUEST["id"];

if ($method == 'new') { 
$url='actions?method=new';
}
else {
$url="actions?id='$id'&method=edit";
}
//echo $url;
?>
<form action="<?php echo $url; ?>" method="post" style="border:0px;">
     <table>
       <tr>
         <td>Title</td>
         <td><input type="text" name="blog[title]" value="<?php echo $title; ?>"></td>
       </tr>
       <tr>
         <td>Content</td>
         <td><textarea name="blog[content]"><?php echo $content; ?></textarea>
         </td>
       </tr>
       <tr>
         <td></td>
         <td>
           <input type="submit" value="Save" name="save" />
         </td>
       </tr>
     </table>
</form>
