<h1>Edit Blog</h1>
<?php
  if  ( isset( $blog ) && !empty( $blog ) ) {
    include( '_form.html.php' );
  } else {
    echo  'Error: The blog With ID "' . $id . '" does not exists.';
  }
