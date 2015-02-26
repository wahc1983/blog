<h1>List of Blogs</h1>
<?php
  if ( $numBlogs > 0 ) { //check if more than 0 record found
?>
<table border="1">
  <tr>
    <th>Title</th>
    <th>Content</th>
    <th colspan="3">Actions</th>
  </tr>
  <?php include( '_blogs.html.php' ); ?>
</table>
<?php
    $result->free();
  } else { //if no records found
    echo "No records found.";
  }
?>
<br />
<a href="blogs.php?action=new">New blog</a>
