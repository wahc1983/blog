<?php
  require( 'app/models/blog.php' );
  
  switch( $action ) {
    case 'new':
      $blog = Blog::initialize();
      $formAction = getUrlFor( $controller, 'create' );
    break;
    case 'edit':
      $id = $params[ 'id' ];
      $blog = Blog::findById( $id );
      
      if  ( empty( $blog ) ) {
        redirectTo( $controller );
      }
      
      $formAction = getUrlFor( array( 'controller' => $controller, 'action' => 'update', 'params' => ( 'id=' . $id ) ) );
    break;
    case 'index':
    case 'list':
      if ( $blogs = Blog::findAll() ) {
        $numBlogs = Blog::countRows( $blogs );
        $view = 'list';
      } else {
        redirectTo( $controller );
      }
    break;
    case 'show':
      $id = $params[ 'id' ];
      $blog = Blog::findById( $id );
      
      if  ( empty( $blog ) ) {
        redirectTo( $controller );
      }
    break;
    case 'delete':
      $id = $params[ 'id' ];
      $blog = Blog::findById( $id );
      
      if  ( empty( $blog ) ) {
        redirectTo( $controller );
      }
    break;
    case 'create':
      $blog = $params[ 'blog' ];
      
      if ( Blog::create( $blog ) ) {
        redirectTo( $controller, 'show', ( 'id=' . $blog[ 'id' ] ) );
      }
      
      redirectTo( $controller );
    break;
    case 'update':
      $id = $params[ 'id' ];
      $oldBlog = Blog::findById( $id );
      
      if  ( empty( $oldBlog ) ) {
        //setFlashMessage( 'error', 'The blog With ID "' . $id . '" does not exists.' );
        redirectTo( $controller );
      }
      
      $blog = $params[ 'blog' ];
      $blog[ 'id' ] = $id;
      
      if ( Blog::update( $blog ) ) {
        //setFlashMessage( 'notice', 'The blog With ID "' . $id . '" was successfully updated.' );
        redirectTo( $controller, 'show', ( 'id=' . $id ) );
      }
      
      //setFlashMessage( 'error', 'The blog With ID "' . $id . '" could not be updated.' );
      $formAction = getUrlFor( array( 'controller' => $controller, 'action' => 'update', 'params' => ( 'id=' . $id ) ) );
      $view = 'edit';
    break;
    case 'destroy':
      $id = $params[ 'id' ];
      $blog = Blog::findById( $id );
      
      if  ( empty( $blog ) ) {
        //setFlashMessage( 'error', 'The blog With ID "' . $id . '" does not exists.' );
      } else {
        if ( Blog::destroy( $blog ) ) {
          //setFlashMessage( 'notice', 'The blog With ID "' . $id . '" was successfully destroyed.' );
        } else {
          //setFlashMessage( 'error', 'The blog With ID "' . $id . '" could not be destroyed.' );
        }
      }
      
      redirectTo( $controller );
    break;
    default:
      redirectTo( $controller );
  }
