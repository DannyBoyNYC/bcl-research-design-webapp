UA = {
    "pageName": "Home",
    "featureType": "QuickList",
    "menuCode":"MENU_FI_WELCOME"
};
var scriptArray = [ "/BC_S/js/api/namespace.js",
					"/BC_S/js/utility/object.js",
					"/BC_S/js/api/UA.js",
					"/BC_S/js/api/ajax-common.js",
                    "/BC_S/js/utility/rest-api.js",
                    "/BC_S/js/api/wb/object.js",
                    "/BC_S/js/api/wb/rest-api.js"];
					//"/BC_S/js/libraries/clipboard/clipboard.min.js"];

var bufferXOnClick = 14;
var bufferYOnClick = 6;
var bufferXOnDiv = -2;
var bufferYOnDiv = 30;
var tagWithClick = false;
var addIconClass = '';
var isResearch=false;
var expandItems=[];

var shouldShowExpandLink=false;
var modelAbsoluteUrlEnabled=false;
var linkbackUrl='';
var currentWebUserId='';
var talkBubbleFloatLeft=false;
var ql_left=0;
var ql_top=0;
var expandedDivModalHeight;
var stopBubblingVar=false;
if (document.createStyleSheet) {
    document.createStyleSheet("/BC_S/css/share/share_styles.css");
	
	
}
else {
    $("head").append('<link rel="stylesheet" href="/BC_S/css/share/share_styles.css">');
	
}


var jsLoadCounter = 0 ;

$(document).ready(function () {
    for (var i=0; i< scriptArray.length ; i++){
        if($('script[src*="'+scriptArray[i]+'"]').length == 0){
            var script = document.createElement('script');
            script.setAttribute('type', 'text/javascript');
            script.setAttribute('src', scriptArray[i]);
            script.onreadystatechange = function () {
                if (this.readyState == 'loaded' || this.readyState == 'complete') {
                    jsLoadCounter += 1;
                    script.onload = function () {
                    };
                }
            };
            script.onload = function () {
                jsLoadCounter += 1;
                script.onreadystatechange = function () {
                };
            };

            //document.getElementsByTagName('body')[0].appendChild(script);
			$("head").append(script);
        } else {
            jsLoadCounter += 1;
        }
    }
	
	
	
	
});

var share_Obj;
var errorMgs;
var workbookSuccessflag=false;
var checkInParent = false;
var iFrameId;
var srcElementOffset;
/*currently used in workbook*/
function addAttachment(type,heading1,uri,date,imgUri,id, fromId, text, heading2,documentId)
{
	//e.preventDefault();
	var shareItem = createQuickListItem(heading1,heading2,fromId,imgUri, uri, type, date, text, documentId);
	//var shareItem = createQuickListItem('test',heading2,fromId,imgUri, uri, 'Model', date, text, documentId);
	addToQuickLinks(shareItem,'undefined','');
}

function createQuickListItem(heading1, heading2, id, thumbnailURI, url, type, date, text, documentId){
	var shareItem = new Object();
    shareItem.id = id;
    shareItem.type = type;
    shareItem.heading1 = heading1;
    shareItem.heading2 = heading2;
    shareItem.url = url;
    shareItem.date = date;
    shareItem.thumbnailURI = thumbnailURI;
    shareItem.text = text;
    shareItem.sourceElementId = documentId;
	
    return shareItem;
}



/*This method can be used if QuickList has to be tagged with the click Event*/
function addToQuickLinksWithClick(shareItem){
	tagWithClick = true;
	addToQuickLinksInternal(shareItem);
}
//'quick_links_cyan'
function addToQuickLinks(shareItem, options,e) {

	
	tagWithClick = false;
	if(options!='undefined'){
		isResearch=true;
		iFrameId = appendHash(options.iFrameId);
		addIconClass = options.iconCls;
	}
	
	if(iFrameId){
		bufferYOnDiv = 36;
    }

	
	if(!shareItem.text){
		shareItem.text ='';
	}
    /* text is used as an attribute in removing the duplicate publications/clippings */
    if(shareItem.text == 'undefined'){
        shareItem.text ='';
    }
	
	addToQuickLinksInternal(shareItem);
}

/*This method uses the unique div element of the click*/
function addToQuickLinksInternal(shareItem) {
	shareItem.divId = "1111"; //leaving this if we want to revert back to the div logic

    
  
    var relX = 0; 
    var relY = 0; 

    
    

    if (!$('#multibasket_' + shareItem.divId).length) {
    	if(typeof clientip === "undefined" )
    		clientip = "";
    	
    	if(typeof userwebid === "undefined")
    		userwebid = "";

    	  var share_html = '<div class="sharebasket" id="multibasket_' + shareItem.divId + '" style="box-sizing:border-box;">'+
    	  '<div class="talkBubbleTop"></div>'+
    	  '<div style="clear:both;">'+
    	  '<div id="addToQuickDiv" style="float:left;border:0px">';
		 
		
		
		 share_html+='<h4 class="shareLabel left">Quick List</h4>'+
    	  '</div><div id="clearAttachmentDiv" style="float:right;margin-top:-12px; border:0px; margin-right: 10px">'+
    	  '<a href="#" onclick="clearAllAttachment();return false;" id="clear" title="clear all" style="text-align: center;">Clear All</a>'+
    	  '</div></div>'+
    	  '<ol class="gblol"></ol>'+
    	  '<div id="shareCanWrapper"><div id="share"  data-ua-instrument="true" data-ua-pub-id="'+clientip+'" data-ua-user-id="'+userwebid+'"data-ua-page-name="'+UA.pageName+'" data-ua-feature-type="'+UA.featureType+'" data-ua-menu-code="'+UA.menuCode+'" data-ua-feature-name="Share" onclick="openShareMessageBox();">Share</div>'+
    	  '<div id="addToWorkbook" data-ua-instrument="true" data-ua-pub-id="'+clientip+'" data-ua-user-id="'+userwebid+'"data-ua-page-name="'+UA.pageName+'" data-ua-feature-type="'+UA.featureType+'" data-ua-menu-code="'+UA.menuCode+'" data-ua-feature-name="Add to Workbook" onclick="openAddToWorkbookBox();">Add to Briefcase</div>';
		
		share_html+='<div style="display:none;" onclick="javascript:openExpand('+shareItem.divId+');" class="link_expand"><img src="/BC_S/img/expand-cyan.png"/>Expand</div></div>'+
    	  '<div class="talkBubbleDown"></div></div><div class="expandedDivModal" style="display:none;" onclick="javascript:closeExpandedDiv()"></div><div class="expandedDiv"></div>';
		  
    }
    
    if (!$('#overlay_' + shareItem.divId).length) {
        var overlay_html = '<div class="shareResult clearfix" id="overlay_' + shareItem.divId + '"></div>';
    }
	
	
	getDivObject('body').append(overlay_html);
	if(iFrameId){
		var iframe_html = '<iframe  id="iframePopup" style="position:absolute;background: transparent;background-color: transparent;FILTER:progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0);opacity: 0;"></iframe>';
		getDivObject('body').append(iframe_html);
	}
	getDivObject('#overlay_' + shareItem.divId).append(share_html);
	var temp_margin_top_for_quicklist_title=-29;
	if($('.pub_util').length){
		
		temp_margin_top_for_quicklist_title=-20;
	}else if($('.addIcon').length){
		temp_margin_top_for_quicklist_title=-24;
	}
	if(currentWebUserId==''){
		$.ajax({
            url : "/BC/S/check/sp/expand",
			
			success:function(data){
				if(data){
					
					shouldShowExpandLink=data.show;
					modelAbsoluteUrlEnabled=data.modelAbsoluteUrl;
					if(shouldShowExpandLink){
						// $(".shareLabel").css("margin-top",temp_margin_top_for_quicklist_title+"px");
						$('.link_expand').css("display","block");
						$('.sharebasket div#addToWorkbook').css('float','left');
						$('.sharebasket div#share').css('padding-right','10px');
						if($('#RSP_MRESEARCH_COMPANY_KEY_METRICS')){
							$('.link_expand').css("padding-top","7px");
							$('.link_expand').find("img").css("margin-top","-10px");
						}
					}
					linkbackUrl=data.linkbackUrl;
					currentWebUserId=data.webUserId;
				}
			}
									
		});
	}else{
		if(shouldShowExpandLink){
			// $(".shareLabel").css("margin-top",temp_margin_top_for_quicklist_title+"px");
			$('.sharebasket div#addToWorkbook').css('float','left');
			$('.sharebasket div#share').css('padding-right','10px');
			if($('#RSP_MRESEARCH_COMPANY_KEY_METRICS')){
				$('.link_expand').css("padding-top","7px");
				$('.link_expand').find("img").css("margin-top","-10px");
			}
			$('.link_expand').css("display","block");
		}
	}
	
	if($('#coverUniMainDiv').length){
		$('.sharebasket a#clear').css({"padding-top":"20px","margin-top":"-10px"});
		$('.sharebasket div#share').css("background-positon","0px -2px");
		$('.sharebasket div#addToWorkbook').css("width","39.5%");
	}
    getDivObject('#overlay_' + shareItem.divId).css({"overflow":'visible', "z-index":'1'});
    getDivObject('#multibasket_' + shareItem.divId).css({"display":'none', "top":'0px', "right":'30px'});

     bindEvent('mouseup', '#multibasket_' + shareItem.divId, 'quicklinks');
	// if(shouldShowExpandLink){
		//			$('.link_expand').css("display","block");
	 //}
    var test = $(".gblol").find("#errId");
    if (test.length == 0) {
        var error_div = '<div id="errId" class="errorMsg">' + errorMgs + '</div>';
        $('.gblol').append(error_div);
    }

    $(".gblol").find("#errId").css('display', 'none');
	if(!shareItem.sourceElementId)
	{
		shareItem.sourceElementId = $(e.srcElement).getPath();
	}
    
	 checkAndAppend(shareItem);
	
	if(!isResearch){
		$("#clear").css('height', '18px');
	}
	
	
// Call The Rest API with ShareItem
    share_Obj = bl.api.getInstance();
    share_Obj.addToQuickList(shareItem, function (data) {
        addSuccessCallBack(relX, relY, data, shareItem.sourceElementId);
    }, addErrorCallback);
	
}

function closeWidget(eventType, eventNameSpace){
	talkBubbleFloatLeft=false;
	getDivObject('#overlay_1111').remove();
	getDivObject('#iframePopup').remove();
	unBindEvent(eventType, eventNameSpace);
	resizeWindow();
}

function getBindObject(findElement){
	if(iFrameId){
		return $(iFrameId).contents().find(findElement);
	}else{
		return $(document).find(findElement);
	}
}

function getDivObject(divId){
	if(checkInParent){
		return $(divId, top.document);
	}else{
		return $(divId);
	}
}

function checkAndAppend(shareItem){
	//if(shareItem.sourceElementId.indexOf('#') == -1){
		shareItem.sourceElementId = appendHash(shareItem.sourceElementId);
	//}
}

function appendHash(varId){
	if(varId && varId.substr(0,1) != '#'){
		varId = '#'+varId;
	}
	return varId;
}
function stopBubbling(){
	stopBubblingVar=true;
}
function removeSelected(type, heading1, heading2, uri, date, imgUri, text, sourceElementId, id) {
	
    if(stopBubblingVar==true){
		stopBubblingVar=false;
		return false;
	}
	if (share_Obj.getShareItemsArr() && share_Obj.getShareItemsArr().length == 1) {
        share_Obj.clearQuickList(clearSuccessCallBack, clearErrorCallback);
        getDivObject(".gblol").find("#errId").css('display', 'none').text('');
        clearAllAttachment();
    } else {
        var removeItem = createQuickListItem(heading1, heading2, id, imgUri, uri, type, date, text, sourceElementId);
        share_Obj.removeItemFromQuickList(removeItem, function () {
		getDivObject(".gblol").find("#li_"+id).remove();
            //target.parentNode.removeChild(target);
            getDivObject(".gblol").find("#errId").css('display', 'none').text('');
            checkAndFlipIcon(removeItem.sourceElementId, 'remove');
			getDivObject('#iframePopup').css({'width': getDivObject('.sharebasket').width()+5,'height':getDivObject('.sharebasket').height()+15});			
        }, function () {
            errorMgs = "Remove Failed";
            getDivObject(".gblol").find("#errId").css('display', 'block').text(errorMgs).css('color', 'red');
        });
		share_Obj.removeShareItems(removeItem);
		var tempItems=[];
		var j=0;
		for(var i=0;i<expandItems.length;i++){
			
			if(expandItems[i].id!=id){
				tempItems[j]=expandItems[i];
				
			}else{
				j--;
			}
			j++;
		}
		expandItems=tempItems;
		
		
    }
	stopBubblingVar=false;
    
}

function removeSelectedExpandLink(type, heading1, heading2, uri, date, imgUri, text, sourceElementId, id) {
    if(stopBubblingVar==true){
		stopBubblingVar=false;
		return false;
	}
	if (share_Obj.getShareItemsArr() && share_Obj.getShareItemsArr().length == 1) {
        share_Obj.clearQuickList(clearSuccessCallBack, clearErrorCallback);
        getDivObject(".gblol").find("#errId").css('display', 'none').text('');
        clearAllAttachment();
    } else {
        var removeItem = createQuickListItem(heading1, heading2, id, imgUri, uri, type, date, text, sourceElementId);
        share_Obj.removeItemFromQuickList(removeItem, function () {
		getDivObject(".gblol").find("#li_"+id).remove();
            //target.parentNode.removeChild(target);
            getDivObject(".gblol").find("#errId").css('display', 'none').text('');
            checkAndFlipIcon(removeItem.sourceElementId, 'remove');
			getDivObject('#iframePopup').css({'width': getDivObject('.sharebasket').width()+5,'height':getDivObject('.sharebasket').height()+15});			
        }, function () {
            errorMgs = "Remove Failed";
            getDivObject(".gblol").find("#errId").css('display', 'block').text(errorMgs).css('color', 'red');
        });
		share_Obj.removeShareItems(removeItem);
    }
	stopBubblingVar=false;
}

function clearAllAttachment() {
    
	//Clear List From Session
    share_Obj.clearQuickList(clearSuccessCallBack, clearErrorCallback);
    getDivObject(".gblol").find("#errId").css('display', 'none').text('');
    getDivObject('.gblol').empty();
    //   $('#g_shareAttachment').empty();
    getDivObject('.sharebasket').css('display', 'none');
	closeWidget('mouseup', 'quicklinks');
	if(addIconClass){
		clearAddIconClass();
	}	
	else{	
		clearAddIconState();
	}
}

function clearAllAttachmentFromExpand(){
    
	//Clear List From Session
    share_Obj.clearQuickList(clearSuccessCallBack, clearErrorCallback);
    getDivObject(".gblol").find("#errId").css('display', 'none').text('');
    getDivObject('.gblol').empty();
    //   $('#g_shareAttachment').empty();
    getDivObject('.sharebasket').css('display', 'none');
	closeWidget('mouseup', 'quicklinks');
	if(addIconClass){
		clearAddIconClass();
	}	
	else{	
		clearAddIconState();
	}
}
function closeGblPopup(e) {
    e = e || window.event;
    if (typeof e.stopPropagation != "undefined") {
        e.stopPropagation();
    } else {
        e.cancelBubble = true;
    }
    getDivObject('.sharebasket').css('display', 'none');
}

function addSuccessCallBack( relX, relY, data, objDiv) {
    var items = share_Obj.getShareItems(data.shareItems);
	
    /* Remove all the items from quicklist and add again from Session */
    getDivObject('.shareItem').remove();
    if (data.status) {
        getDivObject('.gblol').find("#errId").css('display', 'block').text(data.status).css('color', 'red');
    }
	
	if(items){
		for (var temp=0;temp<items.length; temp++ ) {
			var item = items[temp];
			var heading1 = item.heading1;
			if(item.type == 'Chart' && (typeof heading1 == 'undefined' || typeof heading1 == null || heading1 == '')){
				heading1 = "Chart";
			}
			if(item.type == 'Model' && (typeof heading1 == 'undefined' || typeof heading1 == null || heading1 == '')){
				heading1 = "Model";
			}
			var gblli = '<li class="shareItem" id="li_' + item.id + '" onclick="removeSelected(\'' + item.type + '\',\'' + escapeQuoteJS(item.heading1) + '\',\'' + escapeQuoteJS(item.heading2) + '\',\'' + item.url + '\',\'' + item.date + '\',\'' + item.thumbnailURI + '\',\'' + escapeNewLine(escapeQuoteJS(item.text)) + '\',\'' + item.sourceElementId + '\',\'' + item.id + '\')"><div class="L1" style="border: none;height: auto;" >' + wbDecodeHtml_ui(heading1) + '</div>\n<div class="L2" style="border: none;height: auto;" >' + wbDecodeHtml_ui(item.heading2) + '</div></li>';
			getDivObject('.gblol').append(gblli);
			checkAndFlipIcon(item.sourceElementId, 'add');
		}
		 if(shouldShowExpandLink){
			
			  addExpandItems(items);
		  }
		
	}
	
	getDivObject('#iframePopup').css({'width': getDivObject('.sharebasket').width()+5,'height':getDivObject('.sharebasket').height()+5});
	reposition(relX, relY, '#multibasket_1111', objDiv);
	
	//alert(ql_top+"in getting")
}
function checkBrowserEnv(domain){
	var url=top.location.href;
	url=url.split("//")[1];
	url=url.split('/')[0];
	if(url.indexOf("frame")>=0){
		domain="liveframe.barcap.com";
	}if(url.indexOf("qa")>=0){
		domain="liveqa.barcap.com";
	
	}else if(url.indexOf("stage")>=0){
	domain="livestage.barcap.com";
	
	}else {
	domain="live.barcap.com";
	
	}
	return domain;
	
}
function addExpandItems(items){
	
	//create expand items

	var id_params=[];
	var contents=[];
	var linkback_prefix="https://"+checkBrowserEnv()+"/go/publications/link?contentPubID=FC";
	if(items){
		for (var temp=0;temp<items.length; temp++ ) {
			var item = items[temp];
			var heading1 = item.heading1;
			var linkback="";
			var curEnv
			if(item.type == 'Chart' && (typeof heading1 == 'undefined' || typeof heading1 == null || heading1 == '')){
				heading1 = "Chart";
			}
			if(item.type == 'Model' && (typeof heading1 == 'undefined' || typeof heading1 == null || heading1 == '')){
				heading1 = "Model";
				
			}
			if(item.type=='Model'&&!modelAbsoluteUrlEnabled){
					linkback="https://"+checkBrowserEnv();
				}
			//var linkback_url=linkback_prefix+item.id;
			var quicklist={"heading1":heading1,"heading2":item.heading2,"summary":item.summary,"id":item.id,"linkback":linkback,'type':item.type,'url':item.url,'date':item.date,'thumbnailURI':item.thumbnailURI,'text':item.text,'sourceElementId':item.sourceElementId};
			contents.push(quicklist);
			
			id_params.push(item.id);
		}
	
		
	
		//generate the link
		
		if(currentWebUserId==""){
			return false;
		}
		if(linkbackUrl==""){
			linkbackUrl='/DDL/jsp/BCLEncodedLinks.jsp?action=getLinkbacksByPubID';
		}
		
		for(var i=0;i<id_params.length;i++){
			linkbackUrl+="&pubId="+id_params[i];
		}
		linkbackUrl+="&userLogin="+currentWebUserId;

		$.ajax({
			url:linkbackUrl,
			type:"GET",
			headers:{
				'Accept':'application/json'
			},
			
			success:function (data) {
				
				for(var i=0;i<data.users[0].encodedLinks.length;i++){
					for(var j=0;j<id_params.length;j++){
						if(contents[j].id==data.users[0].encodedLinks[i].pubID){
							contents[j].linkback=contents[j].linkback+data.users[0].encodedLinks[i].encodedURI;
							continue;
						}
					}
				}
				
			},error:function(){
				alert("Failed");
			}
		});
		
		expandItems=contents;

		
	}
}

function checkAndFlipIcon(path, addFlag){
	if (path && addIconClass) {
		flipAddIconClass(path, addFlag);
	}else{
		flipAddIcon(path, addFlag);
	}
}

function flipAddIcon(path, addFlag) {
    var imageTag = $(path);
    var imageToLoad;
    if (imageTag.attr('src') == '/BC_S/css/mresearch/workbook/img/plus_cyan.png' && addFlag == 'remove') {
        imageToLoad = "/BC_S/css/mresearch/workbook/img/plus_grey.png";
        imageTag.attr("src", imageToLoad);
    }
    else {
        imageToLoad = "/BC_S/css/mresearch/workbook/img/plus_cyan.png";
        imageTag.attr('src', imageToLoad);
    }
}
function flipAddIconClass(path, addFlag){
	if(addFlag == 'remove')
	{
		getBindObject(path).removeClass(addIconClass);
	}
	else{
		getBindObject(path).addClass(addIconClass);
	}
}

function addErrorCallback(req, reason, error) {
    errorMgs = "ADD To Quick List Failed";
    $(".gblol").find("#errId").css('display', 'block').text(errorMgs).css('color', 'red');
}

function removeSuccessCallBack() {
    var msg = "This is removeSuccessCallBack";
}

function removeErrorCallback() {
    errorMgs = "Add Failed";
    $(".gblol").find("#errId").css('display', 'block').text(errorMgs).css('color', 'red');
}

function clearSuccessCallBack() {
    var msg = "This is removeSuccessCallBack";
}

function clearErrorCallback() {
    var msg = "This is removeErrorCallback";
}

function openAddToWorkbookBox() {
    
    var parentOffSet = $('#multibasket_1111').offset();
	

    if (!$('#addToWorkbookPanel').length) {
        $('<div class="workbookWin" style=" margin:20px; margin-top:40px; vertical-align:top;z-index:99;height: 300px;" id="addToWorkbookPanel"> ' +
            '<div class="talkBubbleTop" style="top: -10px; right: 5px;"></div>' +
           	'<div class="addToFolderTitle workbookBackground" style="margin-bottom:0;">Select A Folder</div>' +
            '<div style="overflow-y:auto; height: 230px;">' +
            '<table class="wbGrayTable" style="margin:0; width:100%; overflow-y:auto;">' +
                    '<tbody  id="workbookFolders">' +
                    '</tbody>' +
                '</table>' +
            '</div>' +
            '</div>')
        .appendTo('body');
    }
    $.ajax({
        url:"/BC/S/workbook/folders",
        type:"GET",
        headers:{
            'Accept':'application/json'
        },
		 beforeSend:function () {
		
                	unBindEvent('mouseup', 'quicklinks');
					$('.sharebasket').css('display', 'none');
					$('.expandedDiv').css("display","none");
					$('.expandedDivModal').css("display","none");
					unBindEvent('mouseup', 'link_expand');
					// alert('none');
					$('#addToWorkbookPanel').show();
					
					//alert('show1');
					
					if(parentOffSet.top==0){
						//alert(ql_top);
						$('#addToWorkbookPanel').offset({top:ql_top, left:ql_left});
						//$('#addToWorkbookPanel').offset({top:parentOffSet.top, left:parentOffSet.left});
					}else{
						//alert(parentOffSet.top)
						$('#addToWorkbookPanel').offset({top:parentOffSet.top, left:parentOffSet.left});
					}
                    if(srcElementOffset.left < $('#addToWorkbookPanel').width()) {
                        $('.talkBubbleTop').css('float','left');
                        $('.talkBubbleTop').css('left','5px');
                    }
					//alert('show');

					bindEvent('mouseup', '#addToWorkbookPanel', 'addToWorkbookPanel', closeWorkbookAdd);
					getDivObject('#iframePopup').css({'height':getDivObject('#addToWorkbookPanel').height()+10});
                    resizeWindow();
                },
        success:function (data) {
            var wb_Obj = bl.api.wb.getInstance(data.folders);
            var wb_data = wb_Obj.getFolders();
			if(wb_data ){
				for (var item=0;item<wb_data.length; item++) {
					if(wb_data[item].id){
						if (!$('#tr_Folder_' + wb_data[item].id).length) {
						    var folderName = wb_data[item].name;
							if(isResearch){
								$("#workbookFolders").append('<tr style="height: 36px;" id="tr_Folder_' + wb_data[item].id + '">' +
										'<td class="firstColIndent" onclick="addToFolder(\'' + wb_data[item].id + '\', \'' + encodeHtmlJs(wb_data[item].name) + '\')"  >' +
										'<img src="/BC_S/css/share/img/icn-workbook-16x16-v2.png" style="vertical-align: bottom;"/><span style="vertical-align: text-top; padding-left: 10px;">' + encodeHtmlJs(folderName) + '</span></td></tr>');
							}else
								{
								$("#workbookFolders").append('<tr style="height: 36px;" id="tr_Folder_' + wb_data[item].id + '">' +
										'<td class="firstColIndent" onclick="addToFolder(\'' + wb_data[item].id + '\', \'' + wb_data[item].name + '\')"  >' +
										'<img src="/BC_S/css/share/img/icn-workbook-16x16-v2.png" style="vertical-align: bottom;"/><span style="vertical-align: text-top; padding-left: 10px;">' + folderName + '</span></td></tr>');
	
								}
							
						}
					}
				}
				var rows = document.getElementById('workbookFolders').getElementsByTagName('tr');
					for(var x = 0; x < rows.length; x++) {
						rows[x].className = (x % 2 == 0) ? 'even' : 'odd';
					}
			}
			

        },
		complete:function() {
		   
           
		   
		   //alert('cm');
		 
			
            
            
		},
         error:function(req, reason, error) {
                	alert(reason);
					alert(error);
         }
    });
}

function encodeHtmlJs(input){var builder = "";
for(var i=0;i<input.length;i++){
		var ch = input.charAt(i);
		var chh = input.charCodeAt(i);
		if(ch != 65535){
			if (((ch > '`') && (ch < '{')) || ((ch > '@') && (ch < '[')) || 
			(ch == ' ') || ((ch > '/') && (ch < ':')) || (ch == '.') || (ch == ',') || (ch == '-') || (ch == '_')) {
			builder = builder + ch;
		  } else {
			builder = builder + "&#";
			builder = builder + chh;
			builder = builder + ";";
		  }
	  }
}return builder;}


function addToFolder(folderId, folderName) {

    var shareObj = bl.api.getInstance();
    var shareItemsArr = shareObj.getShareItemsArr();
    var clippingItems = new Array();
    if(shareItemsArr){
		for (var item=0; item<shareItemsArr.length;item++) {
			var shareItem = shareItemsArr[item];
			var input = JSON.stringify(shareItem);
			var clipping = new bl.api.wb.Clipping(input);
			clipping.setFromId(shareItem.getId());
			clipping.setHeading1(shareItem.getHeading1());
			clipping.setHeading2(shareItem.getHeading2());
			clipping.setThumbnailURI(shareItem.getThumbnailURI());
			//if(shareItem.getType() == 'publication'){
				//clipping.setClippingType('Publication');
			//}else{
				clipping.setClippingType(shareItem.getType());
			//}
			clipping.setFromSourceLogo(shareItem.getThumbnailURI());
			clipping.setFromTitle(shareItem.getHeading2());
			clipping.setFromURI(shareItem.getUrl());
			var params = new Object();
			if (shareItem.getDate() != null && shareItem.getDate() != '') {
				params.pubDate = shareItem.getDate();
			}
			if(shareItem.getText() != null && shareItem.getText() != '' && shareItem.getText() != 'undefined'){
				params.clippedText = shareItem.getText();
			}
			if(shareItem.getId()){
	        	params.id = shareItem.getId();
	        }
			clipping.setParams(params);
			clippingItems.push(clipping);
		}
	}
    addMultipleClippings(folderId, clippingItems, shareObj, encodeHtmlJs(folderName));
}

/*added this for showing the loading message*/
function addMultipleClippings(folderId, clippingItems, shareObj, folderName){
	$.ajax(
            {   url:"/BC/S/workbook/folder/"+folderId+"/multipleClippings/",
                cache:false,
                type:"PUT",
                contentType:"application/json",
                dataType:'json',
                data:JSON.stringify(clippingItems),
                beforeSend:function () {
                	unBindEvent('mouseup', 'addToWorkbookPanel');
                    showLoading();
                },
                success:function(data) {
                	uiSuccessCallback(data, shareObj, folderId, folderName);
                },
                error:function(req, reason, error) {
                	uiErrorCallback(reason, shareObj);
                }
            });
}

function showLoading(){
	var parentOffSet = $('#multibasket_1111').offset();
	if (!$('#workbookResultLoading').length) {
		$('<div class="workbookWin_t" style="width:300px; " id="workbookResultLoading">'+
				'<div style="clear:both;">' +
        '<div style="margin-bottom:0px; height:70px; padding-top:5px; width: 300px; text-align:center"><img style="padding-top: 30px;" src="/BC_S/bl_rebrand/images/ajax-loader.gif"/></div>' +
        '</div></div>').appendTo('body');
	}else{
		$('#workbookResultLoading').replaceWith('<div style="clear:both;">' +
                '<div style="margin-bottom:0px; height:70px; padding-top:5px; width: 300px; text-align:center"><img style="padding-top: 30px;" src="/BC_S/bl_rebrand/images/ajax-loader.gif"/></div>' +
                '</div>');
	}
	$('#workbookResultLoading').toggle();
    $('#workbookResultLoading').offset($('#addToWorkbookPanel').offset());
	//$('#workbookResultLoading').offset({top:parentOffSet.top, left:parentOffSet.left});
    closeWorkbookAdd();
    getDivObject('#iframePopup').css({'height':getDivObject('#workbookResultLoading').height()+10});
}

function uiSuccessCallback(response, shareObj,folderId, folderName) {

var parentOffSet = $('#multibasket_1111').offset();
var resultTitle = 'Workbook';
	workbookSuccessflag = true;
	if (!$('#workbookResult').length) {
    $('<div id="overlayResultDiv" class="overlayShare"></div>' +
        '<div class="workbookResultWin" style="z-index: 99;" id="workbookResult"> ' +
            '<a href="#" class="closeMini"id ="resultClose" onclick="closeWorkbookResult();closeWidget(\'mouseup\', \'workbookResult\');return false;"></a>' +
            '<div id="wbTextdiv" class="workbookResultTitle"><span id="dialog_title_span"></span></div>' +
                '<p class="workbookResultMessage" id="resultBody"></p>'+
            '</div>')
         .appendTo('body');
	}
    bindEvent('mouseup', '#workbookResult', 'workbookResult', closeWorkbookResult);
	var allSuccess = true;
    var serverErrorFlag = false;
    if (response) {
        for (var item=0; item<response.length;item++) {
            if (!$('#row_' + response[item].fromId).length) {
              /*  $("#resultBody").append('<tr id="row_' + response[item].fromId + '"><td>' + response[item].type + '</td><td>' + response[item].title + '</td><td>' + response[item].message + '</td></tr>');*/
                if (allSuccess && response[item].status == 'Failure') {
                	allSuccess = false;
                    if(response[item].message == 'Item not Added'){
                        serverErrorFlag = true;
                    }
                }
            }
        }
		
		if(!isResearch){
				$("#wbTextdiv").css({'width':'270px'});
				$("#resultClose").css({'height':'12px'});
			}
        if (allSuccess) {
			/*if(iFrameId){
				$("#workbookResult").css({'height':'65px'}); 
			}
			else{
				$("#workbookResult").css({'height':'auto'}); 
			}*/
        	$("#workbookResult").css({'height':'auto'});
            $("#dialog_title_span").text('Workbook');
            if(response.length > 1) {
        	    $("#resultBody").append('The publications have been added to your workbook:<br> <span style="font-weight:bold">' + folderName + '</span>');
            }
            else if(response.length == 1){
                $("#resultBody").append('<span style="font-weight:bold">' + response[0].title + '</span> has been added to your workbook: <span style="font-weight:bold">' + folderName + '</span>');
            }
        }

        if(!allSuccess){

            /*if(iFrameId){
 				$("#workbookResult").css({'height':'65px'});
 			}
 			else{
 				$("#workbookResult").css({'height':'auto'});
 			}*/
        	
        	$("#workbookResult").css({'height':'auto'});
            $("#dialog_title_span").text('Alert');

            if(serverErrorFlag){
                $("#resultBody").append('Your message was <span style="font-weight:bold">not</span> delivered due to a technical error. Please try again.');
            }
            else
            {
                $("#resultBody").append('One or more of your selected publications already exists in your folder:<br><br><span style="margin:10px;font-weight:bold;">'+folderName+'</span>');
            }
        }

        $('#overlayResultDiv').show();
        $('#workbookResult').toggle();
		if(iFrameId){
			$('#overlayResultDiv').offset($('#workbookResultLoading').offset());
		}
        $('#workbookResult').offset($('#workbookResultLoading').offset());
		//$('#workbookResult').offset({top:parentOffSet.top, left:parentOffSet.left});
		getDivObject('#iframePopup').css({'height':getDivObject('#workbookResult').height()+10});
		sizeAndPositionOverlayResult();
    }
    closeWorkbookLoading();
    shareObj.clearQuickList();
	if(addIconClass){
		clearAddIconClass();
	}
	else{
		clearAddIconState();
	}
	
	if(!isResearch){
		refreshFolderWithClippings(folderId);
	}
}

function refreshFolderWithClippings(folderId){
        addClippingToFolderOnSuccessCallback(folderId);
   }
function uiErrorCallback(response, shareObj) {
var parentOffSet = $('#multibasket_1111').offset();
    //alert('ERROR : - ' + JSON.stringify(response));
	if (!$('#workbookResult').length) {
	    $('<div id="overlayResultDiv" class="overlayShare"></div><div class="workbookResultWin" style="z-index: 99;" id="workbookResult"> ' +
            '<a href="#" class="closeMini"id ="resultClose" onclick="closeWorkbookResult();closeWidget(\'mouseup\', \'workbookResult\');return false;"></a>' +
            '<div id="wbTextdiv" class="workbookResultTitle"><span id="dialog_title_span"></span></div>' +
             '<p class="workbookResultMessage" id="resultBody"></p>'+
             '</div>')
             .appendTo('body');
	}
    $("#dialog_title_span").text('Alert');
    $("#resultBody").append('Your message was <span style="font-weight:bold">not</span> delivered due to a technical error. Please try again.');

    bindEvent('mouseup', '#workbookResult', 'workbookResult', closeWorkbookResult);

    $('#overlayResultDiv').show();
    $('#workbookResult').toggle();
    $('#workbookResult').offset($('#workbookResultLoading').offset());
	//$('#workbookResult').offset({top:parentOffSet.top, left:parentOffSet.left});
	getDivObject('#iframePopup').css({'height':getDivObject('#workbookResult').height()+10});
	
	if(iFrameId){
		$('#overlayResultDiv').css({'width':getDivObject('#workbookResult').width(),'height':getDivObject('#workbookResult').height()}); 
		$('#overlayResultDiv').offset($('#workbookResultLoading').offset()); 
	}
	
	sizeAndPositionOverlayResult();
    closeWorkbookLoading();
}

function sizeAndPositionOverlayResult(){
	if(iFrameId){
		$('#overlayResultDiv').css({'width':getDivObject('#workbookResult').width(),'height':getDivObject('#workbookResult').height()}); 
		$('#overlayResultDiv').offset($('#workbookResultLoading').offset()); 
	}
}
function closeWorkbookLoading(){
	$('#workbookResultLoading').toggle();
    $('#workbookResultLoading').remove();
}
function closeWorkbookAdd() {
    $('#addToWorkbookPanel').toggle();
    $('#addToWorkbookPanel').remove();
}

function closeWorkbookResult() {
    $('#workbookResult').toggle();
    $('#workbookResult').remove();
    $('#overlayResultDiv').remove();
    
}
function closeExpandedDiv(){
	$('.expandbasket').css("display","none");
	$('.expandbasket_n').css("display","none");
	$('.expandedDivModal').css("display","none");
	$('.expandedDiv').css("display","none");
}
function openShareMessageBox() {

   // closeWidget('mouseup','quicklinks');
   $('.sharebasket').css('display', 'none');
   closeExpandedDiv();
 
   getDivObject('#iframePopup').remove();

    var shareObj = bl.api.getInstance();
    var shareItemsArr = shareObj.getShareItemsArr();
   //alert(shareItemsArr.length);
    var messageItems = new Array();
	if(shareItemsArr){
		for (var item=0; item<shareItemsArr.length;item++) {

			var shareItem = shareItemsArr[item];
			//alert(shareItem.getType());
			var messageItem = new Object();
			//Added a workaround not that great
			if(shareItem.getType()=='Clipping'){
				messageItem.type = 'text';
			}else if(shareItem.getType() == 'Web'){
				messageItem.type = 'Publication';
			}else{
				messageItem.type = shareItem.getType();
			}
			messageItem.heading1 = shareItem.getHeading1();
			messageItem.id = shareItem.getId();
			messageItem.heading2 = shareItem.getHeading2();
			
			if (shareItem.getDate() != null && shareItem.getDate() != '') {
				messageItem.date = new Date(shareItem.getDate());
			}
			messageItem.url = shareItem.getUrl();
			messageItem.thumbnailURI = shareItem.getThumbnailURI();
			messageItems.push(messageItem);
		}
	}


    var content = {
        "subject":"I have shared an item with you",
        "body":"I have shared an item with you",
        "items":messageItems
    };
    compose(content, callMe);
}


function callMe(status, statusDesc, actualResponse) {
    if(statusDesc !='USER_CANCELLED'){
        share_Obj.clearQuickList(clearSuccessCallBack, clearErrorCallback);
		if(addIconClass){
			clearAddIconClass();
		}
		else{
			clearAddIconState();
		}
    }
}

function getBrowser() {
		    var N=navigator.appName, ua=navigator.userAgent, tem;
		    var M=ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
		    if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
		    M=M? [M[1], M[2]]: [N, navigator.appVersion, '-?'];
		    return M[0];
		 }

function reposition(clickX, clickY, divId, objDiv) {
	if(!isResearch){
		
		bufferYOnDiv = 20;
		bufferXOnDiv = -7;
	}
	var brw = getBrowser();
	if(!isResearch && brw =='Firefox'){
     bufferXOnDiv = 23;
    }
	if(isResearch && brw =='Firefox'){
     bufferXOnDiv = 27;
    }
	var offset = getBindObject(objDiv).offset();
	srcElementOffset=offset;
	var relX = offset.left;
	var relY = offset.top;
	var bufferX = bufferXOnDiv;
	var bufferY = bufferYOnDiv;
	var rightXOnly = 35;
	var rightX = 5;
	var rightY = 10;
	if(tagWithClick){
		relX = clickX;
		relY = clickY;
		bufferX = bufferXOnClick;
		bufferY = bufferYOnClick;
		rightXOnly = 12;
		rightX = 10;
		rightY = 5;
	}
	
	var offset = new Object();
	//alert('bufferX '+bufferX);
	
    offset.left = relX - getDivObject(divId).outerWidth() + bufferX; 
    offset.top = relY + bufferY; 
    
    var widgetWidth=getDivObject(divId).outerWidth();
    var widgetHeight=getDivObject(divId).outerHeight();
    
    getDivObject('.talkBubbleDown').css('display','none');

    var viewPortTop = $(window).outerHeight();
	//alert('viewPortTop = '+viewPortTop);
	var tot=widgetWidth+relX;
		/*if((relX < widgetWidth) && (viewPortTop < relY + widgetHeight)){
			offset.left= relX-rightX;
			offset.top = (relY - (widgetHeight))+rightY;
			$('.talkBubbleDown').css('display','block');
			$('.talkBubbleDown').css('float','left');
			$('.talkBubbleDown').css('left','5px');
			$('.talkBubbleTop').css('display','none');
			$('#addToQuickDiv').css('margin-top', '0px');
			$('#clearAttachmentDiv').css('margin-top', '0px');
		} else {*/
			if(relX < widgetWidth){
				offset.left= relX-rightXOnly;
				$('.talkBubbleTop').css('float','left');
				$('.talkBubbleTop').css('left','5px');
				$('.talkBubbleDown').css('display','none');
				talkBubbleFloatLeft=true;
			}
			//check to see the click was at the bottom of the screen
			/*if(viewPortTop < relY + widgetHeight){
				offset.top = (relY - (widgetHeight))+10;
				$('.talkBubbleDown').css('display','block');
				$('.talkBubbleTop').css('display','none');
				$('#addToQuickDiv').css('margin-top', '0px');
				$('#clearAttachmentDiv').css('margin-top', '0px');
			}*/
		//}

	
	getDivObject('#iframePopup').css({'top':offset.top,'left': offset.left+29}); // this is the layer for widget
    getDivObject(divId).css({"display":'block'});
    getDivObject(divId).offset(offset);
	//alert('viewPortTop = ' +viewPortTop);
	//alert('relY + widgetHeight = '+(relY + widgetHeight));
	if(viewPortTop < relY + widgetHeight +100){
		 resizeWindow();
	}
}

function resizeWindow(){
	try{
		$('.expandedDivModal').css("height",expandedDivModalHeight);
			if(!($.browser.msie)){
				parent.BCResizeScreen();
			}else{
            parent.forIEResize();
			}
			
			
		}catch(e){}
}
function escapeQuoteJS(str){
    return String(str).replace(/'/g, "\\'");
}

jQuery.fn.getPath = function () {
    if (this.length != 1) throw 'Requires one element.';

    var path, node = this;
    while (node.length) {
        var realNode = node[0];
        var name = (
            // IE9 and non-IE
            realNode.localName ||
                // IE <= 8
                realNode.tagName ||
                realNode.nodeName
            );
        // on IE8, nodeName is '#document' at the top level, but we don't need that
        if (!name || name == '#document') break;

        name = name.toLowerCase();
        if (realNode.id) {
            // As soon as an id is found, there's no need to specify more.
            return name + '#' + realNode.id + (path ? '>' + path : '');
        } else if (realNode.className) {
            name += '.' + realNode.className.split(/\s+/).join('.');
        }

        var parent = node.parent(), siblings = parent.children(name);
        if (siblings.length > 1) name += ':eq(' + siblings.index(node) + ')';
        path = name + (path ? '>' + path : '');
        node = parent;
    }
    return path;
};

function clearAddIconState(){
    $(document).find('.addIcon').attr('src' ,'/BC_S/css/mresearch/workbook/img/plus_grey.png');
}
function clearAddIconClass(){
    getBindObject('.'+addIconClass).removeClass(addIconClass);
}

function bindEvent(eventType, eventObject, eventNameSpace, closeFunctionName){


       	  getBindObject('body').on(''+eventType+'.'+ eventNameSpace +'',function (e) {
               var container = getDivObject(eventObject);
           if (!container.is(e.target)                                  // if the target of the click isn't the container...
                   && container.has(e.target).length === 0)             // ... nor a descendant of the container
               {
                    container.hide();
       			    closeWidget(eventType, eventNameSpace);
					
                   if(closeFunctionName){
                       closeFunctionName.call();
                   }
               }
/*
               if (!$('#addToWorkbookPanel').is(e.target) && $('#addToWorkbookPanel').has(e.target).length == 0) {
                    closeWorkbookAdd();
       			    closeWidget();
               }
               if (!$('#workbookResult').is(e.target) && $('#workbookResult').has(e.target).length == 0) {
                    closeWorkbookResult();
       			    closeWidget();
               }
*/
           });
}
function unBindEvent(eventType, eventNameSpace){
       	  getBindObject('body').off(''+eventType+'.'+ eventNameSpace +'');
}

function escapeNewLine(str) {
    return String(str).replace(/\n/g, "\\n");
}

function wbDecodeHtml_ui(text) {
    var encodedText = '';

    if(typeof text != 'undefined' && text != null && text != ''){
        encodedText  = $('<div/>').text(text).html();;
    }
    return  encodedText;
}



$(document).ready(function () {
	if(!isResearch){
		checkState();
	}
	
	
});

function checkState(){
	if(jsLoadCounter !== scriptArray.length){
		setTimeout(checkState,100);
	}else{
		loadAddIconState();
	}
}

function loadAddIconState(){
    share_Obj = bl.api.getInstance();

    bl.api.share.web.service.getAllFromQuickLists(function (data) {
    var items = share_Obj.getShareItems(data);
        for (temp in items) {
                var item = items[temp];
                if (item.sourceElementId) {
                    flipAddIcon(item.sourceElementId);
                }
            }
        }, addErrorCallback);
}
function toggleFormat(){
		if($('#showOption').hasClass('summaryChecked')){
			$('#showOption').removeClass('summaryChecked');
			$('.expand_summary').hide();
			resizeWindow();
		}else{
			$('#showOption').addClass('summaryChecked');
			$('.expand_summary').show();
		}
		
}
function openExpand(divId){
	
	if($('.expandedDiv').css("display")=="none"){
		$('.expandedDiv').css("display","block");
		$('.expandedDivModal').css("display","block");
		expandedDivModalHeight=$('.expandedDivModal').offset().height;
		//////////////////
		$('.sharebasket').css("display","none");
		unBindEvent('mouseup', 'quicklinks');
		bindEvent('mouseup','.expandbasket','link_expand');
		bindEvent('mouseup','.expandbasket_n','link_expand');
		return false;
	}
	
var content=expandItems;
//the quicklist style expanded panel
/*
	var expandDiv='<div class="expandbasket"  style="box-sizing: border-box; display: block;">'+
	'<div class="talkBubbleTop"></div>'+
	'<div style="clear:both;">'+
	'<div id="quickListExpand" style="float:left;border:0px"><div class="showOption"><input type="radio" name="showOption" value="title"><label>title</label></input> <input type="radio" name="showOption" value="summary"><label>summary</label></input></div><h4 class="shareLabel left">Quick List</h4></div>'+
		'<div id="closeExpandedDiv" style="float:right; border:0px; margin-right: 10px">'+
			'<a href="#" onclick="backToQuicklist('+divId+');return false;" id="close" title="clear all" style="text-align: center; ">Close</a>'+
		'</div>'+
	'</div>'+
	'<ol class="gblol">';
	for(var i=0;i<content.length;i++){
		expandDiv+='<li class="shareItem" id="li_'+content[i].id+'" onclick="removeSelectedExpandLink(\'' + content[i].type + '\',\'' + escapeQuoteJS(content[i].L1) + '\',\'' + escapeQuoteJS(content[i].L2) + '\',\'' + content[i].url + '\',\'' + content[i].date + '\',\'' + content[i].thumbnailURI + '\',\'' + escapeNewLine(escapeQuoteJS(content[i].text)) + '\',\'' + content[i].sourceElementId + '\',\'' + content[i].id + '\')" >'+
		'<div class="L1" style="border: none;height: auto;">'+content[i].L1+'</div>'+
		'<div class="L2" style="border: none;height: auto;"><a href="'+content[i].linkback+'">'+content[i].L2+'</a></div>'+
		'</li>'
	}	
	expandDiv+='</ol>'+
	'<div id="shareCanWrapperFromExpand"><div id="share" data-ua-instrument="true" data-ua-pub-id="10.144.63.169" data-ua-user-id="prethina" data-ua-page-name="Home" data-ua-feature-type="QuickList" data-ua-menu-code="MENU_FI_WELCOME" data-ua-feature-name="Share" onclick="openShareMessageBox();">Share</div>'+
	'<div id="addToWorkbookFromExpand" data-ua-instrument="true" data-ua-pub-id="10.144.63.169" data-ua-user-id="prethina" data-ua-page-name="Home" data-ua-feature-type="QuickList" data-ua-menu-code="MENU_FI_WELCOME" data-ua-feature-name="Add to Workbook" onclick="openAddToWorkbookBox();">Add to Briefcase</div>'+
	'</div>'+

'</div></div>'
*/

var expandDiv='<div class="expandbasket_n"  style="box-sizing: border-box; display: block;">'+
	//'<div class="talkBubbleTop"></div><div class="topBarForExpand"></div>'+
	'<div style="clear:both;height:60px;">'+
	'<div id="quickListExpand" style="float:left;border:0px;margin-left: 240px;padding-top: 5px;">'+
	'<h4 class="shareLabel left">Quick List</h4></div>'+
		'<div id="closeExpandedDiv" style="float:right; border:0px; margin-right: 10px">'+
			'<a href="#" onclick="clearAllAttachmentFromExpand('+divId+');return false;" id="clear" title="clear all" style="text-align: center; ">Clear All</a>'+
		'</div>'+
	'<div id="expandedTool" style="float:left;border:0px;position:relative;top:-5px;">'+
		
		'<div id="shareCanWrapperFromExpand">'+
		
		
	
		'<div id="share" onclick="openShareMessageBox();">Share</div>'+
		'<div id="addToWorkbookFromExpand"   onclick="openAddToWorkbookBox();" style="margin-left:5px;">Add to Briefcase</div>'+
		'<div id="emailMeBtn" style="position:relative;width:100px;display:inline-block;border:none;"> <a class="expandBtn" style="color:#00aeef!important;margin-left:35px;" onclick="javascript:emailHandler()">Email Me</a></div>'+
		//'<div id="copyButton" onclick="copyToClipboard()">Copy All</div>'+
		//'<div class="showOption"><form id="formatForm">'+
		//'<input type="radio" name="showOption" value="title" checked onclick="toggleFormat()"><label style="vertical-align:center;" >Title</label></input> <input type="radio" name="showOption" value="summary" onclick="toggleFormat()"><label>Summary</label></input></form></div>'+
		'<div style="position:relative;color:#00aeef!important;padding-top:7px;width: 138px;display:inline-block;border-bottom:0;margin-left:125px;"><div id="showOption" class="summaryChecked" onclick="javascript:toggleFormat();"><span><input id="showInput" type="checkbox"></span></div><span style="width:100px;padding-left:5px;">Show Summary</span></div>'+
		//'<div style="position:relative;width:120px;display:inline-block;border:none;margin-left:10px;"> <a class="expandBtn" style="color:#00aeef!important;" data-clipboard-target="#gblol" data-clipboard-action="copy">Copy to Clipboard</a></div>'+
		
	'</div>'+
	
	'</div>'+
	'</div>'+
	'<ol class="gblol" id="gblol">';
	for(var i=0;i<content.length;i++){
		expandDiv+='<li class="shareItem"  id="li_'+content[i].id+'" onclick="removeSelectedExpandLink(\'' + content[i].type + '\',\'' + escapeQuoteJS(content[i].heading1) + '\',\'' + escapeQuoteJS(content[i].heading2) + '\',\'' + content[i].url + '\',\'' + content[i].date + '\',\'' + content[i].thumbnailURI + '\',\'' + escapeNewLine(escapeQuoteJS(content[i].text)) + '\',\'' + content[i].sourceElementId + '\',\'' + content[i].id + '\')" >'+
		'<div class="L1" style="border: none;height: auto;" onclick="stopBubbling();">'+content[i].heading1+'</div>'+
		'<div class="L2" style="border: none;height: auto;" onclick="stopBubbling();"><a href="'+content[i].linkback+'" onclick="stopBubbling();">'+content[i].heading2+'</a></div>';
		if(typeof content[i].summary!=="undefined"){
			expandDiv+='<div class="expand_summary" style="border: none;height: auto;" onclick="stopBubbling();">'+content[i].summary+'</div>';
		}
		//expandDiv+='<div class="summary" style="border: none;height: auto;">'+'Following weeks of speculation, iHeartMedia announced that the company will not repay a portion ($57.1mn) of its upcoming $250mn 5.5% due December 15, 2016, legacy notes held by an unrestricted subsidiary, Clear Channel Holdings (CCH). We view the lack of full payment as a negative development for the structure and creates a high degree of uncertainty for the credit. We remain Market Weight the structure but have adopted a more cautious stance on the credit until more details emerge.'+'</div>';
		expandDiv+='</li>';
	}	
	expandDiv+='</ol>'+
	
	'</div>'+
	'<input type="textarea" id="_hiddenCopyText_" style="display:none;"></input>'

'</div></div>'

$('.expandedDiv').append(expandDiv);
$('.expandedDivModal').css("display","block");
expandedDivModalHeight=$('.expandedDivModal').height;
//var clipboard = new Clipboard('.expandBtn');
///////////////
if($('.addIcon').length){
	$('.expandbasket_n a#clear').css({"padding":"14px 6px 0px 6px"});
	$('.expandbasket_n .shareLabel').css("margin-top","0px");
	$('.expandbasket_n div#addToWorkbookFromExpand').css("width","122px");
	$('.expandbasket_n div#share').css({"padding-top":"14px","margin-top":"-7px"});
}
if($('#coverUniMainDiv').length){
	$('.expandbasket_n a#clear').css({"padding-top":"20px","margin-top":"-10px"});
	$('.expandbasket_n div#share').css("background-position","0px -2px");
	$('.expandbasket_n div#addToWorkbookFromExpand').css("width","125px");
}
var top=$('.sharebasket').css("top").replace('px','');

//top=top-353+"px";

var left=$('.sharebasket').css("left").replace('px','');

ql_left=$('#multibasket_1111').offset().left;
ql_top=$('#multibasket_1111').offset().top;

//var right=$('.sharebasket').css("right");
//left=($(window).width()-500)/2;
left=parseInt(left);

if(talkBubbleFloatLeft){
	left=left+200;
	$('.expandedDiv .talkBubbleTop').css("right","475px");
}else{
	left=left+160;

	$('.expandedDiv .talkBubbleTop').css("right","167px");
}
left=($(window).width()-600)/2;
//top=($(window).height()-$('.sharebasket').offset().height())/2;

var right=left;
left=left+300;
$('.expandedDiv').css({"top":top+"px","left":left+"px","right":right+"px"});

$('.sharebasket').css("display","none");
unBindEvent('mouseup', 'quicklinks');
//bindEvent('mouseup','.expandbasket','link_expand');
bindEvent('mouseup','.expandbasket_n','link_expand');
}

function backToQuicklist(divId){
	$('.sharebasket').css("display","block");
	$('.expandedDiv').css("display","none");
	$('.expandedDivModal').css("display","none");
	unBindEvent('mouseup', 'link_expand');
	bindEvent('mouseup', '#multibasket_' + divId, 'quicklinks');
}

function emailHandler(){
	var url="/BC/S/ql/emailMe";
	
	if($('#showOption').hasClass('summaryChecked')){
			url+="?show=Y";
	}
	/*for(int i=0;i<expandItems.length;i++){
		if(expandItems[i].linkback.equals("")){
			 uiCallbackForEmail(false);
		}
		break;
	}*/
	$.ajax({   
		url:url,
        type:"POST",
        contentType:"application/json",
        dataType:'json',
        data:JSON.stringify(expandItems),
                
        success:function(data) {
             uiCallbackForEmail(data);    	
			setTimeout(function(){closeExpandedDiv();},2000);
					
        },
        error:function(req, reason, error) {
            uiCallbackForEmail(false);
			setTimeout(function(){closeExpandedDiv();},2000);
        }
     });
}


function uiCallbackForEmail(success){
	
	var resultTemplate='<div id="ext-comp-1050" class="x-component confirmationPanel x-layer x-component-default" style="width: 500px;  z-index: 19011; margin-left:-250px;/* display: none; */"><a href="#" class="clickable popupCloseIcon"></a><div class="content" id="ext-gen1240"><div class="message-container"><div>';
	if(success){
		resultTemplate+='The items in your Quick List have been emailed to you.';
	}else{
		resultTemplate+='Sent failed';
	}
	
	resultTemplate+='</div></div></div><div style="clear:both;"></div></div>';
	
	$('.expandbasket_n').css("display","none");
	$(".expandedDiv").append(resultTemplate);
	
}

function escapeSpecialChar(ori){
	ori=replaceAll("<","&lt;");
	ori=replaceAll(">","&gt;");
	ori=replaceAll('"','&quot;');
	return ori;
}


