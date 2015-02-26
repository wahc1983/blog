<?php
require( 'app/helpers/SecurityHelper.php' );

switch( $action ) {
	case 'index';
		$view = 'index';
	break;
    case 'create':
		// if (SecurityHelper::isSignatureValid()) {
		//     $payload["query"] = array_merge($_GET, $_POST);
		//     if (SecurityHelper::requesterIsOwner()){
		//         $status_text = strip_tags($_POST['status_textarea']);
		//     } else {
		//         $payload["result"] = 'not authorized';
		//     }
		// } else {
		//     $payload["validated"] = "This request was spoofed";
		// }
		$view = 'index';
    break;
    default:
      redirectTo( $controller );
}