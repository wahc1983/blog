// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery_ujs
//= require jquery.lightbox-0.5.pack
//= require jquery.form
//= require prototype
//= require scriptaculous
//= require modalbox
// require_tree .

/********************
 * processAjax
 ********************/
function processAjax(objLnk, data, suscces) {// eventObject
	if ( typeof (objLnk.which ) !== 'undefined') {// Esto es para los a[william="true"]
		objLnk = this;
		//var dataType = objLnk.datatype; NO SE PUEDE
		var dataType = objLnk.getAttribute('datatype');
		//var dataType = jQuery( this ).attr( 'datatype' );
		//var dataType = jQuery( this ).data( 'type' );
	}
	if ( typeof (dataType ) !== 'string') {
		dataType = 'html';
	}

	var options = {
		url : objLnk,
		data : data,
		cache : false,
		dataType : 'html',
		success : suscces,
		error : function(jqXHR, textStatus, errorThrown) {
			console.log(textStatus + ' : ' + errorThrown);
		}
	};
	console.log(options);
	jQuery.ajax(options);

	return (false );
}

/********************
 * onSuccessBlogList
 ********************/
function onSuccessBlogList(data, textStatus, jqXHR) {
	jQuery('#results').html(data);
}

/********************
 * onSuccessCommentList
 ********************/
function onSuccessCommentList(data, textStatus, jqXHR) {
	jQuery('#resultsC').html(data);
}

/********************
 * searchFormHandler
 ********************/
function searchFormHandler(objFrm) {
	processAjax(objFrm.action, jQuery(objFrm).serialize(), onSuccessBlogList);
	return (false );
}

/********************
 * searchFormHandler2
 ********************/
function searchFormHandler2(objFrm) {
	processAjax(objFrm.action, jQuery(objFrm).serialize(), onSuccessCommentList);
	return (false );
}

/********************
 * formHandlerS
 ********************/
function formHandlerS(objForm) {

	var options = {
		//dataType: 'json',
		beforeSubmit : function(arr, $form, options) {
			//alert('I am going to send the form. If you want to do a validation here could be a righht place to do it!');
		},

		success : function(data, textStatus, jqXHR, jForm) {
				window.location.reload();
				//jQuery( '#connection-options' ).html( 'Signed in as ' + data.login + '. Not you? <a href="/users/sign_out?locale=en" data-method="delete" rel="nofollow">Sign out</a>' );
				//alert('I already sent the form by AJAX! It is a right place for update the DOM.');
				//alert('Thank you for your registering!');
				Modalbox.hide();
			
		},
		error : function( jqXHR, textStatus, errorThrown ) {
			jQuery('#messages').html(jqXHR.responseText);
		}
	};
	console.log(objForm);
	jQuery(objForm).ajaxSubmit(options);
	return (false );
}

/********************
 * jQuery(document)
 ********************/
jQuery(document).ready(function($) {
	var jForm = jQuery('#searchBlogs');
	var jFormC = jQuery('#searchComments');

	jQuery('#search').keyup(function(eventObject) {
		processAjax(jForm.attr('action'), {
			search : this.value
		}, onSuccessBlogList);
		return (false );
	});

	jQuery('#searchC').keyup(function(eventObject) {
		processAjax(jFormC.attr('action'), {
			searchC : this.value
		}, onSuccessCommentList);
		return (false );
	});

	jQuery('#results').on('click', '.pagination a', function(data, textStatus, jqXHR) {
		processAjax(this.href, null, onSuccessBlogList);
		return (false );
	});

	jQuery('#resultsC').on('click', '.pagination a', function(data, textStatus, jqXHR) {
		processAjax(this.href, null, onSuccessCommentList);
		return (false );
	});

	jForm.on('submit', function(data, textStatus, jqXHR) {
		processAjax(this.action, jForm.serialize(), onSuccessBlogList);
		return (false );
	});

	jQuery('#pictureBlog a').lightBox();

});

//jQuery( document ).ready( function( $ ) {
//jQuery( '[william="true"]' ).bind( 'click', {}, processAjax );
//  jQuery( 'ul > li' ).on( 'click', 'a[enableAjax="true"]', {}, processAjaxLinks );
//} );

