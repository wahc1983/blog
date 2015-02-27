<?php
require_once("lib/OAuth.php");

class SecurityHelper{
    /**
     * Check if the OAuth signature in the request is valid
     * code based on http://wiki.opensocial.org/index.php?title=Validating_Signed_Requests
    **/
    public static function isSignatureValid(){
        //Build a request object from the current request
        $request = OAuthRequest::from_request(null, null, array_merge($_GET, $_POST));

        //Initialize the new signature method
        $signature_method = new SignatureMethod();

        //Check the request signature
        @$signature_valid = $signature_method->check_signature($request, null, null, $_GET["oauth_signature"]);

        return ($signature_valid == true);
    }

    /**
     * Do we know if the request came from the gadget owner
     **/
    public static function requesterIsOwner(){
       return ( (!is_null($_REQUEST["opensocial_owner_id"])) && ($_REQUEST["opensocial_owner_id"] == $_REQUEST['opensocial_viewer_id']));
    }

}

class SignatureMethod extends OAuthSignatureMethod_RSA_SHA1 {
    protected function fetch_public_cert(&$request) {
        $filename = 'gadget/keys/' . $_REQUEST['xoauth_signature_publickey'];
        if (!file_exists($filename)) {
            throw new Exception('Certificate not found');
        }
        return file_get_contents($filename);
    }
}