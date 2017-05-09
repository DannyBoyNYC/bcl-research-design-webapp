function LLGetPath(){
	return location.protocol+'//'+ location.host
}
function preLLGetPath(url){
	r=url.indexOf('http')?LLGetPath():"";
	return r
}
function addLogo(){this.document.write(getFullLogo());}
function addCleanLogo(){this.document.write(getCleanLogo());}
function addSignUpLogo(){this.document.write(((window.location.pathname.indexOf("/BCA/") != 0) ? getSignUpLogo() : "") + "<br>"); }
function addWhiteLogo(){this.document.write(getWhiteLogo());}
function getFullLogo(){return getCleanLogo(1);}
function getFullLogoForFrame() {
	logo = "";
	logo += '<HTML><HEAD><LINK REL="STYLESHEET" TYPE="text/css" href="' + LLGetPath() + '/BC_S/html/llcontent.css\">';
	logo += '<script language=javascript1.2 src="' + LLGetPath() + '/BC_S/js/barcaplive.js"></script></HEAD>';
	logo += '<BODY marginwidth=0 marginheight=0 leftmargin=0 topmargin=0 bgcolor=#ffffff>';
	logo += getFullLogo()+ '</BODY></HTML>';
	return logo;
}
function getCleanLogo(date) {
	dateStr = date ? display_todays_date3() : "";
	logo = "";
	logo += '<table width="100%" cellpadding="0" cellspacing="0" border="0">';
	//logo += '<tr><td style="background-color: #1aaddf" valign="top" align="left"><img src="/BC_S/images/bcnav/bc_logo-live_new.gif" border="0"></td></tr>';
	var url = document.location.href.split("?")[0];
	if (url.indexOf(".barcapint.com")>0){
		//my slice
		logo += '<tr><td style="background-color: #fff;padding:2px 0;" valign="top" align="left"><img src="/BC_S/images/bcnav/BarLive_Pos.gif" border="0"></td></tr>';
	}else {
		logo += '<tr><td style="background-color: #1aaddf;padding:2px 0;" valign="top" align="left"><img src="/BC_S/images/bcnav/BarLive_Neg.gif" border="0"></td></tr>';
	}
	logo += '<tr><td class="bggray" height="1" valign="top"></td></tr>';
	logo += '<tr><td height="10"><img src="/BC_S/imagelibrary/spacer.gif" height="10" width="1" border="0"></td></tr>';
	logo += '</table>';
	return logo;
}
function getSignUpLogo() {
	logo = "";
	logo += '<TABLE WIDTH="100%" CELLPADDING="0" CELLSPACING="0" BORDER="0" bgcolor=#ffffff><TR><TD>';
	logo += '<img border="0" alt="" height="6" src="' + LLGetPath() + '/LL_S/images/trans.gif">';
	logo += '</TD></TR><TR><TD colspan="2" class="grayDate">';
	logo += '</TD><TD align="right">';
	logo += '<a href="/LL/Core">Main Menu</a>&nbsp;&nbsp;';
	logo += '<a target="signuphelp" href="/LL_S/html/SignupHelp.html">Help</a>&nbsp;&nbsp;';
	logo += '<a href="/LL/CoreLogout">Logout</a>&nbsp;&nbsp;';
	logo += '</TD></TR></TABLE>';
	logo += getCleanLogo(1);
	return logo;
}
function getWhiteLogo(){
	var logo = "";
	logo += '<TABLE cellpadding=0 cellspacing=0 border=0 width=100%><TR>';
	logo += '<TD class="topLogo" width=208 background="' + LLGetPath() + '/LL_S/images/topBackground.gif">';
	logo += '<img src="' + LLGetPath() + '/LL_S/images/topLogo.gif" width="208" height="41" alt="" border="0"></TD>';
	logo += '<td width="791" valign="bottom" background="' + LLGetPath() + '/LL_S/images/topBackground.gif" class="topDate">&nbsp;</td>';
	logo += '<TD width=17 valign="top" align="left"><img src="' + LLGetPath() + '/LL_S/images/topShim.gif" width="17" height="41" alt="" border="0"></TD></TR><TR>';
	logo += '<TD colspan=3 bgcolor="#003366"><img src="' + LLGetPath() + '/LL_S/images/cleardot.gif" width="1" height="2" alt="" border="0"></TD></TR></TABLE>';
	return logo;
}

