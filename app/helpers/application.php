<?php
  /**
   * getUrlFor
   **/
  function getUrlFor( $options, $action = '', $params = '' ) {
    $url = 'index.php';
    
    if ( is_array( $options ) ) {
      if ( isset( $options[ 'controller' ] ) && !empty( $options[ 'controller' ] ) ) { $url .= '?controller=' . $options[ 'controller' ]; }
      if ( isset( $options[ 'action' ] ) && !empty( $options[ 'action' ] ) ) { $url .= ( ( strpos( $url, '?' ) === false ) ? '?' : '&' ) . 'action=' . $options[ 'action' ]; }
      if ( isset( $options[ 'params' ] ) && !empty( $options[ 'params' ] ) ) { $url .= ( ( strpos( $url, '?' ) === false ) ? '?' : '&' ) . $options[ 'params' ]; }
    } else {
      if ( !empty( $options ) ) { $url .= '?controller=' . $options; }
      if ( !empty( $action ) ) { $url .= ( ( strpos( $url, '?' ) === false ) ? '?' : '&' ) . 'action=' . $action; }
      if ( !empty( $params ) ) { $url .= ( ( strpos( $url, '?' ) === false ) ? '?' : '&' ) . $params; }
    }
    
    return( $url );
  }
  
  /**
   * redirectTo
   **/
  function redirectTo( $options, $action = '', $params = '' ) {
    header( 'Location: ' . getUrlFor( $options, $action, $params) );
    exit( 0 );
  }
