//
// general javascript functions
//

function getBrowserName()
{
	var browser = navigator.appName;

	return(browser);
}

function getBrowserVersion()
{
	var version = navigator.appVersion;

	return(version);
}

function isNetscape()
{
	var browser = getBrowserName();
	browser = browser.toUpperCase();
	if(browser.indexOf("NETSCAPE") >= 0)
		return(true);
	else
		return(false);
}

function isIE()
{
	var browser = getBrowserName();
	browser = browser.toUpperCase();
	if(browser.indexOf("NETSCAPE") >= 0)
		return(false);
	else
		return(true);
}

function isIE55()
{
	var browser = getBrowserName();
	browser = browser.toUpperCase();
	if(browser.indexOf("NETSCAPE") >= 0)
	{
		return(false);
	}
	else
	{
		var version = getBrowserVersion();
		version = version.toUpperCase();
		if(
			(version.indexOf("MSIE 5.5") >= 0) ||
			(version.indexOf("MSIE 5.6") >= 0) ||
			(version.indexOf("MSIE 5.7") >= 0) ||
			(version.indexOf("MSIE 5.8") >= 0) ||
			(version.indexOf("MSIE 5.9") >= 0) ||
			(version.indexOf("MSIE 6.") >= 0) ||
			(version.indexOf("MSIE 7.") >= 0) ||
			(version.indexOf("MSIE 8.") >= 0) ||
			(version.indexOf("MSIE 9.") >= 0)
		)
			return(true);
		else
			return(false);
	}
}

function isIEOfVersion(ver)
{
	var version = getBrowserVersion();
	version = version.toUpperCase();
	if(ver == "6" && version.indexOf("MSIE 6.") >= 0)
		return true;
	
	if(ver == "7" && version.indexOf("MSIE 7.") >= 0)
		return true;
		
	if(ver == "8" && version.indexOf("MSIE 8.") >= 0)
		return true;
	
	if(ver == "9" && version.indexOf("MSIE 9.") >= 0)
		return true
	
	return false ;
	
}

function anyCheck(form) {
	var total = 0;
	//var max = form.DocsToBePrinted.length;
	var max = document.selectMail.DocsToBePrinted.length;
	for (var idx = 0; idx < max; idx++) {
		//if (eval("document.selectMail.DocsToBePrinted[" + idx + "].checked") == true) {
		if (document.selectMail.DocsToBePrinted[idx].checked == true) {
    			total++;
   		}
	}
	if(total < 2){
		alert("Please select atleast two documents. If you want to print one document, then click on that document link.");
	}else{
		document.selectMail.action = "/RSL/jsp/mergedocs/MultipleDocsMerger.jsp";
		document.selectMail.method = "POST";
		document.selectMail.submit();
	}
}

function wasEnterKeyPressed(e)
{
	var event = e ? e : window.event;
	var keyValue = -1;

	if(isNetscape())
		keyValue = event.which;
	else
		keyValue = event.keyCode;

	if(keyValue == 13)
	{
		return(true);
	}
	else
	{
		return(false);
	}
}

function isBlank(s)
{
        for(var i = 0; i < s.length; i++)
        {
                var c = s.charAt(i);
                if((c != ' ') && (c != '\n') && (c != '\r') && (c != '\t'))
                        return(false);
        }

        return(true);
}

function showListGWT(resultPrefix, dataType, pgQuery, pgText, pgSort)
{
	showList(resultPrefix, dataType, pgQuery, pgText, pgSort);
}

function showListKeyHandler(e, resultPrefix, dataType, pgQuery, pgText, pgSort)
{
	if(wasEnterKeyPressed(e))
		showList(resultPrefix, dataType, pgQuery, pgText, pgSort);
}

function showList(resultPrefix, dataType, pgQuery, pgText, pgSort)
{
	pgQuery = pgQuery.replace(/\/LAS\/UnauthProxy/, "");
	pgText = pgText.replace(/\/LAS\/UnauthProxy/, "");

	var resultFormat = "";
	var xslURL = "";
	if(dataType == "CLIENT")
	{
		resultFormat = "LL_HTML";
		xslURL = "/" + resultPrefix + "/xsl/listClient.xsl";
	}
	else
	{
		resultFormat = "DV_XML";
		xslURL = "/" + resultPrefix + "/xsl/listIntranet.xsl";
	}

        var dateFrom = "";
        var dateTo = "";
        var pubTitle = "", pagePubTitle = "", keyword = "";

	var elmFromDate = document.getElementById("fia-datepicker-slot1");
	var elmToDate = document.getElementById("fia-datepicker-slot2");

        if(elmFromDate)
        {
                dateFrom = elmFromDate.value;
                if(validateDate(dateFrom) < 0)
                {
                        alert("Please enter a valid date in the \"From\" field.");
                        return(false);
                }
                dateTo = elmToDate.value;
                if(validateDate(dateTo) == -222)
                {
                        alert("Please enter a valid date in the \"To\" field.");
                        return(false);
                }
        }

	var sortBy = "PUBDATEPUBID desc";
        if(document.forms[0].pubTitle)
	{
		if(
			(
				(document.forms[0].searchType.length) &&
				(document.forms[0].searchType[0].checked)
			) ||
			(
				document.forms[0].searchType.value == "keyword"
			)
		)
		{
                        keyword = document.forms[0].pubTitle.value;
			//keyword = keyword.replace(/"/g, "");
                        if(!isBlank(keyword))
                        {
                                sortBy = "SCORE desc";
                                if(isIE55())
                                {
                                        keyword = encodeURIComponent(keyword);
                                }
                                else
                                {
                                        keyword = escape(keyword);
                                }
                        }
		}
		else
		{
        		pubTitle = document.forms[0].pubTitle.value;
			//pubTitle = pubTitle.replace(/"/g, "");
			if(!isBlank(pubTitle))
			{
				if(isIE55())
				{
					pagePubTitle = encodeURIComponent(pubTitle);
					pubTitle = "%2a" + encodeURIComponent(pubTitle) + "%2a";
				}
				else
				{
					pagePubTitle = escape(pubTitle);
					pubTitle = "%2a" + escape(pubTitle) + "%2a";
				}
			}
		}
	}

	var xmlURL = "", pageQuery = "", pageText = "";
	if(pgText == "")
	{
		if(isIE55())
		{
			pageQuery = encodeURIComponent(pgQuery);
		}
		else
		{
			pageQuery = escape(pgQuery);
		}
		xmlURL = pgQuery + "&pageText=" + pageQuery;
	}
	else
	{
		if(isIE55())
		{
			pageText = encodeURIComponent(pgText);
		}
		else
		{
			pageText = escape(pgText);
		}
		xmlURL = pgText + "&pageText=" + pageText;
	}

	xmlURL = xmlURL.replace(/resultFormat=/g, "oldRF=");
	xmlURL = xmlURL +
		"&resultFormat=" + resultFormat;
	xmlURL = xmlURL.replace(/resultOffset=/g, "oldRO=");

        if(elmFromDate)
	{
		xmlURL = xmlURL.replace(/dateRange=/g, "oldDR=");
		xmlURL = xmlURL.replace(/dateFrom=/g, "oldDF=");
		xmlURL = xmlURL.replace(/dateTo=/g, "oldDT=");

		xmlURL = xmlURL +
		"&dateFrom=" + dateFrom +
		"&dateTo=" + dateTo;
	}

	xmlURL = xmlURL.replace(/sortBy=/g, "oldSB=");
	if(pgSort == "") {
		xmlURL = xmlURL + "&sortBy=" + escape(sortBy);

		document.forms[0].sortBy.value = sortBy;
	}
	else {
		xmlURL = xmlURL + "&sortBy=" + escape(pgSort);

		document.forms[0].sortBy.value = pgSort;
	}

	if(pagePubTitle != "") {
		xmlURL = xmlURL.replace(/pubTitle=/g, "oldPT=");
		xmlURL = xmlURL.replace(/pubTitleI18N=/g, "oldPTI18N=");
		xmlURL = xmlURL.replace(/pagePubTitle=/g, "oldPGPT=");
		xmlURL = xmlURL.replace(/pagePubTitleI18N=/g, "oldPGPTI18N=");

		xmlURL = xmlURL +
			"&pubTitleI18N=" + pubTitle +
			"&pagePubTitleI18N=" + pagePubTitle;
	}
	else {
		xmlURL = xmlURL.replace(/keyword=/g, "oldKY=");
		xmlURL = xmlURL.replace(/keywordI18N=/g, "oldKYI18N=");
		xmlURL = xmlURL.replace(/pageKeyword=/g, "oldPGKY=");
		xmlURL = xmlURL.replace(/pageKeywordI18N=/g, "oldPGKYI18N=");

		if(keyword != "") {
			xmlURL = xmlURL +
				"&keywordI18N=" + keyword +
				"&pageKeywordI18N=" + keyword;
		}
	}

	document.forms[0].xmlURL.value = xmlURL;

	document.forms[0].xslURL.value = xslURL;

	document.forms[0].submit();

	return(false);
}

function showRecentGWT(btn)
{
	var groupID = btn.buttonId ? btn.buttonId : btn.getAttribute("buttonId");
	showRecent(groupID);
}

function showRecentKeyHandler(e, groupID)
{
	if(wasEnterKeyPressed(e))
		showRecent(groupID);
}

function showRecent(groupID)
{
        var dateFrom = "";
        var dateTo = "";
        var pubTitle = "", pagePubTitle = "", keyword = "";

	var elmFromDate = document.getElementById("fia-datepicker-slot1");
	var elmToDate = document.getElementById("fia-datepicker-slot2");

        if(elmFromDate)
        {
                dateFrom = elmFromDate.value;
                if(validateDate(dateFrom) < 0)
		{
                        alert("Please enter a valid date in the \"From\" field.");
                        return(false);
                }
                dateTo = elmToDate.value;
                if(validateDate(dateTo) == -222)
                {
                        alert("Please enter a valid date in the \"To\" field.");
                        return(false);
                }
        }

	var sortBy = "TIME+desc";
        if(document.forms[0].pubTitle)
        {
		if(document.forms[0].searchType[0].checked)
		{
                        keyword = document.forms[0].pubTitle.value;
			//keyword = keyword.replace(/"/g, "");
                        if(!isBlank(keyword))
                        {
				sortBy = "SCORE+desc";
                                if(isIE55())
                                {
                                        keyword = encodeURIComponent(keyword);
                                }
                                else
                                {
                                        keyword = escape(keyword);
                                }
                        }
		}
		else
		{
        		pubTitle = document.forms[0].pubTitle.value;
			//pubTitle = pubTitle.replace(/"/g, "");
			if(!isBlank(pubTitle))
			{
				if(isIE55())
				{
					pagePubTitle = encodeURIComponent(pubTitle);
					pubTitle = "%2a" + encodeURIComponent(pubTitle) + "%2a";
				}
				else
				{
					pagePubTitle = escape(pubTitle);
					pubTitle = "%2a" + escape(pubTitle) + "%2a";
				}
			}
		}
        }

       	var xmlURL = "/DDL/servlets/dv.search?pagePubTitleI18N="+pagePubTitle+"&keywordI18N="+keyword+"&pageKeywordI18N="+keyword+"&groupID="+groupID+"&pubTitleI18N="+pubTitle+"&dateFrom="+dateFrom+"&dateTo="+dateTo+"&resultFormat=DV_XML&resultDetail=LONG&numResults=50&sortBy="+sortBy+"&characterSet=UTF-8";
	var xslURL = "/DDL/xsl/recentIntranet.xsl";

	document.forms[0].xmlURL.value = xmlURL;
        document.forms[0].xslURL.value = xslURL;
        document.forms[0].groupID.value = groupID;

	document.forms[0].submit();

        return(false);
}

function showDepartmentKeyHandler(e, resultPrefix, id, name, hidden)
{
	if(wasEnterKeyPressed(e))
		showDepartment(resultPrefix, id, name, -1, hidden);
}

function showDepartment(resultPrefix, id, name, latestDisplayDate, hidden)
{
        name = name.replace(/&/g, "and");
	if(hidden == "HIDDEN")
		hidden = 1;

        var dateFrom = "";
        var dateTo = "";
        var pubTitle = "", pagePubTitle = "", keyword = "";
	var latest = 0;

	if((latestDisplayDate == "") || (latestDisplayDate == "NA") || (latestDisplayDate == "N/A"))
	{
		latestDisplayDate = getTodaysDate();
	}

	latest = validateDate(""+latestDisplayDate);
        if(latest > 0)
        {
		if((id == 11) || (id == 54))
                	dateFrom = toDisplayDate(getDateDelta(""+latest, "1 month"));
		else
                	dateFrom = toDisplayDate(getDateDelta(""+latest, "1 year"));
                dateTo = "";
        }
        else
        {
                if(document.forms[0].dateFrom)
                {
                        dateFrom = document.forms[0].dateFrom.value;
                        if(validateDate(dateFrom) < 0)
                        {
                                alert("Please enter a valid date in the \"From:\" field.");
                                document.forms[0].dateFrom.focus();
                                return(false);
                        }
                        dateTo = document.forms[0].dateTo.value;
                        if(validateDate(dateTo) == -222)
                        {
                                alert("Please enter a valid date in the \"To:\" field.");
                                document.forms[0].dateTo.focus();
                                return(false);
                        }
                }
        }

	var sortBy = "PUBDATEPUBID+desc";
        if(document.forms[0].pubTitle)
	{
		if(document.forms[0].searchType[0].checked)
		{
        		keyword = document.forms[0].pubTitle.value;
			keyword = keyword.replace(/"/g, "");
			if(!isBlank(keyword))
			{
				sortBy = "SCORE+desc";
				if(isIE55())
				{
					keyword = encodeURIComponent(keyword);
				}
				else
				{
					keyword = escape(keyword);
				}
			}
		}
		else
		{
        		pubTitle = document.forms[0].pubTitle.value;
			pubTitle = pubTitle.replace(/"/g, "");
			if(!isBlank(pubTitle))
			{
				if(isIE55())
				{
					pagePubTitle = encodeURIComponent(pubTitle);
					pubTitle = "%2a" + encodeURIComponent(pubTitle) + "%2a";
				}
				else
				{
					pagePubTitle = escape(pubTitle);
					pubTitle = "%2a" + escape(pubTitle) + "%2a";
				}
			}
		}
	}

	var xmlURL = "/" + resultPrefix + "/servlets/dv.search?pageTitle="+escape(name)+"&pageID="+id+"&dateFrom="+dateFrom+"&dateTo="+dateTo+"&deptID="+id+"&sortBy="+sortBy+"&resultFormat=DV_XML&resultDetail=LONG&numResults=25&characterSet=UTF-8";
	if(pagePubTitle != "") {
		xmlURL = xmlURL.replace(/pubTitle=/g, "oldPT=");
		xmlURL = xmlURL.replace(/pubTitleI18N=/g, "oldPTI18N=");
		xmlURL = xmlURL.replace(/pagePubTitle=/g, "oldPGPT=");
		xmlURL = xmlURL.replace(/pagePubTitleI18N=/g, "oldPGPTI18N=");

		xmlURL = xmlURL +
			"&pubTitleI18N=" + pubTitle +
			"&pagePubTitleI18N=" + pagePubTitle;
	}
	else {
		xmlURL = xmlURL.replace(/keyword=/g, "oldKY=");
		xmlURL = xmlURL.replace(/keywordI18N=/g, "oldKYI18N=");
		xmlURL = xmlURL.replace(/pageKeyword=/g, "oldPGKY=");
		xmlURL = xmlURL.replace(/pageKeywordI18N=/g, "oldPGKYI18N=");

		if(keyword != "") {
			xmlURL = xmlURL +
				"&keywordI18N=" + keyword +
				"&pageKeywordI18N=" + keyword;
		}
	}
	if(hidden == 1)
		xmlURL = xmlURL + "&pageType=HIDDEN&deptType=HIDDEN";
	if(id == 106)
		xmlURL = xmlURL + "&excludeTitle=emerging+markets+manifold%2a";
	document.forms[0].xmlURL.value = xmlURL;

	var xslURL = "/" + resultPrefix + "/xsl/listIntranet.xsl";
        document.forms[0].xslURL.value = xslURL;

	document.forms[0].submit();

        return(false);
}

// adhoc email
function sendDVAdhocEmail(pub_id, doc_id, title)
{
        if(doc_id > 0) {
                url = "/DDL/jsp/researchMail.jsp?itemType=doc&itemID="+encodeURIComponent(doc_id)+"&itemTitle="+encodeURIComponent(title)+"&itemContent=content&NOBACK=YES&characterSet=UTF-8&searchID=" + encodeURIComponent(pub_id);
        }
        else {
                url = "/DDL/jsp/researchMail.jsp?itemType=pub&itemID="+encodeURIComponent(pub_id)+"&itemTitle="+encodeURIComponent(title)+"&itemContent=content&NOBACK=YES&characterSet=UTF-8&searchID=" + encodeURIComponent(pub_id);
        }

        DVOpenWindow(url, 0, 0, "ADHOC");
        return(false);
}

/*=IPAD fix
 * 
 */
var isEventSupported = function () {
	/* for events that can only be triggered on certain elements */
	var tagNames = {/* empty now, add if needed */};	
	
	return function isEventSupported(eventName) {
		var el = document.createElement(tagNames[eventName] || 'div');
		eventName = 'on' + eventName;
		/* first check if property exists in element */
		var isSupported = (eventName in el);
		if (!isSupported) {
			/* 
			 * check to see if event handler is created when
			 * setting the element's eventType attribute
			 */
			el.setAttribute(eventName, 'return;');
			isSupported = typeof el[eventName] === 'function';
		}
		el = null;
		return isSupported;
	};
}();

/*=IPAD fix
 * feature detection to see if device is touch device
 */
var isTouch = function () {
	// check for the event 'touchend'
	var touchable = isEventSupported('touchend');
	return function () {
		return touchable;
	};
}();

/*=IPAD fix
 * checks to see if device is iDevice and 
 * if the doc pointed by the url can be 
 * open without a frameset.
 */
var isFramesSupported = function (winName, url) {
	if((winName == "remote") || (winName == "remote_child")) {
		return !isTouch() ||
			url.match(/^\/PRC_S\//) ||
			url.match(/^\/GER_S\//) ||
			url.match(/^\/RSR_S\//) ||
			url.match(/^\/RSL\/jsp\/RuleToNugget\.jsp\?/) ||
			url.match(/^\/BC\/composite\/GER_COMPANY\?/) ||
			url.match(/^\/BC\/composite\/GER_ANALYST\?/) ||
			url.match(/^\/RSL\/jsp\/analyst\.jsp\?/) ||
			url.match(/^\/RSL\/jsp\/multipartViewer\.jsp\?/) ||
			(url.match(/dv\.xslProcessor\?/) && !url.match(/docviewID=/) && !url.match(/pubID=/));
	}
	else {
		return true;
	}
};

function isSearchResultPopup(){
	var retValue = location.href.indexOf("/PubSearchResults/Results.html") > -1;
        
	return retValue;
}
// LLOpenWindow clone
var winHandle, winPage="";

function DVOpenWindow(url, width, height, name, popup_check, title)
{
	// use lehmanlive external open function
        if(
                (url.indexOf("&NOLOGOEXTERNAL=YES") >= 0) || (url.indexOf("?NOLOGOEXTERNAL=YES") >= 0)
        )
        {
		LLOpenWindow('/LL/disclaimer?orig_url='+url);
		return;
	}

	// fix email url as left menu is not needed in popup
	if(
		(url.indexOf("/publications/email?contentPubID=") == 0) ||
		(url.indexOf("/publications/content?contentPubID=") == 0) ||
		(url.indexOf("/research/content?contentPubID=") == 0) ||
		(url.indexOf("/go/publications/email?contentPubID=") == 0) ||
		(url.indexOf("/go/publications/content?contentPubID=") == 0) ||
		(url.indexOf("/go/research/content?contentPubID=") == 0) ||
		(url.indexOf("https://liveqa.barcap.com/go/publications/email?contentPubID=") == 0) ||
		(url.indexOf("https://liveqa.barcap.com/go/publications/content?contentPubID=") == 0) ||
		(url.indexOf("https://liveqa.barcap.com/go/research/content?contentPubID=") == 0) ||
		(url.indexOf("https://livestage.barcap.com/go/publications/email?contentPubID=") == 0) ||
		(url.indexOf("https://livestage.barcap.com/go/publications/content?contentPubID=") == 0) ||
		(url.indexOf("https://livestage.barcap.com/go/research/content?contentPubID=") == 0) ||
		(url.indexOf("https://live.barcap.com/go/publications/email?contentPubID=") == 0) ||
		(url.indexOf("https://live.barcap.com/go/publications/content?contentPubID=") == 0) ||
		(url.indexOf("https://live.barcap.com/go/research/content?contentPubID=") == 0)
	)
	{
		var hasAV = url.indexOf("contentPubID=AV") > -1;
		url = url.replace(/contentPubID=\D*/, "docviewID=");
		if(hasAV){
			url += "&resultURL=EXT_URL";
		}
	}

	// calculate width and height
	var winWidth = 0;
	if(!width) winWidth=(screen.width <= 800)?"800":"1100";
	else winWidth=(screen.width <= 800 && width > 800)?"800":width;

	var winHeight = 0;
	if(!height) winHeight=(screen.height <= 600)?"600":"900";
	else winHeight=(screen.height <= 600 && height > 600)?"600":height;

	// use custom docview open function
	var winName = name ? name : "remote";
	var adhocMaintPopup = false;
	var adhocRREPopup = false;
	var adhocSecondPopup = false;
	if( popup_check != "no_popup_check" && (window.name == "popupContent" || true === window["fromBCLPopup"])) // fromBCLPopup is set true from popupContainer.jsp to indicate request is originating from popup
	{
		if(!isTouch() && !isSearchResultPopup()){
			if(winName.match(/MAINTENANCE_/)){
				adhocMaintPopup = true;
			}else if(winName.match(/RRE_/)){
				adhocRREPopup = true;
			}else if(winName == "ADHOC"){ //adhoc email opens in adhoc window
				adhocSecondPopup = true;
			}else if(true === window["fromBCLPopup"] && window["popupContent"] ){ 
				document.getElementById("popupContent").src = url;
				return;
			} else{
				location=url;
				return;
			}
		}else{
			if((winName == "remote") && ((url.match(/dv\.search\?/) && url.match(/docID=/)) || isSearchResultPopup()) ){
				winName = "remote_child";
			}else{
				if(winName.match(/MAINTENANCE_/)){
					adhocMaintPopup = true;
				}else if(winName.match(/RRE_/)){
					adhocRREPopup = true;
				}else if(winName == "ADHOC"){ //adhoc email opens in adhoc window
					adhocSecondPopup = true;
				}else{
					location=url;
					return;
				}
			}
		}
	}
	if((winHandle) && (winHandle != null) && (!winHandle.closed)) { if(winHandle.name == winName) winHandle.close(); }
	
	if(isIEOfVersion("6") || isIEOfVersion("7")){
		var winParams = "width="+winWidth+",height="+winHeight+",scrollbars=no,resizable=yes,status=yes,toolbar=no,menubar=no,location=no";
	}else{
		winParams = "width="+winWidth+",height="+winHeight+",scrollbars=yes,resizable=yes,status=yes,toolbar=no,menubar=no,location=no";
	}
	if(
		(url.indexOf("https://live.barcap.com/go/keyword") == 0) || (url.indexOf("/go/keyword") == 0) ||
		(url.indexOf("https://live.barcap.com/keyword") == 0) || (url.indexOf("/keyword") == 0) ||
		(url.indexOf("https://live.barcap.com/go/BC/Search?q=") == 0) || (url.indexOf("/go/BC/Search?q=") == 0) ||
		(url.indexOf("https://live.barcap.com/BC/Search?q=") == 0) || (url.indexOf("/BC/Search?q=") == 0)
	)
	{
		winWidth = 1050; winHeight = 800;
		winParams = "width="+winWidth+",height="+winHeight+",scrollbars=yes,resizable=yes,status=yes,toolbar=yes,menubar=yes,location=yes";
	}
	
	if(parent.name == "FeaturedResearch_PublicationSelection" || winName == "remote_child" || adhocMaintPopup || adhocRREPopup || adhocSecondPopup){
		winParams +=",top=56,left=33";
	}else{
		winParams +=",top=0,left=0";
	}
	if (isFramesSupported(winName, url)) { // IPAD fix = check if device is iDevice and if doc can be open without frameset
		
		var staticPrefix = "RSR_S";
		var dynamicPrefix = "/RSL";
		if(url.match(/^\/PRC\//)){
			staticPrefix = "PRC_S";
			dynamicPrefix = "/PRC";
		}
		
		var popupUrl = dynamicPrefix+"/jsp/popupContainer.jsp";
		
		var logoURL = "/"+staticPrefix+"/html/bcllogo.html?dc=" + new Date().getTime();
	        if(
	                (url.indexOf("&NOBACK=YES") >= 0) || (url.indexOf("?NOBACK=YES") >= 0)
	        )
	        {
			logoURL = "/"+staticPrefix+"/html/bcllogonoback.html?dc=" + new Date().getTime();
		}
		if(adhocSecondPopup === true || winName === "ADHOC"){
			popupUrl = url+ (url.indexOf("?") > -1 ? "&" : "?") + "forPopup=1";
		}else if(
			(url.indexOf("https://live.barcap.com/go/keyword/") == 0) || (url.indexOf("/go/keyword/") == 0) ||
			(url.indexOf("https://live.barcap.com/keyword/") == 0) || (url.indexOf("/keyword/") == 0) ||
			(url.indexOf("https://live.barcap.com/go/BC/Search?q=") == 0) || (url.indexOf("/go/BC/Search?q=") == 0) ||
			(url.indexOf("https://live.barcap.com/BC/Search?q=") == 0) || (url.indexOf("/BC/Search?q=") == 0) ||
	                (url.indexOf("&NOLOGO=YES") >= 0) || (url.indexOf("?NOLOGO=YES") >= 0)
	        )
	        {
			//winPage = "<html><body><script>location.replace(\""+url+"\");</scr"+"ipt></body></html>";
			popupUrl +="?locationReplaceUrl="+encodeURIComponent(url);
		}
		else
		{
			title = title || "Barclays Live";
			/*
			winPage= "<html><title>"+title+"</title><frameset rows='55, *' border='0' frameborder='NO' noresize>" +
			"<frame name='popupLogo' scrolling='NO' marginheight='0' marginwidth='0' src='"+logoURL+"'></frame>" +
			"<frame name='popupContent' src=\"/"+staticPrefix+"/html/bclwait.html?"+url+"\" onload=\"top.popupLogo.setHistoryButton(); top.focus();\" onunload=\"top.popupLogo.resetHistoryButton();\"></frame>" +
			"</frameset><\/html>";
			*/
			var targetUrl = "/"+staticPrefix+"/html/bclwait.html?"+url;
			popupUrl +="?pageTitle="+encodeURIComponent(title)+"&logoUrl="+encodeURIComponent(logoURL)+"&targetUrl="+encodeURIComponent(targetUrl);
		}
		popupUrl += "&inPopup=YES";
		winHandle = window.open(popupUrl, winName, winParams);
		winHandle.opener = self;
		
	} else {		
		winHandle = window.open(url, winName, winParams);
		winHandle.opener = self;
	}
	winHandle.focus();
}


function DVWriteContent()
{

	var winDocument = winHandle.document;
	winDocument.open(); winDocument.write(winPage); winDocument.close();
	winPage = "";
}

function DVParentOpenWindow(url)
{
	parent.location.href=url;
}

function DVGrandParentOpenWindow(url)
{
	parent.parent.location.href=url;
}

function resizePortalWindow(){
	if(window != window.top && window.top["BCResizeScreen"]){
		try{
			window.top["BCResizeScreen"]();
		}catch(e){}
	}
}

function resizeDVAdminIframe(){
	if(window != window.parent && window.parent["resizedvAdminIframe"]){
		try{
			window.parent["resizedvAdminIframe"]();
		}catch(e){}
	}
}

function DVRemoveLeftNav(){
	try{
		if(window.parent){
			if(parent.BCRemoveLeftNav) {
				parent.BCRemoveLeftNav(); 
				parent.document.getElementById('LLContentFrame').style.width = '1259px';
			} else if(parent.document.getElementById('leftnav-container')) {
				parent.document.getElementById('leftnav-container').style.display = 'none';
				parent.document.getElementById('LLContentFrame').style.styleFloat='left';
				parent.document.getElementById('LLContentFrame').style.cssFloat='left';
				parent.leftNav = false;
				parent.document.getElementById('LLContentFrame').style.marginLeft = '20px';
				parent.document.getElementById('LLContentFrame').style.borderLeft = '#c3c3c3 1px solid';
				parent.document.getElementById('LLContentFrame').style.width = '1210px';
			}
		}
	}catch(e){}
}

var popWinHandle;
function openPopupWin(url,winName,winParams,title) {
	if((popWinHandle) && (popWinHandle != null) && (!popWinHandle.closed)) { if(popWinHandle.name == winName) popWinHandle.close(); }
	url += "&pageTitle=" + title + "&dc=" + new Date().getTime();
	popWinHandle = window.open(url, winName, winParams);
	popWinHandle.opener = self;
	popWinHandle.focus();
}

function addBanner(pubDocs,pubDate,pubInfo,isDesktop,resultPrefix,sourceClick) {
	var BannerUtil = {
		isSyndicatedPublication:function(images) {
			var i = 0,
	    		len = images.length;	
			for(i=0; i<len; i++) {
				if(images[i] && images[i].src.indexOf("/publiccp/RSR/nyfipubs/barcap-email/logo-alt.gif") > -1) {
					return true;
				}
			}
			return false;
		},
		removeBCLBannerForSAER:function(images) {
			try {
				var i = 0,
		    		len = images.length;	
				for(i=0; i<len; i++) {
					if(images[i] && images[i].src.indexOf("/publiccp/GER/images/bc_logo_saer.gif") > -1) {
						if(images[i].parentElement && images[i].parentElement.tagName === "TD" && images[i].parentElement.parentElement.tagName === "TR") {
							var tableRow = images[i].parentElement.parentElement;
							tableRow.parentElement.removeChild(tableRow);
						}
					}
				}
			} catch(e) {}
		},
		createLink:function(pubDoc) {
			var link = document.createElement('a');
			link.innerHTML = pubDoc.title;
			if(isDesktop) {
				link.href = "#";
				link.onclick= function(){
					var urlVals = pubDoc.URL.split("?");
					var docID = null;
					if(urlVals.length == 2) {
						var reqparams = urlVals[1].split("&");
						for(var i=0; i<reqparams.length; i++) {
							if(reqparams[i].indexOf("contentDocID") > -1) {
								docID = reqparams[i].replace(/\D/g,'');
								break;
							}
						}
						
					}
					var url =  "/" + resultPrefix + "/servlets/dv.search?docID=" + docID + "&resultPrefix=" + resultPrefix + "&characterSet=UTF-8";	
					if(sourceClick && sourceClick.length > 0) {
		                url = url + "&sourceClick=" + sourceClick;							
					}
					DVOpenWindow(url);
					return false;
				}
			} else {
				link.href = pubDoc.URL;
				link.target = "_blank";
			}
			var fileIconURL = null;
			var fileExtn = pubDoc.extn;
			if(fileExtn === "pdf") {
				fileIconURL = "/publiccp/RSR/nyfipubs/images/icn-pdf.png";
			}else if(fileExtn === "doc" || fileExtn === "docx") {
				fileIconURL = "/publiccp/RSR/nyfipubs/images/icn-word.png";
			}else if(fileExtn === "csv" || fileExtn === "xls" || fileExtn === "xlsm" || fileExtn === "xlsx") {
				fileIconURL = "/publiccp/RSR/nyfipubs/images/icn-excel.png";
			}else if(fileExtn === "pps" || fileExtn === "ppt" || fileExtn === "ppx" || fileExtn === "pptx") {
				fileIconURL = "/publiccp/RSR/nyfipubs/images/icn-ppt.png";
			}else if(fileExtn === "htm" || fileExtn === "html" || fileExtn === "mht") {
				fileIconURL = "/publiccp/RSR/nyfipubs/images/icn-html.png";
			}else if(fileExtn === "txt" || fileExtn === "text") {
				fileIconURL = "/publiccp/RSR/nyfipubs/images/icn-doc.png";
			}
			var backgroundStyle = "";
			if(fileIconURL) {
				backgroundStyle = "background:url('" + fileIconURL + "') no-repeat;";
			}

			link.style.cssText = 'color:#007EB6;font:11px verdana,sans-serif;text-decoration:none;padding-left:25px;padding-right:20px;padding-top:5px;padding-bottom:10px;margin-left:35px;' + backgroundStyle;
			
			return link;
		}
	};
	
	var images = document.getElementsByTagName("IMG");
	
	//If there is no attachment & it's a syndicated publication (SRCID=bc_*), don't add a banner.
	if(pubDocs.length == 0 && BannerUtil.isSyndicatedPublication(images)) return; 	
			
	var i = 0,
	    len = pubDocs.length;
	var frag = document.createDocumentFragment();	

	var emptyEl = document.createElement('div');			
	emptyEl.style.cssText = "background-color:#00aeef;height:28px;";	   
	frag.appendChild(emptyEl); 

	var headerContainerEl = document.createElement('div');
	headerContainerEl.style.cssText = "overflow:hidden;padding-bottom:10px;border-bottom:#ccc 1px solid;margin-bottom:10px;";
	
	var logoImageEl = document.createElement('IMG');			
	logoImageEl.src = "/publiccp/RSR/nyfipubs/barcap-email/logo-231x55.gif"; 
	logoImageEl.style.cssText = "float:left;";  
	headerContainerEl.appendChild(logoImageEl);
	
	var rightContainerEl = document.createElement('div'); 
	rightContainerEl.style.cssText = "float:right;padding:0 30px;padding-top:33px;";
	if(pubInfo && pubInfo.length > 0) {
		var pubInfoEl = document.createElement('div'); 
		pubInfoEl.style.cssText = "float:right;font-size:12px;color:#00AEEF;font-family:verdana,sans-serif;margin-bottom:8px;";
		pubInfoEl.innerHTML = pubInfo;
		rightContainerEl.appendChild(pubInfoEl);
	}
	if(pubDate && pubDate.length > 0) {
		var dateEl = document.createElement('div'); 
		dateEl.style.cssText = "clear:both;float:right;font-size:11px;color:#666;font-family:verdana,sans-serif;";
		dateEl.innerHTML = pubDate;
		rightContainerEl.appendChild(dateEl);
	}
	headerContainerEl.appendChild(rightContainerEl);
	
	var emptyDivEl = document.createElement('div');
	emptyDivEl.style.cssText = "clear:both;height:0;width:0;position:absolute;";
	headerContainerEl.appendChild(emptyDivEl);
	frag.appendChild(headerContainerEl);
	
    if(pubDocs && pubDocs.length > 0) {
		for(i=0; i<len; i++) {
			var fileEl = document.createElement('div');	
			fileEl.style.cssText = 'margin:15px 0;';
			var link = BannerUtil.createLink(pubDocs[i]);
			fileEl.appendChild(link);
			frag.appendChild(fileEl);
		}
	}
	var elemDiv = document.createElement('div');
	document.body.insertBefore(elemDiv,document.body.childNodes[0]);	
	elemDiv.appendChild(frag);
	BannerUtil.removeBCLBannerForSAER(images);
}

function replaceAttachmentLinks(isDesktop,resultPrefix,sourceClick) {
	if(isDesktop) {
		var LinkUtil = {
				handleClick:function(link) {
					var urlVals = link.href.split("?");
					var docID = null;
					if(urlVals.length == 2) {
						var reqparams = urlVals[1].split("&");
						for(var i=0; i<reqparams.length; i++) {
							if(reqparams[i].indexOf("contentDocID") > -1) {
								docID = reqparams[i].replace(/\D/g,'');
								break;
							}
						}
						
					}
					link.href = "#";
					link.removeAttribute("target");
					link.onclick = function() {
						var url =  "/" + resultPrefix + "/servlets/dv.search?docID=" + docID + "&resultPrefix=" + resultPrefix + "&characterSet=UTF-8";			
						if(sourceClick && sourceClick.length > 0) {
			                url = url + "&sourceClick=" + sourceClick;							
						}
						DVOpenWindow(url);
						return false;
				    };
				}
		};
		var links = document.getElementsByTagName("A");
		var i = 0,
			len = links.length;	
		for(i=0; i<len; i++) {
			if(links[i] && links[i].href.indexOf("/publications/content?contentDocID=") > -1) {
				LinkUtil.handleClick(links[i]);
			}
		}
	}
}

function trackRecommendationAndViewPub(pubId,trackingId,pubURL) {
	if(trackingId && trackingId.length > 0) {
		var recommendationTrackingURL = "/RCS/recommender/rest/v2/clicks/recommendation";
	    var xmlhttp = new XMLHttpRequest();
	    xmlhttp.open("POST",recommendationTrackingURL);
	    xmlhttp.setRequestHeader("Content-type", "application/json");
	    xmlhttp.send(JSON.stringify({
			clickedPubId:pubId,
			showEventId:trackingId
	    }));
	}
	DVOpenWindow(pubURL,0, 0,'',''); 
	return false;
}