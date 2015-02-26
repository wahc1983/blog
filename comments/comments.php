<?php
  require_once( '../db/config.php' );
  $action = ( ( !isset( $_REQUEST[ 'action' ] ) || empty( $_REQUEST[ 'action' ] ) ) ? 'list' : $_REQUEST[ 'action' ] );
  
  switch( $action ) {
    case 'new':
      $comment = array();
      $view = 'new';
      $formAction = 'comments.php?action=create';
    break;
    case 'edit':
      $id = $_REQUEST[ 'id' ];
      $sqlstr = 'SELECT * FROM `comments` WHERE `id` = ' . $id;
      
      if ( $result = $objMysqli->query( $sqlstr ) ) {
        $comment = $result->fetch_assoc();
        $result->free();
        
        if  ( empty( $comment ) ) {
          header( 'Location: comments.php' );
          exit( 0 );
        }
        
        $view = 'edit';
      $formAction = 'comments.php?action=update&id=' . $id;
      } else {
        header( 'Location: comments.php' );
        exit( 0 );
      }
    break;
    case 'list':
      $sqlstr = 'SELECT * FROM `comments`';
      
      if ( $result = $objMysqli->query( $sqlstr ) ) {
        $numComments = $result->num_rows;
        $view = 'index';
      } else {
        header( 'Location: comments.php' );
        exit( 0 );
      }
    break;
    case 'show':
      $id = $_REQUEST[ 'id' ];
      $sqlstr = 'SELECT * FROM `comments` WHERE `id` = ' . $id;
      
      if ( $result = $objMysqli->query( $sqlstr ) ) {
        $comment = $result->fetch_assoc();
        $result->free();
        
        if  ( empty( $comment ) ) {
          header( 'Location: comments.php' );
          exit( 0 );
        }
        
        $view = 'show';
      } else {
        header( 'Location: comments.php' );
        exit( 0 );
      }
    break;
    case 'delete':
      $id = $_REQUEST[ 'id' ];
      $sqlstr = 'SELECT * FROM `comments` WHERE `id` = ' . $id;
      
      if ( $result = $objMysqli->query( $sqlstr ) ) {
        $comment = $result->fetch_assoc();
        $result->free();
        
        if  ( empty( $comment ) ) {
          header( 'Location: comments.php' );
          exit( 0 );
        }
        
        $view = 'delete';
      } else {
        header( 'Location: comments.php' );
        exit( 0 );
      }
    break;
    case 'create':
      $comment = $_REQUEST[ 'comment' ];
      $sqlstr = 'INSERT INTO `comments` SET `content` = "' . $objMysqli->real_escape_string( $comment[ 'content' ] ) . '"';
      
      if ( $objMysqli->query( $sqlstr ) ) {
        header( 'Location: comments.php?action=show&id=' . $objMysqli->insert_id );
      } else {
        header( 'Location: comments.php' );
      }
      
      exit( 0 );
    break;
    case 'update':
      $id = $_REQUEST[ 'id' ];
      $comment = $_REQUEST[ 'comment' ];
      $sqlstr = 'SELECT * FROM `comments` WHERE `id` = ' . $id;
      
      if ( $result = $objMysqli->query( $sqlstr ) ) {
        $origComment = $result->fetch_assoc();
        $result->free();
        
        if  ( !empty( $origComment ) ) {
          $objMysqli->query( 'UPDATE `comments` SET `content` = "' . $objMysqli->real_escape_string( $comment[ 'content' ] ) . '" WHERE `id` = ' . $id );
          header( 'Location: comments.php?action=show&id=' . $id );
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
      $sqlstr = 'SELECT * FROM `comments` WHERE `id` = ' . $id;
      
      if ( $result = $objMysqli->query( $sqlstr ) ) {
        $comment = $result->fetch_assoc();
        $result->free();
        
        if  ( !empty( $comment ) ) {
          $sqlstr = 'DELETE FROM `comments` WHERE `id` = ' . $id;
          $objMysqli->query( $sqlstr );
        }
      }
      
      header( 'Location: comments.php' );
      exit( 0 );
    break;
    default:
      header( 'Location: comments.php' );
      exit( 0 );
  }
  
  include_once( $view . '.html.php' );
  $objMysqli->close();
