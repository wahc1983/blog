<h1>Blog</h1>
<?php
  if  ( isset( $blog ) && !empty( $blog ) ) {
    include( 'app/views/blogs/_blog.html.php' );
  } else {
    echo  'Error: The blog With ID "' . $id . '" does not exists.';
  }
?>
