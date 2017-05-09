function BCGetPath(){
	return location.protocol + '//'+ location.host
}

function preBCGetPath(url){
	r=url.indexOf('http')?BCGetPath():"";
	return r
}

function BCOpenWindow(url,width,height,external,winName,tb){BCOWGetHandle(url,width,height,external,winName,tb)}

function BCOWGetHandle(url,width,height,external,winName,tb,hUrl){
	if(typeof tb=='undefined')tb=0;
	bTb=tb?"yes":"no";
	wName = winName ? winName : "remote";
	if(window.name == "popupContent"){location=url; return;}
	if(win && !win.closed){if(win.name == wName) win.close();}
	w= width || gWW(width);
	h= height || gWH(height);
	if(!external)external="internal";
	prms="toolbar="+bTb+",status="+bTb+",scrollbars=yes,resizable=yes,width="+w+",height="+h+",left=yes,top=yes";
	if(!l && bVsn >3)prms='menubar='+tb+',location='+tb+',width='+w+',height='+h+',toolbar='+tb+',status='+tb+',scrollbars=yes,resizable=yes,left=yes,top=yes';
	return openWindow(url,wName,external,prms,hUrl);
	if(url.indexOf("/BC/disclaimer") != -1){w=560;h=360;}
	if(url.indexOf("/BC/disclaimer") != -1){w=560;h=360;}
}

function openWindow(url,winName,external,prms,hUrl){
	win = window.open(BCGetPath()+"/BC_S/html/blankpage.html",winName,prms);
	win.opener = self;
	wS = waitPage(url,external,hUrl);
	t=ns6?1000:10;
	setTimeout("wFset()",t);
	win.focus();return win;
}

function BCOpenPopup(url,width,height,external,winName,tb){BCOPGetHandle(url,width,height,external,winName,tb)}

function BCOPGetHandle(url,width,height,external,winName,tb,hUrl){
	if(typeof tb=='undefined')tb=0;
	bTb=tb?"yes":"no";
	wName = winName ? winName : "remote";
	if(window.name == "popupContent"){location=url; return;}
	w= width || gWW(width);
	h= height || gWH(height);
	if(!external)external="internal";
	prms="toolbar="+bTb+",status="+bTb+",scrollbars=yes,resizable=yes,width="+w+",height="+h+",left=yes,top=yes";
	if(!l && bVsn >3)prms='menubar='+tb+',location='+tb+',width='+w+',height='+h+',toolbar='+tb+',status='+tb+',scrollbars=yes,resizable=yes,left=yes,top=yes';
	return openPopup(url,wName,external,prms,hUrl);
	if(url.indexOf("/BC/disclaimer") != -1){w=560;h=360;}
	if(url.indexOf("/BC/disclaimer") != -1){w=560;h=360;}
}

function openPopup(url,winName,external,prms,hUrl){
	// win = window.open(BCGetPath()+"/BC_S/html/Popup.html?url="+encodeURIComponent(url),winName,prms);
	win = window.open(BCGetPath()+ url,winName,prms)
	win.opener = self;
	win.focus();
	return win;
}

function waitPage(url,external,hUrl) {
	contentLocString='';
	if(external=="external") contentLocString="top.location=\"" +preBCGetPath(url)+url+ "\";"
	else contentLocString="top.popupContent.location=\"" +preBCGetPath(url)+url+ "\";"
	var page= "<html><head><title>Barclays Live</title>" +
		"<meta content=\"0\" HTTP-EQUIV=\"Expires\"><scr"+"ipt language='javascript1.2' src='" +BCGetPath()+ "/BC_S/js/date.js'><\/script><scr"+"ipt language='javascript1.2' src='" +LLGetPath()+ "/BC_S/js/chrome.js'><\/script>" +
		"<scr"+"ipt>d=document;l=(d.layers)?1:0;function getContent(){return top.popupContent.location='" +url+ "';}" +
		"function getPageContent(){return top.location='" +url+ "';}" +
		"function getReload(){if(l)location.reload(true);}";
	page+="<\/script><\/head>";
	if(external=="external") page+= "<body onLoad='"+contentLocString+"'><I> Loading... </I></body><html>";
	else{
		var headUrl = hUrl ? BCGetPath()+hUrl : BCGetPath()+"/BC_S/html/barcaplivelogo.html";
		page= "<html><title>Barclays Live</title><frameset rows='60, *' border='0' frameborder='NO' noresize onLoad='"+contentLocString+"' >" +
		"<frame name='popupLogo' scrolling='NO' marginheight='0' marginwidth='0' src='" +headUrl+ "'></frame>" +
		"<frame name='popupContent' src='" +BCGetPath()+"/BC_S/html/barcapliveloading.html"+ "'></frame>" +
		"</frameset><\/html>";
	}
	return page;
}

function BCSetNoNavigation(inputurl) {
    var uri = inputurl.split("?");var url="";if (typeof(uri[1])!='undefined' && uri[1]!=null && uri[1]!=''){//remove BCPreviousMenuCode if already present. 
	var queryParam = uri[1];if (queryParam.indexOf('menuCode')>=0){	//remove it.
		params = queryParam.split("&");	queryParam = "";for (i=0 ;i<params.length; i++ ){	//avoid meucode.
			paramname = params[i].split('=');if (paramname[0]=='menuCode'){	continue;}queryParam += params[i] +"&";}
			if (queryParam.length !=0){	queryParam = queryParam.substr(0,queryParam.length-1);}}
		if (queryParam.length !=0){url=uri[0]+"?"+"menuCode="+"none"+"&"+queryParam;}else {url=uri[0]+"?menuCode=none";}}else {url=uri[0]+"?"+"menuCode=none";}return url;
}


d=document;l=d.layers?1:0;bVsn=parseInt(navigator.appVersion);
var ns6=(navigator.appName=="Netscape" && bVsn==5);
// This method allows to use URI retention for links inside LL:
function LLNavigateTo(url) {
	pointer = this;
	while(pointer.name != 'bhBody' && pointer != top){pointer = pointer.parent;}
	if(pointer!=this)pointer.location = url;
}
function LLAddToFavorites(functionid) {
	LLOpenWindow("/BC/ModifyFavoritesServlet?operation=Add&functionid=" + functionid);
}
function getTop(sFrame){
	var targetObj;
	targetObj = sFrame || this;
	while(targetObj.name != 'bhBody' && targetObj != top){
		if(sFrame && targetObj == sFrame.top) break;
		targetObj = targetObj.parent;
	}
	return targetObj ? targetObj : false;
}
function getAllFrameURLs(f){
	var frameList = [];
	var url = f.location.href;
	var j = url.substring(url.indexOf("//")+2);
	var k = j.substring(j.indexOf("/"));
	frameList[frameList.length] = k;
	if(f.frames.length > 0){
		for(var i=0;i<f.frames.length;i++){
			var url = f.frames[i].location.href;
			var j = url.substring(url.indexOf("//")+2);
			var k = j.substring(j.indexOf("/"));
			frameList[frameList.length] = k;
		}
	}
	return frameList;
}
function getFrameByName(name, sFrame){
	var retValue = false;
	if(typeof sFrame=='undefined') sFrame=getTop();
	for(var i=0; i < sFrame.frames.length; i++){
		if(sFrame.frames[i].name == name){return sFrame.frames[i];}
		if(sFrame.frames[i].frames.length > 0){retValue = getFrameByName(name, sFrame.frames[i]);}
	}
	return retValue;
}
function getContentFrame(){
	var targetObj;
	if(top.opener && !top.opener.closed){
		oFrames = getTop(top.opener).frames;
		if(oFrames["contentMain"].frames && oFrames["contentMain"].frames.length > 0){
			if(oFrames["contentMain"].frames['content']) targetObj = oFrames["contentMain"].frames['content']
		}
		else targetObj = oFrames["contentMain"];
		if(!targetObj)targetObj = top.opener;
	}else{
		targetObj=getTop();
		tFrames=targetObj.frames;
		if(tFrames.length && tFrames["contentMain"]){
			targetObj=tFrames["contentMain"];
			if(tFrames["contentMain"].frames && tFrames["contentMain"].frames.length>0){
				if(tFrames["contentMain"].frames['content'])targetObj=tFrames["contentMain"].frames['content']
			}
		}
	}
	return targetObj;
}
function getTopFrame(){
	var targetObj;
	var oldOnError = window.onerror;	//change to hide errors
	window.onerror = hideError;		//change to hide errors
	if(top.opener && !top.opener.closed){
		targetObj = getTop(top.opener) || false;
	}else{
		targetObj = getTop() || false;
	}
	window.onerror = oldOnError;		//change error handler back
	if(!targetObj) return false;
	return targetObj.frames[0] ? targetObj.frames[0] : false;
}
function LLIsInPopup(window){
	if(window.name == "remote" || window.name == "popupContent" || window.name == "popupLogo") return true;
	return false;
}
logScriptPath = "/BCA/JavaScriptErrorLogServlet";
// can override on the page
scriptName = "JS Err Log";
logComment = "Testing";
originalDefaultStatus = window.defaultStatus;
numEE=0;
stopBubble=true;showStatus=true;logNumErrors=3;
function handleErrors(msg, errUrl, line){
	if (numEE < logNumErrors){
		errImage = new Array(logNumErrors);
		d = new Date();
		sn = scriptName ?('&scr=' +escape(scriptName)):'';
		lc = logComment ?('&comm=' +escape(logComment)):'';
		if(!l){errUrl=this.location;msg='Unspecified JS Error';line='MSIE';}
		else{line='line '+line;}
		errLogEntry=logScriptPath+'?url='+escape(errUrl)+'&msg='+escape(msg)+'&line='+escape(line)+sn+lc+'&d='+escape(d);
		errImage[numEE]=new Image();
		errImage[numEE].src=errLogEntry;
		if(showStatus)window.defaultStatus='JavaScript Error: '+msg+' in '+line;
		numEE++;
	}return stopBubble;
}
//window.onerror=handleErrors;

function hideError(msg, errUrl, line){status="..."; return true;};

function display_todays_date3(){
	var week_ar = new Array('Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday');
	var month_ar = new Array('Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec');
	today = new Date();
	n_day=today.getDay();
	return today.getDate()+' '+month_ar[today.getMonth()]+' '+today.getFullYear();
}
function getTelephones(className){
	telephones =
		"<table class=\"" + className + "\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\">" +
		"<tr><td class=\"" + className + "\">Americas:</td><td class=\"" + className + "\" style=\"padding-left: 8px\">+1 866 213 2203 or</td></tr>" +
		"<tr><td class=\"" + className + "\"></td><td class=\"" + className + "\" style=\"padding-left: 8px\">+1 212 412 1993</td></tr>" +
		"<tr><td class=\"" + className + "\">EMEA:</td><td class=\"" + className + "\" style=\"padding-left: 8px\">+44 (0) 800 917 1691 or</td></tr>" +
		"<tr><td class=\"" + className + "\"></td><td class=\"" + className + "\" style=\"padding-left: 8px\">+44 (0) 20 7773 2522</td></tr>" +
		"<tr><td class=\"" + className + "\">Japan:</td><td class=\"" + className + "\" style=\"padding-left: 8px\">+81 (0) 3 4530 1430</td></tr>" +
		"<tr><td class=\"" + className + "\">Singapore:</td><td class=\"" + className + "\" style=\"padding-left: 8px\">+65 6308 6994</td></tr>" +
		"</table>" ;
	return telephones;
}
var win,wS='';
function LLGetPath(){
	return location.protocol + '//'+ location.host
}
function preLLGetPath(url){
	r=url.indexOf('http')?LLGetPath():"";
	return r
}
function LLOWGetHandle(url,width,height,external,winName,tb,hUrl){
	if(typeof tb=='undefined')tb=0;
	bTb=tb?"yes":"no";
	wName = winName ? winName : "remote";
	if(window.name == "popupContent"){location=url; return;}
	if(win && !win.closed){if(win.name == wName) win.close();}
	w= width || gWW(width);
	h= height || gWH(height);
	if(!external)external="internal";
	prms="toolbar="+bTb+",status="+bTb+",scrollbars=yes,resizable=yes,width="+w+",height="+h+",left=yes,top=yes";
	if(!l && bVsn >3)prms='menubar='+tb+',location='+tb+',width='+w+',height='+h+',toolbar='+tb+',status='+tb+',scrollbars=yes,resizable=yes,left=yes,top=yes';
	return openWindow(url,wName,external,prms,hUrl);
	if(url.indexOf("/BC/disclaimer") != -1){w=560;h=360;}
	if(url.indexOf("/BC/disclaimer") != -1){w=560;h=360;}
}

// Prafull: New version of function LLOWGetHandle() to proper positioning the popup window on the screen (without using window.moveTo(x,y))
// (only works with NS4+ and IE4+)
function LLOWGetHandlePos(url,width,height,external,winName,tb,hUrl,x,y)
{
	if(typeof tb=='undefined')tb=0;
	bTb=tb?"yes":"no";
	wName = winName ? winName : "remote";
	if(window.name == "popupContent"){location=url; return;}
	if(win && !win.closed){if(win.name == wName) win.close();}
	w= width || gWW(width);
	h= height || gWH(height);
	if(!external)external="internal";
	prms="toolbar="+bTb+",status="+bTb+",scrollbars=yes,resizable=yes,width="+w+",height="+h+",left="+x+",top="+y;
	if(!l && bVsn >3)prms='menubar='+tb+',location='+tb+',width='+w+',height='+h+',toolbar='+tb+',status='+tb+',scrollbars=yes,resizable=yes,left='+x+',top='+y;
	return openWindow(url,wName,external,prms,hUrl);
	if(url.indexOf("/BC/disclaimer") != -1){w=560;h=360;}
	if(url.indexOf("/BC/disclaimer") != -1){w=560;h=360;}
}

function LLOpenWindow(url,width,height,external,winName,tb){LLOWGetHandle(url,width,height,external,winName,tb)}

//javascript:LLOpenWinKw({'url':'/UAB/ContactUs','hUrl':'/BC_S/html/blankpage.html'});
function LLOpenWinKw(kwArgs){
	LLOWGetHandle(kwArgs.url,kwArgs.width,kwArgs.height,kwArgs.external,kwArgs.winName,kwArgs.tb,kwArgs.hUrl);
}
function LLOpenLegalWindow(url){
	wName="legal";
	w=gWW()-50;
	h=gWH()-50;
	prms = "toolbar=no,status=no,scrollbars=yes,resizable=yes,width="+w+",height="+h+",left=yes,top=yes";
	if(!l && bVsn >3)prms='width='+w+',height='+h+',toolbar=0,status=0,scrollbars=yes,resizable=yes,left=yes,top=yes';
	return openWindow(url,wName,'internal',prms);
}

function wFset(){
	winD=win.document;winD.open();winD.write(wS);winD.close();wS="";
}
// only used "Equity"
function LLOpenPopUpWindow(url, width, height){
	if(window.name=="content"){location=url;return;}
	LLOpenWindow(url, width, height);
}
// Equity
function LLOpenExternalLinkPopUpWindow(url, width, height){
	var disclaimerUrl="/BC/disclaimer?orig_url=" + unescape(url);
	if(window.name=="content"){window.location=disclaimerUrl;return;}
	LLOpenWindow(disclaimerUrl, width, height, "external");
}
function LLCloseWindow(){top.close();}
function gWW(w){
	newW=500;
	if(!w)newW=(screen.width <= 800)?"780":"819";
	else newW=(screen.width <= 800 && w>780 )?"780":w;
	return newW;
}
function gWH(h){
	newH=0;
	if(!h)newH=(screen.height>600)?"660":"480";
	else newH=(screen.height<=600 && h>480)?"480":h;
	return newH;
}

function LLShowNuggetError(url, timeout, width, height){
	prms="scrollbars=yes,resizable=yes,width="+(width+80)+",height="+height+",left=yes,top=yes";
	win = window.open(LLGetPath()+"/BC_S/html/blankpage.html","remote",prms);
	wS =  "<html>";
	wS += "<frameset rows=\"50%,50%\">";
	wS += "<frame name=\"frame_top\" src=\"" + url + "\">";
	wS += "</frame>";
	wS += "<frame name=\"frame_bottom\" src=\"/BC/NuggetSyntax?LLUri=" + escape(url) + "&LLWidth=" + width + "&LLTimeout=" + timeout + "\">";
	wS += "</frame>";
	wS += "</frameset>";
	wS += "</html>";
	winD=win.document;
	winD.open();winD.write(wS);winD.close();wS="";
}
//Extras
function disableForm(obj){
	for(i=0;i<obj.length;i++){
		var tobj=obj.elements[i];
		if(tobj.type.toLowerCase()=="submit"||tobj.type.toLowerCase()=="reset"){
			tobj.disabled=true;
			tobj.onclick=function(){return extracheck(this)}}}
	if(obj.dis) return false;
	obj.dis=true;return true;
}
function extracheck(obj){return !obj.disabled;}
function rSlowLink(lnk){
	if(typeof lnk=='undefined'){alert("Error: Link URL missing");return;}
	if(l){ns4MakeLoading(lnk);return;}
	if(ns6){ns6MakeLoading(lnk);return;}
	else{
		document.write("<a href=\"#\" onclick=\"location.replace('"+lnk+"');return false;\"><img src=\""+LLGetPath()+"/BC_S/images/loading.gif\" border=\"0\" alt=\"Loading...\" onload=\"location.replace('"+lnk+"');\"></a>");
		//location.replace(lnk);
	}}
function ns4MakeLoading(lnk){
	document.open();document.write("<a href=\"#\" onclick=\"location.replace('"+lnk+"');return false;\"><img src=\"/BC_S/images/loading.gif\" width=\"96\" height=\"43\" border=\"0\" alt=\"Loading...\" onload=\"location.replace('"+lnk+"');\"></a>");document.close();
}
function ns6MakeLoading(lnk){
	document.open();document.write("<a href=\""+lnk+"\"><img src=\"/BC_S/images/loading.gif\" width=\"96\" height=\"43\" border=\"0\" alt=\"Loading...\" onload=\"location.href='"+lnk+"';\"></a>");document.close();
}
function LLDialog(url,model,w,h){
	if(window.showModelessDialog){
		str=h?'dialogHeight:'+h+'px;dialogWidth:'+w+'px;':'';
		if(model) return showModalDialog(url,'',str);
		else return showModelessDialog(url,'',str);
	}
	else return LLOpenWindow(url,w,h)
}
function LLRedirectToHPT(templ){
	if(templ == null || templ == '') return;
	if(d.mainForm && d.mainForm.templateId) {
		var curTemplateId = d.mainForm.templateId.value;
		if(curTemplateId == '') return;

		if(typeof(parent.isLLOnNewNav) != 'undefined' && parent.isLLOnNewNav()) {
			parent.addLehmanLiveNavigation("/BC/composite?LLChangeCompPage=Y&templateId=" + curTemplateId + "&LLOverrideTemplateCode=" + templ + "&LLIsHomepage=Y");	
		}
		else {
			d.location="/BC/Home?LLChangeCompPage=Y&templateId=" + curTemplateId + "&LLOverrideTemplateCode=" + templ;
		}
	}
}
function gUrlPath(loc){
	if(!loc) loc = location.href.substring(location.href.indexOf(".com")+4);
	else loc = loc.substring(location.href.indexOf(".com")+4);
	return loc.substring(loc.indexOf("/"));
}
function setRefresh(){
	var topFrame = getTopFrame();
	if(!topFrame||!topFrame.saveLocation){setTimeout("setRefresh()",2000);return false;}
	// get the current url
	loc = location.href.substring(location.href.indexOf(".com")+4);
	loc = loc.substring(loc.indexOf("/"));
	topFrame.saveLocation(loc);
}
function LLCompositeCall(){
	for(var i=0; i<arguments.length; i++){
		if(eval("window."+arguments[i])) eval("window."+arguments[i]+"()")
	}
}
var LLFCodes = [];
function LLGetFCodes(){
	return LLFCodes || false;
}
function LLSetFCodes(){
	LLFCodes = [];
	for(var i=0; i<arguments.length; i++){LLFCodes[i]=arguments[i]}
}
function LLBroadcast(func){
	//first arg is function name - rest of args get pased to func
	if(arguments.length<1)return false;
	var passArg="";
	for(var i=1; i<arguments.length; i++){
		passArg += "\""+arguments[i]+"\"";
		if(i!=arguments.length-1)passArg+=",";}
	if(LLGetFCodes()){
		var codes = LLGetFCodes();
		for(var i=0; i<codes.length; i++){if(eval("window."+codes[i]+func))eval("window."+codes[i]+func+"("+passArg+")")}}
}
function FullURLEncode(str){
	var ms=",2C%25#23 20?3F<3C{7B}7D[5B]5D|7C^5E~7E`60/2F=3D&26&26";
	var msi=0;var i,c,rs,ts;
	while(msi<ms.length){
	c=ms.charAt(msi);
	rs=ms.substring(++msi,msi+2);
	msi+=2;i=0;
	while(true){
		i=str.indexOf(c,i);
		if(i==-1) break;
		ts=str.substring(0,i);
		str= ts+"%"+rs+str.substring(++i,str.length);
		}
	}return str
}
//Import extra files
function importJsFile(file){
	document.write('<scr'+'ipt language="Javascript" src="'+file+'">'+'<\/script>');
	document.close();}
if(typeof dontImportAll=='undefined'){importJsFile("/BC_S/js/chrome.js");}
//document.write('<link href="/BC_S/images/favicon.ico" rel="shortcut icon">');

// for shared resources
var resourceKeys = new Array();
var resources = new Array();
function LLAddCompPageResource(resourceKey, resourceBody){
	if(arguments.length != 2) return;
	if(resourceKey==null || resourceKey=='' || resourceBody==null || resourceBody=='') return;
	var found=false;
	var size=resources.length;
	for(var i=0; i<size; i++){
		if(resourceKeys[i]==resourceKey){
			found=true;
			break;}
	}
	if(!found){
		resourceKeys[size]=resourceKey;
		resources[size]=resourceBody;}
}
function LLAppendAllCompPageResources(){
	if(resources && resources.length>0){
		for(var i=0; i<resources.length; i++){
			document.write(resources[i]+'\n');
		}
	}
}

/**
 * Simple email validation
 */
function checkEmail(emailAddr)
{
	if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailAddr))
	{
		return true;
	}
	else
	{
		return false;
	}
}

/**
 * LdapPerson object, used as a vehicle for inter-browser communication
 */
function LdapPerson(internalId, ntLogin, llLogin, employeeNumber, commonName, firstName, lastName, email, phone, department, firmName, adbId, departmentNumber, ugdPhone, deskNumber, division, title, address1, address2, city, st, postalCode, region, financeDepartment)
{
	this.internalId = internalId;
	this.ntLogin = ntLogin;
	this.llLogin = llLogin;
	this.employeeNumber = employeeNumber;
	this.commonName = commonName;
	this.firstName = firstName;
	this.lastName = lastName;
	this.email = email;
	this.phone = phone;
	this.department = department;
	this.firmName = firmName;
	this.adbId = adbId;
	this.departmentNumber = departmentNumber;
	this.ugdPhone = ugdPhone;
	this.deskNumber = deskNumber;	
	this.division = division;
	this.title = title;
	this.address1=address1;
	this.address2=address2;
	this.city=city;
	this.st=st;
	this.postalCode=postalCode;
	this.region=region;
	this.financeDepartment=financeDepartment;
}

function LLActivatePlugIn(pluginHTMLText)
{
	document.write(pluginHTMLText);
	document.close();
}

function isLLOnNewNav() {
	if (typeof(llVersion)=='undefined'){
		var iframeItm = document.getElementById('LLContentFrame');
		if (typeof(iframeItm)=='undefined' || iframeItm==null){
			return false;
		}else {
			return true;
		}
	}else if (llVersion==2){
		return true;
	}else {
		return false;
	}
}

function BCStopWidthMonitoring() {
	if (!isLLOnNewNav()){
		return;
	}
	var itm = document.getElementById('LLContentFrame');
	if (itm==null || typeof(itm)=='undefined'){
		return;
	}
	 try{return itm.style.removeExpression('width');}catch (err){}
}
function LLStopWidthMonitoring() {
	BCStopWidthMonitoring();
}

function BCStopHeightMonitoring() {
	if (!isLLOnNewNav()){
		return;
	}
	var itm = document.getElementById('LLContentFrame');
	try{LLDisableMonitor = true;}catch (err){}
	if (itm==null || typeof(itm)=='undefined'){
		return;
	}
	 try{return itm.style.removeExpression('height');}catch (err){}
}
function LLStopHeightMonitoring() {
	BCStopHeightMonitoring();
}

function BCStartWidthMonitoring() {
	if (!isLLOnNewNav()){
		return;
	}
	var itm = document.getElementById('LLContentFrame');
	try{LLDisableMonitor = false;}catch (err){}
	if (itm==null || typeof(itm)=='undefined'){
		return;
	}
	
	try{itm.style.setExpression('width','llMyWidth(document.getElementById("LLContentFrame"))');}catch (err){}
}
function LLStartWidthMonitoring() {
	BCStartWidthMonitoring();
}

function BCStartHeightMonitoring() {
	if (!isLLOnNewNav()){
		return;
	}
	var itm = document.getElementById('LLContentFrame');
	if (itm==null || typeof(itm)=='undefined'){
		return;
	}

	try{itm.style.setExpression('height','llMyHeight(document.getElementById("LLContentFrame"))');}catch (err){}
}
function LLStartHeightMonitoring() {
	BCStartHeightMonitoring();
}

function BCLogout() {
	top.location.href = "/BC/logout";
}

//breadcrumbs..

function BCPopulateBreadCrumb(bcObj) {
	var htmlForBC = "";
	if (bcObj.length==0){
		return;
	}
	for (i=0;i<bcObj.length ; i++){
		if (i==bcObj.length-1){ //lastitem
		 htmlForBC += "<a class='last'>"+bcObj[i].name+"</a>";
		}else
			htmlForBC += "<a href='"+bcObj[i].link+"'>"+bcObj[i].name+"</a> &gt;";
	}
	var bc = document.getElementById('breadcrumb');
	if (typeof(bc)!='undefined' && bc!=null){
		bc.getElementsByTagName("div")[0].innerHTML = htmlForBC;

		//update title now..
		var environment = document.title.split(" -- ")[0];
		if (environment=="DEV" || environment=="QA" || environment=="STAGE"){
			environment += " -- ";
		}else {
			environment="";
		}

		var title = "";
		for (i=bcObj.length-1 ; i>=0; i--){
			title += bcObj[i].name;
			if (i!=0){
				title += " -- ";
			}
		}

		//document.title = environment + title + " -- "+topMostMenuName + " -- Barclays Live";
		v_title = environment + title + " -- "+topMostMenuName + " -- Barclays Live";
		document.title = v_title.substring(0,110);
		setTimeout("BCPositionContentFrame()",50);
	}

}

function BCGetBreadCrumb() {
	var resultBC = new Array();
	var bC = document.getElementById('breadcrumb');

	if (typeof(bC)=='undefined' || bC==null || bC=='null'){
		return resultBC;
	}

	var anObjects = bC.getElementsByTagName("a");
	for (var i=0; i<anObjects.length;i++ ){
			var aObj = anObjects[i];

			var href='#';
			try{href=makeRelativeUrl(aObj.href);}catch (err){}
			if (i==anObjects.length-1 && href!='#'){
				href=document.getElementById('LLContentFrame').src;
			}
			var name = aObj.innerHTML;
			var obj = new Object();
			obj['name']=aObj.innerHTML;
			obj['link']=href
			resultBC[i]=obj;
	}
	return resultBC;
}

function getElementTopPosition(what) {
	var totaloffset= what.offsetTop;
	var parentEl=what.offsetParent;
	while (parentEl!=null){
		totaloffset= totaloffset+parentEl.offsetTop;
		parentEl=parentEl.offsetParent;
	}
	return totaloffset;
}


function BCPositionContentFrame() {
	var bc = document.getElementById('breadcrumb');
	if (typeof(bc)!='undefined' && bc!=null){
		var bcHeight = bc.offsetHeight;
		var contentFrame = document.getElementById('LLContentFrame');
		if (bcHeight>=30){
			contentFrame.style.top = "162px";
		} else if (bcHeight>14 && bcHeight<30){
			contentFrame.style.top = "144px";
		} else {
			contentFrame.style.top = "135px";
		}
	}
}

function gotoAboutContent(){
	
	var contentframeurl = document.getElementById("LLContentFrame").src;
	//alert(contentframeurl);
	window.open("/BCA/CPDashboardServlet?action=getWebAppDetailsByURL&webappurl="+contentframeurl);

}

function isIntranet() {
	var url = document.location.href.split("?")[0];
	if (url.indexOf(".barcapint.com")>0){
		return true;
	}
	return false;
}

function isExtranet() {
	var url = document.location.href.split("?")[0];
	if (url.indexOf(".barcap.com")>0){
		return true;
	}
	return false;
}
