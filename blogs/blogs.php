<?php
  require_once( '../db/config.php' );
  $action = ( ( !isset( $_REQUEST[ 'action' ] ) || empty( $_REQUEST[ 'action' ] ) ) ? 'list' : $_REQUEST[ 'action' ] );
  
  switch( $action ) {
    case 'new':
      $blog = array();
      $view = 'new';
      $formAction = 'blogs.php?action=create';
    break;
    case 'edit':
      $id = $_REQUEST[ 'id' ];
      $sqlstr = 'SELECT * FROM `blogs` WHERE `id` = ' . $id;
      
      if ( $result = $objMysqli->query( $sqlstr ) ) {
        $blog = $result->fetch_assoc();
        $result->free();
        
        if  ( empty( $blog ) ) {
          header( 'Location: blogs.php' );
          exit( 0 );
        }
        
        $view = 'edit';
      $formAction = 'blogs.php?action=update&id=' . $id;
      } else {
        header( 'Location: blogs.php' );
        exit( 0 );
      }
    break;
    case 'list':
      $sqlstr = 'SELECT * FROM `blogs`';
      
      if ( $result = $objMysqli->query( $sqlstr ) ) {
        $numBlogs = $result->num_rows;
        $view = 'index';
      } else {
        header( 'Location: blogs.php' );
        exit( 0 );
      }
    break;
    case 'show':
      $id = $_REQUEST[ 'id' ];
      $sqlstr = 'SELECT * FROM `blogs` WHERE `id` = ' . $id;
      
      if ( $result = $objMysqli->query( $sqlstr ) ) {
        $blog = $result->fetch_assoc();
        $result->free();
        
        if  ( empty( $blog ) ) {
          header( 'Location: blogs.php' );
          exit( 0 );
        }
        
        $view = 'show';
      } else {
        header( 'Location: blogs.php' );
        exit( 0 );
      }
    break;
    case 'delete':
      $id = $_REQUEST[ 'id' ];
      $sqlstr = 'SELECT * FROM `blogs` WHERE `id` = ' . $id;
      
      if ( $result = $objMysqli->query( $sqlstr ) ) {
        $blog = $result->fetch_assoc();
        $result->free();
        
        if  ( empty( $blog ) ) {
          header( 'Location: blogs.php' );
          exit( 0 );
        }
        
        $view = 'delete';
      } else {
        header( 'Location: blogs.php' );
        exit( 0 );
      }
    break;
    case 'create':
      $blog = $_REQUEST[ 'blog' ];
      $sqlstr = 'INSERT INTO `blogs` SET `title` = "' . $objMysqli->real_escape_string( $blog[ 'title' ] ) . '", `content` = "' . $objMysqli->real_escape_string( $blog[ 'content' ] ) . '"';
      
      if ( $objMysqli->query( $sqlstr ) ) {
        header( 'Location: blogs.php?action=show&id=' . $objMysqli->insert_id );
      } else {
        header( 'Location: blogs.php' );
      }
      
      exit( 0 );
    break;
    case 'update':
      $id = $_REQUEST[ 'id' ];
      $blog = $_REQUEST[ 'blog' ];
      $sqlstr = 'SELECT * FROM `blogs` WHERE `id` = ' . $id;
      
      if ( $result = $objMysqli->query( $sqlstr ) ) {
        $orgBlog = $result->fetch_assoc();
        $result->free();
        
        if  ( !empty( $orgBlog ) ) {
          $objMysqli->query( 'UPDATE `blogs` SET `title` = "' . $objMysqli->real_escape_string( $blog[ 'title' ] ) . '", `content` = "' . $objMysqli->real_escape_string( $blog[ 'content' ] ) . '" WHERE `id` = ' . $id );
          header( 'Location: blogs.php?action=show&id=' . $id );
        } else {
          header( 'Location: index.html.php' );
        }
      } else {
        header( 'Location: index.html.php' );
      }
      
      exit( 0 );
    break;
    case 'destroy':
      $id = $_REQUEST[ 'id' ];
      $sqlstr = 'SELECT * FROM `blogs` WHERE `id` = ' . $id;
      
      if ( $result = $objMysqli->query( $sqlstr ) ) {
        $blog = $result->fetch_assoc();
        $result->free();
        
        if  ( !empty( $blog ) ) {
          $sqlstr = 'DELETE FROM `comments` WHERE `blog_id` = ' . $id;
          $objMysqli->query( $sqlstr );
          $sqlstr = 'DELETE FROM `blogs` WHERE `id` = ' . $id;
          $objMysqli->query( $sqlstr );
        }
      }
      
      header( 'Location: blogs.php' );
      exit( 0 );
    break;
    default:
      header( 'Location:blogs.php' );
      exit( 0 );
  }
  
  include_once( $view . '.html.php' );
  $objMysqli->close();
