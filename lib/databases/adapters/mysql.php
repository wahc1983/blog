<?php
  if ( !class_exists( 'DbAdapter' ) ) {
    /**
     * DbAdapter
     **/
    class DbAdapter {
      protected static $dbConnection;
      
      /**
       * setDbConnection
       **/
      public static function setDbConnection( $dbConnection ) {
        self::$dbConnection = $dbConnection;
      }
      
      /**
       * connect
       **/
      public static function connect() {
        $objMysqli = new mysqli( DATABASE_HOST, DATABASE_USERNAME, DATABASE_PASSWD, DATABASE_DBNAME );
        
        // Check connection
        if ( $objMysqli->connect_errno ) {
          throw new Exception( "Failed Connection!<br />\nERROR " . $objMysqli->connect_errno . ' (' . $objMysqli->sqlstate . ') : ' . $objMysqli->connect_error );
        }
        
        self::setDbConnection( $objMysqli );
      }
      
      /**
       * getDbConnection
       **/
      public static function getDbConnection() {
        return( self::$dbConnection );
      }
      
      /**
       * close
       **/
      public static function close() {
        self::getDbConnection()->close();
      }
      
      /**
       * getTableName
       **/
      public static function getTableName() {
        return( static::$tableName );
      }
      
      /**
       * realEscapeString
       **/
      public static function realEscapeString( $string ) {
        return( self::getDbConnection()->real_escape_string( $string ) );
      }
      
      /**
       * getEscapedTableName
       **/
      public static function getEscapedTableName() {
        return( self::realEscapeString( self::getTableName() ) );
      }
      
      /**
       * query
       **/
      public static function query( $sqlstr ) {
        return( self::getDbConnection()->query( $sqlstr ) );
      }
      
      /**
       * lastInsertedId
       **/
      public static function lastInsertedId() {
        return( self::getDbConnection()->insert_id );
      }
      
      /**
       * countRows
       **/
      public static function countRows( &$result ) {
        return( $result->num_rows );
      }
      
      /**
       * fetchAssoc
       **/
      public static function fetchAssoc( &$result ) {
        return( $result->fetch_assoc() );
      }
      
      /**
       * free
       **/
      public static function free( &$result ) {
        $result->free();
      }
      
      /**
       * findAll
       **/
      public static function findAll() {
        $sqlstr = 'SELECT * FROM `' . self::getEscapedTableName() . '`';
        
        return( self::query( $sqlstr ) );
      }
      
      /**
       * findById
       **/
      public static function findById( $id ) {
        $obj = array();
        $sqlstr = 'SELECT * FROM `' . self::getEscapedTableName() . '` WHERE `id` = ' . self::realEscapeString( $id );
        
        if ( $result = self::query( $sqlstr ) ) {
          $tmpObj = self::fetchAssoc( $result );
          if ( !empty( $tmpObj ) ) { $obj = $tmpObj; }
          self::free( $result );
        }
        
        return( $obj );
      }
      
      /**
       * initialize
       **/
      public static function initialize() {
        $obj = array();
        $sqlstr = 'DESC `' . self::getEscapedTableName() . '`';
        
        if ( $result = self::query( $sqlstr ) ) {
          while ( $row = self::fetchAssoc( $result ) ) {
            $obj[ $row[ 'Field' ] ] = '';
          }
          self::free( $result );
        }
        
        return( $obj );
      }
      
      /**
       * create
       **/
      public static function create( &$obj ) {
        if ( is_array( $obj ) ) {
          $fields = '';
          $Values = '';
          
          foreach ( $obj as $field => $value ) {
            if ( $field == 'id' ) { continue; }
            $fields .= '`' . self::realEscapeString( $field ) . '`, ';
            $values .=  '"' . self::realEscapeString( $value ) . '", ';
          }
          
          $sqlstr = 'INSERT INTO `' . self::getEscapedTableName() . '` ( ' . substr( $fields, 0, -2 ) . ' ) VALUES ( ' . substr( $values, 0, -2 ) . ' )';
          
          if ( self::query( $sqlstr ) ) {
            $obj[ 'id' ] = self::lastInsertedId();
            return( true );
          }
        }
        
        return( false );
      }
      
      /**
       * update
       **/
      public static function update( &$obj ) {
        if ( is_array( $obj ) ) {
          $fieldsAndValues = '';
          
          foreach ( $obj as $field => $value ) {
            if ( $field == 'id' ) { continue; }
            $fieldsAndValues .= '`' . self::realEscapeString( $field ) . '` = "' . self::realEscapeString( $value ) . '", ';
          }
          
          $sqlstr = 'UPDATE `' . self::getEscapedTableName() . '` SET ' . substr( $fieldsAndValues, 0, -2 ) . ' WHERE `id` = ' . self::realEscapeString( $obj[ 'id' ] );
          
          if ( self::query( $sqlstr ) ) {
            return( true );
          }
        }
        
        return( false );
      }
      
      /**
       * destroy
       **/
      public static function destroy( &$obj ) {
        if ( is_array( $obj ) ) {
          $sqlstr = 'DELETE FROM `' . self::getEscapedTableName() . '` WHERE `id` = ' . self::realEscapeString( $obj[ 'id' ] );
          
          if ( self::query( $sqlstr ) ) {
            return( true );
          }
        }
        
        return( false );
      }
      
      /**
       * destroyById
       **/
      public static function destroyById( $id ) {
        return( self::destroy( self::findById( $id ) ) );
      }
    }
  }
