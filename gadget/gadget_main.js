      function fetchData() {

            console.log('incwo gadget');

            //Extractor Vars

            var from_address;
            var to_address;
            var cc_address;
            var email_body;
            
            
            matches = google.contentmatch.getContentMatches();

            console.log("Init Gadget");
                  for (var match in matches) {
                        for (var key in matches[match]) {

                            if (key == "recipient_to_email") {
                                to_address = matches[match][key];
                            }
                            if (key == "recipient_cc_email") {
                                cc_address = matches[match][key];
                            }
                            if (key == "sender_email") {
                                from_address = matches[match][key];
                            }
                            if (key == "email_body") {
                                email_body = matches[match][key];
                            }
                     
                        }
                  }

            console.log(from_address);
            console.log(to_address);
            console.log(cc_address);

            var params = {};
            url = "http://web1.tunnlr.com:13189/gadget/contextual_gadget_contacts";
            console.log(url);
            params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.JSON;
            params[gadgets.io.RequestParameters.AUTHORIZATION] = gadgets.io.AuthorizationType.OAUTH;
            params[gadgets.io.RequestParameters.OAUTH_SERVICE_NAME] = "google";
            params[gadgets.io.RequestParameters.OAUTH_USE_TOKEN] = "always";
            params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.GET;

            gadgets.io.makeRequest(url, function (response) { 
              if (response.oauthApprovalUrl) {

                var popup = shindig.oauth.popup({ destination: response.oauthApprovalUrl,
                                                  windowOptions: null,
                                                  onOpen: function() { showOneSection('waiting'); },
                                                  onClose: function() { fetchData(); }
                                                });
                var personalize = document.getElementById('personalize');
                personalize.onclick = popup.createOpenerOnClick();
                var approvaldone = document.getElementById('approvaldone');
                approvaldone.onclick = popup.createApprovedOnClick();
                showOneSection('approval');

              } else if (response.data) {
                showOneSection('main');
                showResults(response.data);
              } else {
                var main = document.getElementById('main');
                var err = document.createTextNode('OAuth error: ' +
                response.oauthError + ': ' + response.oauthErrorText);
                main.appendChild(err);
                showOneSection('main');
              }
            }, params);
          }

        /*************************************************************************************************/

        function showResults(result) {
          showOneSection('main');
          console.log(result);
          jQuery('#main').html(result);
        }

        /*************************************************************************************************/

        function showOneSection(toshow) {
          var sections = [ 'main', 'approval', 'waiting' ];
          for (var i=0; i < sections.length; ++i) {
            var s = sections[i];
            var el = document.getElementById(s);
            if (s === toshow) {
              el.style.display = "block";
            } else {
              el.style.display = "none";
            }
          }
        }
        /*************************************************************************************************/
        
        gadgets.util.registerOnLoadHandler(fetchData);

        /*************************************************************************************************/