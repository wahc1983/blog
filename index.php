<link rel="stylesheet" type="text/css" href="app/assets/stylesheets/application.css" media="screen">
<?php
  $params = $_REQUEST;
  $request = $_REQUEST;
 
  $controller = ( ( !isset( $params[ 'controller' ] ) || empty( $params[ 'controller' ] ) ) ? 'home' : $params[ 'controller' ] );
  $action = ( ( !isset( $params[ 'action' ] ) || empty( $params[ 'action' ] ) ) ? 'index' : $params[ 'action' ] );
  $view = $action;

  require_once( 'src/PhpConsole/__autoload.php' );

  require_once( 'config/database.php' );
  require_once( 'app/helpers/application.php' );
  require_once( 'lib/databases/adapters/' . DATABASE_ADAPTER . '.php' );
  DbAdapter::connect();
  $objMysqli = DbAdapter::getDbConnection();
  include_once( 'app/controllers/' . $controller . '.php' );
  include_once( 'app/views/' . $controller . '/' . $view . '.html.php' );
  DbAdapter::close();
 
  $password = 1234;
  if(!$password) {
    die('Please set $password variable value in ' . __FILE__);
  }

  //*****************************************************************
  // php console config
  //*****************************************************************

  $isActiveClient = PhpConsole\Connector::getInstance()->isActiveClient();
  $connector = PhpConsole\Connector::getInstance();
  $connector->setPassword($password); // Eval requests listener can be started only in password protected mode
  // $connector->enableSslOnlyMode(); // PHP Console clients will be always redirected to HTTPS
  // $connector->setAllowedIpMasks(array('192.168.*.*'));

  $evalProvider = $connector->getEvalDispatcher()->getEvalProvider();
  $evalProvider->disableFileAccessByOpenBaseDir(); // means disable functions like include(), require(), file_get_contents() & etc
  $evalProvider->addSharedVar('uri', $_SERVER['REQUEST_URI']); // so you can access $_SERVER['REQUEST_URI'] just as $uri in terminal
  $evalProvider->addSharedVarReference('post', $_POST);
  /*
   $evalProvider->setOpenBaseDirs(array(__DIR__)); // set directories limited for include(), require(), file_get_contents() & etc
   $evalProvider->addCodeHandler(function(&$code) { // modify or validate code before execution
      $code = 'return '. $code;
   });
  */

  $connector->startEvalRequestsListener(); // must be called after all configurations

  $handler = PhpConsole\Handler::getInstance();
  $handler->start(); // start handling PHP errors & exceptions