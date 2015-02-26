<?php
  switch( $action ) {
    case 'new':
      $comment = array(
        'content' => ''
      );
      $formAction = getUrlFor( $controller, 'create' );
    break;
    case 'edit':
      $id = $_REQUEST[ 'id' ];
      $sqlstr = 'SELECT * FROM `comments` WHERE `id` = ' . $id;
      
      if ( $result = $objMysqli->query( $sqlstr ) ) {
        $comment = $result->fetch_assoc();
        $result->free();
        
        if  ( empty( $comment ) ) {
          redirectTo( $controller );
        }
        
        $formAction = getUrlFor( array( 'controller' => $controller, 'action' => 'update', 'params' => ( 'id=' . $id ) ) );
      } else {
        redirectTo( $controller );
      }
    break;
    case 'index':
    case 'list':
      $sqlstr = 'SELECT * FROM `comments`';
      
      if ( $result = $objMysqli->query( $sqlstr ) ) {
        $numComments = $result->num_rows;
        $view = 'list';
      } else {
        redirectTo( $controller );
      }
    break;
    case 'show':
      $id = $_REQUEST[ 'id' ];
      $sqlstr = 'SELECT * FROM `comments` WHERE `id` = ' . $id;
      
      if ( $result = $objMysqli->query( $sqlstr ) ) {
        $comment = $result->fetch_assoc();
        $result->free();
        
        if  ( empty( $comment ) ) {
          redirectTo( $controller );
        }
              } else {
        redirectTo( $controller );
      }
    break;
    case 'delete':
      $id = $_REQUEST[ 'id' ];
      $sqlstr = 'SELECT * FROM `comments` WHERE `id` = ' . $id;
      
      if ( $result = $objMysqli->query( $sqlstr ) ) {
        $comment = $result->fetch_assoc();
        $result->free();
        
        if  ( empty( $comment ) ) {
          redirectTo( $controller );
        }
      } else {
        redirectTo( $controller );
      }
    break;
    case 'create':
      $comment = $_REQUEST[ 'comment' ];
      $sqlstr = 'INSERT INTO `comments` SET `content` = "' . $objMysqli->real_escape_string( $comment[ 'content' ] ) . '"';
      
      if ( $objMysqli->query( $sqlstr ) ) {
        redirectTo( $controller, 'show', ( 'id=' . $objMysqli->insert_id ) );
      } else {
        redirectTo( $controller );
      }
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
          redirectTo( $controller, 'show', ( 'id=' . $id ) );
        } else {
          redirectTo( $controller );
        }
      } else {
        redirectTo( $controller );
      }
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
      
      redirectTo( $controller );
    break;
    default:
      redirectTo( $controller );
  }
