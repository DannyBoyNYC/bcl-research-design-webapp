
var DEFAULT_SUBJECT_BODY = new Array("");
var DEFAULT_MESSAGE_BODY = new Array("Enter message","I have shared an item with you");
var DEFAULT_WIDGET_TITLE = "Share";
var contactLoadTimestamp = new Date(2014,1,1).getTime();
var inWatchList=false;
var renderOnBody = true;
var errorMessageToShowInDiv = "Your Message was not sent";
var defaultWidthForError = 240;
var defaultLeftForError = -150;
var additionalOffset = 20;
var prefixToUse = "/BC_S";
var isEmployee = true;
	
var BrowserDetect = 
{
    init: function () 
    {
        this.browser = this.searchString(this.dataBrowser) || "Other";
        this.version = this.searchVersion(navigator.userAgent) ||       this.searchVersion(navigator.appVersion) || "Unknown";
    },

    searchString: function (data) 
    {
        for (var i=0 ; i < data.length ; i++)   
        {
            var dataString = data[i].string;
            this.versionSearchString = data[i].subString;

            if (dataString.indexOf(data[i].subString) != -1)
            {
                return data[i].identity;
            }
        }
    },

    searchVersion: function (dataString) 
    {
        var index = dataString.indexOf(this.versionSearchString);
        if (index == -1) return;
        return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
    },

    dataBrowser: 
    [
        { string: navigator.userAgent, subString: "Chrome",  identity: "Chrome" },
        { string: navigator.userAgent, subString: "MSIE",    identity: "Explorer" },
        { string: navigator.userAgent, subString: "Firefox", identity: "Firefox" },
        { string: navigator.userAgent, subString: "Safari",  identity: "Safari" },
        { string: navigator.userAgent, subString: "Opera",   identity: "Opera" }
    ]

};
BrowserDetect.init();

function loadStyleSheet(path, fn, scope ) {
	var head = document.getElementsByTagName( 'head' )[0], // reference to document.head for appending/ removing link nodes
	link = document.createElement('link');           // create the link node
	link.setAttribute( 'href', path);
	link.setAttribute( 'rel', 'stylesheet' );
	link.setAttribute( 'type', 'text/css' );

	var sheet, cssRules;
// get the correct properties to check for depending on the browser
	if ( 'sheet' in link ) {
		sheet = 'sheet'; cssRules = 'cssRules';
	}else {
		sheet = 'styleSheet'; cssRules = 'rules';
	}

	var timeout_id = setInterval( function() {                     // start checking whether the style sheet has successfully loaded
          try {
             if ( link[sheet] && link[sheet][cssRules].length ) { // SUCCESS! our style sheet has loaded
                clearInterval(timeout_id);                      // clear the counters
                clearTimeout(timeout_id);
                fn.call( scope || window, true, link );           // fire the callback with success == true
             }
          } catch( e ) {} finally {}
    }, 10 ),                                                   // how often to check if the stylesheet is loaded
    timeout_id = setTimeout( function() {       // start counting down till fail
          clearInterval( timeout_id );             // clear the counters
          clearTimeout( timeout_id );
          head.removeChild( link );                // since the style sheet didn't load, remove the link node from the DOM
          fn.call( scope || window, false, link ); // fire the callback with success == false
       }, 15000);                                 // how long to wait before failing

	head.appendChild(link);  // insert the link node into the DOM and start loading the style sheet
	
	return link; // return the link node;
}

$(document).ready(function() {
	
	jQuery.cachedScript = function( url, options ) {
		// Allow user to set any option except for dataType, cache, and url
		options = $.extend( options || {}, {
			dataType: "script",
			cache: true,
			url: url
		});
	 
		// Use $.ajax() since it is more flexible than $.getScript
		// Return the jqXHR object so we can chain callbacks
		return jQuery.ajax( options );
	};
	
	$.cachedScript(prefixToUse+"/js/mustache/mustache.js" )
		.done(function( script, textStatus ) {
		
		})
		.fail(function( jqxhr, settings, exception ) {
		
	});
	$.cachedScript( prefixToUse+"/js/jquery.slimscroll.min.js" )
		.done(function( script, textStatus ) {
		
		})
		.fail(function( jqxhr, settings, exception ) {
		
	});
	$.cachedScript( prefixToUse+"/js/modernizr.custom.86787.js" )
		.done(function( script, textStatus ) {
		
		})
		.fail(function( jqxhr, settings, exception ) {
		
	});

	$.cachedScript( prefixToUse+"/bl_rebrand/js/IEround.js" )
		.done(function( script, textStatus ) {
		
		})
		.fail(function( jqxhr, settings, exception ) {
		
	});
	loadStyleSheet(prefixToUse+'/css/mresearch/messaging/share.css',function(success, link ){});
	if (BrowserDetect.browser=='Explorer' ) {
		
		loadStyleSheet(prefixToUse+'/css/mresearch/messaging/share_ie.css',function(success, link ){});
		if(BrowserDetect.version == "7.0"){
			loadStyleSheet(prefixToUse+'/css/mresearch/messaging/share_ie7.css',function(success, link ){});
			
		}
		if(BrowserDetect.version == "8.0"){
			loadStyleSheet(prefixToUse+'/css/mresearch/messaging/share_ie8.css',function(success, link ){});
			
		}
		if(BrowserDetect.version == "10.0"){
			//loadStyleSheet(prefixToUse+'/css/mresearch/messaging/subscriptions_ie10.css',function(success, link ){});
		}
	}
	
	jQuery.ajax({url:'/BC/S/usercheck', headers: {Accept : 'application/json'}}).done(function(data){
	if(data != undefined && data.statusCode === 0){
		isEmployee = false;
	}else{
		isEmployee = true;
	}});
	
	//alert(navigator.sayswho);
});

var contactsAppInitialized = false;

var iframeToAdd = '<iframe id="iframeshimOtherContent" src="/BC_S/html/blankpage.html" frameBorder="0" scrolling="no" style="z-index: 2000; position: absolute; filter: progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0);display: none">';

var composeTemplate = 
'<div id="compose-panel-modal"></div>'+
'<div id="compose-panel-modal-confirmation"></div>'+
'<div id="compose-panel" class="compose-panel" style="max-height:1000px;height:auto;border-radius:4px;top: 20px;margin-left:0px;">'+
'	<div id="message-panel" style="position:relative;margin:0px auto;">'+
'		<div class="compose-header">'+
'		'+
'			<a style="position:relative;float:left;margin-left:25px;margin-top:10px;margin-bottom:10px;" id="cancelBtn" class="minimalComposeButton" href="javascript:void(0)">Cancel</a>'+
'			<h4 style="margin-left:150px;font-size:18px;font-family:Expert-Sans-Regular;">{{widgetTitle}}</h4>'+
'			<a id="composeSendButton" class="minimalComposeBtn mynewClass composeSend send UA-Instrument minimalComposeBtnDisabled" data-ua-instrument="true" data-ua-page-name="Connect" data-ua-menu-code="MENU_FI_WELCOME" data-ua-feature-name="Send Message" data-ua-feature-type="Messages"  style="margin-right: 25px;float:right;margin-top:10px;margin-bottom:10px;border: 1px solid #DDDDDD;" href="javascript:void(0)">Send</a>'+
'			'+
'		</div>'+
'		'+
'        <div class="sender-line" style="position:relative;padding-top: 2px;padding-bottom: 2px;height:auto;min-height:40px;">'+
'		'+
'       	<div style="position:absolute;"><a href="javascript:void(0)" title="" class="minimalComposeButton contactsBtn" style="position: relative; margin-top: 3px; margin-bottom:3px; float: left; white-space:nowrap;margin-left:5px;"> + Contacts</a></div>'+ 
'           <div class="contactNames" style="margin-top:0px;width:450px;margin-bottom: 0px;overflow:hidden;top: 0px;margin-left: 0px;left: 0px;float: right;min-height: 35px;height:auto;font:12px Arial;"></div>'+ 
'			'+
'		</div>'+
'		<span class="contactSelectionContainer" id="contactSelectionContainer">'+
'		</span>'+
'		'+
'		<div class="sender-line" style="position:relative;padding-top: 2px;padding-bottom: 2px;">'+
'		'+
'			<div id="subject-prefix" contenteditable="false" style="top:-5px;top:-3px\9;*top:-3px;position:absolute;height:20px;margin-left: 5px;margin-top:10px;*margin-top:8px;margin-top:8px\9;line-height:32px;float:left;color:#abaCad; width:10%;" class="compose-subject">Subject:</div>'+
'			<div id="subject" contenteditable="true" style="font:12px Arial;position: relative; padding-top: 2px;  left: -10px; line-height: 22px; height: 17px; float: right; width: 87%; margin-top: 7px;*margin-top:5px;" class="compose-subject"></div>'+
'		'+
'		</div>'+
'		{{#isEmployee}}'+
'		<div class="sender-line" style="position:relative;padding-top: 2px;padding-bottom: 2px;">'+
'		'+
'			<div style="position: relative;left: 5px;top: 10px;"><div id="sendMeCopySelection" class="msgChecker"><span class="copy" ><input type="checkbox" id="ackMsg" class="copyCheck" style="padding-right:5px;" height="15" width="15" /></span></div><span style="position:relative;top:-1px;top:-5px\9;float:left;">Send me a copy</span></div>'+
'		'+
'		</div>	'+
'		{{/isEmployee}}'+
'		<div contenteditable="true" style="line-height:20px;margin-left:25px;height: 180px; margin-top:10px;margin-right:25px;font:12px Arial;overflow-x:hidden;overflow-y:auto;word-wrap:break-word;" class="compose-body">{{body}}</div>'+
'		{{#itemsPresent}}'+
'		<div class="attachments" style="padding-left: 30px; padding-top: 15px;padding-right: 30px;border-top: 1px solid #E6E6E6;height:auto;max-height:300px;overflow:auto;">'+
'		{{#items}}'+
'			{{#tileItem}}'+
'				<div style="float:left; width:60px;"><img src="{{thumbnailURI}}" width="41" height="52" style="margin-right:10px;"></div>'+
'				<div style="padding-bottom:30px;">'+
'					<div class="tileAttachmentContainer"><p style="font-size:10px; color:#036; margin:0;padding:0;">New Tile:</p>'+
'						<h3 style="margin:0; padding:0;"><a href="{{url}}"> {{heading1}} </a></h3>'+
'						<p class="dateTime">{{dateToDisplay}}</p>'+
'					</div>'+
'				</div>'+
'			{{/tileItem}}'+
'			{{#chartItem}}'+
'				<div style="float:left; width:60px;"><img src="{{thumbnailURI}}" width="41" height="52" style="margin-right:10px;"></div>'+
'				<div class="chartAttachmentContainer">'+
'					<div style="padding-bottom:30px;"><p style="font-size:10px; color:#036; margin:0;padding:0;">Chart:</p>'+
'						<h3 style="margin:0; padding:0;"><a href="{{url}}">{{heading2}}</a></h3><p class="dateTime">{{dateToDisplay}}</p>'+
'					</div>'+
'				</div>'+
'			{{/chartItem}}'+
'			{{#publicationItem}}'+
'				<div style="float:left; width:60px;"><img src="{{thumbnailURI}}" width="41" height="52" style="margin-right:10px;"></div>'+
'				<div class="publicationAttachmentContainer">'+
'					<div style="padding-bottom:40px;"><p style="font-size:10px; color:#036; margin:0;padding:0;">{{heading1}}</p>'+
'						<h3 style="margin:0; padding:0;"><a href="{{url}}">{{heading2}} </a></h3><p class="dateTime">{{dateToDisplay}}</p>'+
'					</div>'+
'				</div>'+
'			{{/publicationItem}}'+
'			{{#textItem}}'+
'				<div style="float:left; width:60px;"><img src="{{thumbnailURI}}" width="41" height="52" style="margin-right:10px;"></div>'+
'				<div class="clippingAttachmentContainer">'+
'					<div style="padding-bottom:10px;"><p style="font-size:13px;font-style:italic; color:#036; padding:0;">{{partialText}}</p>'+
'						<p style="padding-top: 10px;font-size: 10px;">Excerpt from:</p>'+
'						<p style="font-size:10px; color:#036; margin:0;padding:0;">{{heading1}}</p>'+
'						<h3 style="margin:0; padding:0;"><a href="{{url}}">{{heading2}} </a></h3><p class="dateTime">{{dateToDisplay}}</p>'+
'					</div>'+
'				</div>'+
'			{{/textItem}}'+
'		{{#webItem}}'+
'				<div style="float:left; width:60px;"><img src="{{thumbnailURI}}" width="41" height="52" style="margin-right:10px;"></div>'+
'				<div class="publicationAttachmentContainer">'+
'					<div style="padding-bottom:40px;"><p style="font-size:10px; color:#036; margin:0;padding:0;">{{heading1}}</p>'+
'						<h3 style="margin:0; padding:0;"><a href="{{url}}">{{heading2}} </a></h3><p class="dateTime">{{dateToDisplay}}</p>'+
'					</div>'+
'				</div>'+
'			{{/webItem}}'+
'		{{#modelItem}}'+
'				<div style="float:left; width:60px;"><img src="{{thumbnailURI}}" width="41" height="52" style="margin-right:10px;"></div>'+
'				<div class="modelAttachmentContainer">'+
'					<div style="padding-bottom:40px;"><p style="font-size:10px; color:#036; margin:0;padding:0;">{{heading1}}</p>'+
'						<h3 style="margin:0; padding:0;"><a href="{{url}}">{{heading2}} </a></h3><p class="dateTime">{{dateToDisplay}}</p>'+
'					</div>'+
'				</div>'+
'			{{/modelItem}}'+
'		{{/items}}'+
'		</div>'+
'		{{/itemsPresent}}'+
'		<div style="border-top: 1px solid #E6E6E6;">'+
'			<p style="padding-top:10px;margin-left:25px;color: #ABACAD;font: 9px/1.5em verdana,san-serif;margin-right: 25px;">'+
'				This message is for information purposes only, it is not a recommendation, advice, offer or solicitation to buy or sell a product or service nor an official confirmation of any transaction. It is directed at persons who are professionals and is not intended for retail customer use. Intended for recipient only. This message is subject to the terms at: <a style="font-size:9px" target="_blank" href="http://www.barclays.com/emaildisclaimer/">www.barclays.com/emaildisclaimer</a>.'+
'			</p>'+
'			<p style="margin-left:25px;color: #ABACAD;font: 9px/1.5em verdana,san-serif;margin-right: 25px;">'+
'				For important disclosures, please see: <a style="font-size:9px" target="_blank" href="http://www.barclays.com/salesandtradingdisclaimer">www.barclays.com/salesandtradingdisclaimer</a> regarding market commentary from Barclays Sales and/or Trading, who are active market participants; and in respect of Barclays Research, including disclosures relating to specific issuers, please see <a style="font-size:9px" target="_blank" href="http://publicresearch.barclays.com">http://publicresearch.barclays.com</a>.'+
'			</p>'+
'		</div>'+
'		<div class="compose-footer" style="positive:relative;position:relative;margin-left:0px;"></div>'+
'	</div>'+
'	'+
'	<div id="contacts-widget-page" style="display:none"></div>'+
'</div>'+
'	<div class="confirmDiv" style="position: absolute; top: 200px;top:-140px\9;*top:160px;margin:0 auto;border-radius: 5px;left:50%; margin-left:-150px;"> '+
'		<span class="list_arrow">Arrow</span> '+
'		<p>Empty Subject </p> '+
'		<p style="margin-bottom:12px;">This message has no subject. Do you want to send it anyway?</p> '+
'		<p id="delete-options"> '+
'		<a class="confirmbtn yesno btn-default" style="float:left;text-align:center;" id="bNo">Cancel</a> '+
'		<a class="confirmbtn yesno btn-primary"  style="float:right;text-align:center;" id="bYes">Send</a> '+
'		</p> '+
'	</div> '+
'	<div class="confirmMsgSent" style="position: absolute; top:200px;*top:200px;text-align:center;vertical-align:middle;left:50%;margin-left:-150px;"><a href="#" class="close" id="close"></a>'+
'      <p style="vertical-align:middle;top:20px\9;position:relative;"><strong  style="vertical-align:middle;position:relative;top:40px\9;">Message has been sent</strong><br></p>'+
'   </div>'+
'	<div class="confirmMsgFailed" style="position: absolute; top:200px;top:200px\9;*top:200px;text-align:center;left:50%;margin-left:-150px;"><a href="#" class="close" id="confirmMsgFailed_close"></a>'+
'      <br/><h2 style="text-align:center;padding-left:28px;font:Verdana, "Expert-Sans-Regular", sans-serif;">Send Failed</h2><br/><div>Your Message was not sent</div><p/>'+
'   </div>'+
'	<div class="confirmMsgFailedOverLimit" style="position: absolute; top:200px;top:200px\9;*top:200px;text-align:center;left:50%;margin-left:-150px;"><a href="#" class="close" id="confirmMsgFailedOverLimit_close"></a>'+
'      <div><p id="errorMessageToShowInDiv"></p></div>'+
'   </div>';


var contactNamesTemplate=
'<div id="contact-current-selection" style="height:36px;padding: 4px 10px 10px 0px;display:inline;zoom:1;*display:inline;top: 9px;position: relative;*top:1px;left:-5px;">'+ 
'        <ul id="contact-current-list" style="margin-top:18px;*margin-top:10px;margin-bottom:0px;display:inline;zoom:1;*display:block;clear:both;">'+ 
'		{{#recipients}}'+
'		{{#isNotColleague}}'+
'			<li id="li_allcontacts_{{key}}" class="contact-current-name" style="display: inline-block;padding-top: 0px;margin-right:2px;zoom:1;*display:inline;padding-left:7px;">'+
'				<span id="li_selectedContact_{{key}}" style="border:0;color:#00AEEF;float: left;margin: 0 2px 2px 0;padding: 0 4px 0 16px;cursor: pointer;white-space: nowrap;background:url(/BC_S/images/icon_close_cyan.png) no-repeat scroll center left;height:20px;line-height:20px;"></span><span id="list_name_{{key}}" style="cursor: pointer; border:0px;margin-top: 0px; padding-top: 0px;white-space:pre;">{{length}} {{name}}&nbsp;&nbsp;&nbsp;&nbsp;|</span>'+
'			</li>'+
'			<li class="li_allcontacts_delimiter_{{key}}" style="display: inline-block;*display:inline;*position:relative;*top:-6px;padding-top: 0px;padding-left:0px;margin-right:0px;clear:both;"></li>'+
'		{{/isNotColleague}}'+
'		{{#isColleague}}'+
'			{{#values}}'+
'			<li class="contact-current-name" id="li_{{user}}" style="display: inline-block;padding-top: 0px;margin-right:2px;zoom:1;*display:inline;padding-left:7px;white-space:pre;">'+
'			{{first}} {{last}}&nbsp;&nbsp;&nbsp;&nbsp;|<label><span id="li_selectedColleague_{{user}}" style="padding-top:0px; color:#00AEEF;float: right;border:0px; cursor: pointer;background:url(/BC_S/images/icon_close_cyan.png) no-repeat scroll center right;height:20px;line-height:20px;"></span></label>'+
'			</li>'+
'		<li class="li_delimiter_{{user}}" style="display: inline-block;*display:inline;*position:relative;*top:-6px;padding-top: 0px;padding-left:0px;margin-right:0px;clear:both;"></li>'+
'			{{/values}}'+
'		{{/isColleague}}'+
'		{{/recipients}}'+
'	</ul>'+
'</div>';

var contactPopupSelectionTemplate=
'		<div class="popWin clearfix contactSelection" id="popup_{{key}}" style="z-index:9999;display:none"> '+
'       		<div class="popHeader" style="margin-top: 0px;text-align:center;border-top-left-radius: 5px;border-top-right-radius: 5px;">'+
'					<p class="smallCapsHeader" style="margin:0px;margin-left: 40px;margin-left:50px\9;*margin-left:50px;float:left;padding:0px;margin-top:8px;">Remove Contact(s)</p>'+
'       			<div class="talkBubbleTop" style="right:100px"></div>'+
'       		</div>'+
'				<div id="popBody_div_{{key}}" class="popBody">'+
'     			<table class="minimalGrayTable" style="margin:0; width:200px; ">'+
'          		<tbody>'+
'		  		{{#values}}'+
'		  		<tr id="tr_uniform_radio_{{user}}">'+
'            	<td class="td_pad" style="width:5%;padding-left: 10px;"><label style="float:left;">'+
'              		<div class="deleteEntry" id="uniform_radio_{{user}}"></div>'+
'            		</label>  '+
' 				</td>'+
'				<td style="width:70%;position:relative;padding-left:8px;padding-left:8px\9;*padding-left:5px;left:-6px;left:5px\9;*left:17px;">  <span class="userName">'+
'            		{{first}} {{last}}</span>'+
'					<span class="userFirm">{{firm}} </span>'+
'          		</td></tr>'+
'		  		{{/values}}'+
'        		</tbody></table>'+
'				</div>'+
'       		<div class="popFooter" >'+
'            		<a style="position: relative;margin-top:5px;margin-bottom:2px; padding-bottom: 6px; padding-top: 6px; border-top-width: 1px;text-align:center;color:rgb(255, 0, 0);" id="deleteAllContacts_{{key}}" class="deleteAllContacts" href="javascript:void(0)">Delete All</a>'+
'         		</div>    '+
'   	</div>';

var messageToSend = {};


var initializeContactWidget = function(element){
	if(element){
		var modalConfig = {isModal:true,callbackMethod:"pushUsersToMessageDialog"};
		angular.module('connectContactsApp').value('modalConfig', modalConfig);
		angular.bootstrap(element, ["connectContactsApp"]);
		if(messageToSend.recipients && messageToSend.recipients.length >0){
			window.selectedUsers = messageToSend.recipients;
			selectedUsersWatch.trigger();
		}
		return true;
	}
	return false;
}

function getScopeReference(){
	if(!renderOnBody){
		return window.top.document.body;
	}else{
		return document.body;
	}
}

function pushUsersToMessageDialog(response){
	if(response && response.recipients && response.recipients.length > 0){
		if(!messageToSend.recipients){
			messageToSend.recipients = [];
		}
		messageToSend.recipients = response.recipients;
	}
	
	$('#contacts-widget-page',getScopeReference()).hide();
	$('#message-panel',getScopeReference()).show();
	
	fillContactDetails(messageToSend.recipients);
	
}

function fillContactDetails(recipients){

	var setupDisplayData = function(recipients){
		//alert("how many recipients:"+recipients.length);
		
		if(recipients.length > 0){
			var listAndEntries = [];
			var listName=null;
			
			for(var k=0;k<recipients.length;k++){
				var recipientEntry = recipients[k];
				var entryToUse = null;
				$contactField=$('#faceScroll',getScopeReference());
			
				// change the deparment to parent folder
				if(recipientEntry.list.toLowerCase()==recipientEntry.firm){
						recipientEntry.list=$('#faceScroll li:eq(3) .listName',getScopeReference()).html();						
				}
				if(listAndEntries){
					//count the recipient to that block with same key
					for(var i=0;i<listAndEntries.length;i++){
						if(listAndEntries[i].name == recipientEntry.list){
							entryToUse = listAndEntries[i];
							break;
						}
					}
				}
				if(entryToUse!=null){
					entryToUse.values.push(recipientEntry);
				}else{
					//add new block, recent, colleague, or client list
					listAndEntries.push({'key':recipientEntry.list.toLowerCase().replace(/ /g, '_'),'name':recipientEntry.list, values:[recipientEntry]});
				}
			}
			if(listAndEntries){
				for(var i=0;i<listAndEntries.length;i++){
					listAndEntries[i].length = listAndEntries[i].values.length;
					listAndEntries[i].isColleague = listAndEntries[i].key == 'colleague';
					listAndEntries[i].isNotColleague = !listAndEntries[i].isColleague;
					//change the block name to recipient name when the block only contains one recipient
					if(listAndEntries[i].length==1){
						
						listAndEntries[i].name=listAndEntries[i].values[0].first+" "+listAndEntries[i].values[0].last;
						listAndEntries[i].length=null;
						
					}
				}
			}
		}
		return listAndEntries;
	};

	if (recipients && recipients.length>0) {
		$('.contactsBtn',getScopeReference()).css("margin-right", "20px");	
		// Preprocess the recipients list

		var listAndEntries = setupDisplayData(recipients);
		
		var hideAllVisiblePopups = function(excludeDivId){
			var activeId = null;
			if($('#contactSelectionContainer .contactSelection',getScopeReference()).is(":visible") && $('#contactSelectionContainer .contactSelection',getScopeReference()) && $('#contactSelectionContainer .contactSelection',getScopeReference()).attr('id')){
				$('#contactSelectionContainer .contactSelection',getScopeReference()).each(function(entry,val){
					if(excludeDivId && excludeDivId == val.id){
						// do nothing
					}else{
						if($('#'+val.id,getScopeReference()).is(":visible")){
							$('#'+val.id,getScopeReference()).hide();
						}
					}
				});
			}
		};
		
		var repositionPopup = function(clickX, clickY, divId, objDiv) {
				
				var bufferXOnClick = 14;
				var bufferYOnClick = 6;
				var bufferXOnDiv = -23;
				var bufferYOnDiv = 24;
		
				var offset = $(objDiv,getScopeReference()).offset();
				var relX = offset.left;
				var relY = offset.top;
				var bufferX = bufferXOnDiv;
				var bufferY = bufferYOnDiv;
				var rightXOnly = 5;
				var rightX = 5;
				var rightY = 10;
				
				var offset = new Object(); 
				offset.left = relX + bufferXOnDiv;
				offset.top = relY + bufferYOnDiv;
				//alert("123");
				$(divId,getScopeReference()).offset(offset);
			};
		var adjustRecipientField=function(){
			//alert("lala");
			var curHeight=$('#contact-current-selection',getScopeReference()).height();
			//alert(curHeight);
			var diffHeight=$('#contact-current-selection',getScopeReference()).height()-28;
			var newHeight=curHeight+diffHeight;
			//alert("newHeight"+newHeight);
			var newMarginTop=diffHeight-2;
			var curHeightLater=$('#contact-current-selection',getScopeReference()).height();
			
			//alert(newHeight);
			if(newHeight>40||curHeight<curHeightLater){
				
				//alert(curHeight+"  >39");
				//newHeight=$('#contact-current-selection',getScopeReference()).height()+diffHeight;
				$('.contactsBtn',getScopeReference()).css("margin-top",newMarginTop+"px");
				$('.contactNames',getScopeReference()).parent().css("height",newHeight);
				
			}else{
				//alert(curHeight+"  <39");
				$('.contactNames',getScopeReference()).parent().css("height","40px");
				$('.contactsBtn',getScopeReference()).css("margin-top","3px");
			}
			
			//alert($('.contactNames',getScopeReference()).parent().css("height"));
		};
		$('.contactNames',getScopeReference()).html(Mustache.to_html(contactNamesTemplate,{"recipients":listAndEntries}));
	
		
		
		
		// Now attach appropriate events to all the entries that were added.
		if(listAndEntries){
			for(var i=0;i<listAndEntries.length;i++){
				var listEntry = listAndEntries[i];
				if(listEntry.isColleague){
					for(var j=0;j<listEntry.values.length;j++){
						var entry = listEntry.values[j];
						// We do not have popup option here
						var prefixForClickEle = 'li_selectedColleague_';
						var divId = 'li_selectedColleague_'+entry.user;
						$('#'+divId,getScopeReference()).unbind('click');
						$('#'+divId,getScopeReference()).on('click', function (event) {
								var idToRemove = event.target.id;
								var entryToRemove = idToRemove.substring(prefixForClickEle.length);
								// Iterate through the selection
								if(recipients){
									var indexToRemove = -1;
									for(var i=0;i<recipients.length;i++){
										if(entryToRemove == recipients[i].user){
											indexToRemove = i;
											break;
										}
									}
									if(indexToRemove > -1){
										recipients.splice(indexToRemove,1);
										window.selectedUsers = recipients;
										window.selectedUsersWatch.trigger();
										messageToSend.recipients = recipients;
										// Paint the contacts again
										$('#li_'+entryToRemove,getScopeReference()).remove();
										$('#li_delimiter_'+entryToRemove,getScopeReference()).remove();
									}
									checkSendButtonStatus();
									
								}
							});
						}
						
				}else{
					
					//alert(listEntry.key);
					// Popup exists so we have to attach click event
					// Attach the popup content to the corresponding list name
					var divIdToReplace = 'list_'+listEntry.key;
					if($('#'+divIdToReplace,getScopeReference())){
						$('#'+divIdToReplace,getScopeReference()).remove();		
					}
					$('<div id="'+divIdToReplace+'"></div>').html(Mustache.to_html(contactPopupSelectionTemplate,listEntry)).appendTo('.contactSelectionContainer',getScopeReference());
					
     				
					//when pick recent or colleague to show details the css
					
					var showOrHidePopup=function(event){
						// Find the list name from the click event
						var listName = event.target.id.substr('list_name_'.length);
						// Get the id for the popbody content div
						var divId = 'popBody_div_'+listName;
						// Hide all other contactSelections
						//alert("456");
						hideAllVisiblePopups('popup_'+listName);
						var relX = 0; 
						var relY = 0; 

						if (event.pageX || event.pageY) { 
							relX = event.pageX; 
							relY = event.pageY; 
							//alert("1   "+relX);
						} 
						else if (event.clientX || event.clientY) { 
							relX = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
							relY = event.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
							//alert("2   "+relX);
						}
						
						// Show the popup
						var leftDiv=$('.compose-panel',getScopeReference()).position().left;
						var leftPopUp=100;
						var relLeft=relX-leftDiv-leftPopUp;
						if(relLeft>380){
							relLeft=360;
						}
						$('#popup_'+listName).css("left",relLeft+"px");
						$('#popup_'+listName).toggle();
						if($('#popup_'+listName,getScopeReference()).is(":visible")){
							repositionPopup(relX,relY,'#popup_'+listEntry.key,'#li_allcontacts_'+listEntry.key);
						}
						// If the popup is visible then adjust the height
						if($('#contactSelectionContainer .contactSelection',getScopeReference()).is(":visible")){
							var containerSize = $('.compose-panel',getScopeReference()).height();
							var diffHeight = containerSize-175;
							if(diffHeight > 500){
								diffHeight = 500;
							}
							$('#contactSelectionContainer .contactSelection #'+divId,getScopeReference()).height(diffHeight);
							// Attach the slim scroll to the div tag
							$('.popBody',getScopeReference()).slimScroll({
									width: '200px',
									height: diffHeight+'px',
									size: '6px',
									position: 'right',
									color:'#00AEEF',
									alwaysVisible: true,
									railVisible: true,
									railColor: '#222',
									railOpacity: 0.3,
									wheelStep: 10,
									allowPageScroll: false,
									disableFadeOut: false    
							});	
						}
					};
					
					// On clicking of the list name attach the popup body hide/show event
					$('#list_name_'+listEntry.key,getScopeReference()).on('click',showOrHidePopup);
					
					// For each and every entry that has been rendered in the popup
					// attach the event to remove the entry
					var deleteListEntry = function(event){
						// Find the user id from the click
						var userId = event.target.id.substr("uniform_radio_".length);
						var listNameToRemove = null;
						if(userId){
							var newRecipients = [];
							var listChanged = null;
							var beforeListEntries = setupDisplayData(recipients);
							for(var k=0;k<recipients.length;k++){
								var entry = recipients[k];
								if(entry.user == userId){
									// Attach unremove handling here
									var prefix = "uniform_radio_";
									var divId = '#tr_'+prefix+userId;
									$(divId,getScopeReference()).remove();
									listNameToRemove = entry.list.toLowerCase().replace(/ /g, '_');
								}else{
									newRecipients.push(entry);
								}
							}
							recipients = newRecipients;
							var afterListEntries = setupDisplayData(recipients);	
							var separator="|";							
							if(beforeListEntries){
								for(var z=0;z<beforeListEntries.length;z++){
									// Find the corresponding entry in the after
									var foundEntry = false;
									if(afterListEntries){
										for(var m=0;m<afterListEntries.length;m++){
											if(beforeListEntries[z].key == afterListEntries[m].key && afterListEntries[m].values.length>0){
												//
												if(afterListEntries[m].values.length==1){
													$('#list_name_'+afterListEntries[m].key,getScopeReference()).text(afterListEntries[m].name+'    '+separator,getScopeReference());
													//$('.contactNames',getScopeReference()).html(Mustache.to_html(contactNamesTemplate,{"recipients":afterListEntries}));
													hideAllVisiblePopups();
													adjustRecipientField();
													//alert("put recipient again");
												}else{
													$('#list_name_'+afterListEntries[m].key,getScopeReference()).text(afterListEntries[m].values.length+'  '+afterListEntries[m].name+'    '+separator,getScopeReference());
												
												}
												foundEntry = true;
											}
										}
									}
									//alert("lala");
									if(!foundEntry){
										//alert("unbind");
										$('#li_selectedContact_'+beforeListEntries[z].key,getScopeReference()).unbind('click');
										$('#list_'+beforeListEntries[z].key,getScopeReference()).remove();
										$('#li_allcontacts_'+beforeListEntries[z].key,getScopeReference()).remove();
										$('#li_allcontacts_delimiter_'+beforeListEntries[z].key,getScopeReference()).remove();
									}
									//alert("haha");
									
								}
							}
							// If the popup is empty then hide it?
							window.selectedUsers = recipients;
							window.selectedUsersWatch.trigger();
							messageToSend.recipients = recipients;
							checkSendButtonStatus();								
							//
						}
					};
					
					for(var j=0;j<listEntry.values.length;j++){
						var prefix = "uniform_radio_";
						var userEntry = listEntry.values[j];
						var divId = '#tr_'+prefix+userEntry.user;						
						$(divId,getScopeReference(),getScopeReference()).on('click',deleteListEntry);
					}

					// If a user clicks on the group name cross icon
					// delete all the entries from recipients with matching 
					// list name
					
					var deleteAllContacts = function(event){
					
						// Delete all the recipients entries that
						// have this id
						var listName = null;
						if(event.target.id.indexOf('deleteAllContacts_')!= -1){
							listName = event.target.id.substr('deleteAllContacts_'.length);
						}else if(event.target.id.indexOf('li_selectedContact_')!= -1){
							listName = event.target.id.substr('li_selectedContact_'.length);
						}
						if(listName){
							// unbind all the events for this button
							// Remove the entries from recipients
							var newRecipients = [];
							for(var k=0;k<recipients.length;k++){
								var entry = recipients[k];
								if(entry.list.toLowerCase().replace(/ /g, '_') == listName){
									// Attach unremove handling here
									var prefix = "uniform_radio_";
									var divId = '#tr_'+prefix+entry.user;
									$(divId,getScopeReference()).remove();
								}else{
									newRecipients.push(entry);
								}
							}
							recipients = newRecipients;
							// Hide all other contactSelections
							hideAllVisiblePopups();
							window.selectedUsers = recipients;
							window.selectedUsersWatch.trigger();
							messageToSend.recipients = recipients;
							$('#li_selectedContact_'+listName,getScopeReference()).unbind('click');
							// remove the whole div popup
							var divIdToRemove = 'list_'+listEntry.key;
							$('#'+divIdToRemove,getScopeReference()).remove();
							$('#li_allcontacts_'+listEntry.key,getScopeReference()).remove();
							$('#li_allcontacts_delimiter_'+listEntry.key,getScopeReference()).remove();
							fillContactDetails(recipients);
							
						}
					};
					$('#li_selectedContact_'+listEntry.key,getScopeReference()).on('click',deleteAllContacts);
					$('#deleteAllContacts_'+listEntry.key,getScopeReference()).on('click',deleteAllContacts);
				}
				
			}
			adjustRecipientField();
		}
	} else {
		$('.contactNames',getScopeReference()).html('');
	}
	checkSendButtonStatus();
}

var checkSendButtonStatus = function(){
	if ($("#contact-current-list li.contact-current-name",getScopeReference()) && $("#contact-current-list li.contact-current-name",getScopeReference()).length>0) {
		//$('#composeSendButton').removeAttr("disabled");
		$('#composeSendButton',getScopeReference()).css('cursor','pointer');
		$('#composeSendButton',getScopeReference()).removeClass('minimalComposeBtnDisabled');
		//$('.composeSend').addClass('enabledSend');
	}else{
		//$('#composeSendButton').attr("disabled", "disabled");
		$('#composeSendButton',getScopeReference()).addClass('minimalComposeBtnDisabled');
		$('#composeSendButton',getScopeReference()).css('cursor','default');
		//$('.composeSend').removeClass('enabledSend');
	}
}

window.selectedUsers = [];
var selectedUsersWatch = (function() {
     var watches = {};
     return {
           watch: function(callback) {
                var id = Math.random().toString();
                watches[id] = callback;
				return function(){
                     watches[id] = null;
                     delete watches[id];
                }
           },
           trigger: function(){
                for (var k in watches){
                     watches[k](window.selectedUsers);
                }
           }
     }

})();

function addToShare(messageContent,options,callBackFunction,scope){
	if(options && options.isPopup){
		renderOnBody = false;
	}
	compose(messageContent,callBackFunction,scope);
}

function confirmationWindow(divId,timer,bNoId, fnNo,bYesId,fnYes,scope){
		showOverlay('compose-panel-modal-confirmation');
		//$(divId,getScopeReference()).find(".btn-default").css("background-image","url(/BC_S/css/mresearch/workbook/img/btn_bg.gif)");
		$(divId,getScopeReference()).css("display","block");
		
		$(divId,getScopeReference()).css("background-color","#fff");
		$(divId,getScopeReference()).find(".btn-primary").css("background-color","#00aeef");
		
		var T = topLocationForWidget(divId);
		T +=additionalOffset;
		
		$(divId,getScopeReference()).css({top: T});
		
		if(timer && timer > 0){
			setTimeout(function () {
				if($(divId,getScopeReference()).is(":visible")){
					hideOverlay('compose-panel-modal-confirmation');
					$(divId,getScopeReference()).css("display","block");
					fnNo.call(scope || window);
				}
				}, timer // milliseconds delay
			);
		}
		
		if(bNoId){
			// $('#'+bNoId).on('click', function () {
			$(getScopeReference()).on('click', '#'+bNoId,function () {
				hideOverlay('compose-panel-modal-confirmation');
				$(divId,getScopeReference()).css("display","none");
				$(divId,getScopeReference()).find(".confirmbtn").css("background-color","transparent");
				//$(divId,getScopeReference()).find(".btn-default").css("background-image","none");
				$('.compose-panel').css("background-color","#fff");
				fnNo.call(scope || window);
			});
		}
		if(bYesId){
			// $('#'+bYesId).on('click', function () {
			//$('#'+bYesId,getScopeReference()).removeClass('minimalComposeBtnDisabled');
			$(getScopeReference()).on('click','#'+bYesId, function () {
				//$('#'+bYesId,getScopeReference()).addClass('minimalComposeBtnDisabled');
				$('#'+bYesId,getScopeReference()).unbind('click');
				hideOverlay('compose-panel-modal-confirmation');
				$(divId,getScopeReference()).css("display","none");
				$(divId,getScopeReference()).find(".confirmbtn").css("background-color","transparent");
				$('.compose-panel').css("background-color","#fff");
				//$(divId,getScopeReference()).find(".btn-default").css("background-image","none");
				fnYes.call(scope || window);
			});
		}
		
}

function hideOverlay(modalId) {
	$('#'+modalId,getScopeReference()).css("visibility","hidden");
	$('#'+modalId).css("visibility","hidden");
}

function getWidthAndHeight() {
  var myWidth = 0, myHeight = 0;
  if( typeof( window.innerWidth ) == 'number' ) {
    //Non-IE
    myWidth = window.innerWidth;
    myHeight = window.innerHeight;
  } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
    //IE 6+ in 'standards compliant mode'
    myWidth = document.documentElement.clientWidth;
    myHeight = document.documentElement.clientHeight;
  } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
    //IE 4 compatible
    myWidth = document.body.clientWidth;
    myHeight = document.body.clientHeight;
  }
  
  var scrOfX = 0, scrOfY = 0;
  if( typeof( window.pageYOffset ) == 'number' ) {
    //Netscape compliant
    scrOfY = window.pageYOffset;
    scrOfX = window.pageXOffset;
  } else if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
    //DOM compliant
    scrOfY = document.body.scrollTop;
    scrOfX = document.body.scrollLeft;
  } else if( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
    //IE6 standards compliant mode
    scrOfY = document.documentElement.scrollTop;
    scrOfX = document.documentElement.scrollLeft;
  }
  
  return {"w":myWidth,"h":myHeight,"x":scrOfX,"y":scrOfY};
}

function showOverlay(modalId) {
	$('#'+modalId,getScopeReference()).css("visibility","visible");
}


function compose(messageContent,callBackFunction,scope){

	functionScope = this;
	
	var pad = function pad(value) {
		if (value < 10) {
			return '0' + value;
		} else {
			return value;
		}
	}
	
	var month = new Array();
	month[0] = "January";
	month[1] = "February";
	month[2] = "March";
	month[3] = "April";
	month[4] = "May";
	month[5] = "June";
	month[6] = "July";
	month[7] = "August";
	month[8] = "September";
	month[9] = "October";
	month[10] = "November";
	month[11] = "December";

	var mon = new Array();
	mon[0] = "Jan";
	mon[1] = "Feb";
	mon[2] = "Mar";
	mon[3] = "Apr";
	mon[4] = "May";
	mon[5] = "Jun";
	mon[6] = "Jul";
	mon[7] = "Aug";
	mon[8] = "Sep";
	mon[9] = "Oct";
	mon[10] = "Nov";
	mon[11] = "Dec";

	var isValidDate = function(val) {
		try{
			var d = new Date(val);
			return !isNaN(d.valueOf());
		}catch(e){
			return false;
		}
	};
	
	var initializeMessageStructure = function(messageContent){
		if(messageContent){
			
			if(!messageContent.interactive){
				messageContent.interactive=true;
			}
			if(!messageContent.widgetTitle){
				messageContent.widgetTitle=DEFAULT_WIDGET_TITLE;
			}
			if(!messageContent.body){
				messageContent.body = DEFAULT_MESSAGE_BODY[0];
				
			}
			if(!messageContent.ack){
				messageContent.ack = false;
			}
			
			if(isEmployee === undefined){
				messageContent.isEmployee = true;
			}else{
				messageContent.isEmployee = isEmployee;
			}
			if(!messageContent.recipients){
				messageContent.recipients = [];
			}else{
				var recipients = messageContent.recipients;
				messageContent.recipients = [];
				for(var i=0;i<recipients.length;i++){
					var recipient = recipients[i];
					if(typeof recipient === 'string' ) {
						messageContent.recipients.push({"user":recipient,"first":recipient, "last":""});
					}else{
						messageContent.recipients.push(recipient);
					}
				}
			}
			
			if(messageContent.items){
				for(var i=0;i<messageContent.items.length;i++){
					var entry = messageContent.items[i];
					var entryType = entry.type.toLowerCase();
					var entryDate = entry.date;
					if(entryDate && isValidDate(entryDate)){
						var timeToShow = '';
						if(entryDate.getHours() && entryDate.getHours()>0){
							timeToShow = entryDate.getHours();
							if(entryDate.getMinutes() && entryDate.getMinutes()>0){
								timeToShow = timeToShow + ':'+ pad(entryDate.getMinutes());
							}
						}
						//entry.dateToDisplay = timeToShow + ' ' + pad(entryDate.getDate()) + ' ' + month[entryDate.getMonth()] + ' ' + entryDate.getFullYear();
						entry.dateToDisplay = pad(entryDate.getDate()) + ' ' + month[entryDate.getMonth()] + ' ' + entryDate.getFullYear();
					}else{
						entry.dateToDisplay ='';
					}
					if(entryType==='publication'){
						entry.publicationItem = true;
						entry.thumbnailURI = '/BC_S/images/Publication.png';
					}else if(entryType==='tile'){
						entry.tileItem = true;
						entry.thumbnailURI ='/BC_S/images/NewTile.png';
					}else if(entryType==='chart'){
						entry.chartItem = true;
						entry.thumbnailURI = '/BC_S/images/Chart.png';
					}else if(entryType==='text'){
						entry.textItem = true;
						if(entry.text){
							entry.partialText = entry.text.substring(0,255)+'...';
						}
						entry.thumbnailURI = '/BC_S/images/Excerpt.png';
					}else if(entryType==='web'){
						entry.webItem=true;
						entry.thumbnailURI = '/BC_S/images/Publication.png';
					}else if(entryType==='model'){
						entry.modelItem=true;
					//	entry.thumbnailURI = shareItem.getThumbnailURI();
					}
					else {
					}
				}
				messageContent.itemsPresent = true;
			}else{
				messageContent.itemsPresent = false;
				
			}
		}
		//alert(JSON.stringify(messageContent))
		return messageContent;
	}

	var addShimming = function(top,left,width,height) {
		$('#iframeshimOtherContent',getScopeReference()).css('top',top+"px");// $('.'+crntName + '-home').position().top+"px");
		$('#iframeshimOtherContent',getScopeReference()).css('position',"absolute");
		$('#iframeshimOtherContent',getScopeReference()).css('left',left+"px");
		$('#iframeshimOtherContent',getScopeReference()).css('width',width);
		$('#iframeshimOtherContent',getScopeReference()).css('height',height);
		$('#iframeshimOtherContent',getScopeReference()).css('display','block');
	};

	var removeShimming = function() {
		$('#iframeshimOtherContent',getScopeReference()).css('display','none');
	};
	
	
	messageToSend = initializeMessageStructure(messageContent);
	
	//console.log(">>");
	//console.log(messageContent);

	var composeHtml = Mustache.to_html(composeTemplate,messageToSend); 

	// append only if its not present already
	if($('#compose-panel-container',getScopeReference()).length > 0){
		// Remove the old content before applying the new template changes
		$('#compose-panel-container',getScopeReference()).remove();
	}
	
	$("#iframeshimOtherContent",getScopeReference()).remove();

	$('<div id="compose-panel-container"></div>').html(composeHtml).appendTo(getScopeReference());

	$(getScopeReference()).append(iframeToAdd);
	
	fillContactDetails(messageToSend.recipients);
	
	if (BrowserDetect.browser=='Explorer' ) {
		
		$('.minimalComposeBtn',getScopeReference()).corner('round 6px');
		$('.minimalComposeButton',getScopeReference()).corner('round 6px'); 
		//$('.compose-panel',getScopeReference()).corner('round 6px'); 
		//$('.compose-header').corner('round 0px');
		//$('.popWin',getScopeReference()).corner('round 6px'); 
		$('#message-panel',getScopeReference()).corner('round 6px');
		//$('.confirmDiv',getScopeReference()).corner('round 6px'); 
		$('.confirmbtn',getScopeReference()).corner('round 6px'); 
		$('#deleteAllContacts',getScopeReference()).corner('round 6px'); 
		//$('.confirmMsgFailed',getScopeReference()).corner('round 6px'); 
		//$('.confirmMsgSent',getScopeReference()).corner('round 6px'); 
		
	}
	
	// Update the recipients
	
	
	showOverlay('compose-panel-modal');
	hideOverlay('compose-panel-modal-confirmation');
	
	$('.compose-panel',getScopeReference()).toggle();
	
	topLocationForWidget =function(divId) {
	
		var adjustTop = function(top, divId){
			result = top;
			div = $(divId,getScopeReference());
			if(div != null && (result + div.height()) > document.body.clientHeight){
				result += document.body.clientHeight - top - div.height()
				if(result > 0){
					return result;
				}
			}
			return top;
		};
		var windowHeight= $(divId,getScopeReference()).height();
		var popupHeight = windowHeight;
		
		var visibleHeightForThisFrame = 0;
		var viewportHeight = 0;
		var outerHeight = 0;
		var myContentHeight = 0;
		var currentWindowTop = 0;
		if(window.parent.innerHeight){
			viewportHeight = window.parent.innerHeight;
			outerHeight = window.parent.document.body.offsetHeight;
			myContentHeight = document.body.offsetHeight;
		}else{
			var doc = window.parent.document;
			viewportHeight = doc.documentElement.clientHeight;
			outerHeight = doc.body.clientHeight;
			myContentHeight = document.documentElement.clientHeight;
		}
		visibleHeightForThisFrame = myContentHeight;
						
		if(window.parent != window && "popupContent" != window.name){
			var d = window.parent.document.documentElement || window.parent.document;
			var scrollTop = d.scrollTop;
			if(typeof Ext!= 'undefined' && Ext.isWebKit){
				scrollTop = window.parent.document.body.scrollTop;
			}
			currentWindowTop = (window.parent.document.getElementById("main-content") && window.parent.document.getElementById("main-content").offsetTop)
							 || 135;
			
			var effectiveWindowTop = currentWindowTop;
			if(scrollTop <= currentWindowTop){
				effectiveWindowTop -= scrollTop;
			}else{
				effectiveWindowTop = 0;
			}
			visibleHeightForThisFrame = viewportHeight - effectiveWindowTop;  
		}else{
			var scrollTop = document.documentElement.scrollTop;
			if(Ext.isWebKit){
				scrollTop = document.body.scrollTop;
			}
			visibleHeightForThisFrame = viewportHeight;	
			if("popupContent" == window.name){ // when inside docview popup
				visibleHeightForThisFrame -= 55;
			}
		}
		var yMin = 0;
		if(visibleHeightForThisFrame > popupHeight){
			yMin = (visibleHeightForThisFrame - popupHeight) / 4;
		}
		var y = scrollTop - currentWindowTop  + yMin;
		y = Math.max(y,yMin);
		return adjustTop(y, divId);
	};
	
	var composePanelReference = $('.compose-panel',getScopeReference())
	var centerAlignCompose = function(){
		getScrollTop = function(){
			if(typeof pageYOffset!= 'undefined'){
				//most browsers except IE before #9
				return pageYOffset;
			}
			else{
				var B= document.body; //IE 'quirks'
				var D= document.documentElement; //IE with doctype
				D= (D.clientHeight)? D: B;
				return D.scrollTop;
			}
		};
		
		var divToCenterAlign = '#compose-panel';
		var T = topLocationForWidget('#compose-panel');
		T +=additionalOffset;
		
		var L = $(window).width() / 2 - $(divToCenterAlign,getScopeReference()).width() / 2;
		$(divToCenterAlign,getScopeReference()).css({top: T,left: L});
		
		// Add shimming to the compose window
		var bgToUse = $(divToCenterAlign,getScopeReference());
		var top = bgToUse.offset().top;
		var left = bgToUse.offset().left;
		var width = bgToUse.css('width').replace('px','');
		var height = bgToUse.css('height').replace('px','');
		addShimming(top,left,width,height);
	};

	centerAlignCompose();
	
	//$(window).scroll(centerAlignCompose);
	//$(window).resize(centerAlignCompose);
	
	var findActiveVisiblePopup = function(){
		var activeId = null;
		if($('#contactSelectionContainer .contactSelection',getScopeReference()).is(":visible") && $('#contactSelectionContainer .contactSelection',getScopeReference()) && $('#contactSelectionContainer .contactSelection',getScopeReference()).attr('id')){
			
			$('#contactSelectionContainer .contactSelection',getScopeReference()).each(function(entry,val){
				if($('#'+val.id,getScopeReference()).is(":visible")){
					activeId = val.id;
					return activeId;
				}
			});
		}
		return activeId;
	};
	
	var handleAllClicks = function(e){
		var activePopupId = findActiveVisiblePopup();
		if(activePopupId){
			var activeListId = activePopupId.substr("popup_".length);
			if(activeListId){
				var divId = "#popup_"+activeListId;
				if($(divId,getScopeReference()).is(":visible") && $(divId,getScopeReference()).has(e.target).length===0 && ($('#contact-current-selection',getScopeReference()).has(e.target).length===0)){
					//also make sure that it is not from the id that got deleted for contact selection
					if(e.target.id && /uniform_radio_.*/.test(e.target.id)){
						//dont do anything
					}else{
						$(divId,getScopeReference()).hide();
					}
				}
			}
		}
	};

	$(document).on('click',handleAllClicks);

	/*
	$('#contact-current-selection').slimScroll({
		width: '200px',
		height: '36px',
		size: '4px',
		position: 'right',
		color:'#00AEEF',
		alwaysVisible: true,
		railVisible: true,
		railColor: '#222',
		railOpacity: 0.3,
		wheelStep: 10,
		allowPageScroll: false,
		disableFadeOut: false    });	
	*/
	
	var isBlank = function(str) {
		return (!str || /^\s*$/.test(str));
	}
	
	var composeSendClicked = function(e){
		e.preventDefault();
		
	//	alert('composeSend'+JSON.stringify(messageToSend));
		var times=0;
		if(!$("#composeSendButton",getScopeReference()).hasClass("minimalComposeBtnDisabled")){
			messageToSend.subject = $('#subject',getScopeReference()).text();
			messageToSend.text = $('.compose-body',getScopeReference())[0].innerText || $('.compose-body',getScopeReference())[0].textContent;
			
			if (messageToSend.subject.length == 0) {
				messageToSend.subject = ' ';
			}
			if (isBlank(messageToSend.subject)) {
				confirmationWindow('.confirmDiv',-1,'bNo',
					function(){
						$('#subject').focus();
						times=times+1;
					},
					'bYes',
					function(){
						messageToSend.subject = "<no subject>";
						if(times<1){
							sendMessageNow(messageToSend);
							times=times+1;
						}
						
					}
				);
			}else{
				sendMessageNow(messageToSend);
			}
		}
	};

	
	$('.composeSend',getScopeReference()).unbind('click');
	$('.composeSend',getScopeReference()).on('click',composeSendClicked);

	
	//console.log(($("#contacts-widget-page") && $("#contacts-widget-page").length>0 && $("#contacts-widget-page").get(0).innerHTML==""));
	if(!contactsAppInitialized || $("#contacts-widget-page",getScopeReference()).length>0 && $("#contacts-widget-page",getScopeReference()).get(0).innerHTML==""){
		$.ajaxSetup({ cache: true });
		$("#contacts-widget-page",getScopeReference()).load( ("/BC_S/html/mresearch/contacts.html?buster="+ contactLoadTimestamp),function(){
			contactsAppInitialized = initializeContactWidget(this);
		});
		$.ajaxSetup({ cache: false });
	}

	var clearMessage = function(){
		messageToSend ={};
		window.selectedUsers = [];
		selectedUsersWatch.trigger();
		$(".contactNames",getScopeReference()).text("");
		$('#subject',getScopeReference()).text('');
		$('.compose-body',getScopeReference()).css("overflow", "hidden");
		$('#subject',getScopeReference()).css("overflow", "hidden");
		$('.composeSend',getScopeReference()).removeClass('enabledSend');
		//$(".copyCheck").attr("src", "/BC_S/css/mresearch/watchlist/img/share_uncheck.png");
		$('.compose-panel',getScopeReference()).hide();			
		removeShimming();
		hideOverlay('compose-panel-modal');
		$('#compose-panel-container',getScopeReference()).remove();
	}
	
	$('#cancelBtn',getScopeReference()).on('click', function(){
			clearMessage();
			if(callBackFunction){
				callBackFunction.call( scope || window, false,"USER_CANCELLED",null);
			}
	});

	$('#ackMsg',getScopeReference()).on('click', function () {
		if (!$("#sendMeCopySelection",getScopeReference()).hasClass("msgChecked")) {
			$("#sendMeCopySelection",getScopeReference()).addClass("msgChecked");
			messageToSend.ack = true;
		} else {
			$("#sendMeCopySelection",getScopeReference()).removeClass("msgChecked")
			messageToSend.ack = false;
		}
	});
	
	$("#subject",getScopeReference()).on('click', function () {
		$('#subject',getScopeReference()).css({
			"overflow": "auto",
			"height": "30px"
		});
		
		this.focus();
	});

	$(".compose-body",getScopeReference()).on('focus', function () {
		$('.compose-body',getScopeReference()).css("overflow", "auto");
		if($.inArray($(".compose-body",getScopeReference()).text(), DEFAULT_MESSAGE_BODY)!=-1){
			this.innerHTML = "";
		}
		this.focus();
	});

	var contacts = [];
	$(".contactsBtn",getScopeReference()).on('click', function () {
		//console.log(($("#contacts-widget-page") && $("#contacts-widget-page").length>0 && $("#contacts-widget-page").get(0).innerHTML==""));
		//console.log($("#contacts-widget-page").get(0).innerHTML);
		if(!contactsAppInitialized || $("#contacts-widget-page",getScopeReference()).length>0 && $("#contacts-widget-page",getScopeReference()).get(0).innerHTML==""){
			$("#contacts-widget-page",getScopeReference() ).load("/BC_S/html/mresearch/contacts.html",function(){
				contactsAppInitialized = initializeContactWidget(this);
				
				$('#message-panel',getScopeReference()).hide();
				$('#contacts-widget-page',getScopeReference()).show();
				if(BrowserDetect.browser=='Explorer' ){ 
				
					$('#done-btn',getScopeReference()).corner('round 6px'); 
				} 
			});
		}else{
			$('#message-panel',getScopeReference()).hide();
			$('#contacts-widget-page',getScopeReference()).show();
			if(BrowserDetect.browser=='Explorer' ){ 
					$('#done-btn',getScopeReference()).corner('round 6px'); 
				} 
		}
	});
	
	var replaceNewLines = function(text){
		if(text){
			return text.replace(/\n/g, '<br />').replace(/\r/g,'<br />');
		}else{
			return text;
		}
	};
	
	var sendMessageNow = function(messageToSendJson){
		var dataToPost = {};
		//alert('messageToSendJson'+JSON.stringify(messageToSendJson));
		dataToPost = {
				'subject': messageToSendJson.subject,
				'text': messageToSendJson.text,
				'type': 'NEW',
				'ack': messageToSendJson.ack
		}
		if(messageToSendJson.recipients && messageToSendJson.recipients.length>0){
			dataToPost.recipients=[];
			for(var i=0;i<messageToSendJson.recipients.length;i++){
				var recipient = messageToSendJson.recipients[i];
				dataToPost.recipients.push(recipient.user);
			};
		}
		
		if(messageToSendJson.items && messageToSendJson.items.length>0){
			dataToPost.items = [];
			var isiPad = navigator.userAgent.match(/iPad/i) != null;
			for(var i=0;i<messageToSendJson.items.length;i++){
				var entry = messageToSendJson.items[i];
				var entryType = entry.type.toLowerCase();
				var itemDetails = {
					'type':entry.type,
					'name':entry.heading1,
					'id':entry.id,
					'mUrl':'',
                                        'tb_url':''
					
				};
				if(entryType==='publication'){
				}else if(entryType==='tile'){
				}else if(entryType==='chart'){
					itemDetails.name = entry.heading2;
				}else if(entryType==='model'){
					itemDetails.name = entry.heading2;
					itemDetails.tb_url = entry.thumbnailURI;
					itemDetails.mUrl = entry.url;
				}else if(entryType==='text'){
					itemDetails.content = {'text':entry.partialText};
				}else if(entryType==='web'){
					if(!isiPad){
						itemDetails.type='Publication';
					}
					
				}else{
				}
				dataToPost.items.push(itemDetails);
			};
		}
//	alert('dataToPost'+JSON.stringify(dataToPost));
		// Validate that we have basic info
		if(!dataToPost.recipients||dataToPost.recipients.length==0){
			return;
		}

		$('#composeSendButton',getScopeReference()).addClass('minimalComposeBtnDisabled');
		$.ajax({
			url: "/BC/S/message/?buster=" + new Date().getTime(),
			type: "PUT",
			data: JSON.stringify(dataToPost),
			contentType: "application/json",
			accept: "application/json",
			success: function (data) {
				$('#composeSendButton',getScopeReference()).removeClass('minimalComposeBtnDisabled');
				//alert('data'+data);
				// Handle success failures 
				if(messageToSendJson.interactive){
					confirmationWindow('.confirmMsgSent',2000,'close',function(){
						//do nothing
						clearMessage();
					});
				}else{
					clearMessage();
				}
				if(callBackFunction){
					callBackFunction.call( scope || window, true,"MSG_SENT",data);
				}
			},
			error: function (xhr, ajaxOptions, thrownError) {
				$('#composeSendButton',getScopeReference()).removeClass('minimalComposeBtnDisabled');
				if(messageToSendJson.interactive){
					var messageToShow = errorMessageToShowInDiv;
					var errorMessageWidth = defaultWidthForError;
					var errorMessageLeftAlignment = defaultLeftForError;
					var overLimitMessage = false;
					try{
						var responseObj = JSON.parse(xhr.responseText);
						if(responseObj && responseObj.code == 'FORBIDDEN'){
								messageToShow = responseObj.message.replace(/!/g, '.');
								errorMessageWidth += 160;
								errorMessageLeftAlignment -= 80;
								overLimitMessage = true;
						}
					}catch(e){
					}
					if(overLimitMessage){
						$('.confirmMsgFailedOverLimit',getScopeReference()).width(errorMessageWidth);
						$('.confirmMsgFailedOverLimit',getScopeReference()).css('margin-left',errorMessageLeftAlignment);
						$('#errorMessageToShowInDiv',getScopeReference()).html(messageToShow);					
						confirmationWindow('.confirmMsgFailedOverLimit',null,'confirmMsgFailedOverLimit_close',function(){
							//do nothing
						});
					}else{
						// let the user click when she is ready to proceed after failure
						confirmationWindow('.confirmMsgFailed',null,'confirmMsgFailed_close',function(){
							//do nothing
						});
					
					}
				}else{
					// Error occurred
					clearMessage();
					if(callBackFunction){
						callBackFunction.call( scope || window, true,"MSG_NOT_SENT",xhr.responseText);
					}
				}
			}
		});
	
	}
	
}
