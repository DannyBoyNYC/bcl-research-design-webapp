//
// functions used by DocView Mail
//

document.write('<script type="text/javascript" src="/RSR_S/jslib/dvGen.js"></scr' + 'ipt>');

function displayAdhocRedirectPage(url)
{
        DVOpenWindow(url, 0, 0, "ADHOC");
        return(false);
}

function displayAdhocEmailPage(type, id, title, content, subject, comment, charSet)
{
	if(subject == "undefined") {
		subject = "";
	}
	if(comment == "undefined") {
		comment = "";
	}

        url = "/DDL/jsp/researchMail.jsp?itemType="+encodeURIComponent(type)+"&itemID="+encodeURIComponent(id)+"&itemTitle="+encodeURIComponent(title)+"&itemContent="+encodeURIComponent(content)+"&mailSubject="+encodeURIComponent(subject)+"&mailComment="+encodeURIComponent(comment)+"&characterSet="+charSet;

        DVOpenWindow(url, 0, 0, "ADHOC");
        return(false);
}

function sendAdhocEmail(pub_id, doc_id, title)
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

function storeInfo(bSelected, pID, dID, title)
{
	if(bSelected == true)
	{
		saveInfo(pID, dID, title);
	}
	else
	{
		deleteInfo(pID, dID, title);
	}
}

function saveInfo(pID, dID, title)
{
	new Cookie;
	Cookie.prototype.store = _Cookie_store;
	Cookie.prototype.load = _Cookie_load;
	Cookie.prototype.remove = _Cookie_remove;

	var info = new Cookie(document, "LL-SHARED2", 24, "/", ".lehman.com");
        if((info.load()) && (info.source != "mail"))
                info.remove();

	if(!info.load())
	{
		info.pubID = pID;
		info.docID = dID;
		info.title = title;
	}
	else
	{
		info.pubID = info.pubID + "|" + pID;
		info.docID = info.docID + "|" + dID;
		info.title = info.title + "|" + title;
	}

	info.source = "mail";
	info.store();
}
 
function deleteInfo(pID, dID, title)
{
	new Cookie;
	Cookie.prototype.store = _Cookie_store;
	Cookie.prototype.load = _Cookie_load;
	Cookie.prototype.remove = _Cookie_remove;

	var info = new Cookie(document, "LL-SHARED2", 24, "/", ".lehman.com");
        if((info.load()) && (info.source != "mail"))
                info.remove();

	if(info.load())
	{
		var a = info.pubID.split('|');	
		var b = info.docID.split('|');	
		var c = info.title.split('|');	

		info.pubID = '';
		info.docID = '';
		info.title = '';
		for(var i = 0; i < a.length; i++)
		{
			var temp1 = a[i];		
			var temp2 = b[i];		
			if((temp1 != pID) || (temp2 != dID))
			{
				if(info.pubID == '')
				{
					info.pubID = a[i];
					info.docID = b[i];
					info.title = c[i];
				}
				else
				{
					info.pubID = info.pubID + "|" + a[i];
					info.docID = info.docID + "|" + b[i];
					info.title = info.title + "|" + c[i];
				}
			}
		}

		if(info.pubID == '')
		{
			info.remove();
		}
		else
		{
			info.source = "mail";
			info.store();
		}
	}
}

function loadMailForm()
{
	self.location.href = "/DDS/dvMail/dvMail.html";
}

function resetForm()
{
	new Cookie;
	Cookie.prototype.store = _Cookie_store;
	Cookie.prototype.load = _Cookie_load;
	Cookie.prototype.remove = _Cookie_remove;

	var info = new Cookie(document, "LL-SHARED2", 24, "/", ".lehman.com");
        if((info.load()) && (info.source != "mail"))
                info.remove();

	if(!info.load())
	{
		document.selectMail.reset();
		return;
	}

	var a = info.pubID.split('|');
	var b = info.docID.split('|');
	for(var i = 0; i < a.length; i++)
	{
		var temp1 = "p"+a[i]+b[i];		
		if (document.selectMail[temp1]) {
			document.selectMail[temp1].checked = true;
		}
	}
}

function clearInfo()
{
	new Cookie;
	Cookie.prototype.store = _Cookie_store;
	Cookie.prototype.load = _Cookie_load;
	Cookie.prototype.remove = _Cookie_remove;

	var info = new Cookie(document, "LL-SHARED2", 24, "/", ".lehman.com");
	info.remove();
}


/////////////////////////////////////////////////////////////////////////
// Functions used for emailing sections from XML publication page
/////////////////////////////////////////////////////////////////////////

var fixml_xmlHttp;
function fixmlSendmail()
{
       var _url ="/RSR/cgi-bin/publicationMail.pl"
       var data = "send_to="+encodeURIComponent(document.getElementsByName("send_to")[1].value);
       data = data +"&"+ "ckb_copyself="+document.getElementsByName("ckb_copyself")[1].checked;
       data = data +"&"+ "page_link="+encodeURIComponent(document.getElementsByName("page_link")[1].value);
       data = data +"&"+ "txt_message="+encodeURIComponent(document.getElementsByName("txt_message")[1].value);
       data = data +"&"+ "hdn_section_name="+encodeURIComponent(document.getElementsByName("hdn_section_name")[1].value);
       data = data +"&"+ "hdn_publication_name="+encodeURIComponent(document.getElementsByName("hdn_publication_name")[1].value);
       data = data +"&"+ "hdn_publication_date="+encodeURIComponent(document.getElementsByName("hdn_publication_date")[1].value);
       //data = data +"&"+ "userId="+encodeURIComponent(document.getElementById("userId").value);
       //alert(document.frm.name);       
       //alert(data);
       fixml_xmlHttp = fixmlCreateXmlHTTPRequest();
       fixml_xmlHttp.onreadystatechange=fixmlCallBack;
       fixml_xmlHttp.open('POST', _url, true);
       fixml_xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
       // _xmlHttp.setRequestHeader("Content-type", "xml/x-www-form-urlencoded; charset=utf-8");
      fixml_xmlHttp.setRequestHeader("Content-length", data.length);
      fixml_xmlHttp.setRequestHeader("Connection", "close");
      fixml_xmlHttp.send(data);
}
function fixmlCallBack()
{
     if (fixml_xmlHttp.readyState==4)
     {
         //alert(_xmlHttp.status);
         if(fixml_xmlHttp.status == 200)
         {
             //alert(document.getElementById("span_response").innerHTML);
             document.getElementsByName("span_response")[1].innerHTML = "<b>Message sent successfully</b>";
             //document.getElementsByName("txt_message")[1].innerHTML = _xmlHttp.responseXml;
             setTimeout('hideIbox()',3000);
             //alert(document.getElementById("span_response").innerHTML);
             //alert(_xmlHttp.responseXML.xml);
             //document.getElementById("span_response").innerHTML = _xmlHttp.responseText;
             //document.frm.txt_message.value = _xmlHttp.responseText;
             //var xmlDoc=_xmlHttp.responseXML.documentElement;
             //var text = "Code: "+xmlDoc.getElementsByTagName("response")[0].childNodes[0].nodeValue;
             //text = text + "\nMessage: "+xmlDoc.getElementsByTagName("response")[0].childNodes[1].nodeValue;
             //document.getElementById("span_response").innerHTML = text;
         }
         else
         {
              document.getElementsByName("span_response")[1].innerHTML = "<b>There was an error! Please try again ...</b>";
              //document.getElementsByName("txt_message")[1].value = _xmlHttp.responseText;
         }
         document.getElementById("span_response").style.display="block";
     }
     else
     {
         document.getElementsByName("span_response")[1].innerHTML = "<img src='/RSR_S/images/icon_refresh_indicator_arrows.gif'/><b>Please wait while your message is being sent...</b>";
         document.getElementsByName("span_response")[1].style.display="block";
     }
}
function fixmlCreateXmlHTTPRequest(){
     http_request = false;
     if (window.XMLHttpRequest) {
     // Mozilla, Safari,...
         http_request = new XMLHttpRequest();
         if (http_request.overrideMimeType) {
              http_request.overrideMimeType('text/html');
         }
     } else if (window.ActiveXObject) { // IE
         try {
              http_request = new ActiveXObject("Msxml2.XMLHTTP");
         } catch (e) {
             try {
                 http_request = new ActiveXObject("Microsoft.XMLHTTP");
             } catch (e) {}
         }
     }
     return http_request;
}

function fixmlPopulateIBox(pagelink, sectionName, pubName, pubDate)
{
  document.getElementsByName("page_link")[1].value = pagelink;
  document.getElementsByName("hdn_section_name")[1].value = sectionName;
  document.getElementsByName("hdn_publication_name")[1].value = pubName;
  document.getElementsByName("hdn_publication_date")[1].value = pubDate;
}


