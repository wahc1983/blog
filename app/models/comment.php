<?php
  if ( class_exists( 'DbAdapter' ) && !class_exists( 'Comment' ) ) {
    /**
     * Comment
     **/
    class Comment extends DbAdapter {
      protected static $tableName = 'comments';
      
      /**
       * findAllByBlog
       **/
      public static function findAllByBlog( $blog ) {
        $sqlstr = 'SELECT * FROM `' . self::getEscapedTableName() . '` WHERE `blog_id` = ' . $blog[ 'id' ];
        
        return( self::query( $sqlstr ) );
      }
    }
  }
