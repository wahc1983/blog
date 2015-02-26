
//Extractor Vars
          var date_sent;
          var message_id;
          var from_address;
          var from_name;
          var email_body;
          var email_subject;
          
          //Insightly Vars
          var email_id;
          var sender_id;
          var opensocial_id;
          var JSONOrgList;
          var popup_url;
          
          var save_called = new Boolean(0);
          var show_links = new Boolean(0);
          var saveContactCalled = new Boolean(0);
          
          saveContactCalled = 0;
          show_links = 0;
          
          
          matches = google.contentmatch.getContentMatches();


          function init() {
              console.log("Init Gadget");
              for (var match in matches) {
                    for (var key in matches[match]) {
                        if (key == "date_sent") {
                            date_sent = matches[match][key];
                        }
                        if (key == "date_received") {
                            date_received = matches[match][key];
                        }
                        if (key == "message_id") {
                            message_id = matches[match][key];
                        }
                        if (key == "sender_email") {
                            from_address = matches[match][key];
                        }
                        if (key == "sender_name") {
                            from_name = matches[match][key];
                        }
                        if (key == "email_body") {
                            email_body = matches[match][key];
                        }
                        if (key == "subject") {
                            email_subject = matches[match][key];
                        }                    
                    }
              }
 
              var logonResource = 'http://' + envURL + '/gadget2/findEmail/' + message_id + '?date_sent=' + date_sent + '&from_address=' + encodeURIComponent(from_address);
              console.log('Requesting gadget: ' + logonResource);
              osapi.http.get({'href': logonResource, 'format': 'json','authz': 'signed'}).execute(handleLoadResponse);
              
              $('#savedEmail').append('<img style="vertical-align:middle;margin-left:4px;" src="https://d9qolodtvydv6.cloudfront.net/Content/images/tick-small.png">');
               
              $('#addEmail').click(function(){getAddEmail();return false;});
              $('#showContactButton').click(function(){getContactDetails();return false;});              
              $('#showEmailLinks').click(function(){getEmailLinks();return false;});
              $('#saveContactButton').click(function(){saveContact();return false;});
              
              $('#AddNewDropDrown').change(function() {
                $('#output').hide();
                gadgets.window.adjustHeight(40);
	              if ($(this).val() == 'TAS') {
	                   getAddTask();return false;
                } else if ($(this).val() == 'OPP') {
                     getAddOpp();return false;
	              } else if ($(this).val() == 'PRO') {
                     getAddProject();return false;
                } else if ($(this).val() == 'EVE') {
                     getAddEvent();return false;
                } 
              });
              console.log("Finished Init Gadget");
          };
          
          function setSelectionRange(input, selectionStart, selectionEnd) {
            if (input.setSelectionRange) {
                input.focus();
                input.setSelectionRange(selectionStart, selectionEnd);
            }
            else if (input.createTextRange) {
                var range = input.createTextRange();
                range.collapse(true);
                range.moveEnd('character', selectionEnd);
                range.moveStart('character', selectionStart);
                range.select();
            }
        }

        function setCaretToPos(input, pos) {
            setSelectionRange(input, pos, pos);
        }
          
        function handleLoadResponse(data) {
            console.log("Finding Email and Contact..");
            if ((data.content)) {
                console.log('Response data: ' + JSON.stringify(data));
            }
            else {
                console.log('Response data: empty');
            }
              if ((data.content) && (data.content.error_occured)) { // Error occured
                  var str = data.content.error_msg;
                  $('#output').hide();
                  gadgets.window.adjustHeight(70);
                  $('#infomessage').html(str);
                  $('#infomessage').show();
                  save_called = 0;
                  saveContactCalled = 0; 
                  $('#addEmail').text('Error Saving');
                  $('#addEmail').append('<img style="vertical-align:middle;margin-left:4px;" src="https://d9qolodtvydv6.cloudfront.net/Content/images/cross-small.png">');
                  $('#saveContactButton').text('Error Saving');
                  $('#saveContactButton').append('<img style="vertical-align:middle;margin-left:4px;" src="https://d9qolodtvydv6.cloudfront.net/Content/images/cross-small.png">');
                  $('#AddButtons').hide();
                  console.log("Error while Finding Email.");

              } else if ((data.content) && (data.content.user_exists)) {
                  $('#AddButtons').show();
                  if (data.content.sender_exists) { 
                        sender_id = data.content.sender_id;
                        $('#showContactButton').show();
                        $('#saveContactButton').hide();
                        if(saveContactCalled) {
                            saveContactCalled = 0;
                            var typeform = sender_id.substring(0, 3);
                            if(typeform == 'CON') {
                                editContact();
                            } else if(typeform == 'ORG') {
                                editOrganisation();
                            }
                        }
                        console.log("Contact found.");
                        
                  } else {
                        $('#showContactButton').hide();
                        $('#saveContactButton').show();
                        console.log("Contact not found.");
                  }
                  if (data.content.email_exists) {
                        save_called = 0;
                        email_id = data.content.email_id;
                        $('#addEmail').hide();
                        $('#savedEmail').show();
                        $('#showEmailLinks').show();
                        if (show_links) {
                            getEmailLinks();
                            show_links = 0;
                        }
                        console.log("Email found.");
                  } else {
                        $('#addEmail').show(); 
                        $('#savedEmail').hide();
                        console.log("Email not found.");
                  }
              }
              
          };
          
          function getAddEmail() {
              console.log("Saving Email..");
              $('#addEmail').attr("disabled", true);
              $('#addEmail').text('Saving to Insightly');
              $('#addEmail').addClass('disabled');
              $('#addEmail').append('<img style="vertical-align:middle;margin-left:4px;" src="https://d9qolodtvydv6.cloudfront.net/Content/images/ajax-loader-trans2.gif">');
              var emailExistsResource = 'http://' + envURL + '/gadget2/saveEmail/' +  message_id;
              osapi.http.get({ 'href': emailExistsResource, 'format': 'json','authz': 'signed'}).execute(handleLoadResponse);  
              save_called = 1; 
              savedInterval = setInterval(function() {
                  if (save_called) {
                      var logonResource = 'http://' + envURL + '/gadget2/findEmail/' + message_id + '?date_sent='+ date_sent +'&from_address=' + encodeURIComponent(from_address);
                      osapi.http.get({'href': logonResource, 'format': 'json','authz': 'signed'}).execute(handleLoadResponse);
                      show_links = 1;
                    }
              }, 3000);
              
          };
          
          function saveContact() {
                console.log("Saving Contact..");
                $('#saveContactButton').text('Saving Contact');
                $('#saveContactButton').append('<img style="vertical-align:middle;margin-left:4px;" src="https://d9qolodtvydv6.cloudfront.net/Content/images/ajax-loader-trans2.gif">');
                var params = {};  
                params[gadgets.io.RequestParameters.AUTHORIZATION] = gadgets.io.AuthorizationType.SIGNED; 
                params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.GET;
                var url = "http://" + envURL + "/gadget2/saveContact/" + message_id + "?email_id=" + email_id;
                gadgets.io.makeRequest(url, saveContactResponse, params);
          }; 
          
          function saveContactResponse(data) {
            saveContactCalled = 1;
            savedContactInterval = setInterval(function() {
            if (saveContactCalled) {
                var str = data.text;
                  if(str.length == 0) {
                    var logonResource = 'http://' + envURL + '/gadget2/findEmail/' + message_id + '?date_sent='+ date_sent +'&from_address=' + encodeURIComponent(from_address);
                    osapi.http.get({ 'href': logonResource, 'format': 'json', 'authz': 'signed' }).execute(handleLoadResponse);
                    console.log("Contact saved.");
                  } else {
                    $('#saveContactButton').text('Error Saving');
                    $('#saveContactButton').append('<img style="vertical-align:middle;margin-left:4px;" src="https://d9qolodtvydv6.cloudfront.net/Content/images/cross-small.png">');
                    $('#saveContactButton').attr("disabled", true);
                    $('#output').hide();
                    gadgets.window.adjustHeight(70);
                    $('#infomessage').html(str);
                    $('#infomessage').show();
                  }
           } 
                }, 3000);   
          };
          
          function getAddTask() {
              console.log("Loading Task form..");
              var params = {};  
              params[gadgets.io.RequestParameters.AUTHORIZATION] = gadgets.io.AuthorizationType.SIGNED; 
              var url = "http://" + envURL + "/gadget2/TaskCreate";
              gadgets.io.makeRequest(url, addTaskResponse, params);  
          };
          
          function addTaskResponse(data) {  
              var str = data.text;
              document.getElementById('output').innerHTML = str;
              $('#infomessage').hide();
              $('#output').show();
              $("#ContactID").val(sender_id);
              $("#EmailID").val(email_id);
              $("#Title").val(email_subject);
              $("#Details").val(email_body);
              addTaskScript();
              $('#Cancel').click(function() {
                    $('#output').hide();
                    $('#AddNewDropDrown').val("");
                    gadgets.window.adjustHeight(40);
                    return false;
              });
              $('#newTaskform').submit(function() {
                    saveTask();
                    return false; 
              });
              gadgets.window.adjustHeight(720);
              console.log("Task form loaded");
          };
          
          function saveTask() {
                console.log("Saving Task..");
                $("#EmailID").val(email_id);
                var formData = $('#newTaskform').serialize();
                var params = {};  
                params[gadgets.io.RequestParameters.AUTHORIZATION] = gadgets.io.AuthorizationType.SIGNED; 
                params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.POST;
                params[gadgets.io.RequestParameters.POST_DATA] = formData;
                var url = "http://" + envURL + "/gadget2/TaskCreate";
                gadgets.io.makeRequest(url, saveTaskResponse, params);
          }; 
          
          function saveTaskResponse(data) {
                var str = data.text;                   
                $('#output').hide();
                gadgets.window.adjustHeight(70);
                $('#infomessage').html(str);
                $('#infomessage').show();
                console.log("Task saved.");
          };
          
          function getAddOpp() {
              console.log("Loading Opportunity form..");
              var params = {};  
              params[gadgets.io.RequestParameters.AUTHORIZATION] = gadgets.io.AuthorizationType.SIGNED; 
              var url = "http://" + envURL + "/gadget2/OpportunityCreate";
              gadgets.io.makeRequest(url, addOppResponse, params);              
          };
          
          function addOppResponse(data) {  
              var str = data.text;
              document.getElementById('output').innerHTML = str;
              $('#infomessage').hide();
              $('#output').show();
              $("#ContactID").val(sender_id);
              $("#EmailID").val(email_id);
              $("#OPPORTUNITY_NAME").val(email_subject);
              $("#OPPORTUNITY_DETAILS").val(email_body);              
              asmSelect();
              addOppScript();
              $('#Cancel').click(function() {
                    $('#output').hide();
                    $('#AddNewDropDrown').val("");
                    gadgets.window.adjustHeight(40);
                    return false;
              });
              $('#newOpportunityform').submit(function() {
                    saveOpportunity();
                    return false; 
              });                            
              gadgets.window.adjustHeight(880);
              console.log("Opportunity form loaded.");
          };    
          
          function saveOpportunity(){
                console.log("Saving Opportunity..");
                $("#EmailID").val(email_id);
                var formData = $('#newOpportunityform').serialize();
                var params = {};  
                params[gadgets.io.RequestParameters.AUTHORIZATION] = gadgets.io.AuthorizationType.SIGNED; 
                params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.POST;
                params[gadgets.io.RequestParameters.POST_DATA] = formData;
                var url = "http://" + envURL + "/gadget2/OpportunityCreate";
                gadgets.io.makeRequest(url, saveOpportunityResponse, params);
          }; 
          
          function saveOpportunityResponse(data) {
                var str = data.text;
                $('#output').hide();
                gadgets.window.adjustHeight(70);
                $('#infomessage').html(str);
                $('#infomessage').show();
                console.log("Opportunity saved");
          };          

          function getAddProject() {
              console.log("Loading Project form..");
              var params = {};  
              params[gadgets.io.RequestParameters.AUTHORIZATION] = gadgets.io.AuthorizationType.SIGNED; 
              var url = "http://" + envURL + "/gadget2/ProjectCreate";
              gadgets.io.makeRequest(url, addProjectResponse, params);
          };
          
          function addProjectResponse(data) {  
              var str = data.text;
              document.getElementById('output').innerHTML = str;
              $('#infomessage').hide();
              $('#output').show();
              $("#ContactID").val(sender_id);
              $("#EmailID").val(email_id);
              $("#PROJECT_NAME").val(email_subject);
              $("#PROJECT_DETAILS").val(email_body); 
              asmSelect();
              addProjectScript();
              $('#Cancel').click(function() {
                    $('#output').hide();
                    $('#AddNewDropDrown').val("");
                    gadgets.window.adjustHeight(40);
                    return false;
              }); 
              $('#newProjectform').submit(function() {
                    saveProject();
                    return false; 
              });                            
              gadgets.window.adjustHeight(690);
              console.log("Project form loaded.");
          };             
          
          function saveProject() {
                console.log("Saving project..");
                $("#EmailID").val(email_id);
                var formData = $('#newProjectform').serialize();
                var params = {};  
                params[gadgets.io.RequestParameters.AUTHORIZATION] = gadgets.io.AuthorizationType.SIGNED; 
                params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.POST;
                params[gadgets.io.RequestParameters.POST_DATA] = formData;
                var url = "http://" + envURL + "/gadget2/ProjectCreate";
                gadgets.io.makeRequest(url, saveProjectResponse, params);
          }; 
          function saveProjectResponse(data) {
                var str = data.text;
                $('#output').hide();
                gadgets.window.adjustHeight(70);
                $('#infomessage').html(str);
                $('#infomessage').show();
                console.log("Project saved");
          };
          
          
          function getAddEvent() {
              console.log("Loading Event form..");
              var params = {};  
              params[gadgets.io.RequestParameters.AUTHORIZATION] = gadgets.io.AuthorizationType.SIGNED; 
              var url = "http://" + envURL + "/gadget2/EventCreate";
              gadgets.io.makeRequest(url, addEventResponse, params); 
          };
          
          function addEventResponse(data) {  
              var str = data.text;
              document.getElementById('output').innerHTML = str;
              $('#infomessage').hide();
              $('#output').show();
              asmSelect();
              addEventScript();
              $("#EmailID").val(email_id);
              $("#Title").val(email_subject);
              $("#Details").val(email_body); 
              
              $('#Cancel').click(function() {
                    $('#output').hide();
                    $('#AddNewDropDrown').val("");
                    gadgets.window.adjustHeight(40);
                    return false;
              });
              $('#newEventform').submit(function() {
                    saveEvent();
                    return false; 
              });
              gadgets.window.adjustHeight(720);
              console.log("Event form loaded.");
          };
          
          function saveEvent() {
                console.log("Saving Event..");
                $("#EmailID").val(email_id);
                var formData = $('#newEventform').serialize();
                var params = {};  
                params[gadgets.io.RequestParameters.AUTHORIZATION] = gadgets.io.AuthorizationType.SIGNED; 
                params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.POST;
                params[gadgets.io.RequestParameters.POST_DATA] = formData;
                var url = "http://" + envURL + "/gadget2/EventCreate";
                gadgets.io.makeRequest(url, saveEventResponse, params);
          }; 
          
          function saveEventResponse(data) {
                var str = data.text;
                $('#output').hide();
                gadgets.window.adjustHeight(70);
                $('#infomessage').html(str);
                $('#infomessage').show();
                console.log("Event saved.");
          };
          
          function getEmailLinks() {
              console.log("Loading Email links..");
              var params = {};  
              params[gadgets.io.RequestParameters.AUTHORIZATION] = gadgets.io.AuthorizationType.SIGNED; 
              var url = "http://" + envURL + "/gadget2/EmailLinks/"+ email_id + "?sender_id=" + sender_id;
              gadgets.io.makeRequest(url, getEmailLinksResponse, params); 
          };
          function getEmailLinksResponse(data) {  
              var str = data.text;
              document.getElementById('output').innerHTML = str;
              autoComplete();
              emailLinksScript();
              $('#infomessage').hide();
              $('#output').show();
              gadgets.window.adjustHeight();
              if ($('#output').height() < 250) {gadgets.window.adjustHeight(250)};
              
              $('#Cancel').click(function() {
                    $('#output').hide();
                    gadgets.window.adjustHeight(40);
                    return false;
              });
              console.log("Email links loaded.");
          };

          function getContactDetails() {
              console.log("Loading contact details..");
              $('#showContactButton').append('<img style="vertical-align:middle;margin-left:4px;" src="https://d9qolodtvydv6.cloudfront.net/Content/images/ajax-loader-trans2.gif">');
              var params = {};  
              params[gadgets.io.RequestParameters.AUTHORIZATION] = gadgets.io.AuthorizationType.SIGNED; 
              var url = "http://" + envURL + "/gadget2/SenderDetails/"+ sender_id;
              gadgets.io.makeRequest(url, getContactDetailsResponse, params);
          };          
          function getContactDetailsResponse(data) {
              $('#showContactButton').text('View Contact');
              var str = data.text;
              document.getElementById('output').innerHTML = str;
              $('#infomessage').hide();
              $('#output').show();
              gadgets.window.adjustHeight();
              $('#Cancel').click(function() {
                    $('#output').hide();
                    gadgets.window.adjustHeight(40);
                    return false;
              });
              $('#EditContact').click(function(){editContact();return false;});
              $('#EditOrganisation').click(function () { editOrganisation(); return false; });
              console.log("Contact details loaded.");
          };
          
          function editContact() {
              console.log("Loading Contact edit form..");
              var params = {};  
              params[gadgets.io.RequestParameters.AUTHORIZATION] = gadgets.io.AuthorizationType.SIGNED;
              var contactid =  sender_id.substring(3, sender_id.length);
              var url = "http://" + envURL + "/gadget2/ContactEdit/"+ contactid;
              gadgets.io.makeRequest(url, editContactResponse, params);
          };
          
          function editContactResponse(data) {
              var str = data.text;
              document.getElementById('output').innerHTML = str;
              $('#infomessage').hide();
              $('#output').show();
              asmSelect();
              editContactScript();
              $('#Cancel').click(function() {
                    getContactDetails();
                    return false;
              });
              $('#editcontactform').submit(function() {
                    saveEditContact();
                    return false; 
              });
              gadgets.window.adjustHeight(1500);
              console.log("Contact edit form loaded.");
          }; 
          
          function saveEditContact() {
                console.log("Saving contact..");
                var formData = $('#editcontactform').serialize();
                var params = {};  
                var contactid =  sender_id.substring(3, sender_id.length);
                params[gadgets.io.RequestParameters.AUTHORIZATION] = gadgets.io.AuthorizationType.SIGNED; 
                params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.POST;
                params[gadgets.io.RequestParameters.POST_DATA] = formData;
                var url = "http://" + envURL + "/gadget2/ContactEdit/" + contactid;
                gadgets.io.makeRequest(url, saveEditContactResponse, params);
          };
          
          function saveEditContactResponse(data) {
              getContactDetails();
              console.log("Contact saved.");
          };
          
          function editOrganisation() {
              console.log("Loading Organization edit form..");
              var params = {};  
              params[gadgets.io.RequestParameters.AUTHORIZATION] = gadgets.io.AuthorizationType.SIGNED;
              var organisationid =  sender_id.substring(3, sender_id.length);
              var url = "http://" + envURL + "/gadget2/OrganisationEdit/"+ organisationid;
              gadgets.io.makeRequest(url, editOrganisationResponse, params);
          };
          
          function editOrganisationResponse(data) {
              var str = data.text;
              document.getElementById('output').innerHTML = str;
              $('#infomessage').hide();
              $('#output').show();
              asmSelect();
              editOrganisationScript();
              $('#Cancel').click(function() {
                    getContactDetails();
                    return false;
              });
              $('#editorganisationform').submit(function() {
                    saveEditOrganisation();
                    return false; 
              });
              gadgets.window.adjustHeight(1400);
              console.log("Organization edit form loaded.");
          }; 
          
          function saveEditOrganisation() {
                console.log("Saving organization..");
                var formData = $('#editorganisationform').serialize();
                var params = {};  
                var organisationid =  sender_id.substring(3, sender_id.length);
                params[gadgets.io.RequestParameters.AUTHORIZATION] = gadgets.io.AuthorizationType.SIGNED; 
                params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.POST;
                params[gadgets.io.RequestParameters.POST_DATA] = formData;
                var url = "http://" + envURL + "/gadget2/OrganisationEdit/" + organisationid;
                gadgets.io.makeRequest(url, saveEditOrganisationResponse, params);
          };
          
          function saveEditOrganisationResponse(data) {
              getContactDetails();
              console.log("Organization saved.");
          };          
          

          function addNewEmailLink() {
              console.log("Adding new link..");
               var LinkType = $('#LinkType').val();
               var linkName = $('#linkName').val();
               var LinkID = $('#LinkID').val();
               var params = {};  
               var postdata = {
                    LinkID: LinkID,
                    LinkType: LinkType,
                    linkName: linkName
                };
                params[gadgets.io.RequestParameters.AUTHORIZATION] = gadgets.io.AuthorizationType.SIGNED; 
                params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.POST;
                params[gadgets.io.RequestParameters.POST_DATA] = gadgets.io.encodeValues(postdata);
                var url = 'http://' + envURL + '/gadget2/EmailLinkCreate/'+ email_id;
                gadgets.io.makeRequest(url, addNewEmailLinkResponse, params);
          }; 
          function addNewEmailLinkResponse(data) {
                var str = data.text;
                $('#emailLinkItems').html(str);
                $('#LinkTextBox').val('');
                $('#LinkTextBox').focus();
                gadgets.window.adjustHeight();
                if ($('#output').height() < 250) { gadgets.window.adjustHeight(250) };
                console.log("New link added.");
          };                                 
          
          function asmSelect() {
                (function($){$.fn.asmSelect=function(customOptions){var options={listType:'ol',sortable:false,highlight:false,animate:false,addItemTarget:'bottom',hideWhenAdded:false,debugMode:false,removeLabel:'remove',highlightAddedLabel:'Added: ',highlightRemovedLabel:'Removed: ',containerClass:'asmContainer',selectClass:'asmSelect',optionDisabledClass:'asmOptionDisabled',listClass:'asmList',listSortableClass:'asmListSortable',listItemClass:'asmListItem',listItemLabelClass:'asmListItemLabel',removeClass:'asmListItemRemove',highlightClass:'asmHighlight'};$.extend(options,customOptions);return this.each(function(index){var $original=$(this);var $container;var $select;var $ol;var buildingSelect=false;var ieClick=false;var ignoreOriginalChangeEvent=false;function init(){while($("#"+options.containerClass+index).size()>0)index++;$select=$("<select></select>").addClass(options.selectClass).attr('name',options.selectClass+index).attr('id',options.selectClass+index);$selectRemoved=$("<select></select>");$ol=$("<"+options.listType+"></"+options.listType+">").addClass(options.listClass).attr('id',options.listClass+index);$container=$("<div></div>").addClass(options.containerClass).attr('id',options.containerClass+index);buildSelect();$select.change(selectChangeEvent).click(selectClickEvent);$original.change(originalChangeEvent).wrap($container).before($select).before($ol);if(options.sortable)makeSortable();if($.browser.msie)$ol.css('display','block');}
                function makeSortable(){$ol.sortable({items:'li.'+options.listItemClass,handle:'.'+options.listItemLabelClass,axis:'y',update:function(e,data){var updatedOptionId;$(this).children("li").each(function(n){$option=$('#'+$(this).attr('rel'));if($(this).is(".ui-sortable-helper")){updatedOptionId=$option.attr('id');return;}
                $original.append($option);});if(updatedOptionId)triggerOriginalChange(updatedOptionId,'sort');}}).addClass(options.listSortableClass);}
                function selectChangeEvent(e){if($.browser.msie&&$.browser.version<7&&!ieClick)return;var id=$(this).children("option:selected").slice(0,1).attr('rel');addListItem(id);ieClick=false;triggerOriginalChange(id,'add');}
                function selectClickEvent(){ieClick=true;}
                function originalChangeEvent(e){if(ignoreOriginalChangeEvent){ignoreOriginalChangeEvent=false;return;}
                $select.empty();$ol.empty();buildSelect();if($.browser.opera)$ol.hide().fadeIn("fast");}
                function buildSelect(){buildingSelect=true;$select.prepend("<option>"+$original.attr('title')+"</option>");$original.children("option").each(function(n){var $t=$(this);var id;if(!$t.attr('id'))$t.attr('id','asm'+index+'option'+n);id=$t.attr('id');if($t.is(":selected")){addListItem(id);addSelectOption(id,true);}else{addSelectOption(id);}});if(!options.debugMode)$original.hide();selectFirstItem();buildingSelect=false;}
                function addSelectOption(optionId,disabled){if(disabled==undefined)var disabled=false;var $O=$('#'+optionId);var $option=$("<option>"+$O.text()+"</option>").val($O.val()).attr('rel',optionId);if(disabled)disableSelectOption($option);$select.append($option);}
                function selectFirstItem(){$select.children(":eq(0)").attr("selected",true);}
                function disableSelectOption($option){$option.addClass(options.optionDisabledClass).attr("selected",false).attr("disabled",true);if(options.hideWhenAdded)$option.hide();if($.browser.msie)$select.hide().show();}
                function enableSelectOption($option){$option.removeClass(options.optionDisabledClass).attr("disabled",false);if(options.hideWhenAdded)$option.show();if($.browser.msie)$select.hide().show();}
                function addListItem(optionId){var $O=$('#'+optionId);if(!$O)return;var $removeLink=$("<a></a>").attr("href","#").addClass(options.removeClass).prepend(options.removeLabel).click(function(){dropListItem($(this).parent('li').attr('rel'));return false;});var $itemLabel=$("<span></span>").addClass(options.listItemLabelClass).html($O.html());var $item=$("<li></li>").attr('rel',optionId).addClass(options.listItemClass).append($itemLabel).append($removeLink).hide();if(!buildingSelect){if($O.is(":selected"))return;$O.attr('selected',true);}
                if(options.addItemTarget=='top'&&!buildingSelect){$ol.prepend($item);if(options.sortable)$original.prepend($O);}else{$ol.append($item);if(options.sortable)$original.append($O);}
                addListItemShow($item);disableSelectOption($("[rel="+optionId+"]",$select));if(!buildingSelect){setHighlight($item,options.highlightAddedLabel);selectFirstItem();if(options.sortable)$ol.sortable("refresh");}}
                function addListItemShow($item){if(options.animate&&!buildingSelect){$item.animate({opacity:"show",height:"show"},100,"swing",function(){$item.animate({height:"+=2px"},50,"swing",function(){$item.animate({height:"-=2px"},25,"swing");});});}else{$item.show();}}
                function dropListItem(optionId,highlightItem){if(highlightItem==undefined)var highlightItem=true;var $O=$('#'+optionId);$O.attr('selected',false);$item=$ol.children("li[rel="+optionId+"]");dropListItemHide($item);enableSelectOption($("[rel="+optionId+"]",options.removeWhenAdded?$selectRemoved:$select));if(highlightItem)setHighlight($item,options.highlightRemovedLabel);triggerOriginalChange(optionId,'drop');}
                function dropListItemHide($item){if(options.animate&&!buildingSelect){$prevItem=$item.prev("li");$item.animate({opacity:"hide",height:"hide"},100,"linear",function(){$prevItem.animate({height:"-=2px"},50,"swing",function(){$prevItem.animate({height:"+=2px"},100,"swing");});$item.remove();});}else{$item.remove();}}
                function setHighlight($item,label){if(!options.highlight)return;$select.next("#"+options.highlightClass+index).remove();var $highlight=$("<span></span>").hide().addClass(options.highlightClass).attr('id',options.highlightClass+index).html(label+$item.children("."+options.listItemLabelClass).slice(0,1).text());$select.after($highlight);$highlight.fadeIn("fast",function(){setTimeout(function(){$highlight.fadeOut("slow");},50);});}
                function triggerOriginalChange(optionId,type){ignoreOriginalChangeEvent=true;$option=$("#"+optionId);$original.trigger('change',[{'option':$option,'value':$option.val(),'id':optionId,'item':$ol.children("[rel="+optionId+"]"),'type':type}]);}
                init();});};})(jQuery);          
          };
          
          function autoComplete() {
              console.log("Loading autoComplete library..");
              (function ($) {
                  $.fn.extend({
                      autocomplete: function (urlOrData, options) {
                          var isUrl = typeof urlOrData == "string";
                          options = $.extend({}, $.Autocompleter.defaults, {
                              url: isUrl ? urlOrData : null,
                              data: isUrl ? null : urlOrData,
                              delay: isUrl ? $.Autocompleter.defaults.delay : 10,
                              max: options && !options.scroll ? 10 : 150
                          }, options);
                          options.highlight = options.highlight || function (value) {
                              return value;
                          };
                          options.formatMatch = options.formatMatch || options.formatItem;
                          return this.each(function () {
                              new $.Autocompleter(this, options);
                          });
                      },
                      result: function (handler) {
                          return this.bind("result", handler);
                      },
                      search: function (handler) {
                          return this.trigger("search", [handler]);
                      },
                      flushCache: function () {
                          return this.trigger("flushCache");
                      },
                      setOptions: function (options) {
                          return this.trigger("setOptions", [options]);
                      },
                      unautocomplete: function () {
                          return this.trigger("unautocomplete");
                      }
                  });
                  $.Autocompleter = function (input, options) {
                      var KEY = {
                          UP: 38,
                          DOWN: 40,
                          DEL: 46,
                          TAB: 9,
                          RETURN: 13,
                          ESC: 27,
                          COMMA: 188,
                          PAGEUP: 33,
                          PAGEDOWN: 34,
                          BACKSPACE: 8
                      };
                      var $input = $(input).attr("autocomplete", "off").addClass(options.inputClass);
                      var timeout;
                      var previousValue = "";
                      var cache = $.Autocompleter.Cache(options);
                      var hasFocus = 0;
                      var lastKeyPressCode;
                      var config = {
                          mouseDownOnSelect: false
                      };
                      var select = $.Autocompleter.Select(options, input, selectCurrent, config);
                      var blockSubmit;
                      $.browser.opera && $(input.form).bind("submit.autocomplete", function () {
                          if (blockSubmit) {
                              blockSubmit = false;
                              return false;
                          }
                      });
                      $input.bind(($.browser.opera ? "keypress" : "keydown") + ".autocomplete", function (event) {
                          hasFocus = 1;
                          lastKeyPressCode = event.keyCode;
                          switch (event.keyCode) {
                              case KEY.UP:
                                  event.preventDefault();
                                  if (select.visible()) {
                                      select.prev();
                                  } else {
                                      onChange(0, true);
                                  }
                                  break;
                              case KEY.DOWN:
                                  event.preventDefault();
                                  if (select.visible()) {
                                      select.next();
                                  } else {
                                      onChange(0, true);
                                  }
                                  break;
                              case KEY.PAGEUP:
                                  event.preventDefault();
                                  if (select.visible()) {
                                      select.pageUp();
                                  } else {
                                      onChange(0, true);
                                  }
                                  break;
                              case KEY.PAGEDOWN:
                                  event.preventDefault();
                                  if (select.visible()) {
                                      select.pageDown();
                                  } else {
                                      onChange(0, true);
                                  }
                                  break;
                              case options.multiple && $.trim(options.multipleSeparator) == "," && KEY.COMMA:
                              case KEY.TAB:
                              case KEY.RETURN:
                                  if (selectCurrent()) {
                                      event.preventDefault();
                                      blockSubmit = true;
                                      return false;
                                  }
                                  break;
                              case KEY.ESC:
                                  select.hide();
                                  break;
                              default:
                                  clearTimeout(timeout);
                                  timeout = setTimeout(onChange, options.delay);
                                  break;
                          }
                      }).focus(function () {
                          hasFocus++;
                      }).blur(function () {
                          hasFocus = 0;
                          if (!config.mouseDownOnSelect) {
                              hideResults();
                          }
                      }).click(function () {
                          if (hasFocus++ > 1 && !select.visible()) {
                              onChange(0, true);
                          }
                      }).bind("search", function () {
                          var fn = (arguments.length > 1) ? arguments[1] : null;

                          function findValueCallback(q, data) {
                              var result;
                              if (data && data.length) {
                                  for (var i = 0; i < data.length; i++) {
                                      if (data[i].result.toLowerCase() == q.toLowerCase()) {
                                          result = data[i];
                                          break;
                                      }
                                  }
                              }
                              if (typeof fn == "function") fn(result);
                              else $input.trigger("result", result && [result.data, result.value]);
                          }
                          $.each(trimWords($input.val()), function (i, value) {
                              request(value, findValueCallback, findValueCallback);
                          });
                      }).bind("flushCache", function () {
                          cache.flush();
                      }).bind("setOptions", function () {
                          $.extend(options, arguments[1]);
                          if ("data" in arguments[1]) cache.populate();
                      }).bind("unautocomplete", function () {
                          select.unbind();
                          $input.unbind();
                          $(input.form).unbind(".autocomplete");
                      });

                      function selectCurrent() {
                          var selected = select.selected();
                          if (!selected) return false;
                          var v = selected.result;
                          previousValue = v;
                          if (options.multiple) {
                              var words = trimWords($input.val());
                              if (words.length > 1) {
                                  var seperator = options.multipleSeparator.length;
                                  var cursorAt = $(input).selection().start;
                                  var wordAt, progress = 0;
                                  $.each(words, function (i, word) {
                                      progress += word.length;
                                      if (cursorAt <= progress) {
                                          wordAt = i;
                                          return false;
                                      }
                                      progress += seperator;
                                  });
                                  words[wordAt] = v;
                                  v = words.join(options.multipleSeparator);
                              }
                              v += options.multipleSeparator;
                          }
                          $input.val(v);
                          hideResultsNow();
                          $input.trigger("result", [selected.data, selected.value]);
                          return true;
                      }

                      function onChange(crap, skipPrevCheck) {
                          if (lastKeyPressCode == KEY.DEL) {
                              select.hide();
                              return;
                          }
                          var currentValue = $input.val();
                          if (!skipPrevCheck && currentValue == previousValue) return;
                          previousValue = currentValue;
                          currentValue = lastWord(currentValue);
                          if (currentValue.length >= options.minChars) {
                              $input.addClass(options.loadingClass);
                              if (!options.matchCase) currentValue = currentValue.toLowerCase();
                              request(currentValue, receiveData, hideResultsNow);
                          } else {
                              stopLoading();
                              select.hide();
                          }
                      };

                      function trimWords(value) {
                          if (!value) return [""];
                          if (!options.multiple) return [$.trim(value)];
                          return $.map(value.split(options.multipleSeparator), function (word) {
                              return $.trim(value).length ? $.trim(word) : null;
                          });
                      }

                      function lastWord(value) {
                          if (!options.multiple) return value;
                          var words = trimWords(value);
                          if (words.length == 1) return words[0];
                          var cursorAt = $(input).selection().start;
                          if (cursorAt == value.length) {
                              words = trimWords(value)
                          } else {
                              words = trimWords(value.replace(value.substring(cursorAt), ""));
                          }
                          return words[words.length - 1];
                      }

                      function autoFill(q, sValue) {
                          if (options.autoFill && (lastWord($input.val()).toLowerCase() == q.toLowerCase()) && lastKeyPressCode != KEY.BACKSPACE) {
                              $input.val($input.val() + sValue.substring(lastWord(previousValue).length));
                              $(input).selection(previousValue.length, previousValue.length + sValue.length);
                          }
                      };

                      function hideResults() {
                          clearTimeout(timeout);
                          timeout = setTimeout(hideResultsNow, 200);
                      };

                      function hideResultsNow() {
                          var wasVisible = select.visible();
                          select.hide();
                          clearTimeout(timeout);
                          stopLoading();
                          if (options.mustMatch) {
                              $input.search(function (result) {
                                  if (!result) {
                                      if (options.multiple) {
                                          var words = trimWords($input.val()).slice(0, -1);
                                          $input.val(words.join(options.multipleSeparator) + (words.length ? options.multipleSeparator : ""));
                                      } else {
                                          $input.val("");
                                          $input.trigger("result", null);
                                      }
                                  }
                              });
                          }
                      };

                      function receiveData(q, data) {
                          if (data && data.length && hasFocus) {
                              stopLoading();
                              select.display(data, q);
                              autoFill(q, data[0].value);
                              select.show();
                          } else {
                              hideResultsNow();
                          }
                      };

                      function request(term, success, failure) {
                          if (!options.matchCase) term = term.toLowerCase();
                          var data = cache.load(term);
                          if (data && data.length) {
                              success(term, data);
                          } else if ((typeof options.url == "string") && (options.url.length > 0)) {
                              var extraParams = {
                                  timestamp: +new Date()
                              };
                              $.each(options.extraParams, function (key, param) {
                                  extraParams[key] = typeof param == "function" ? param() : param;
                              });
                              //$.ajax({
                              //    mode: "abort",
                              //    port: "autocomplete" + input.name,
                              //    dataType: options.dataType,
                              //    url: options.url,
                              //    data: $.extend({
                              //        q: lastWord(term),
                              //        limit: options.max
                              //    }, extraParams),
                              //    success: function (data) {
                              //        var parsed = options.parse && options.parse(data) || parse(data);
                              //        cache.add(term, parsed);
                              //        success(term, parsed);
                              //    }
                              //});
                              var params = {};
                              params[gadgets.io.RequestParameters.AUTHORIZATION] = gadgets.io.AuthorizationType.SIGNED;
                              var data = $.extend({
                                  q: lastWord(term),
                                  limit: options.max
                              }, extraParams);
                              var queryString = gadgets.io.encodeValues(data);
                              var url = options.url + "?" + queryString;
                              gadgets.io.makeRequest(url, function (response) {
                                  if (response.data != undefined) {
                                      var parsed = options.parse && options.parse(response.data) || parse(response.data);
                                      cache.add(term, parsed);
                                      success(term, parsed);
                                  } else {
                                      hideResultsNow();
                                  }
                              }, params);

                          } else {
                              select.emptyList();
                              failure(term);
                          }
                      };

                      function parse(data) {
                          var parsed = [];
                          var rows = data.split("\n");
                          for (var i = 0; i < rows.length; i++) {
                              var row = $.trim(rows[i]);
                              if (row) {
                                  row = row.split("|");
                                  parsed[parsed.length] = {
                                      data: row,
                                      value: row[0],
                                      result: options.formatResult && options.formatResult(row, row[0]) || row[0]
                                  };
                              }
                          }
                          return parsed;
                      };

                      function stopLoading() {
                          $input.removeClass(options.loadingClass);
                      };
                  };
                  $.Autocompleter.defaults = {
                      inputClass: "ac_input",
                      resultsClass: "ac_results",
                      loadingClass: "ac_loading",
                      minChars: 1,
                      delay: 400,
                      matchCase: false,
                      matchSubset: true,
                      matchContains: false,
                      cacheLength: 10,
                      max: 100,
                      mustMatch: false,
                      extraParams: {},
                      selectFirst: true,
                      formatItem: function (row) {
                          return row[0];
                      },
                      formatMatch: null,
                      autoFill: false,
                      width: 0,
                      multiple: false,
                      multipleSeparator: ", ",
                      highlight: function (value, term) {
                          return value.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + term.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi, "\\$1") + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>");
                      },
                      scroll: true,
                      scrollHeight: 180
                  };
                  $.Autocompleter.Cache = function (options) {
                      var data = {};
                      var length = 0;

                      function matchSubset(s, sub) {
                          if (!options.matchCase) s = s.toLowerCase();
                          var i = s.indexOf(sub);
                          if (options.matchContains == "word") {
                              i = s.toLowerCase().search("\\b" + sub.toLowerCase());
                          }
                          if (i == -1) return false;
                          return i == 0 || options.matchContains;
                      };

                      function add(q, value) {
                          if (length > options.cacheLength) {
                              flush();
                          }
                          if (!data[q]) {
                              length++;
                          }
                          data[q] = value;
                      }

                      function populate() {
                          if (!options.data) return false;
                          var stMatchSets = {}, nullData = 0;
                          if (!options.url) options.cacheLength = 1;
                          stMatchSets[""] = [];
                          for (var i = 0, ol = options.data.length; i < ol; i++) {
                              var rawValue = options.data[i];
                              rawValue = (typeof rawValue == "string") ? [rawValue] : rawValue;
                              var value = options.formatMatch(rawValue, i + 1, options.data.length);
                              if (value === false) continue;
                              var firstChar = value.charAt(0).toLowerCase();
                              if (!stMatchSets[firstChar]) stMatchSets[firstChar] = [];
                              var row = {
                                  value: value,
                                  data: rawValue,
                                  result: options.formatResult && options.formatResult(rawValue) || value
                              };
                              stMatchSets[firstChar].push(row);
                              if (nullData++ < options.max) {
                                  stMatchSets[""].push(row);
                              }
                          };
                          $.each(stMatchSets, function (i, value) {
                              options.cacheLength++;
                              add(i, value);
                          });
                      }
                      setTimeout(populate, 25);

                      function flush() {
                          data = {};
                          length = 0;
                      }
                      return {
                          flush: flush,
                          add: add,
                          populate: populate,
                          load: function (q) {
                              if (!options.cacheLength || !length) return null;
                              if (!options.url && options.matchContains) {
                                  var csub = [];
                                  for (var k in data) {
                                      if (k.length > 0) {
                                          var c = data[k];
                                          $.each(c, function (i, x) {
                                              if (matchSubset(x.value, q)) {
                                                  csub.push(x);
                                              }
                                          });
                                      }
                                  }
                                  return csub;
                              } else
                                  if (data[q]) {
                                      return data[q];
                                  } else
                                      if (options.matchSubset) {
                                          for (var i = q.length - 1; i >= options.minChars; i--) {
                                              var c = data[q.substr(0, i)];
                                              if (c) {
                                                  var csub = [];
                                                  $.each(c, function (i, x) {
                                                      if (matchSubset(x.value, q)) {
                                                          csub[csub.length] = x;
                                                      }
                                                  });
                                                  return csub;
                                              }
                                          }
                                      }
                              return null;
                          }
                      };
                  };
                  $.Autocompleter.Select = function (options, input, select, config) {
                      var CLASSES = {
                          ACTIVE: "ac_over"
                      };
                      var listItems, active = -1,
                          data, term = "",
                          needsInit = true,
                          element, list;

                      function init() {
                          if (!needsInit) return;
                          element = $("<div/>").hide().addClass(options.resultsClass).css("position", "absolute").appendTo(document.body);
                          list = $("<ul/>").appendTo(element).mouseover(function (event) {
                              if (target(event).nodeName && target(event).nodeName.toUpperCase() == 'LI') {
                                  active = $("li", list).removeClass(CLASSES.ACTIVE).index(target(event));
                                  $(target(event)).addClass(CLASSES.ACTIVE);
                              }
                          }).click(function (event) {
                              $(target(event)).addClass(CLASSES.ACTIVE);
                              select();
                              input.focus();
                              return false;
                          }).mousedown(function () {
                              config.mouseDownOnSelect = true;
                          }).mouseup(function () {
                              config.mouseDownOnSelect = false;
                          });
                          if (options.width > 0) element.css("width", options.width);
                          needsInit = false;
                      }

                      function target(event) {
                          var element = event.target;
                          while (element && element.tagName != "LI") element = element.parentNode;
                          if (!element) return [];
                          return element;
                      }

                      function moveSelect(step) {
                          listItems.slice(active, active + 1).removeClass(CLASSES.ACTIVE);
                          movePosition(step);
                          var activeItem = listItems.slice(active, active + 1).addClass(CLASSES.ACTIVE);
                          if (options.scroll) {
                              var offset = 0;
                              listItems.slice(0, active).each(function () {
                                  offset += this.offsetHeight;
                              });
                              if ((offset + activeItem[0].offsetHeight - list.scrollTop()) > list[0].clientHeight) {
                                  list.scrollTop(offset + activeItem[0].offsetHeight - list.innerHeight());
                              } else if (offset < list.scrollTop()) {
                                  list.scrollTop(offset);
                              }
                          }
                      };

                      function movePosition(step) {
                          active += step;
                          if (active < 0) {
                              active = listItems.size() - 1;
                          } else if (active >= listItems.size()) {
                              active = 0;
                          }
                      }

                      function limitNumberOfItems(available) {
                          return options.max && options.max < available ? options.max : available;
                      }

                      function fillList() {
                          list.empty();
                          var max = limitNumberOfItems(data.length);
                          for (var i = 0; i < max; i++) {
                              if (!data[i]) continue;
                              var formatted = options.formatItem(data[i].data, i + 1, max, data[i].value, term);
                              if (formatted === false) continue;
                              var li = $("<li/>").html(options.highlight(formatted, term)).addClass(i % 2 == 0 ? "ac_even" : "ac_odd").appendTo(list)[0];
                              $.data(li, "ac_data", data[i]);
                          }
                          listItems = list.find("li");
                          if (options.selectFirst) {
                              listItems.slice(0, 1).addClass(CLASSES.ACTIVE);
                              active = 0;
                          }
                          if ($.fn.bgiframe) list.bgiframe();
                      }
                      return {
                          display: function (d, q) {
                              init();
                              data = d;
                              term = q;
                              fillList();
                          },
                          next: function () {
                              moveSelect(1);
                          },
                          prev: function () {
                              moveSelect(-1);
                          },
                          pageUp: function () {
                              if (active != 0 && active - 8 < 0) {
                                  moveSelect(-active);
                              } else {
                                  moveSelect(-8);
                              }
                          },
                          pageDown: function () {
                              if (active != listItems.size() - 1 && active + 8 > listItems.size()) {
                                  moveSelect(listItems.size() - 1 - active);
                              } else {
                                  moveSelect(8);
                              }
                          },
                          hide: function () {
                              element && element.hide();
                              listItems && listItems.removeClass(CLASSES.ACTIVE);
                              active = -1;
                          },
                          visible: function () {
                              return element && element.is(":visible");
                          },
                          current: function () {
                              return this.visible() && (listItems.filter("." + CLASSES.ACTIVE)[0] || options.selectFirst && listItems[0]);
                          },
                          show: function () {
                              var offset = $(input).offset();
                              element.css({
                                  width: typeof options.width == "string" || options.width > 0 ? options.width : $(input).width(),
                                  top: offset.top + input.offsetHeight,
                                  left: offset.left
                              }).show();
                              if (options.scroll) {
                                  list.scrollTop(0);
                                  list.css({
                                      maxHeight: options.scrollHeight,
                                      overflow: 'auto'
                                  });
                                  if ($.browser.msie && typeof document.body.style.maxHeight === "undefined") {
                                      var listHeight = 0;
                                      listItems.each(function () {
                                          listHeight += this.offsetHeight;
                                      });
                                      var scrollbarsVisible = listHeight > options.scrollHeight;
                                      list.css('height', scrollbarsVisible ? options.scrollHeight : listHeight);
                                      if (!scrollbarsVisible) {
                                          listItems.width(list.width() - parseInt(listItems.css("padding-left")) - parseInt(listItems.css("padding-right")));
                                      }
                                  }
                              }
                          },
                          selected: function () {
                              var selected = listItems && listItems.filter("." + CLASSES.ACTIVE).removeClass(CLASSES.ACTIVE);
                              return selected && selected.length && $.data(selected[0], "ac_data");
                          },
                          emptyList: function () {
                              list && list.empty();
                          },
                          unbind: function () {
                              element && element.remove();
                          }
                      };
                  };
                  $.fn.selection = function (start, end) {
                      if (start !== undefined) {
                          return this.each(function () {
                              if (this.createTextRange) {
                                  var selRange = this.createTextRange();
                                  if (end === undefined || start == end) {
                                      selRange.move("character", start);
                                      selRange.select();
                                  } else {
                                      selRange.collapse(true);
                                      selRange.moveStart("character", start);
                                      selRange.moveEnd("character", end);
                                      selRange.select();
                                  }
                              } else if (this.setSelectionRange) {
                                  this.setSelectionRange(start, end);
                              } else if (this.selectionStart) {
                                  this.selectionStart = start;
                                  this.selectionEnd = end;
                              }
                          });
                      }
                      var field = this[0];
                      if (field.createTextRange) {
                          var range = document.selection.createRange(),
                              orig = field.value,
                              teststring = "<->",
                              textLength = range.text.length;
                          range.text = teststring;
                          var caretAt = field.value.indexOf(teststring);
                          field.value = orig;
                          this.selection(caretAt, caretAt + textLength);
                          return {
                              start: caretAt,
                              end: caretAt + textLength
                          }
                      } else if (field.selectionStart !== undefined) {
                          return {
                              start: field.selectionStart,
                              end: field.selectionEnd
                          }
                      }
                  };
              })(jQuery);

              (function () {
                    $.fn.linkBoxAutocomplete = function (url, options) {
                        var defaultOptions = {
                            matchContains: true,
                            autoFill: false,
                            highlightItem: true,
                            mustMatch: false,
                            max: 20,
                            formatItem: function (row, i, max) {
                                return row[0] + " (" + row[1] + ")";
                            },
                            formatMatch: function (row, i, max) {
                                return row[0];
                            },
                            formatResult: function (row) {
                                return row[0];
                            }
                        };

                        options = options || {};

                        // anything passed in to the options argument overrides the defaultOptions
                        options = $.extend({}, defaultOptions, options);

                        this.autocomplete(url, options);
                    };
              })();

              (function () {
                  $.fn.organisationNameAutocomplete = function (url, options) {
                      var defaultOptions = {
                          width: 592,
                          matchContains: true,
                          autoFill: false,
                          highlightItem: true,
                          mustMatch: false,
                          parse: function (data) {
                              var items = JSON.parse(data);
                              var result = [];
                              for (var i = 0; i < items.length; i++) {
                                  var item = items[i];
                                  if (item) {
                                      result[result.length] = {
                                          data: item,
                                          value: item.name,
                                          result: item.name
                                      }
                                  }
                              }

                              return result;
                          },
                          formatItem: function (row, i, max) {
                              return row.name;
                          },
                          formatMatch: function (row, i, max) {
                              return row.name;
                          },
                          formatResult: function (row) {
                              return row.name;
                          }
                      };

                      options = options || {};

                      // anything passed in to the options argument overrides the defaultOptions
                      options = $.extend({}, defaultOptions, options);

                      this.autocomplete(url, options);
                  };
              })();

              console.log("autoComplete library loaded.");
          };
          
          function editContactScript() {
            var currentPhone = 2;
            var currentEmail = 2;
            var currentWebsite = 1;
            var currentAddress = 1;
            var currentDate = 1;
            var currentSocial = 1;
            
            var contactid = sender_id.substring(3, sender_id.length);
         
            $("#SALUTATION").focus();
             
            $("#addPhoneNumber").click(function() {
            currentPhone++;
            $newPhone = $("#phoneTemplate").clone(true);
            $newPhone.children("div").children("span").children("label").each(function(i) {
                var $currentElem = $(this);
                $currentElem.attr("for", $currentElem.attr("for") + currentPhone);
                $currentElem.text("Phone Number ");
            });
            $newPhone.children("div").children("span").children("input").each(function(i) {
                var $currentElem = $(this);
                $currentElem.attr("name", $currentElem.attr("name") + currentPhone);
                $currentElem.attr("id", $currentElem.attr("id") + currentPhone);
            });
            $newPhone.children("div").children("span").children("select").each(function(i) {
                var $currentElem = $(this);
                $currentElem.attr("name", $currentElem.attr("name") + currentPhone);
                $currentElem.attr("id", $currentElem.attr("id") + currentPhone);
            });
            $newPhone.appendTo("#phone_number_list_person");
            $newPhone.slideDown(300 ,function() {
                        $("#personPhoneNumber" + currentPhone).focus();
                    });
            return false;
            });
        
            $("#addEmailAddress").click(function() {
                currentEmail++;
                $newEmail = $("#emailTemplate").clone(true);
                $newEmail.children("div").children("span").children("label").each(function(i) {
                    var $currentElem = $(this);
                    $currentElem.attr("for", $currentElem.attr("for") + currentEmail);
                    $currentElem.text("Email Address ");
                });
                $newEmail.children("div").children("span").children("input").each(function(i) {
                    var $currentElem = $(this);
                    $currentElem.attr("name", $currentElem.attr("name") + currentEmail);
                    $currentElem.attr("id", $currentElem.attr("id") + currentEmail);
                });
                $newEmail.children("div").children("span").children("select").each(function(i) {
                    var $currentElem = $(this);
                    $currentElem.attr("name", $currentElem.attr("name") + currentEmail);
                    $currentElem.attr("id", $currentElem.attr("id") + currentEmail);
                });
                $newEmail.appendTo("#email_list_person");
                $newEmail.slideDown(300, function() {
                    $("#emailAddress" + currentEmail).focus();
                });            
                return false;
            });

            $("#addSocialInfo").click(function() {
                currentSocial++;
                $newEmail = $("#socialTemplate").clone(true);
                $newEmail.children("div").children("span").children("label").each(function(i) {
                    var $currentElem = $(this);
                    $currentElem.attr("for", $currentElem.attr("for") + currentSocial);
                    $currentElem.text("Social Info ");
                });
                $newEmail.children("div").children("span").children("input").each(function(i) {
                    var $currentElem = $(this);
                    $currentElem.attr("name", $currentElem.attr("name") + currentSocial);
                    $currentElem.attr("id", $currentElem.attr("id") + currentSocial);
                });
                $newEmail.children("div").children("span").children("select").each(function(i) {
                    var $currentElem = $(this);
                    $currentElem.attr("name", $currentElem.attr("name") + currentSocial);
                    $currentElem.attr("id", $currentElem.attr("id") + currentSocial);
                });
                $newEmail.appendTo("#social_list_person");
                $newEmail.slideDown(300, function() {
                    $("#socialInfo" + currentSocial).focus();
                });            
                return false;
            });

            $("#addWebsite").click(function() {
                currentWebsite++;
                $newWebsite = $("#websiteTemplate").clone(true);
                $newWebsite.children("div").children("span").children("label").each(function(i) {
                    var $currentElem = $(this);
                    $currentElem.attr("for", $currentElem.attr("for") + currentWebsite);
                    $currentElem.text("Web site ");
                });
                $newWebsite.children("div").children("span").children("input").each(function(i) {
                    var $currentElem = $(this);
                    $currentElem.attr("name", $currentElem.attr("name") + currentWebsite);
                    $currentElem.attr("id", $currentElem.attr("id") + currentWebsite);
                });
                $newWebsite.children("div").children("span").children("select").each(function(i) {
                    var $currentElem = $(this);
                    $currentElem.attr("name", $currentElem.attr("name") + currentWebsite);
                    $currentElem.attr("id", $currentElem.attr("id") + currentWebsite);
                });
                $newWebsite.appendTo("#website_person");
                $newWebsite.slideDown(300, function() {
                    $("#website" + currentWebsite).focus();
                    //setCaretToPos(document.getElementById("website" + currentWebsite), 7);
                });                       
                return false;
            });
            
            $("#addDate").click(function() {
                currentDate++;
                $newDate = $("#datesTemplate").clone(true);
               $newDate.children("div").children("span").children("label").each(function(i) {
                    var $currentElem = $(this);
                    $currentElem.attr("for", $currentElem.attr("for") + currentDate);
                });               
                $newDate.children("div").children("span").children("input").each(function(i) {
                    var $currentElem = $(this);
                    $currentElem.attr("name", $currentElem.attr("name") + currentDate);
                    $currentElem.attr("id", $currentElem.attr("id") + currentDate);
                });
                $newDate.children("div").children("span").children("select").each(function(i) {
                    var $currentElem = $(this);
                    $currentElem.attr("name", $currentElem.attr("name") + currentDate);
                    $currentElem.attr("id", $currentElem.attr("id") + currentDate);
                });
                $newDate.children("div").children("span").children("checkbox").each(function(i) {
                    var $currentElem = $(this);
                    $currentElem.attr("name", $currentElem.attr("name") + currentDate);
                    $currentElem.attr("id", $currentElem.attr("id") + currentDate);
                });            
                $newDate.appendTo("#dates_person");
                $newDate.slideDown(300, function() {
                    $("#occasion_name" + currentDate).focus();
                });                       
                return false;
            });        

            $("#addAddress").click(function() {
                currentAddress++;
                $newAddr = $("#addressTemplate").clone(true);
                $newAddr.children("div").children("span").children("label").each(function(i) {
                    var $currentElem = $(this);
                    $currentElem.attr("for", $currentElem.attr("for") + currentAddress);
                });
                $newAddr.children("div").children("span").children("label").each(function(i) {
                    var $currentElem = $(this);
                    $currentElem.attr("for", $currentElem.attr("for") + currentAddress);
                });
                $newAddr.children("div").children("span").children("select").each(function(i) {
                    var $currentElem = $(this);
                    $currentElem.attr("name", $currentElem.attr("name") + currentAddress);
                    $currentElem.attr("id", $currentElem.attr("id") + currentAddress);
                });
                $newAddr.children("div").children("span").children("input").each(function(i) {
                    var $currentElem = $(this);
                    $currentElem.attr("name", $currentElem.attr("name") + currentAddress);
                    $currentElem.attr("id", $currentElem.attr("id") + currentAddress);
                });
                $newAddr.children("div").children("span").children("textarea").each(function(i) {
                    var $currentElem = $(this);
                    $currentElem.attr("name", $currentElem.attr("name") + currentAddress);
                    $currentElem.attr("id", $currentElem.attr("id") + currentAddress);
                });
                $newAddr.appendTo("#address_Person");
                $newAddr.slideDown(300, function() {
                    $("#address_type" + currentAddress).focus();
                });              
                return false;
            });
        
             $('.deleteimage').click(function(e) {
                e.preventDefault();
                var parent = $(this).parent().parent();
                var content_show = $(this).attr("id");
                ContactDeleteContactInfo(content_show, contactid, parent);
            });
            
            $('.deletedateimage').click(function(e) {
                e.preventDefault();
                var parent = $(this).parent().parent();
                var content_show = $(this).attr("id").replace('delContactDate', '');;
                ContactDeleteDate(content_show, contactid, parent)
            });

            $('.deleteaddrimage').click(function(e) {
                e.preventDefault();
                var parent = $(this).parent().parent();
                var addressID = $(this).attr("id").replace('delContactAddr', ''); ;
                ContactDeleteAddress(addressID, contactid, parent)
            });
        
            // Permissions User Control
            $('#visibleToTeam').click(function () {
                $('#groupSelection').show();
                $('#individualsSelection').hide();
            });
            $('#visibleToIndividuals').click(function () {
                $('#individualsSelection').show();
                $('#groupSelection').hide();
            });
            $('#visibleToOwner').click(function () {
                $('#individualsSelection').hide();
                $('#groupSelection').hide();
            });
            $('#visibleToEveryone').click(function () {
                $('#individualsSelection').hide();
                $('#groupSelection').hide();
            });
            $("#userIDs").asmSelect({
                addItemTarget: 'top',
                animate: true,
                highlight: false,
                sortable: false
            });


            $('#showExpandedContactDetails').click(function() {
                $('#contact_section').show();
                $('#link_to_show_contact_section').hide();
                $('#personPhoneNumber1').focus();
            });
            
            // Custom Fields Control
            var firstDayWeek = $("#TaskWeekStartsOn").val();
            $("input[custom*=date]").datepicker({ showAnim: 'fadeIn', showButtonPanel: true, dateFormat: 'D d-M-yy', firstDay: firstDayWeek});
             
             // Organisation List Autocomplete
             
             autoComplete();
             var orgSearchUrl = "http://" + envURL + "/gadget2/JSONOrgList/";
             $("#COMPANY").organisationNameAutocomplete(orgSearchUrl);
             $("#COMPANY").result(function (event, data, formatted) {
                 if (data) {
                     $('#COMPANY_ID').val(data['id']);
                 };
             });    
          };
        
         function getJSONOrgList(request, response) { //Get full link list in JSON for Email Links autoComplete
              var params = {};  
              params[gadgets.io.RequestParameters.AUTHORIZATION] = gadgets.io.AuthorizationType.SIGNED; 
              params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.JSON;
              params["q"] = request.term;
              var linkurl = "http://" + envURL + "/gadget2/JSONOrgList/";
              gadgets.io.makeRequest(linkurl, function(data) {
                  var dataList = eval(data.text);
                  var result = [];
                  for (var key in dataList) {
                      var item = dataList[key].name;
                      result.push(item);
                  }
                  response(result);
              }, params);          
          };
          
          function ContactDeleteContactInfo(id, contactid, parent) {
              var params = {};
              params[gadgets.io.RequestParameters.AUTHORIZATION] = gadgets.io.AuthorizationType.SIGNED; 
              params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.GET;
              var url = "http://" + envURL + "/gadget2/ContactDeleteContactInfo/"+ id + "?ContactID=" + contactid;
              gadgets.io.makeRequest(url, ContactDeleteContactInfoResponse(parent), params);
          }
          
          function ContactDeleteContactInfoResponse(parent) {
              parent.slideUp(300, function() {
                 parent.remove();
              });
          }
          
          function ContactDeleteDate(id, contactid, parent) {
              var params = {};
              params[gadgets.io.RequestParameters.AUTHORIZATION] = gadgets.io.AuthorizationType.SIGNED; 
              params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.GET;
              var url = "http://" + envURL + "/gadget2/ContactDeleteDate/"+ id + "?ContactID=" + contactid;
              gadgets.io.makeRequest(url, ContactDeleteDateResponse(parent), params);
          }
          
          function ContactDeleteDateResponse(parent) {
              parent.slideUp(300, function() {
                 parent.remove();
              });
          }
          
          function ContactDeleteAddress(id, contactid, parent) {
              var params = {};
              params[gadgets.io.RequestParameters.AUTHORIZATION] = gadgets.io.AuthorizationType.SIGNED; 
              params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.GET;
              var url = "http://" + envURL + "/gadget2/ContactDeleteAddress/"+ id + "?ContactID=" + contactid;
              gadgets.io.makeRequest(url, ContactDeleteAddressResponse(parent), params);
          }
          
          function ContactDeleteAddressResponse(parent) {
              parent.slideUp(300, function() {
                 parent.remove();
              });
          }
          
         function OrgDeleteContactInfo(id, contactid, parent) {
              var params = {};
              params[gadgets.io.RequestParameters.AUTHORIZATION] = gadgets.io.AuthorizationType.SIGNED; 
              params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.GET;
              var url = "http://" + envURL + "/gadget2/OrgDeleteContactInfo/"+ id + "?OrganisationID=" + contactid;
              gadgets.io.makeRequest(url, OrgDeleteContactInfoResponse(parent), params);
          }
          
          function OrgDeleteContactInfoResponse(parent) {
              parent.slideUp(300, function() {
                 parent.remove();
              });
          }
          
          function OrgDeleteDate(id, organisationid, parent) {
              var params = {};
              params[gadgets.io.RequestParameters.AUTHORIZATION] = gadgets.io.AuthorizationType.SIGNED; 
              params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.GET;
              var url = "http://" + envURL + "/gadget2/OrgDeleteDate/"+ id + "?OrganisationID=" + organisationid;
              gadgets.io.makeRequest(url, OrgDeleteDateResponse(parent), params);
          }
          
          function OrgDeleteDateResponse(parent) {
              parent.slideUp(300, function() {
                 parent.remove();
              });
          }
          
          function OrgDeleteAddress(id, organisationid, parent) {
              var params = {};
              params[gadgets.io.RequestParameters.AUTHORIZATION] = gadgets.io.AuthorizationType.SIGNED; 
              params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.GET;
              var url = "http://" + envURL + "/gadget2/OrgDeleteAddress/"+ id + "?OrganisationID=" + organisationid;
              gadgets.io.makeRequest(url, OrgDeleteAddressResponse(parent), params);
          }
          
          function OrgDeleteAddressResponse(parent) {
              parent.slideUp(300, function() {
                 parent.remove();
              });
          }
          
          
          function editOrganisationScript() {
            var currentEmailDomain = 1;
            var currentPhone = 2;
            var currentEmail = 2;
            var currentWebsite = 1;
            var currentAddress = 1;
            var currentPosition = 1;
            var currentDate = 1;
            var currentSocial = 1;
            
            var organisationid = sender_id.substring(3, sender_id.length);
            
            $("#ORGANISATION_NAME").focus();

        $("#addEmailDomain").click(function() {
            currentEmailDomain++;
            $newEmailDomain = $("#email_domain_template").clone(true);
            $newEmailDomain.children("div").children("span").children("label").each(function(i) {
                var $currentElem = $(this);
                $currentElem.attr("for", $currentElem.attr("for") + currentEmailDomain);
                $currentElem.text("Email Domain ");
            });
            $newEmailDomain.children("div").children("span").children("input").each(function(i) {
                var $currentElem = $(this);
                $currentElem.attr("name", $currentElem.attr("name") + currentEmailDomain);
                $currentElem.attr("id", $currentElem.attr("id") + currentEmailDomain);
            });
            $newEmailDomain.appendTo("#email_domain_list");
            $newEmailDomain.slideDown(300, function() {
                //setCaretToPos(document.getElementById("email_domain" + currentEmailDomain), 1);
                $("#email_domain" + currentEmailDomain).focus();
            });
            return false;
        });

        $("#addPhoneNumber").click(function() {
            currentPhone++;
            $newPhone = $("#phoneTemplate").clone(true);
            $newPhone.children("div").children("span").children("label").each(function(i) {
                var $currentElem = $(this);
                $currentElem.attr("for", $currentElem.attr("for") + currentPhone);
                $currentElem.text("Phone Number ");
            });
            $newPhone.children("div").children("span").children("input").each(function(i) {
                var $currentElem = $(this);
                $currentElem.attr("name", $currentElem.attr("name") + currentPhone);
                $currentElem.attr("id", $currentElem.attr("id") + currentPhone);
            });
            $newPhone.children("div").children("span").children("select").each(function(i) {
                var $currentElem = $(this);
                $currentElem.attr("name", $currentElem.attr("name") + currentPhone);
                $currentElem.attr("id", $currentElem.attr("id") + currentPhone);
            });
            $newPhone.appendTo("#phone_number_list_person");
            $newPhone.slideDown(300, function() {
                //setCaretToPos(document.getElementById("personPhoneNumber" + currentPhone), 1);
                $("#personPhoneNumber" + currentPhone).focus();
            });
            return false;
        });        

        $("#addEmailAddress").click(function() {
            currentEmail++;
            $newEmail = $("#emailTemplate").clone(true);
            $newEmail.children("div").children("span").children("label").each(function(i) {
                var $currentElem = $(this);
                $currentElem.attr("for", $currentElem.attr("for") + currentEmail);
                $currentElem.text("Email Address ");
            });
            $newEmail.children("div").children("span").children("input").each(function(i) {
                var $currentElem = $(this);
                $currentElem.attr("name", $currentElem.attr("name") + currentEmail);
                $currentElem.attr("id", $currentElem.attr("id") + currentEmail);
            });
            $newEmail.children("div").children("span").children("select").each(function(i) {
                var $currentElem = $(this);
                $currentElem.attr("name", $currentElem.attr("name") + currentEmail);
                $currentElem.attr("id", $currentElem.attr("id") + currentEmail);
            });
            $newEmail.appendTo("#email_list_person");
            $newEmail.slideDown(300, function() {
                //$("#emailAddress" + currentEmail).rules("add", { email: true });
                //setCaretToPos(document.getElementById("emailAddress" + currentEmail), 1);
                $("#emailAddress" + currentEmail).focus();
            });            
            return false;
        });
        
        $("#addSocialInfo").click(function () {
            currentSocial++;
            $newEmail = $("#socialTemplate").clone(true);
            $newEmail.children("div").children("span").children("label").each(function (i) {
                var $currentElem = $(this);
                $currentElem.attr("for", $currentElem.attr("for") + currentSocial);
                $currentElem.text("Social Info ");
            });
            $newEmail.children("div").children("span").children("input").each(function (i) {
                var $currentElem = $(this);
                $currentElem.attr("name", $currentElem.attr("name") + currentSocial);
                $currentElem.attr("id", $currentElem.attr("id") + currentSocial);
            });
            $newEmail.children("div").children("span").children("select").each(function (i) {
                var $currentElem = $(this);
                $currentElem.attr("name", $currentElem.attr("name") + currentSocial);
                $currentElem.attr("id", $currentElem.attr("id") + currentSocial);
            });
            $newEmail.appendTo("#social_list_person");
            $newEmail.slideDown(300, function () {
                $("#socialInfo" + currentSocial).focus();
            });
            return false;
        });

        $("#addWebsite").click(function() {
            currentWebsite++;
            $newWebsite = $("#websiteTemplate").clone(true);
            $newWebsite.children("div").children("span").children("label").each(function(i) {
                var $currentElem = $(this);
                $currentElem.attr("for", $currentElem.attr("for") + currentWebsite);
                $currentElem.text("Web site ");
            });
            $newWebsite.children("div").children("span").children("input").each(function(i) {
                var $currentElem = $(this);
                $currentElem.attr("name", $currentElem.attr("name") + currentWebsite);
                $currentElem.attr("id", $currentElem.attr("id") + currentWebsite);
            });
            $newWebsite.children("div").children("span").children("select").each(function(i) {
                var $currentElem = $(this);
                $currentElem.attr("name", $currentElem.attr("name") + currentWebsite);
                $currentElem.attr("id", $currentElem.attr("id") + currentWebsite);
            });
            $newWebsite.appendTo("#website_person");
            $newWebsite.slideDown(300, function() {
                //setCaretToPos(document.getElementById("website" + currentWebsite), 7);
                $("#website" + currentWebsite).focus();
            });                       
            return false;
        });
        
        $("#addDate").click(function() {
            currentDate++;
            $newDate = $("#datesTemplate").clone(true);
           $newDate.children("div").children("span").children("label").each(function(i) {
                var $currentElem = $(this);
                $currentElem.attr("for", $currentElem.attr("for") + currentDate);
            });               
            $newDate.children("div").children("span").children("input").each(function(i) {
                var $currentElem = $(this);
                $currentElem.attr("name", $currentElem.attr("name") + currentDate);
                $currentElem.attr("id", $currentElem.attr("id") + currentDate);
            });
            $newDate.children("div").children("span").children("select").each(function(i) {
                var $currentElem = $(this);
                $currentElem.attr("name", $currentElem.attr("name") + currentDate);
                $currentElem.attr("id", $currentElem.attr("id") + currentDate);
            });
            $newDate.children("div").children("span").children("checkbox").each(function(i) {
                var $currentElem = $(this);
                $currentElem.attr("name", $currentElem.attr("name") + currentDate);
                $currentElem.attr("id", $currentElem.attr("id") + currentDate);
            });            
            $newDate.appendTo("#dates_person");
            $newDate.slideDown(300, function() {
                //setCaretToPos(document.getElementById("occasion_name" + currentDate), 1);
                $("#occasion_name" + currentDate).focus();
            });                       
            return false;
        });        

        $("#addAddress").click(function() {
            currentAddress++;
            $newAddr = $("#addressTemplate").clone(true);
            $newAddr.children("div").children("span").children("label").each(function(i) {
                var $currentElem = $(this);
                $currentElem.attr("for", $currentElem.attr("for") + currentAddress);
                //$currentElem.text("Contact Address " + currentAddress);
            });
            $newAddr.children("div").children("span").children("select").each(function(i) {
                var $currentElem = $(this);
                $currentElem.attr("name", $currentElem.attr("name") + currentAddress);
                $currentElem.attr("id", $currentElem.attr("id") + currentAddress);
            });
            $newAddr.children("div").children("span").children("input").each(function(i) {
                var $currentElem = $(this);
                $currentElem.attr("name", $currentElem.attr("name") + currentAddress);
                $currentElem.attr("id", $currentElem.attr("id") + currentAddress);
            });
            $newAddr.children("div").children("span").children("textarea").each(function(i) {
                var $currentElem = $(this);
                $currentElem.attr("name", $currentElem.attr("name") + currentAddress);
                $currentElem.attr("id", $currentElem.attr("id") + currentAddress);
            });
            $newAddr.appendTo("#address_Person");
            $newAddr.slideDown(300, function() {
                $("#address_type" + currentAddress).focus();
            });              
            return false;
        });

        $('.deleteimage').click(function(e) {
            e.preventDefault();
            var parent = $(this).parent().parent();
            var content_show = $(this).attr("id");
            OrgDeleteContactInfo(content_show, organisationid, parent);
        });

        
        $('.deletedateimage').click(function(e) {
            e.preventDefault();
            var parent = $(this).parent().parent();
            var content_show = $(this).attr("id").replace('DeleteOrgDate', '');
            OrgDeleteDate(content_show, organisationid, parent);
        });


        $('.deleteaddrimage').click(function(e) {
            e.preventDefault();
            var parent = $(this).parent().parent();
            var AddressID = $(this).attr("id").replace('delOrgAddr', ''); ;
            OrgDeleteAddress(AddressID, organisationid, parent);
        });
        
            // Custom Fields Control
            var firstDayWeek = $("#TaskWeekStartsOn").val();
            $("input[custom*=date]").datepicker({ showAnim: 'fadeIn', showButtonPanel: true, dateFormat: 'D d-M-yy', firstDay: firstDayWeek});
            
            // Permissions
            $('#visibleToTeam').click(function () {
                $('#groupSelection').show();
                $('#individualsSelection').hide();
            });
            $('#visibleToIndividuals').click(function () {
                $('#individualsSelection').show();
                $('#groupSelection').hide();
            });
            $('#visibleToOwner').click(function () {
                $('#individualsSelection').hide();
                $('#groupSelection').hide();
            });
            $('#visibleToEveryone').click(function () {
                $('#individualsSelection').hide();
                $('#groupSelection').hide();
            });
            $("#userIDs").asmSelect({
                addItemTarget: 'top',
                animate: true,
                highlight: false,
                sortable: false
            });

            $('#showExpandedContactDetails').click(function() {
                $('#contact_section').show();
                $('#link_to_show_contact_section').hide();
                $('#personPhoneNumber1').focus();
            });
          };
          
          
          
        
          function addTaskScript() {
                    $(':input:not([type="button"],[type="submit"],[type="checkbox"],[id="SearchInputString"],[class="selects"],[class="noHighlight"])').each(function() {
                            $(this).focus(function() {
                                if (!$(this).parent().hasClass("errordiv")) {
                                    $(this).parent().addClass('formFieldFocus');
                                }
                            }).blur(function() {
                                $(this).parent().removeClass('formFieldFocus');
                            });
                    });
                    
                  var firstDayWeek = $("#TaskWeekStartsOn").val();
	                $("#startdate").datepicker({ showAnim: 'fadeIn', showButtonPanel: true, dateFormat: 'D d-M-yy', firstDay: firstDayWeek});
	                $("#duedate").datepicker({ showAnim: 'fadeIn', showButtonPanel: true, dateFormat: 'D d-M-yy', firstDay: firstDayWeek});
	                $("#Reminderdate").datepicker({ showAnim: 'fadeIn', showButtonPanel: true, dateFormat: 'D d-M-yy', firstDay: firstDayWeek});
	                $('#ui-datepicker-div').show(); //For Mozilla Gadget window resize adjustment    
                    $('#ui-datepicker-div').hide(); //For Mozilla Gadget window resize adjustment   

	                $('#startdate').datepicker('option', 'onSelect', function(startdate) {
	                    try {
	                        var startdate = $.datepicker.parseDate('D d-M-yy', startdate);
	                        var duedate = $.datepicker.parseDate('D d-M-yy', $('#duedate').val());
	                        if (isDate(duedate) && isDate(startdate)) {
	                            if (duedate < startdate) { $('#duedate').datepicker('setDate', new Date(startdate)) };
	                        }
	                        var today = new Date();
	                        if ( isDate(startdate) && startdate <=  today) {
	                             $("#status option[value='In Progress']").attr('selected', 'selected');	     
	                        }
	                    } catch (e) {
	                        $('#startdate').datepicker('setDate', new Date());
	                    }
	                });	        
        	        

	                $('#reminder').click(function() {
	                    if ($(this).attr('checked') == true) {
	                        $('#Reminderdate').removeAttr('disabled');
	                        $('#Remindertime').removeAttr('disabled');
	                        $("#Remindertime option[value='None']").remove();
	                        $("#Remindertime option[value='8:00 AM']").attr('selected', 'selected');
	                        try {
	                            var duedate = $.datepicker.parseDate('D d-M-yy', $('#duedate').val());
	                            if (isDate(duedate)) {
	                                $('#Reminderdate').datepicker('setDate', new Date(duedate));
	                            } else {
	                                $('#Reminderdate').datepicker('setDate', new Date());
	                            }
	                        } catch (e) {
	                            $('#Reminderdate').datepicker('setDate', new Date());
	                        }

	                    } else {
	                        $('#Reminderdate').val('None');
	                        $('#Reminderdate').attr('disabled', 'disabled');
	                        $("#Remindertime").append('<option selected value="None">None</option>');
	                        $('#Remindertime').attr('disabled', 'disabled');
	                    }
	                });
        	        
	                $('#status').change(function() {
	                    if ($(this).val() == 'Completed') {
	                         $('#reminder').attr('checked', false);
	                         $('#Reminderdate').attr('disabled', 'disabled');
	                         $('#Remindertime').attr('disabled', 'disabled');
	                         $("#percentcomplete option[value='100']").attr('selected', 'selected');	        
	                    } else if ($(this).val() == 'Not Started') {
	                        $("#percentcomplete option[value='0']").attr('selected', 'selected');	        
	                    }
	                });	        
        	        
	                 $('#percentcomplete').change(function() {
	                    var percentcomplete = parseInt($('#percentcomplete').val());
	                    if (percentcomplete == 100) {
	                        $("#status option[value='Completed']").attr('selected', 'selected');	                
	                    } else if (percentcomplete > 0) {
	                        $("#status option[value='In Progress']").attr('selected', 'selected');
	                    } else if (percentcomplete == 0) {
	                        $("#status option[value='Not Started']").attr('selected', 'selected');
	                    };
	                 });
        	        
	                $('#privateToggle').live("click", function() {
	                    if ($('#private').is(':checked')) {
	                        $('#private').attr('checked', false);
	                        $("#privateToggleImg").attr("src", "https://d9qolodtvydv6.cloudfront.net/Content/images/ico_lock_open.gif");
	                        $("#privateToggleImg2").attr("src", "https://d9qolodtvydv6.cloudfront.net/Content/images/ico_lock_open.gif");
	                        $("#privateToggleImg").attr("title", "This task is currently visible to others. Click to mark this task private so others cannot see the details");
	                        $("#privateToggleImg2").attr("title", "This task is currently visible to others. Click to mark this task private so others cannot see the details");
	                    } else {
	                        $('#private').attr('checked', true);
	                        $("#privateToggleImg").attr("src", "https://d9qolodtvydv6.cloudfront.net/Content/images/ico-lockbig.gif");
	                        $("#privateToggleImg2").attr("src", "https://d9qolodtvydv6.cloudfront.net/Content/images/ico-lockbig.gif");
	                        $("#privateToggleImg").attr("title", "This task is currently private. Click to make the details of this task viewable to others");
	                        $("#privateToggleImg2").attr("title", "This task is currently private. Click to make the details of this task viewable to others");
	                    }
	                    return false;
	                });

	                $('#privateToggle2').live("click", function() {
	                    if ($('#private').is(':checked')) {
	                        $('#private').attr('checked', false);
	                        $("#privateToggleImg").attr("src", "https://d9qolodtvydv6.cloudfront.net/Content/images/ico_lock_open.gif");
	                        $("#privateToggleImg2").attr("src", "https://d9qolodtvydv6.cloudfront.net/Content/images/ico_lock_open.gif");
	                        $("#privateToggleImg").attr("title", "This task is currently visible to others. Click to mark this task private so others cannot see the details");
	                        $("#privateToggleImg2").attr("title", "This task is currently visible to others. Click to mark this task private so others cannot see the details");	                
	                    } else {
	                        $('#private').attr('checked', true);
	                        $("#privateToggleImg").attr("src", "https://d9qolodtvydv6.cloudfront.net/Content/images/ico-lockbig.gif");
	                        $("#privateToggleImg2").attr("src", "https://d9qolodtvydv6.cloudfront.net/Content/images/ico-lockbig.gif");
	                        $("#privateToggleImg").attr("title", "This task is currently private. Click to make the details of this task viewable to others");
	                        $("#privateToggleImg2").attr("title", "This task is currently private. Click to make the details of this task viewable to others");
	                    }
	                    return false;
	                });	               
                    
                    $('#AssignedTo').change(function() {
	            if ($(this).val() == '') {
	                 $('#reminderDiv').show();
	                 $('#assignedDiv').hide();
                     //Tipped.remove('#AssignedToType');
                } else if ($(this).val().slice(0,5) == 'TEAM_') {
                     $('#reminderDiv').hide();
	                 $('#assignedDiv').show();
	            } else {
	                 $('#reminderDiv').hide();
	                 $('#assignedDiv').show();
                     //Tipped.remove('#AssignedToType');	
	            }
                

                var selected = $("option:selected", this);
                if(selected.parent()[0].id == "optgroupTeams"){
                    $("#AssignedToType").show();
                    //showAssignToTypeTipped()
                } else{
                    $("#AssignedToType").hide();
                }
	        });
            
            $('#AssignedToType').change(function() {
                //showAssignToTypeTipped();
                if($(this).val() == 'unique') {
                   $('#reminderDiv').hide();
                   $('#assignedDiv').hide(); 
                } else {
                    $('#reminderDiv').hide();
	                 $('#assignedDiv').show();
                }
                
            });
                  
                   $('#relatedTo').change(function() {
                $('#spinner').show();
	            var relatedID = $('#relatedTo').val();
                var title = $('#Title').val();
                $('#MilestoneStageLabel').remove();
                $('#MilestoneStageDropDown').remove();
                
                GetMilestonePipelineStageList();
                
	        });	  

            $('#MilestoneStageDropDown').live('focus', function() {
                $(this).focus(function() {
                    if (!$(this).parent().hasClass("errordiv")) {
                        $(this).parent().addClass('formFieldFocus');
                    }
                }).blur(function() {
                    $(this).parent().removeClass('formFieldFocus');
                });
            }); 
                  
                  
	          $("#Title").focus();        
          };
          
          function GetMilestonePipelineStageList() {
              var TaskID = $('#TaskID').val();
              var relatedID = $('#relatedTo').val();
              var params = {};
              params[gadgets.io.RequestParameters.AUTHORIZATION] = gadgets.io.AuthorizationType.SIGNED; 
              params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.GET;
              gadgets.io.makeRequest("http://" + envURL + "/gadget2/MilestonePipelineStageList/"+ relatedID + "?TaskID=" + TaskID, GetMilestonePipelineStageListResponse, params);
          }
          
          function GetMilestonePipelineStageListResponse(data) {
              var str = data.text;
              var title = $('#Title').val();
              $('#relatedOpportunityProject').append(str);
              if ((title) && (str)) { $('#MilestoneStageDropDown').focus(); }
              $('#spinner').hide();
          }
          
          function addOppScript() {
                  $("select#PIPELINE_ID").change(function() {
                      GetOppPipelineStageList();
                  });
                  
                  $("#STAGE_ID, #ActivitySetStartDate, #ActivitySetEndDate").change(function() {
                      $('#spinner').show();
                      var stageID = $("#STAGE_ID").val();
                      var DateStart = $('#ActivitySetStartDate').val();
                      var DateEnd = $('#ActivitySetEndDate').val();

                      if (stageID > 1) {
                          GetActivitySetActivityList();
                      } else {
                          $('#spinner').hide();
                          $('#ActivitySetActivities').hide();
                          $('#ActivitySetActivitiesDates').hide();
                      };
                  });
                  
                  $(':input:not([type="button"],[type="submit"],[type="checkbox"],[id="SearchInputString"],[class="selects"],[class="noHighlight"])').each(function() {
                            $(this).focus(function() {
                                if (!$(this).parent().hasClass("errordiv")) {
                                    $(this).parent().addClass('formFieldFocus');
                                }
                            }).blur(function() {
                                $(this).parent().removeClass('formFieldFocus');
                            });
                  });          
                  $("select#BID_TYPE").change(function() {
                        var bidTypeVal = $('#BID_TYPE').val();
                        switch (bidTypeVal) {
                            case 'Fixed Bid':
                                $('#SPAN_BID_DURATION').hide();
                                $('#durationOption').hide();
                                break;
                            case 'Per Hour':
                                $('#SPAN_BID_DURATION').show();
                                $('#durationOption').text('hours');
                                $('#durationOption').show();
                                break;
                            case 'Per Week':
                                $('#SPAN_BID_DURATION').show();
                                $('#durationOption').text('weeks');
                                $('#durationOption').show();
                                break;
                            case 'Per Month':
                                $('#SPAN_BID_DURATION').show();
                                $('#durationOption').text('months');
                                $('#durationOption').show();
                                break;
                            case 'Per Year':
                                $('#SPAN_BID_DURATION').show();
                                $('#durationOption').text('years');
                                $('#durationOption').show();
                                break;
                        }
                    });
                    var firstDayWeek = $("#TaskWeekStartsOn").val();
                    $("#forcastclosedate").datepicker({ showAnim: 'slideDown', showButtonPanel: true, dateFormat: 'D d-M-yy', firstDay: firstDayWeek });
                    
                    // permissions
                    $('#visibleToTeam').click(function () {
                        $('#groupSelection').show();
                        $('#individualsSelection').hide();
                    });
                    $('#visibleToIndividuals').click(function () {
                        $('#individualsSelection').show();
                        $('#groupSelection').hide();
                    });
                    $('#visibleToOwner').click(function () {
                        $('#individualsSelection').hide();
                        $('#groupSelection').hide();
                    });
                    $('#visibleToEveryone').click(function () {
                        $('#individualsSelection').hide();
                        $('#groupSelection').hide();
                    });
                    $("#userIDs").asmSelect({
                        addItemTarget: 'top',
                        animate: true,
                        highlight: false,
                        sortable: false
                    });

                    // expand
                    $('#showExpandedContactDetails').click(function() {
                        $('#contact_section').show();
                        $('#link_to_show_contact_section').hide();
                        $('#personPhoneNumber1').focus();
                    });

                    // Custom Fields Control
                    $("input[custom*=date]").datepicker({ showAnim: 'fadeIn', showButtonPanel: true, dateFormat: 'D d-M-yy', firstDay: firstDayWeek });
                    
                     $("#ActivitySetStartDate, #ActivitySetEndDate").datepicker({ showAnim: 'fadeIn', showButtonPanel: true, dateFormat: 'D d-M-yy', firstDay: firstDayWeek });  
                    
                    $('#ui-datepicker-div').show(); //For Mozilla Gadget window resize adjustment    
                    $('#ui-datepicker-div').hide(); //For Mozilla Gadget window resize adjustment    
                    $('#OPPORTUNITY_NAME').focus();
          };
          
          
          function GetOppPipelineStageList() {
              var pipelineID = $('#PIPELINE_ID').val();
              $('#spinner').show();
              var params = {};
              params[gadgets.io.RequestParameters.AUTHORIZATION] = gadgets.io.AuthorizationType.SIGNED; 
              params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.GET;
              gadgets.io.makeRequest("http://" + envURL + "/gadget2/OppPipelineStageListJSON/?id=" + pipelineID, GetOppPipelineStageListResponse, params);
          }
          
          function GetOppPipelineStageListResponse(data) {
              var j = eval(data.text);
              var options = '';
              for (var i = 0; i < j.length; i++) {
                  options += '<option value="' + j[i].optionValue + '">' + j[i].optionDisplay + '</option>';
              }
              $("#STAGE_ID").html(options);
              $('#STAGE_ID option:first').attr('selected', 'selected');
              $('#STAGE_ID').trigger('change');
              $('#spinner').hide();
          }
          
          function GetActivitySetActivityList() {
              $('#spinner').show();
              var stageID = $("#STAGE_ID").val();
              var DateStart = $('#ActivitySetStartDate').val();
              var DateEnd = $('#ActivitySetEndDate').val();
              var params = {};
              var postdata = {ActivitySetStartDate: DateStart, ActivitySetEndDate: DateEnd};
              params[gadgets.io.RequestParameters.POST_DATA] = gadgets.io.encodeValues(postdata);
              params[gadgets.io.RequestParameters.AUTHORIZATION] = gadgets.io.AuthorizationType.SIGNED; 
              params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.POST;
              gadgets.io.makeRequest("http://" + envURL + "/gadget2/ActivitySetActivityList/STAGE" + stageID, GetActivitySetActivityListResponse, params);
          }
          
          function GetActivitySetActivityListResponse(data) {
              var html = data.text;
              $('#ActivitySetActivities').show();
              $('#ActivitySetActivities').html(html);
              $('#spinner').hide();
              var hasActivity = $("#ActivitySetHasActivity").val();
              if (html.length == 0 | hasActivity == 0) {
                  $('#ActivitySetActivitiesDates').hide();
              } else {
                  $('#ActivitySetActivitiesDates').show();
                  var hasEndDate = $("#ActivitySetHasEndDate").val();
                  if (hasEndDate == 0) {
                      $("#ActivitySetEndDateDisplay").hide();
                  } else {
                      $("#ActivitySetEndDateDisplay").show();
                  }
              }
          }
          
          function addProjectScript() {
                    $("select#PIPELINE_ID").change(function() {
                      GetProPipelineStageList();
                    });
                    $("#STAGE_ID, #ActivitySetStartDate, #ActivitySetEndDate").change(function() {
                      $('#spinner').show();
                      var stageID = $("#STAGE_ID").val();
                      var DateStart = $('#ActivitySetStartDate').val();
                      var DateEnd = $('#ActivitySetEndDate').val();

                      if (stageID > 1) {
                          GetActivitySetActivityList();
                      } else {
                          $('#spinner').hide();
                          $('#ActivitySetActivities').hide();
                          $('#ActivitySetActivitiesDates').hide();
                      };
                    });
                    $(':input:not([type="button"],[type="submit"],[type="checkbox"],[id="SearchInputString"],[class="selects"],[class="noHighlight"])').each(function() {
                            $(this).focus(function() {
                                if (!$(this).parent().hasClass("errordiv")) {
                                    $(this).parent().addClass('formFieldFocus');
                                }
                            }).blur(function() {
                                $(this).parent().removeClass('formFieldFocus');
                            });
                    });
                    
                    // permissions
                    $('#visibleToTeam').click(function () {
                        $('#groupSelection').show();
                        $('#individualsSelection').hide();
                    });
                    $('#visibleToIndividuals').click(function () {
                        $('#individualsSelection').show();
                        $('#groupSelection').hide();
                    });
                    $('#visibleToOwner').click(function () {
                        $('#individualsSelection').hide();
                        $('#groupSelection').hide();
                    });
                    $('#visibleToEveryone').click(function () {
                        $('#individualsSelection').hide();
                        $('#groupSelection').hide();
                    });
                    $("#userIDs").asmSelect({
                        addItemTarget: 'top',
                        animate: true,
                        highlight: false,
                        sortable: false
                    });
                    
                    var firstDayWeek = $("#TaskWeekStartsOn").val();
                    
                    $("#ActivitySetStartDate, #ActivitySetEndDate").datepicker({ showAnim: 'fadeIn', showButtonPanel: true, dateFormat: 'D d-M-yy', firstDay: firstDayWeek });

                    // Custom Fields Control
                    $("input[custom*=date]").datepicker({ showAnim: 'fadeIn', showButtonPanel: true, dateFormat: 'D d-M-yy', firstDay: firstDayWeek });
                    
                    $('#PROJECT_NAME').focus();  
          };
          
          function GetProPipelineStageList() {
              var pipelineID = $('#PIPELINE_ID').val();
              $('#spinner').show();
              var params = {};
              params[gadgets.io.RequestParameters.AUTHORIZATION] = gadgets.io.AuthorizationType.SIGNED; 
              params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.GET;
              gadgets.io.makeRequest("http://" + envURL + "/gadget2/ProPipelineStageListJSON/?id=" + pipelineID, GetProPipelineStageListResponse, params);
          }
          
          function GetProPipelineStageListResponse(data) {
              var j = eval(data.text);
              var options = '';
              for (var i = 0; i < j.length; i++) {
                  options += '<option value="' + j[i].optionValue + '">' + j[i].optionDisplay + '</option>';
              }
              $("#STAGE_ID").html(options);
              $('#STAGE_ID option:first').attr('selected', 'selected');
              $('#STAGE_ID').trigger('change');
              $('#spinner').hide();
          }
          
          function addEventScript() {
              var firstDayWeek = $("#TaskWeekStartsOn").val();
              $("#startdate").datepicker({ showAnim: 'fadeIn', showButtonPanel: true, dateFormat: 'D d-M-yy', firstDay: firstDayWeek});
	            $("#enddate").datepicker({ showAnim: 'fadeIn', showButtonPanel: true, dateFormat: 'D d-M-yy', firstDay: firstDayWeek});
              $('#Title').focus();
              
              $('#startdate').datepicker('setDate', new Date());
              
              $('#enddate').datepicker('setDate', new Date());

               $('#startdate').datepicker('option', 'onSelect', function(dateText) {
                    try {
                        var startdate = $.datepicker.parseDate('D d-M-yy', $('#startdate').val());
                        if (isDate(startdate)) {
                            $('#enddate').datepicker('setDate', new Date(startdate));
                        } else {
                            $('#enddate').datepicker('setDate', new Date());
                        }
                    } catch (e) {
                        $('#enddate').datepicker('setDate', new Date());
                    }
               });
             
              $("#starttime, #endtime").timePicker({ show24Hours: false });
              var oldTime = $.timePicker("#starttime").getTime();
             $("#starttime").change(function() {
                 if ($("#endtime").val()) {
                     var duration = ($.timePicker("#endtime").getTime() - oldTime);
                     var time = $.timePicker("#starttime").getTime();
                     $.timePicker("#endtime").setTime(new Date(new Date(time.getTime() + duration)));
                     oldTime = time;
                 }
             });

          };
          
          function isDate(x) {
            return (null != x) && !isNaN(x) && ("undefined" !== typeof x.getDate);
          }
          
          function emailLinksScript() {
              var linkurl = "http://" + envURL + "/gadget2/LinkSearch/";
              $("#LinkTextBox").linkBoxAutocomplete(linkurl);
              $("#LinkTextBox").result(function (event, data, formatted) {
                  if (data) {
                      $('#LinkID').val(data[3]);
                      $('#linkName').val(data[0]);
                      $('#LinkType').val(data[2]);
                  };
              });
              
              $('#emailLinkAddButton').click(function() {
                  addNewEmailLink();
              }); 
              
              $('#emailLinksform').submit(function() {
                  addNewEmailLink();
                  return false;
              });

              $('.delNormLink').live("click", function() {      
                  var linkid = $(this).attr('id').replace('DELNORMLINK', '');
                  var params = {};  
                  var postdata = {LinkID: linkid};
                  params[gadgets.io.RequestParameters.AUTHORIZATION] = gadgets.io.AuthorizationType.SIGNED; 
                  params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.POST;
                  params[gadgets.io.RequestParameters.POST_DATA] = gadgets.io.encodeValues(postdata);
                  var url = "http://" + envURL + "/gadget2/EmailLinkDelete/"+ email_id;
                  gadgets.io.makeRequest(url, deleteEmailLinkResponse, params);                        
                  var parent = $(this).parent().parent();
                  var groupparent = $(this).parent().parent().parent();
                  var count = 0;
                  
                  parent.slideUp();
                  
                  setTimeout(function() {
                    parent.remove();
                    count = groupparent.children().size() - 1;
                    if(count == 0) {
                      groupparent.slideUp();
                    }
                  }, 400);
              });
              
              function deleteEmailLinkResponse(data) {
                  //Nothing to do
              };
              
              $('.addSugLink').live("click", function() {      
                  var linkid = $(this).attr('id').replace('SUGLINK', '');
                  var linktype = linkid.substring(0, 3);
                  
                  var params = {};
                  var postdata = {
                      LinkID: linkid,
                      LinkType: linktype
                  };
                  params[gadgets.io.RequestParameters.AUTHORIZATION] = gadgets.io.AuthorizationType.SIGNED; 
                  params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.POST;
                  params[gadgets.io.RequestParameters.POST_DATA] = gadgets.io.encodeValues(postdata);
                  var url = 'http://' + envURL + '/gadget2/EmailLinkCreate/'+ email_id;
                  gadgets.io.makeRequest(url, addNewEmailLinkResponse, params);
                  
                  var parent = $(this).parent().parent();
                  var groupparent = $(this).parent().parent().parent();
                  var count = 0;
                  
                  parent.slideUp();
                  
                  setTimeout(function() {
                    parent.remove();
                    count = groupparent.children().size() - 1;
                    if(count == 0) {
                      groupparent.slideUp();
                    }
                  }, 400);
                  
                  
                  
              });
          };

          $(document).ready(function () {
              console.log("Call Init Gadget Function..");
              gadgets.util.registerOnLoadHandler(init);
              console.log("Called Init Gadget Function.");
          });

        