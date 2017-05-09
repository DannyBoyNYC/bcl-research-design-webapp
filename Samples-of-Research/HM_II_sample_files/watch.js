var watchGlobalEvent = Ext.create('Ext.Component');

Ext.Ajax.defaultHeaders = {
	    'Accept' : 'application/json'
};

function resizeMainWindow(){
	if(!Ext.isIE && window != window.parent && window.parent["BCResizeScreen"]){
		try{
			window.parent["BCResizeScreen"]();
		}catch(e){}
	}
}
 
function resizeIframe(){
	if(window != window.parent && window.parent["resizedvAdminIframe"]){
		try{
			window.parent["resizedvAdminIframe"]();
		}catch(e){}
	}
}


Ext.define('WatchUtils',{
	alias:'WatchUtils',
	statics: {
			isHNWClient: function(){
				return this.hnwClient;
			},
			setHNWClient: function(val){
				this.hnwClient = val;
			},
			isBarcorpRetail: function(){
				return this.barcorpRetail;
			},
			setBarcorpRetail: function(val){
				this.barcorpRetail = val;
			},
			findInPagePopupRect:function(windowWidth,windowHeight) {
				var bodyWidth = Ext.getBody().getWidth();
				windowWidth = windowWidth || Math.round(bodyWidth * .7);
				var x = (bodyWidth - windowWidth)/2;
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
				if(window.parent && window.parent.document.getElementById("contentFrame")){
					if(window.parent.innerHeight){
						viewportHeight = window.top.innerHeight;
					} else {
						var doc = window.top.document;
				   		viewportHeight = doc.documentElement.clientHeight;
					}
					var d = window.top.document.documentElement || window.top.document;
					var scrollTop = d.scrollTop;
					if(Ext.isWebKit){
						scrollTop = window.top.document.body.scrollTop;
					}
					currentWindowTop = window.parent.document.getElementById("contentFrame").offsetTop || 115;
					
					var effectiveWindowTop = currentWindowTop;
					if(scrollTop <= currentWindowTop){
						effectiveWindowTop -= scrollTop;
					}else{
						effectiveWindowTop = 0;
					}
					visibleHeightForThisFrame = viewportHeight - effectiveWindowTop;  
				} else if(window.parent != window && "popupContent" != window.name){
					var d = window.parent.document.documentElement || window.parent.document;
					var scrollTop = d.scrollTop;
					if(Ext.isWebKit){
						scrollTop = window.parent.document.body.scrollTop;
					}
					currentWindowTop = (window.parent.document.getElementById("main-content") && window.parent.document.getElementById("main-content").offsetTop)
									 || 115;
					
					var effectiveWindowTop = currentWindowTop;
					if(scrollTop <= currentWindowTop){
						effectiveWindowTop -= scrollTop;
					}else{
						effectiveWindowTop = 0;
					}
					visibleHeightForThisFrame = viewportHeight - effectiveWindowTop;  
				} else{
					var scrollTop = document.documentElement.scrollTop;
					if(Ext.isWebKit){
						scrollTop = document.body.scrollTop;
					}
					visibleHeightForThisFrame = viewportHeight;	
					if("popupContent" == window.name){ // when inside docview popup
						visibleHeightForThisFrame -= 55;
					}
				}
				var yMin = (visibleHeightForThisFrame - popupHeight) / 4;
				var y = scrollTop - currentWindowTop  + yMin;
				y = Math.max(y,yMin);
				
				return {x:x , y : y};
			},
			findShareConfWindowLocation : function(windowWidth,windowHeight){
				var bodyWidth = Ext.getBody().getWidth();
				windowWidth = windowWidth || Math.round(bodyWidth * .7);
				var posX = (bodyWidth - windowWidth)/2;
				var posY = 181;
				
				var visibleHeightForThisFrame = 0;
				var viewportHeight = 0;
				var myContentHeight = 0;
				if(window.parent.innerHeight){
					viewportHeight = window.parent.innerHeight;
		       		myContentHeight = document.body.offsetHeight;
		       	}else{
		       		var doc = window.parent.document;
		       		viewportHeight = doc.documentElement.clientHeight;
		       		myContentHeight = document.documentElement.clientHeight;
		       	}
				
				if(windowHeight && viewportHeight){
					posY = Math.max(30,Math.min(posY, (viewportHeight - windowHeight)/2));
				}
				
				return {posX : posX ,posY: posY, visibleFrameHeight: myContentHeight, availableWidth: bodyWidth,availableHeight:viewportHeight};
			},
			isIframeShimRequired : function(){
				var needIframeShim = false;
				if(Ext.isIE || Ext.isGecko || Ext.isChrome){
					var popupContentWindow = top.frames["popupContent"];
					if(popupContentWindow){
						try{
							var myIFrame = document.getElementById("popupContent");
	   						var content = popupContentWindow.document.body.innerHTML;
	   						if((content.indexOf('<embed type="application/pdf"') == 0  
	   								|| content.indexOf('type="application/pdf"') > -1)
	   								|| content.indexOf('type=application/pdf') > -1
	   								|| content.indexOf('/RSR_S/html/documentOpen.htm') >= 0
	   							    || content.indexOf('/PRC_S/html/documentOpen.htm') >= 0){
	   							needIframeShim = true;
	   						}
				       	}catch(e){
				       		needIframeShim = true;
				       	}
					}
				}
				return needIframeShim;
			},
			getConfPanel:function() {
				var confPanel = {};
				if(WatchUtils.isIframeShimRequired()) {
					confPanel = Ext.create("com.barclays.DV.view.tap.sharenew.IFrameConfirmationPanel");
				} else {
					confPanel = Ext.create("com.barclays.DV.view.tap.sharenew.ConfirmationPanel");
				}
				return confPanel;
			},
			getAlertPanel:function(parentContainer) {
				return Ext.create("com.barclays.DV.view.tap.sharenew.AlertPanel",{
					parentContainer:parentContainer
				});
			},
			getSubscribeClientPanel:function(configObj) {
				return Ext.create("com.barclays.DV.view.tap.sharenew.SubscribeClientPanel",{
					parentContainer:configObj.parentContainer,
	    			pubId:configObj.pubId,
	    			inPage:configObj.inPage,
	    			isMultipart:configObj.isMultipart,
	    			targetWindow:configObj.targetWindow,
	    			subscriptionVals:configObj.subscriptionVals
				});
			},
			insertIframeForChrome:function(width,height,x) {
				var iframeEl = "";
				iframeEl = parent.document.getElementById("popupContent").contentDocument.getElementById("testFrame")
				if(!iframeEl) {
					iframeEl = document.createElement("iframe");
					iframeEl.id = "testFrame";
				}
				iframeEl.scrolling = "no";
				iframeEl.style.border = "0px";
				iframeEl.style.position = "absolute";
				iframeEl.style.background="#fff";
				iframeEl.style.width = width;
				iframeEl.style.height = height;
				iframeEl.style.left = x;
				iframeEl.style.top = 0;
				parent.document.getElementById("popupContent").contentDocument.body.appendChild(iframeEl);	
			},
			removeIframeForChrome:function() {
				if(parent.document && parent.document.getElementById("popupContent")) {
					var iframeEl = parent.document.getElementById("popupContent").contentDocument.getElementById("testFrame");
					if(iframeEl) {
						parent.document.getElementById("popupContent").contentDocument.body.removeChild(iframeEl);
					}
				}
			}
			
	}

});

Ext.define('com.barclays.DV.view.tap.sharenew.IFrameConfirmationPanel' ,{
	extend : 'Ext.Component',
	cls: 'iFrameConfirmationPanel',
	data: {},
	floating: true,
    config: {
    	pubId : '',
    	pubTitle: '',
    	panelType: '',
    	currentPanel : null
    },
    shadow : 'frame',
    shadowOffset: 5,
    initComponent: function() {
    	var loc = WatchUtils.findShareConfWindowLocation(0);
    	this.width = loc.availableWidth;
    	this.height = loc.availableHeight;
    	this.tpl = new Ext.XTemplate(
    		'<div class="dv-mask clickable" style="height:100%;position:relative;"></div>',
                '<tpl if="this.showShim()">',
                   '<iframe class="iframeshim" frameborder="0" scrolling="no" >',
                   		'<html><head></head><body></body></html>',
					'</iframe>',
			'</tpl>',{
				showShim : function(){
					return Ext.isIE || Ext.isGecko || Ext.isChrome;
				}
			}
			
		);
    	
    	this.callParent(arguments);
	},
	afterRender : function(){
		var that = this;
		Ext.getBody().addCls("dv-body-masked");
		this.currentPanel = Ext.create("com.barclays.DV.view.tap.sharenew.ConfirmationPanel",{modal:false});
		var popupRect = WatchUtils.findInPagePopupRect(500,200);
		this.currentPanel.setPosition( popupRect.x ,  popupRect.y);
		this.currentPanel.render(this.getEl());
		//(new Ext.ZIndexManager(this.getEl())).bringToFront(this.currentPanel);
		this.currentPanel.getEl().dom.style.zIndex = 99999;
    	if(this.currentPanel){
    		this.currentPanel.on("PopupPanelClosed",function(){
    			that.hide();
    		});
    	}
		this.getEl().on({
			click : {
				fn : function(e,t){
					that.handleClickableClick(e,t);
				},
				delegate : '.clickable'
			}	
		});
		this.doComponentLayout();	
	},
	handleClickableClick: function(e,t){
		e.preventDefault();
		var elem = Ext.get(t);
		if(elem.hasCls("popupCloseIcon")){
			this.hide();
		}
		return false;
	},
    listeners: {
    	beforeshow: function(){
    		var that = this;
    		Ext.getBody().on({
    			"click" : {
    				fn : this.hideSelfOnMaskClick,
    				delegate : '.iFrameConfirmationPanel',
    				scope : this
    			}
    		});
    		if(Ext.isChrome) {
    			WatchUtils.insertIframeForChrome("100%","100%","0px");
    		}
    	},
		show:function() {
    		var me = this;
    		var popupRect = WatchUtils.findInPagePopupRect(this.getBox().width,this.getBox().height);
        	this.x = popupRect.x;
        	this.y = popupRect.y;
        	this.addMsgTimeOut();
		},
    	hide: function(){
			var that = this;
    		Ext.getBody().un("click",this.hideSelfOnMaskClick,this);
    		this.clearMsgTimeOut();
    		setTimeout(function(){
    			Ext.removeNode(that.getEl().dom);
    		},1);
    		if(Ext.isChrome) {
    			WatchUtils.removeIframeForChrome();
    		}
    	}
    },
    hideSelfOnMaskClick : function(e,t){
    	var tagName = "";
    	try {
    		tagName = e.target.tagName;
    	}catch(e) {
    		
    	}
    	if(tagName != "INPUT") {
        	this.hide();    		
    	}
    },
    clearMsgTimeOut:function() {
    	if(this.hideFn) {
			clearTimeout(this.hideFn);
		}
    },
    addMsgTimeOut:function() {
    	var me = this;
    	this.hideFn = setTimeout(function(){
    		me.hide();
    	},10000);
    }
});

Ext.define('com.barclays.DV.view.tap.sharenew.ConfirmationPanel' ,{
	extend : 'Ext.Component',
	cls: 'confirmationPanel',
	floating:true,
	modal:true,
	width:500,
	data:[],
	initComponent:function() {
		var me = this;
		Ext.applyIf(me, {
			tpl: new Ext.XTemplate('<a href="#" class="clickable popupCloseIcon"></a>',
					'<div class="content"></div>',
					'<div style="clear:both;"></div>',
			    	'<tpl if="this.needIframe()">',
			           	'<iframe class="iframeshimConfPanel" frameborder="0" scrolling="no">',
			           		'<html><head></head><body></body></html>',
			 			'</iframe>',
		 			'</tpl>',{
			    	needIframe : function(){
	 					return WatchUtils.isIframeShimRequired();
	 				}
			    })
		});
		me.callParent(arguments);
	},
    afterRender : function(){
		var that = this;
    	this.getEl().on({
			click : {
    			scope:this,
				fn:that.handleClickableClick,
				delegate : '.clickable'
			}
    	});
	},
	handleClickableClick: function(e,t){
		e.preventDefault();
		var elem = Ext.get(t);
		if(elem.hasCls("popupCloseIcon")){
			this.hide();
		}
		return false;
	},
    listeners: {
    	beforeshow: function(){
    		var that = this;
    		Ext.getBody().on({
    			"click" : {
    				fn : this.hideSelfOnMaskClick,
    				delegate : '.x-mask',
    				scope : this
    			}
    		});
    	},
		show:function() {
    		var me = this;
    		var popupRect = WatchUtils.findInPagePopupRect(this.getBox().width,this.getBox().height);
        	this.x = popupRect.x;
        	this.y = popupRect.y;
        	this.addMsgTimeOut();
		},
    	hide: function(){
    		Ext.getBody().un("click",this.hideSelfOnMaskClick,this);
    		this.clearMsgTimeOut();
    	}
    },
    hideSelfOnMaskClick : function(e,t){
    	this.hide();
    },
    clearMsgTimeOut:function() {
    	if(this.hideFn) {
			clearTimeout(this.hideFn);
		}
    },
    addMsgTimeOut:function() {
    	var me = this;
    	this.hideFn = setTimeout(function(){
    		me.hide();
    	},10000);
    }
});

Ext.define('com.barclays.DV.view.tap.sharenew.AlertPanel' ,{
	extend : 'Ext.Component',
	cls: 'alertPanel',
	style:'z-index:999999',
	floating:true,
	modal:false,
	shadow:false,
	width:300,
	data:[],
	initComponent:function() {
		var me = this;
		Ext.applyIf(me, {
			tpl: new Ext.XTemplate('<a href="#" class="clickable popupCloseIcon"></a>',
					'<div class="msg-container"></div>',
					'<div style="position:relative;width:60px;margin:0 auto;"><div class="clickable btn ok-btn"><a href="#">OK</a></div></div>',
					'<div style="clear:both;"></div>'
			 ),
			msgTpl:new Ext.XTemplate('<div class="content">{msg}</div>')
		});
		me.callParent(arguments);
	},
    afterRender : function(){
		var that = this;
    	this.getEl().on({
			click : {
    			scope:this,
				fn:that.handleClickableClick,
				delegate : '.clickable',
				stopPropagation:true
			}
    	});
	},
	handleClickableClick: function(e,t){
		e.preventDefault();
		var elem = Ext.get(t);
		if(elem.hasCls("popupCloseIcon") || elem.hasCls("ok-btn")){
			this.hide();
			this.parentContainer.mask.hide();
		}
		return false;
	},
	alert:function(msg) {
		this.show();
		this.getEl().down(".msg-container").setHTML("");
		this.msgTpl.append(this.getEl().down(".msg-container"),{msg:msg});
	}
});

Ext.define('com.barclays.DV.view.tap.sharenew.WatchClienInfoPanel' ,{
	extend : 'Ext.Component',
	cls: 'flyoutClientInfoPanel',
	floating:true,
	shadow:false,
	data:[],
	initComponent:function() {
		var me = this;
		Ext.applyIf(me, {
		    contactTpl: new Ext.XTemplate('<div class="clickable content">',
		    		'<img class="top-bubble" style="display:block;position:relative;top:5px;z-index:9999;margin-left:24px;" src="/RSR_S/nyfipubs/barcap/images/iconsUtility/talkBubbleWhite_top.png"/>',
		    		'<div class="content-items">',
		    			'<a href="#" class="clickable popupCloseBtn"></a>',
		    			'<div style="width:0;height:0;clear:both"></div>',
		    			'<div class="grid-header">',
		    				'<tpl if="this.isEmployee(values)">',
								'<div class="header" style="width:250px;border-right:#e4e4e4 1px solid;float:left;"><div class="headerColumn">Name</div></div>',
								'<div class="header" style="width:350px;float:left;"><div class="headerColumn">Email</div></div>',
							'</tpl>',
							'<tpl if="!this.isEmployee(values)">',
								'<div class="header" style="width:150px;border-right:#e4e4e4 1px solid;float:left;"><div class="headerColumn">Name</div></div>',
								'<div class="header" style="width:200px;border-right:#e4e4e4 1px solid;float:left;"><div class="headerColumn">Client Office</div></div>',
								'<div class="header" style="width:250px;float:left;"><div class="headerColumn">Email</div></div>',
							'</tpl>',
							'<div style="clear:both;"></div>',
						'</div>',
						'<div class="grid-content">',
		    			'<ul>',
	    				'<tpl for="selectedContacts">',
	    					'<li class="list-item {[this.addCls(xindex)]}">',
	    						'<tpl if="this.isInternal(values)">',
	    							'<div style="float:left;width:250px">{fullName}</div>',
	    							'<tpl if="this.isMultipleEmail(values)">',
	    								'<div style="float:left;width:450px">',
		    								'<span style="display:inline-block;vertical-align:middle;margin-top:-2px;" userId={webUserID} type="primary" class="clickable radio {[this.isPrimaryChecked(values)]}"></span><span style="padding-left:2px;">{primaryEmail}</span>',
			    							'<span style="display:inline-block;vertical-align:middle;margin-left:7px;margin-top:-2px;" userId={webUserID} type="alternate" class="clickable radio {[this.isAlternateChecked(values)]}"></span><span style="padding-left:2px;">{alternateEmail}</span>',
	    								'</div>',
	    							'</tpl>',
	    							'<tpl if="!this.isMultipleEmail(values)">',
    									'<div style="float:left;width:450px">{primaryEmail}</div>',
    								'</tpl>',
	    						'</tpl>',
	    						'<tpl if="!this.isInternal(values)">',
	    							'<div style="float:left;width:150px">{fullName}</div>',
	    							'<div style="float:left;width:200px">{firmName}</div>',
	    							'<tpl if="this.isMultipleEmail(values)">',
	    								'<div style="float:left;width:450px">',
		    								'<span style="display:inline-block;vertical-align:middle;margin-top:-2px;" userId={webUserID} type="primary" class="clickable radio {[this.isPrimaryChecked(values)]}"></span><span style="padding-left:2px;">{primaryEmail}</span>',
			    							'<span style="display:inline-block;vertical-align:middle;margin-left:7px;margin-top:-2px;" userId={webUserID} type="alternate" class="clickable radio {[this.isAlternateChecked(values)]}"></span><span style="padding-left:2px;">{alternateEmail}</span>',
	    								'</div>',
	    							'</tpl>',
	    							'<tpl if="!this.isMultipleEmail(values)">',
	    								'<div style="float:left;width:450px">{primaryEmail}</div>',
	    							'</tpl>',
	    						'</tpl>',
	    						'<div style="width:0;height:0;clear:both;"></div>',
	    					'</li>',
	    					'<tpl if="this.isMultipleEmail(values)">',
								'<div class="select-btn-container"><a href="#" class="clickable select selectButton selectButton-inactive">Select</a></div>',
	    					'</tpl>',
	    				'</tpl>',
	    			'</ul>',
	    				'</div>',
	    			'</div>',
		    '</div>',
            '<tpl if="this.needIframe()">',
        	'<iframe class="iframeshimFlyoutPanel iframeshimFlyoutClientInfo" frameborder="0" scrolling="no">',
				'<html><head></head><body></body></html>',
			'</iframe>',
		'</tpl>',{
					needIframe : function(){
						return WatchUtils.isIframeShimRequired();
					},
					addCls:function(index) {
		    			return index % 2 == 0 ? "item-even" : "item-odd";
		    		},
		    		isEmployee:function(values) {
		    			return values.isEmployee;
		    		},
		    		isInternal:function(values) {
		    			return values.isInternal == "true" ? true : false;
		    		},
		    		isMultipleEmail:function(values) {
		    			return values.alternateEmail != null  ? true : false;
		    		},
		    		isPrimaryChecked:function(values) {
		    			return values.usePrimaryEmail ? "radio-checked" : "";
		    		},
		    		isAlternateChecked:function(values) {
		    			return values.usePrimaryEmail   ? "" : "radio-checked";
		    		}
		    	}
		    )
		});
		me.callParent(arguments);
	},
	afterRender:function() {
		this.callParent(arguments);
		this.getEl().on({
			click : {
				scope:this,
				fn :this.handleClickableClick,
				delegate : '.clickable'
			}
		});
	},
	handleClickableClick:function(e,t) {
		e.preventDefault();
		Ext.EventObject.stopEvent();
		var elem = Ext.get(t);
		if(elem.hasCls("popupCloseBtn")){
			this.hideClienInfoPanel();
		} else if(elem.hasCls("radio")) {
			var itemEl = Ext.get(Ext.DomQuery.selectNode(".radio-checked",this.getEl().dom));
			if(itemEl) {
				itemEl.removeCls("radio-checked");
			}
			elem.addCls("radio-checked");
			var type = this.selectedContacts[0].usePrimaryEmail ? "primary" : "alternate";
			var selectButtonEl = Ext.get(Ext.DomQuery.selectNode(".selectButton",this.getEl().dom));
			if(type == elem.dom.getAttribute("type")) {
				if(!selectButtonEl.hasCls("selectButton-inactive")) {
					selectButtonEl.addCls("selectButton-inactive");
				}
			} else {
				if(selectButtonEl.hasCls("selectButton-inactive")) {
					selectButtonEl.removeCls("selectButton-inactive");
				}
			}
		} else if(elem.hasCls("select")) {
			var itemEl = Ext.get(Ext.DomQuery.selectNode(".radio-checked",this.getEl().dom));
			var type = itemEl.dom.getAttribute("type");
			var forBCLId = itemEl.dom.getAttribute("userId");
			Ext.Ajax.request({
				url: "/LNS/subscription/service/setEmails",
				params:{use:type,forBCLId:forBCLId},
				scope: this,
				success: function(response,opts){
					var retObj = Ext.JSON.decode(response.responseText);
					if(retObj.success) {
						var selectedContact = this.selectedContacts[0];
						if(type == "primary") {
							selectedContact.usePrimaryEmail = true;
						} else {
							selectedContact.usePrimaryEmail = false;
						}
						this.selectedClientPanel.updateItem(this.activeKey,this.selectedContacts);
						this.hide();
					}
				},
				failure: function(response,opts){
					com.barclays.DV.view.Utils.showMsg("Subscriptions - Error","Error while updating email");
				}
			});
		} 
		return false;
	},
	listeners:{
		show:function() {
			var me = this;
			setTimeout(function() {
				Ext.getBody().on("click",me.hideClienInfoPanel,me);
			},1);
		},
		hide:function() {
			this.activeKey = "";
			Ext.getBody().un("click",this.hideClienInfoPanel,this);
		}
	},
	hideClienInfoPanel:function() {
		this.hide();
	}
});

Ext.define('com.barclays.DV.view.tap.sharenew.SubscribeClientPanel' ,{
	extend : 'Ext.Component',
	cls: 'flyoutItemPanel flyoutSubscribeClientPanel',
	floating:true,
	shadow:false,
	data:[],
	initComponent:function() {
		var me = this;
		Ext.applyIf(me, {
		    tpl: new Ext.XTemplate('<div class="content">',
		    		'<img class="{[this.addCls()]}" src="/RSR_S/nyfipubs/barcap/images/iconsUtility/talkBubble_up.png"/>',
		    		'<div class="content-items">',
			    		'<div class="subscribe-client-info">',
				    		'<h3 class="title">Select client</h3>',
				    		'<div style="display:none" class="watchSelectedClientPanel">',
								'<div class="selected-items-layout">',
				            		'<div class="selected-items-box"></div>',
				            	'</div>',
			            	'</div>',
				    		'<div class="manageClient"></div>',
				    		'<div class="subscribeClient"></div>',
			    		'</div>',
		    		'</div>',
		    '</div>',
            '<tpl if="this.needIframe()">',
	        	'<iframe class="iframeshimFlyoutPanel iframeshimFlyoutSubscribeClientPanel" width="1080" height="800" frameborder="0" scrolling="no">',
					'<html><head></head><body></body></html>',
				'</iframe>',
			'</tpl>',{
		    	addCls:function() {
    				return me.inPage ? 'leftBubbleTop' : "rightBubbleTop";
    			},
				needIframe : function(){
					return WatchUtils.isIframeShimRequired();
				}
		    }),
		    itemTpl: new Ext.XTemplate(
		            '<div class="selected-item" item-key="{[this.getEscapedKey(values)]}">',            	
		                '<div class="close-icon subscribeClientClickable delete"></div>',
		                '<div style="float:left" isList="{isList}" class="subscribeClientClickable display-name">{name}&nbsp;{[this.getEmail(values)]}</div>',
		             '</div>',{
		                getEscapedKey:function(values) {
		            		return escape(values.key);
		            	},
		            	getEmail:function(values) {
		            		if(!values.isList) {
		            			return  "(" + values.email + ")";
		            		}
		            	}
		            }
		    )
		    		
		});
		me.callParent(arguments);
	},
	afterRender:function() {
		this.getEl().on({
			click : {
				scope:this,
				fn :this.handleClickableClick,
				delegate : '.subscribeClientClickable'
			}	
		});
		var mgmtClientPanelComp = Ext.ComponentQuery.query('container[cls=manageClientPanel]');
		if (mgmtClientPanelComp.length > 0) {
			Ext.getCmp(Ext.ComponentQuery.query('container[cls=manageClientPanel]')[0].id).destroy();
		}
		var manageClientPanel= Ext.create('com.barclays.PubSubscription.view.ManageClientPanel',{
			renderTo:this.getEl().down(".manageClient")
		});
		manageClientPanel.on("subscribeForClient",this.subscribeForClient,this);
	},
	handleClickableClick:function(e,t) {
		e.preventDefault();
		var me = this;
		var element = Ext.get(t);
		if(element.hasCls("delete")) {
			var key = unescape(t.parentNode.getAttribute('item-key'));
			me.selectedListMap.removeAtKey(key);
			me.forBCLIds = [];
			var keys = me.selectedListMap.getKeys();
			for(var i = 0; i < keys.length; i++) {
				var contacts = me.selectedListMap.get(keys[i]).selectedContacts;
				for(var j = 0; j < contacts.length; j++) {
					if(!Ext.Array.contains(me.forBCLIds,contacts[j].webUserID)) {
						me.forBCLIds.push(contacts[j].webUserID);
					}
				}
			}
			t.parentNode.parentNode.removeChild(t.parentNode);
			me.SubscriptionItemPanel.forBCLIds = me.forBCLIds;
			if(me.forBCLIds.length == 0) {
				me.clientInfoPanel = null;
				me.getEl().down(".watchSelectedClientPanel").setVisibilityMode(Ext.Element.DISPLAY);
				me.getEl().down(".watchSelectedClientPanel").hide();
				me.getEl().down(".subscribeClient").setVisibilityMode(Ext.Element.DISPLAY);
				me.getEl().down(".subscribeClient").setHTML("");
				me.getEl().down(".subscribeClient").hide();
				me.getEl().down(".manageClient").show();
				var mgmtClientPanelComp = Ext.ComponentQuery.query('container[cls=manageClientPanel]');
				if (mgmtClientPanelComp.length > 0) {
					Ext.getCmp(Ext.ComponentQuery.query('container[cls=manageClientPanel]')[0].id).destroy();
				}
				me.getEl().down(".title").setHTML("Select client");
				var manageClientPanel= Ext.create('com.barclays.PubSubscription.view.ManageClientPanel',{
					renderTo:this.getEl().down(".manageClient")
				});
				manageClientPanel.on("subscribeForClient",this.subscribeForClient,this);
			}
		} else if(element.hasCls("display-name")) {
			var box = element.getBox();
			var key = unescape(t.parentNode.getAttribute('item-key'));
			var selectedContacts = me.selectedListMap.get(key).selectedContacts;
			if(!this.clientInfoPanel) {
				this.clientInfoPanel = Ext.create("com.barclays.DV.view.tap.sharenew.WatchClienInfoPanel",{
					selectedClientPanel:this
				});				
			}
			if(this.clientInfoPanel.activeKey != key) {
				if(this.clientInfoPanel.isVisible()) {
					this.clientInfoPanel.hide();
				}
				var x = box.x + box.width/2 - 42;
				var y = box.y + box.height - 9;
				var compPos = x + 750;
				var initX = x;
				if(compPos > 1110) {
					x = x - (compPos - 1100);
				}
				this.clientInfoPanel.setPosition(x,y);
				this.clientInfoPanel.show();
				var isEmployee = selectedContacts[0].isInternal == "true" ? true : false;
				var obj = {
					isEmployee:isEmployee,
					selectedContacts:selectedContacts
				}
				this.clientInfoPanel.contactTpl.overwrite(this.clientInfoPanel.getEl(),obj);
				Ext.get(Ext.DomQuery.selectNode(".top-bubble",this.clientInfoPanel.getEl().dom)).setX(initX + 24);
				this.clientInfoPanel.activeKey = key;
				this.clientInfoPanel.selectedContacts = selectedContacts;
			} else {
				this.clientInfoPanel.hide();
			}
		}
		return false;
	},
	updateItem:function(key,selectedContacts) {
		Ext.Array.each(Ext.DomQuery.select(".selected-item",this.getEl().dom),function(item){
    		var itemEl = Ext.get(item);
			var displayNameEL = Ext.get(Ext.DomQuery.selectNode(".display-name",itemEl.dom));
			var itemKey = unescape(itemEl.getAttribute('item-key'));
			if(key == itemKey) {
				var selectedContact = selectedContacts[0];
				var email = selectedContact.usePrimaryEmail ? selectedContact.primaryEmail : selectedContact.alternateEmail;
				var html = selectedContact.fullName + " (" + email + ")";
				displayNameEL.setHTML(html);	
			}
   		});	
	},
	subscribeForClient:function(params) {
		var me = this;
		me.forBCLIds = [];
		me.selectedListMap = params.selectedListMap;
		me.getEl().down(".title").setHTML("Subscribe to");
		var mgmtClientPanelComp = Ext.ComponentQuery.query('container[cls=manageClientPanel]');
		if (mgmtClientPanelComp.length > 0) {
			Ext.getCmp(Ext.ComponentQuery.query('container[cls=manageClientPanel]')[0].id).destroy();
		}
		me.getEl().down(".manageClient").setHTML("");
		me.getEl().down(".manageClient").setVisibilityMode(Ext.Element.DISPLAY);
		me.getEl().down(".manageClient").hide();
		me.getEl().down(".watchSelectedClientPanel").show();
		var selectedElemEL = me.getEl().down(".selected-items-box");
		var keys = me.selectedListMap.getKeys();
		for(var i = 0, len = keys.length; i < len; i++) {
			var obj = me.selectedListMap.get(keys[i]);
			me.itemTpl.append(selectedElemEL,{
				name:obj.displayName,
				isList:obj.isList,
				email:obj.selectedContacts[0].usePrimaryEmail ? obj.selectedContacts[0].primaryEmail : obj.selectedContacts[0].alternateEmail,
				key:keys[i]
			});
			var selectedContacts = obj.selectedContacts;
			for(var j = 0, contactsLen = selectedContacts.length; j < contactsLen; j++) {
				me.forBCLIds.push(selectedContacts[j].webUserID);
			}
		}
		me.getEl().down(".subscribeClient").show();
		me.getEl().down(".subscribeClient").setHTML("");
		var clientInfoPanelEl = Ext.get(Ext.DomQuery.selectNode(".flyoutClientInfoPanel"),Ext.getBody().dom);
		if(clientInfoPanelEl) {
			Ext.getBody().dom.removeChild(clientInfoPanelEl.dom);
		}
		me.SubscriptionItemPanel = Ext.create("com.barclays.DV.view.tap.sharenew.SubscriptionItemPanel",{
											renderTo:me.getEl().down(".subscribeClient"),
											parentContainer:me.parentContainer,
											subscribeClientPanel:me,
											pubId:me.pubId,
											inPage:me.inPage,
											isWealthEmployee: me.isWealthEmployee,
											isMResearchDeny:me.isMResearchDeny,
											isMResearchAllow:me.isMResearchAllow,
											fromSubscribeClient:true,
											isMultipart:me.isMultipart,
											forBCLIds:me.forBCLIds,
											targetWindow:me.targetWindow,
											subscriptionVals:me.subscriptionVals
									});
	},
	resizeParent:function() {
		this.getEl().down(".subscribeClient").setHeight(this.getEl().down(".flyoutSubscriptionItemPanel").getHeight()+10);
	}
});
	

Ext.define('com.barclays.DV.view.tap.sharenew.SubscriptionItemPanel' ,{
	extend : 'Ext.Component',
	cls: 'flyoutItemPanel flyoutSubscriptionItemPanel',
	floating:true,
	shadow:false,
	data:[],
    config: {
    	pubId : '',
    	pubTitle: '',
    	languagePreferences : [],
    	isMenuTreeSubscription : false,
    	isSubscribePanel:false,
    	subscriptionVals : [],
    	subscriptionDisplayLabel : '',
    	subscriptionLinkQuery : '',
    	subscriptionItemMap : {},
		subscriptionItems : [],
    	maxSectorThreshold: -1,
    	maxCompanyThreshold:10,
    	maxAnalystThreshold: 5,
    	maxCountryThreshold:10,
    	maxCurrencyThreshold:10,
    	maxCurrencyGroupThreshold:10,
    	maxCurrencyPairThreshold:10,
    	inPage:false
    },
	initComponent:function() {
		var me = this;
		if(me.isMultipart) {
			this.maxCompanyThreshold = 0;
    		this.maxAnalystThreshold = 0;
    		this.maxSectorThreshold = 0;
    		this.maxCountryThreshold = 0;
    		this.maxCurrencyThreshold = 0;
    		this.maxCurrencyGroupThreshold = 0;
    		this.maxCurrencyPairThreshold = 0;
		} 
		Ext.applyIf(me, {
		    tpl: new Ext.XTemplate('<div class="content">',
		    		'<img class="{[this.addCls()]}" src="/RSR_S/nyfipubs/barcap/images/iconsUtility/talkBubble_up.png"/>',
		    		'<div class="content-items">',
		    			'<p class="loading">',
		    				'Loading data. Please wait.....',
		    			'</p>',
	    			'</div>',
		    '</div>',
            '<tpl if="this.needIframe()">',
               '<iframe class="iframeshimFlyoutPanel iframeshimSubscribeItem" frameborder="0" scrolling="no">',
					'<html><head></head><body></body></html>',
				'</iframe>',
			'</tpl>',{
				needIframe : function(){
					return WatchUtils.isIframeShimRequired();
				},
		    	addCls:function() {
	    			return me.inPage ? 'leftBubbleTop' : "rightBubbleTop";
	    		}
		    }),
		    alternateSubscriptionTpl : new Ext.XTemplate(
		        	'<p style="text-align:left" class="alternateSubscription">',
		        		'Unable to subscribe to this publication. Please go to ',
		        		'<a href="#" onclick="window.open(\'/BC/barcaplive?url=/RSL/jsp/subscriptions.jsp\', \'\', \'\'); return false;">',
		        			'<b class="cat">subscriptions</b>',
		        		'</a>',
		        		' to manage your subscription items.',
		    '</p>'),	
		    contentTpl: new Ext.XTemplate('<div class="subscribe-info">',
		    		'<h3>Subscribe to</h3>',
		    			'<div class="subscribe-items">',
		    				'<ul>',
					    		'<tpl for="values.getKeys()">',
					    			'<li>',
						    			'<div class="itemTitle">{.}&nbsp;</div>',
							    		'<tpl for="this.getItems(values)">',
							    			'<tpl if="this.isSubscribed(values)">',
							    				'<div><a href="#" itemName="{itemName}" itemPK="{itemPK}" class="clickable subscribe-item-active">{itemName} (Subscribed)</a></div>',
							    			'</tpl>',
							    			'<tpl if="!this.isSubscribed(values)">',
							    				'<div><a href="#" itemName="{itemName}" itemPK="{itemPK}" class="clickable subscribe-item">{itemName}</a></div>',
						    				'</tpl>',
							    		'</tpl>',
						    		'</li>',
					    		'</tpl>',
				    		'</ul>',
			    		'</div>',
		    		'</div>',{
		    			isSubscribed:function(item) {
		    				return item.isSubscribed;
		    			},
		    			getItems:function(type) {
		    				return me.subscriptionItemsByGroupMap.get(type);
		    			}
		    		}
		    ),
		    msgTpl:new Ext.XTemplate('<div class="message-container">',
					'<p>{msg}',
						'<tpl if="this.isMResearchAllow() && !this.isMResearchDeny()">',
							'<tpl if="this.getTileInfo(values).length &gt; 0">',
			    				'</br></br> {tileMsg} ',
			    				'<tpl for="tiles">',
			    				'"{.}"',
			    					'<tpl if="xcount &gt; 1">',
				    					'<tpl if="xindex == xcount-1">',
											' and ',
										'<tpl elseif="xcount != xindex">',
											' , ',
										'</tpl>',
									'</tpl>',
			    				'</tpl>',
			    				' in your <a href="#" onclick="window.open(\'/BC/barcaplive?url=%2FBC%2FS%2Fwatchlist%2F&menuCode=MENU_FI_WELCOME\'); return false;" class="watchListLink">Watchlist</a>',
			    			'</tpl>',
		    			'</tpl>',
	    			'</p>',
				'</div>',{
		    		getTileInfo:function(values) {
		    			return values.tiles;
		    		},
		    		isMResearchDeny:function() {
		    			return me.isMResearchDeny;
		    		},
		    		isMResearchAllow:function() {
		    			return me.isMResearchAllow;
		    		}
		    	}
			),
		    errorMsgTpl:new Ext.XTemplate('<div class="message-container">',
					'<p>{msg}',
						'<tpl if="this.getUsersInfo(values).length &gt; 0">',
		    				'</br>',
		    				'<tpl for="users">',
		    				'"{userId}"',
		    					'<tpl if="xcount &gt; 1">',
			    					'<tpl if="xindex == xcount-1">',
										' and ',
									'<tpl elseif="xcount != xindex">',
										' , ',
									'</tpl>',
								'</tpl>',
		    				'</tpl>',		    				
		    			'</tpl>',
	    			'</p>',
				'</div>',{
		    		getUsersInfo:function(values) {
		    			return values.users;
		    		}
		    	}
			)
		});
		me.callParent(arguments);
	},
	afterRender:function() {
		this.callParent(arguments);
		this.getEl().on({
			click : {
				scope:this,
				fn :this.handleClickableClick,
				delegate : '.clickable'
			}
		});
		if(this.fromSubscribeClient) {
			this.subscribeClientPanel.resizeParent();
		}
		this.doSubscribableItemLookup();
	},
	handleClickableClick:function(e,t) {
		e.preventDefault();
		var me = this;
		var element = Ext.get(t);
		if(element.hasCls("subscribe-item-active")) {
			if(me.isSubscribeSingleClient()) {
				me.subscribeSingleClient(e,t,"REMOVE");
			}else {
				me.doSubscribe(e,t,"REMOVE");
			}
		} else if(element.hasCls("subscribe-item")) {
			if(me.isSubscribeMultipleClient()) {
				me.checkPermissionForClient(e,t,"ADD");
			} else if(me.isSubscribeSingleClient()) {
				me.subscribeSingleClient(e,t,"ADD");
			} else {
				me.doSubscribe(e,t,"ADD");
			}
		}
		return false;
	},
	isSubscribeSingleClient:function() {
		return this.forBCLIds && this.forBCLIds.length == 1;
	},
	isSubscribeMultipleClient:function() {
		return this.forBCLIds && this.forBCLIds.length > 1
	},
	subscribeSingleClient:function(e,t,actionFlag) {
		var me = this;
		var reqParams = {};
		var forBCLIds = me.forBCLIds;
		var itemName = t.getAttribute("itemName");
  		var itemPK = t.getAttribute("itemPK");
  		var subscriptionVals = this.subscriptionItemMap.get(itemPK);
		var jsonDataObj = {
					"params" : []
		};
		var criteria = [];
		for(var i=0;i< subscriptionVals.length;i++){
			var val = subscriptionVals[i];
			var criterion = {};
			criterion.name = val.paramName;
			criterion.value = val.paramValue;
			criteria.push(criterion);
		}
		if("ADD" == actionFlag){
			var addCriteria = [];
			addCriteria.push({"criteria":criteria});
			for(var i=0;i < forBCLIds.length;i++) {
				var obj = {
					"bclId" : forBCLIds[i],
					"subscriptions" : {}
				};
				obj.subscriptions.subscriptions_added = addCriteria;
				jsonDataObj.params.push(obj);
			}
		} else {
			var deleteCriteria = [];
			deleteCriteria.push({"criteria":criteria});
			for(var i=0;i < forBCLIds.length;i++) {
				var obj = {
					"bclId" : forBCLIds[i],
					"subscriptions" : {}
				};
				obj.subscriptions.subscriptions_deleted = deleteCriteria;
				jsonDataObj.params.push(obj);
			}
		}
		reqParams.jsonDataObj = jsonDataObj;
		me.doClientSubscription(reqParams,itemName,itemPK,actionFlag);
	},
	checkPermissionForClient:function(e,t,actionFlag) {
		var me = this;
		var itemName = t.getAttribute("itemName");
  		var itemPK = t.getAttribute("itemPK");
  		var subscriptionVals = this.subscriptionItemMap.get(itemPK);
		var jsonDataObj = {
					"params" : []
		};
		var criteria = [];
		for(var i=0;i< subscriptionVals.length;i++){
			var val = subscriptionVals[i];
			var criterion = {};
			criterion.name = val.paramName;
			criterion.value = val.paramValue;
			criteria.push(criterion);
		}
		var addCriteria = [];
		if("ADD" == actionFlag){
			addCriteria.push({"criteria":criteria});
		}
		var permJsonDataObj = {};
		permJsonDataObj.subscriptions = addCriteria;
		permJsonDataObj.users =  me.forBCLIds;
		Ext.Ajax.request({
			url: '/RSL/servlets/dv.data?requestType=MAP_USERS_TO_SUBSCRIPTIONS',
			scope: this,
			params:{userSubscriptionJSON:Ext.encode(permJsonDataObj)},
			success: function(response,opts){
				var retObj =  Ext.JSON.decode(response.responseText);
				var subscriptions = retObj.subscriptions;
				if(retObj && retObj.userSubscriptionMap.length > 0) {
					var userSubscriptionMap = retObj.userSubscriptionMap;
					var reqParams = {};
					jsonDataObj = {
							"params" : []
					};
					for(var i=0;i < userSubscriptionMap.length;i++) {
						var userId = userSubscriptionMap[i].userId;
						var subscriptionItems = userSubscriptionMap[i].subscriptionItems;
						var obj = {
								"bclId" : userId,
								"subscriptions" : {}
						};
						var addCriteria = [];
						if(subscriptionItems.length > 0) {
							for(var j=0;j < subscriptionItems.length;j++) {
								for(var k=0;k < subscriptions.length;k++) {
									if(subscriptionItems[j] == subscriptions[k].itemId) {
										addCriteria.push({"criteria":subscriptions[k].criteria});
									}
								}
							}
						}
						obj.subscriptions.subscriptions_added = addCriteria;
						jsonDataObj.params.push(obj);
					}
					reqParams.jsonDataObj = jsonDataObj;
					me.doClientSubscription(reqParams,itemName,itemPK,actionFlag);
				}
			},
			failure: function(response,opts){
				com.barclays.DV.view.Utils.showMsg("Subscriptions - Error","Error while checking permission");
			}
		});
	},
	doClientSubscription:function(reqParams,itemName,itemPK,actionFlag) {
		var me = this;
		if("ADD" == actionFlag){
	    	me.displayMsgDialog({
				msg: "Subscribing to " + itemName
	    	});
		} else {
	    	me.displayMsgDialog({
				msg: "Unsubscribing from " + itemName
	    	});
		}
  		me.parentContainer.hideFlyoutPanel();
		Ext.Ajax.request({
			url: '/LNS/subscription/mresearch/addClientSubscriptions',
			scope: this,
			method:'POST',
			jsonData: reqParams.jsonDataObj,
			success: function(response,opts){
				var retObj =  Ext.JSON.decode(response.responseText);
				var msg = "";
				if ("ADD" == actionFlag) {
					msg = "Your client(s) have been subscribed to <b>" + itemName + "</b>";
				} else {
					msg = "Your client(s) have been unsubscribed from <b>" + itemName + "</b>";
				}
		    	var tileName = "";
				if(retObj && retObj.errorUsers.length > 0) {					
	   				me.displayMsgDialog({
	   					msg: "Subscription failed for following users",
	   					users: retObj.errorUsers
	   				},'errorMsgTpl');
				} else if(retObj && retObj.successUsers.length > 0) {
					me.displayMsgDialog({
	   					msg: msg
	   				});
				}
			},
			failure: function(response,opts){
				me.displayMsgDialog({
   					msg: "Subscription failed - Error while sending the request to mercury"
   				});
			}
		});
	},
	doSubscribe:function(e,t,actionFlag) {
		var me = this;
		var params = {};
  		var itemName = t.getAttribute("itemName");
  		var itemPK = t.getAttribute("itemPK");
  		var subscriptionVals = this.subscriptionItemMap.get(itemPK);
  		var jsonDataObj = {
  	  			"subscriptions" : {
  	  				"menuTreeSubscriptions" : {},
  	  				"requestTimestamp" : (new Date()).getTime(),
  	  				"systemSubscriptions" : {}
  	  			}
  	  	};
  		var subscriptions_added = [];
  		var subscriptions_deleted = [];
  		var isMenuTreeSubscription = false;	
  		var criteria = [];
		for(var i=0;i< subscriptionVals.length;i++){
			var val = subscriptionVals[i];
			var criterion = {};
			criterion.name = val.paramName;
			criterion.value = val.paramValue;
			if("LINKID" == val.paramName){
				isMenuTreeSubscription = true;
			}
			criteria.push(criterion);
		}
		if("ADD" == actionFlag){
			subscriptions_added.push({"criteria":criteria});
		} else {
			subscriptions_deleted.push({"criteria":criteria});		
		}
  		if(true === isMenuTreeSubscription){
  			jsonDataObj.subscriptions.menuTreeSubscriptions.subscriptions_added = subscriptions_added;
  			jsonDataObj.subscriptions.menuTreeSubscriptions.subscriptions_deleted = subscriptions_deleted;
  		}else{
  			jsonDataObj.subscriptions.systemSubscriptions.subscriptions_added = subscriptions_added;
  			jsonDataObj.subscriptions.systemSubscriptions.subscriptions_deleted = subscriptions_deleted;
  		}
  		params.jsonData = encodeURI(Ext.encode(jsonDataObj));
  		params.action = "saveSubscriptions";
  		params.deliveryPreference = "LINK";
  		me.parentContainer.hideFlyoutPanel();
  		if("ADD" == actionFlag) {
	    	me.displayMsgDialog({
					msg: "Subscribing to " + itemName
			});
  		} else {
	    	me.displayMsgDialog({
				msg: "Unsubscribing from " + itemName
	    	});
  		}
    	var doSubscribeRequest = Ext.Ajax.request({
		    url: '/LNS/subscription/ext/subscriptionJsonService?characterSet=UTF-8',
		    params: params,
		    scope: this,
		    success: function(response,opts){
		    	var retObj = Ext.decode(Ext.String.trim(response.responseText));
		    	var resultFlag = retObj && "SUCCESS" == retObj["returnStatus"];
		    	if(resultFlag) {
		    		//var msg = ("ADD" == actionFlag) ? "You have subscribed to " : "You have unsubscribed from ";
		    		var msg = "";
		    		var tiles = [];
		    		var tileMsg = "";
		    		var affectedTileName = "";
		    		if ("ADD" == actionFlag) {
		    			msg = "You have subscribed to <b>" + itemName + "</b>";
		    			if(retObj.payload && retObj.payload.addedSubscriptions 
		    					&& retObj.payload.addedSubscriptions.length > 0) {
		    				var affectedTiles = retObj.payload.addedSubscriptions[0].affectedTiles;
		    				if (affectedTiles && affectedTiles.length > 0) {
		    					for (var tileIndex = 0; tileIndex < affectedTiles.length; tileIndex++) {
		    						tiles.push(affectedTiles[tileIndex].name);
		    					}
		    					tileMsg = 'Your subscription has also been added to ';
		    				}
		    			}
		    		} else {
		    			msg = "You have unsubscribed from <b>" + itemName + "</b>";
		    			if(retObj.payload && retObj.payload.deletedSubscriptions 
		    					&& retObj.payload.deletedSubscriptions.length > 0) {
		    				var affectedTiles = retObj.payload.deletedSubscriptions[0].affectedTiles;
		    				if (affectedTiles && affectedTiles.length > 0) {
		    					for (var tileIndex = 0; tileIndex < affectedTiles.length; tileIndex++) {
		    						tiles.push(affectedTiles[tileIndex].name);
		    					}
		    					tileMsg = 'Your subscription has also been removed from ';
		    				}
		    			}
		    		}
			    	me.displayMsgDialog({
	   					msg: msg,
	   					tileMsg: tileMsg,
	   					tiles: tiles
	   				});
		    	} else {
		    		me.displayMsgDialog({
	   					msg: "Subscription failed &mdash; please try again later"
	   				});
		    	}
		    },
		    failure: function(response,opts){
		    	me.displayMsgDialog({
   					msg: "Subscription failed &mdash; please try again later"
   				});
		    }
		});
	},
	doSubscribableItemLookup:function() {
		var me = this; 
		 if (Ext.isEmpty(this.pubId)) {
				this.subscriptionItems = [];
				this.subscriptionItemMap = new Ext.util.HashMap();
				this.subscriptionVals['itemType'] = 'ANALYST';
				this.subscriptionVals['itemTypeDisplay'] = 'ANALYST';
				var keyName = this.subscriptionVals.itemId+"_ANALYST_1";
				this.subscriptionVals['itemPK'] = keyName; 
				this.subscriptionItems.push(this.subscriptionVals);
				var subscriptionParamArray = [];
				subscriptionParamArray = [{paramName: "ANALYST",paramValue: this.subscriptionVals.itemId},
				                          {paramName: "DIVISION",paramValue: this.subscriptionVals.coverage},
				                          {paramName: "LANGUAGES",paramValue: this.subscriptionVals.language}];
				this.subscriptionItemMap.add(keyName,subscriptionParamArray);
				this.checkAndDispalySubsriptionOption(this.subscriptionItemMap,this.subscriptionItems);
		} else {
			var params = {
			    	"pubID": this.pubId,
			    	"maxCompanyThreshold": this.maxCompanyThreshold,
			    	"maxAnalystThreshold": this.maxAnalystThreshold,
			    	"maxCountryThreshold": this.maxCountryThreshold,
			    	"maxSectorThreshold": this.maxSectorThreshold,
			    	"maxCurrencyThreshold":this.maxCurrencyThreshold,
			    	"maxCurrencyGroupThreshold":this.maxCurrencyGroupThreshold,
			    	"maxCurrencyPairThreshold":this.maxCurrencyPairThreshold
			};
			var isSubscribeForClient = (me.forBCLIds && me.forBCLIds.length > 0) ? true : false;
			var isSubscribeSingleClient = (me.forBCLIds && me.forBCLIds.length == 1) ? true : false;
			if(isSubscribeForClient) {
				params.isClientSubscriptionReq = "YES";
			}
			if(isSubscribeSingleClient) {
				params.userID = me.forBCLIds[0];
			}
			var subscriptionPubIdLookupRequest = Ext.Ajax.request({
			    url: '/RSL/servlets/dv.data?requestType=GET_SUBSCRIPTION_ITEMS&contentType=JSON',
			    params: params,
			    scope: this,
			    method: 'POST',
			    success: function(response,opts){
			    	try {
		   				var retObj = Ext.decode(Ext.String.trim(response.responseText));
		   				var subscriptionItems = retObj.subscriptionItems;
		   				this.languagePreferences = retObj.languagePreferences;
		   				
		   			}catch(e){
				    	me.displayMsgDialog({
		   					msg: "Subscription failed &mdash; please try again later"
		   				});
		   				return;
		   			}
		   			if(subscriptionItems.length == 0){
		   				me.alternateSubscriptionTpl.overwrite(me.getEl().down(".content-items"));
		   				me.parentContainer.fireEvent("resizeBody");
		   			}else{
		   				this.subscriptionItemMap = new Ext.util.HashMap();
		   				this.subscriptionItems = subscriptionItems;
				    	for(var i=0; i < this.subscriptionItems.length; i++){
				    		var itemObj = this.subscriptionItems[i];
				    		itemObj.itemPK = itemObj.itemId+"_"+itemObj["itemType"]+"_"+i;  
				    		var subscriptionParamArray = [];
				    		subscriptionParamArray = [{paramName: itemObj["itemType"],paramValue: itemObj.itemId}];
				    		if("SECTIONID" == itemObj["itemType"]){
					    		var hasLanguageFlag = false;
					    		if(itemObj.extraParams && itemObj.extraParams.length > 0){
					    			for(var j=0; j < itemObj.extraParams.length;j++){
					    				var extraParam = itemObj.extraParams[j];
					    				if(extraParam.paramName == "LANGUAGES"){
					    					hasLanguageFlag = true;
					    				}
					    			}
					    		}
					    		if(hasLanguageFlag === false){
					    			// For SectionID, language is always english if not provided by server side
					    			subscriptionParamArray.push({paramName: 'LANGUAGES', paramValue:'ENG'});
					    		}
				    		}
				    		if(itemObj.extraParams && itemObj.extraParams.length > 0){
				    			for(var j=0; j < itemObj.extraParams.length;j++){
				    				var extraParam = itemObj.extraParams[j];
				    				subscriptionParamArray.push({paramName: extraParam.paramName, paramValue: extraParam.paramValue});
				    			}
				    		}
				    		this.subscriptionItemMap.add(itemObj.itemPK,subscriptionParamArray);
				    	}
		   				me.checkAndDispalySubsriptionOption(this.subscriptionItemMap,this.subscriptionItems);
		   			}
		   			
			    },
			    failure: function(response,opts){
			    	me.displayMsgDialog({
	   					msg: "Subscription failed &mdash; please try again later"
	   				});
			    	return;
		   				
			    }
			});
		}
	},
	checkAndDispalySubsriptionOption: function() {
		var me = this;
		var ajaxRequestConfigObjectsMap = {};
		var keys = this.subscriptionItemMap.getKeys();
		var isSubscribeMultipleClient = (me.forBCLIds && me.forBCLIds.length > 1) ? true : false;
		var isSubscribeSingleClient = (me.forBCLIds && me.forBCLIds.length == 1) ? true : false;
		var forBCLId = "";
		if(!isSubscribeMultipleClient) {
			if (isSubscribeSingleClient) {
				forBCLId = me.forBCLIds[0];
			}
			for(var i = 0; i < keys.length; i++) {
				var subscriptionItem = this.subscriptionItemMap.get(keys[i]);
				var params = {};
				var jsonDataObj = {};
				if(isSubscribeSingleClient) {
					params.action = "CheckMultiSubscription";
					jsonDataObj = {
				  			"subscription" : {
				  				"criteria" : []
				  			},
				  			 "requestTimestamp" : (new Date()).getTime(),
	    		  			"userIdType":"BclId",
	    		 			"forUserIds":[forBCLId]
				  	};
				} else {
					params.action = "CheckSubscription";
					jsonDataObj = {
				  			"subscription" : {
				  				"criteria" : []
				  			},
				  			"requestTimestamp" : (new Date()).getTime()
				  	};
			  	}
		  		var criteria = [];
				for(var j=0;j< subscriptionItem.length;j++){
					var val = subscriptionItem[j];
					var criterion = {};
					criterion.name = val.paramName;
					criterion.value = val.paramValue;
					criteria.push(criterion);
				}
				jsonDataObj.subscription.criteria = criteria;
				params.jsonData = encodeURI(Ext.encode(jsonDataObj));
				
				var requestConfigObj = {
					url : '/LNS/subscription/ext/subscriptionJsonService?characterSet=UTF-8',
					params : params,
					itemPKV: keys[i]
				};
		  		ajaxRequestConfigObjectsMap[keys[i]] = requestConfigObj;
			}
			
	    	var barrier = Ext.create('com.barclays.DV.view.ThreadBarrier',{
				timeout: (me.subscriptionItems.length * 90000),
				ajaxRequestConfigObjectsMap : ajaxRequestConfigObjectsMap,
				numberOfThread: me.subscriptionItems.length,
				successCallbackFn: function(resultMap){
					var subscriptionItemsByGroupMap = new Ext.util.HashMap();
					for(var i=0; i< me.subscriptionItems.length;i++){
						var subObj = me.subscriptionItems[i];
						var itemId = subObj["itemPK"];
			    		var actionResult = resultMap[itemId];
			    		var  isSubscribed = false;
			    		if("_REQUEST_FAILED_" == actionResult){
			    			isSubscribed = false;
			    		}else if(actionResult["subscribed"] == "current" || (actionResult[forBCLId] && actionResult[forBCLId]["subscribed"] == "current")){
			    			isSubscribed = true;
				    	} 
				    	subObj.isSubscribed = isSubscribed;
				    	var type = subObj["itemTypeDisplay"]
			    		if(!subscriptionItemsByGroupMap.containsKey(type)){
			    			var a = [];
			    			subscriptionItemsByGroupMap.add(type,a);
			    		}
			    		var items = subscriptionItemsByGroupMap.get(type);
			    		items.push(subObj);
					}
					me.subscriptionItemsByGroupMap = subscriptionItemsByGroupMap;
					me.contentTpl.overwrite(me.getEl().down(".content-items"),me.subscriptionItemsByGroupMap);
					if(me.fromSubscribeClient) {
						me.subscribeClientPanel.resizeParent();
					}
					me.parentContainer.fireEvent("resizeBody");
				},
				timeoutCallbackFn: function(resultMap){
			    	me.displayMsgDialog({
	   					msg: "Subscription failed &mdash; please try again later"
	   				});
			    	return;
				}
			});
			barrier.start();
			this.barrier = barrier;
		} else {
			this.updateSubscriptionItemsGroup(this.subscriptionItemMap.get(keys[i]));
			if(me.fromSubscribeClient) {
				me.subscribeClientPanel.resizeParent();
			}
		}
	},
	
	updateSubscriptionItemsGroup: function() {
		var me = this;
		var subscriptionItemsByGroupMap = new Ext.util.HashMap();
		for(var i=0; i< me.subscriptionItems.length;i++){
			var subObj = me.subscriptionItems[i];
			var itemId = subObj["itemPK"];
    		var  isSubscribed = false;
	    	subObj.isSubscribed = isSubscribed;
	    	var type = subObj["itemTypeDisplay"];
    		if(!subscriptionItemsByGroupMap.containsKey(type)){
    			var a = [];
    			subscriptionItemsByGroupMap.add(type,a);
    		}
    		var items = subscriptionItemsByGroupMap.get(type);
    		items.push(subObj);
		}
		me.subscriptionItemsByGroupMap = subscriptionItemsByGroupMap;
		me.contentTpl.overwrite(me.getEl().down(".content-items"),me.subscriptionItemsByGroupMap);
	},
	displayMsgDialog : function(msg,tplName){
		watchGlobalEvent.fireEvent("removeActiveSelection");
		var popupRect = WatchUtils.findInPagePopupRect(400,200);
		if(!this.confPanel) {
			this.confPanel = this.targetWindow.WatchUtils.getConfPanel();
		} 
		this.confPanel.setPosition( popupRect.x ,  popupRect.y);
		this.confPanel.show();
        if(WatchUtils.isIframeShimRequired() && Ext.isChrome) {
            WatchUtils.insertIframeForChrome("100%","100%","0px");
        }
		if (Ext.isDefined(tplName)) {
			this[tplName].overwrite(this.confPanel.getEl().down(".content"),msg);
		} else {
			this.msgTpl.overwrite(this.confPanel.getEl().down(".content"),msg);
		}
		this.confPanel.doComponentLayout();
	}
});

Ext.define('com.barclays.DV.view.tap.sharenew.WatchItemPanel' ,{
	extend : 'Ext.Component',
	cls: 'flyoutItemPanel flyoutWatchItemPanel',
	floating:true,
	shadow:false,
	data:[],
    config: {
    	pubId : '',
    	pubTitle: '',
    	languagePreferences : [],
    	isMenuTreeSubscription : false,
    	isSubscribePanel:false,
    	subscriptionVals : [],
    	subscriptionDisplayLabel : '',
    	subscriptionLinkQuery : '',
    	subscriptionItemMap : {},
		subscriptionItems : [],
    	maxSectorThreshold: -1,
    	maxCompanyThreshold:10,
    	maxAnalystThreshold: 5,
    	maxCountryThreshold:10,
    	maxCurrencyThreshold:10,
    	maxCurrencyGroupThreshold:10,
    	maxCurrencyPairThreshold:10
    },
	initComponent:function() {
		var me = this;
		if(me.isMultipart) {
			this.maxCompanyThreshold = 0;
    		this.maxAnalystThreshold = 0;
    		this.maxSectorThreshold = 0;
    		this.maxCountryThreshold = 0;
    		this.maxCurrencyThreshold = 0;
    		this.maxCurrencyGroupThreshold = 0;
    		this.maxCurrencyPairThreshold = 0;
		} 
		Ext.applyIf(me, {
		    tpl: new Ext.XTemplate('<div class="content">',
		    		'<img class="{[this.addCls()]}" src="/RSR_S/nyfipubs/barcap/images/iconsUtility/talkBubble_up.png"/>',
		    		'<div class="content-items">',
		    			'<p class="loading">',
		    				'Loading data. Please wait.....',
		    			'</p>',
	    			'</div>',
		    '</div>',
            '<tpl if="this.needIframe()">',
               '<iframe class="iframeshimFlyoutPanel iframeshimFlyoutWatch" frameborder="0" scrolling="no">',
					'<html><head></head><body></body></html>',
				'</iframe>',
			'</tpl>',{
				needIframe : function(){
					return WatchUtils.isIframeShimRequired();
				},
		    	addCls:function() {
	    			return me.inPage ? 'leftBubbleTop' : "rightBubbleTop";
	    		}
		    }),
		    contentTpl: new Ext.XTemplate('<div class="watch-info">',
			    		'<div class="watch-header">',
				    		'<h3>Select a feed to watch</h3>',
				    		'<p>This publication belongs to the following feed(s). </p>',
				    		'<p>Select the one you want to add to your Watchlist.</p>',
			    		'</div>',
		    			'<div class="watch-items">',
		    				'<ul>',
					    		'<tpl for="values.getKeys()">',
					    			'<li>',
						    			'<div class="itemTitle">{.}&nbsp;</div>',
							    		'<tpl for="this.getItems(values)">',
							    			'<div><a href="#" itemId="{itemId}" itemPK="{itemPK}"  class="clickable watch-item">{itemName}</a></div>',
							    		'</tpl>',
						    		'</li>',
					    		'</tpl>',
				    		'</ul>',
			    		'</div>',
		    		'</div>',{
		    			getItems:function(type) {
		    				return me.subscriptionItemsByGroupMap.get(type);
		    			}
		    		}
		    ),
		    alternateSubscriptionTpl : new Ext.XTemplate(
		        	'<p style="text-align:left" class="alternateSubscription">',
		        		'Unable to watch this publication. Please go to ',
		        		'<a href="#" onclick="window.open(\'/BC/barcaplive?url=%2FBC%2FS%2Fwatchlist%2F&menuCode=MENU_FI_WELCOME\', \'\', \'\'); return false;">',
		        			'<b class="cat">watchlist</b>',
		        		'</a>',
		        		' to manage your watch items.',
		    '</p>'),	
		    suggestedTileTpl:new Ext.XTemplate('<div class="watch-item-info">',
		    		'<h3>Watch in</h3>',
			    		'<div class="watch-items">',
			    			'<ul>',
			    				'<tpl if="tileList.length &gt; 0">',
				    				'<tpl for="tileList">',
				    					'<tpl if="xindex == 1">',
						    				'<li class="tile-item tile-item-even clickable new-tile">',
						    					'<div class="new-tile-lbl">New Tile</div>',
						    					'<div class="new-tile-editor">',
						    						'<div class="create-tile-input"></div>',
						    						'<div class="clickable create-tile-btn create-tile"><a href="#">Create Tile</a></div>',
						    						'<div style="clear:both"></div>',
						    					'</div>',
					    					'</li>',
						    			'</tpl>',
						    			'<tpl if="xindex %2 == 0">',
					    					'<li tileId="{id}" tileName="{name}" class="tile-item tile-item-even clickable update-tile">',
				    							'<div><span class="tile-img"></span>{name}</div>',
				    						'</li>',
				    					'</tpl>',
				    					'<tpl if="xindex %2 != 0">',
					    					'<li tileId="{id}" tileName="{name}" class="tile-item tile-item-odd clickable update-tile">',
				    							'<div><span class="tile-img"></span>{name}</div>',
				    						'</li>',
			    						'</tpl>',
			    					'</tpl>',
		    					'</tpl>',
		    					'<tpl if="tileList.length == 0">',
				    				'<li class="tile-item tile-item-even clickable new-tile">',
				    					'<div class="new-tile-lbl">New Tile</div>',
				    					'<div class="new-tile-editor">',
				    						'<div class="create-tile-input"></div>',
				    						'<div class="clickable create-tile-btn create-tile"><a href="#">Create Tile</a></div>',
				    						'<div style="clear:both"></div>',
				    					'</div>',
			    					'</li>',
		    					'</tpl>',
			    			'</ul>',
			    		'</div>',
			    		'<div class="subscribe-panel">',
			    			'<span>Email Subscriptions</span>',
			    			'<div class="clickable subscribe subscribe-checkbox subscribe-checkbox-checked" style="float:right;cursor:pointer;">&nbsp;</div>',
			    			'<div style="width:0;clear:both;"></div>',
			    			'<div class="email-tip">Tip: Switch email subscriptions off if you do not want associated publications sent to you as they are published.</div>',
		    		'</div>',
		    		'</div>'
		    ),
		    successMsgTpl:new Ext.XTemplate('<div class="message-container">',
					'<div><a style="cursor:pointer;color:#017eb6;text-decoration:none;" href="#" onclick="window.open(\'/BC/barcaplive?url=%2FBC%2FS%2Fwatchlist%2F&menuCode=MENU_FI_WELCOME\');return false;">{tileName}</a> tile has been updated</div>',
				'</div>'
			),
		    errorMsgTpl:new Ext.XTemplate('<div class="message-container">',
					'<div>{msg}</div>',
				'</div>'
			)
		});
		me.callParent(arguments);
	},
	afterRender:function() {
		this.callParent(arguments);
		this.getEl().on({
			click : {
				scope:this,
				fn :this.handleClickableClick,
				delegate : '.clickable'
			}
		});
		this.doSubscribableItemLookup();
	},
	handleClickableClick:function(e,t) {
		e.preventDefault();
		var me = this;
		var element = Ext.get(t);
		if(element.hasCls("watch-item")) {
			me.getSuggestedTiles(e,t);
		} else if(element.hasCls("subscribe")) {
			element.toggleCls("subscribe-checkbox-checked");
		} else if(element.hasCls("new-tile")) {
			element.removeCls("new-tile")
			element.addCls("new-tile-edit")
		} else if(element.hasCls("create-tile") && !element.hasCls("create-tile-btn-disabled")) {
			var tileName = me.newTileTxtComp.getValue();
			for(var i = 0, len = this.tileList.length; i < len; i++) {
				if(Ext.String.trim(tileName) == Ext.String.trim(this.tileList[i].name)) {
					if(!this.alertPanel) {
						this.mask  = new Ext.LoadMask(this.getEl().down(".watch-items"),{msg:"Please wait...",msgCls:'alert-mask-msg'});
						this.alertPanel = this.targetWindow.WatchUtils.getAlertPanel(me);
					}
					try {
						this.mask.show();
					} catch(e) {}
					this.alertPanel.alert("Tile with the name already exists");
					var pos = me.getPosition();
					var x = pos[0] + (me.getWidth() - me.alertPanel.getWidth())/2;
					var y = pos[1] + (me.getHeight() - me.alertPanel.getHeight())/2;
					me.alertPanel.setPosition(x,y);
					return;
				}
			}
			me.parentContainer.hideFlyoutPanel();
			me.createTile(e,t,tileName);
		} else if(element.hasCls("update-tile")) {
			var tileId = t.getAttribute("tileId");
			var tileName = t.getAttribute("tileName");
			if(tileId.length == 0 && tileName && Ext.String.trim(tileName).length > 0) {
				me.createTile(e,t,tileName);
			} else {
				me.parentContainer.hideFlyoutPanel();
				me.updateTile(e,t,tileId,tileName);				
			}
		}

		return false;
	},
	updateTile:function(e,t,tileId,tileName) {
		var me = this;
		var subscribeEl = Ext.get(Ext.DomQuery.selectNode(".subscribe",this.getEl().dom));
		var deliveryPreference =  subscribeEl.hasCls("subscribe-checkbox-checked") ? "" : "Watch Only";
		
		me.displayMsgDialog({
			msg:'Updating Tile Info...',
			hideMsgTimeOut:true
		},false);
		var subscriptionVals = me.selectedSubscrptionVals;
		var jsonData = {
				"tileList":[{
					"params":{
						"subscriptions":{
							"subscriptions_added":[]			
						}
					}
				}]
		};
  		var criteria = [];
		for(var i=0;i< subscriptionVals.length;i++){
			var val = subscriptionVals[i];
			var criterion = {};
			criterion.name = val.paramName;
			criterion.value = val.paramValue;
			criteria.push(criterion);
		}
		jsonData.tileList[0].id = tileId;
		jsonData.tileList[0].name = tileName;
		var sub_add = {};
		sub_add.criteria = criteria;
		if(deliveryPreference.length > 0) {
			sub_add.deliveryPreference = deliveryPreference;
		}
		jsonData.tileList[0].params.subscriptions.subscriptions_added.push(sub_add);
		 Ext.Ajax.request({
			    url: '/BC/S/watchlist/tile/update/Subscription',
			    scope: this,
			    method: 'POST',
			    headers : {'Content-Type': 'application/json'},
			    jsonData:jsonData,
			    success: function(response,opts){
			    	var retObj = Ext.decode(Ext.String.trim(response.responseText));
			    	if(retObj.status && retObj.status.code == 0 && retObj.status.message == "success") {
				    	me.displayMsgDialog({
				    		tileName: tileName
		   				},true);
			    	} else {
				    	me.displayMsgDialog({
		   					msg: "Watch failed &mdash; please try again later",
		   					desc: "Error updating tile"
		   				},false);
			    	}
			    },
			    failure: function(response,opts){
			    	me.displayMsgDialog({
	   					msg: "Watch failed &mdash; please try again later",
	   					desc: "Error updating tile"
	   				},false);
			    }
		 });
	},
	createTile:function(e,t,tileName) {
		var me = this;
		me.displayMsgDialog({
			msg:'Creating Tile...',
			hideMsgTimeOut:true
		},false);
		var subscriptionVals = me.selectedSubscrptionVals;
		var subscribeEl = Ext.get(Ext.DomQuery.selectNode(".subscribe",this.getEl().dom));
		var deliveryPreference =  subscribeEl.hasCls("subscribe-checkbox-checked") ? "" : "Watch Only";
		var jsonData = {
				"tileList":[{
					"params":{
						"subscriptions":{
							"subscriptions_added":[]			
						}
					}
				}]
		};
  		var criteria = [];
		for(var i=0;i< subscriptionVals.length;i++){
			var val = subscriptionVals[i];
			var criterion = {};
			criterion.name = val.paramName;
			criterion.value = val.paramValue;
			criteria.push(criterion);
		}
		jsonData.tileList[0].name = tileName;
		var sub_add = {};
		sub_add.criteria = criteria;
		if(deliveryPreference.length > 0) {
			sub_add.deliveryPreference = deliveryPreference;
		}
		jsonData.tileList[0].params.subscriptions.subscriptions_added.push(sub_add);
		 Ext.Ajax.request({
			    url: '/BC/S/watchlist/tile/create/Subscription',
			    scope: this,
			    method: 'PUT',
			    headers : {'Content-Type': 'application/json'},
			    jsonData:jsonData,
			    success: function(response,opts){
			    	var retObj = Ext.decode(Ext.String.trim(response.responseText));
			    	if(retObj.status && retObj.status.code == 0 && retObj.tileList && retObj.tileList.length > 0) {
				    	me.displayMsgDialog({
				    		tileName: tileName
		   				},true);
			    	} else {
				    	me.displayMsgDialog({
		   					msg: "Watch failed &mdash; please try again later",
		   					desc: "Error creating tile"
		   				},false);
			    	}
			    },
			    failure: function(response,opts){
			    	me.displayMsgDialog({
	   					msg: "Watch failed &mdash; please try again later",
	   					desc: "Error creating tile"
	   				},false);
			    }
		 });
	},
	getSuggestedTiles:function(e,t) {
		var me = this;
  		var itemId = t.getAttribute("itemId");
  		var itemPK = t.getAttribute("itemPK");
  		var subscriptionVals = this.subscriptionItemMap.get(itemPK);
  		me.selectedSubscrptionVals = subscriptionVals;
  		var itemObj = {};
  		for(var i=0; i < this.subscriptionItems.length; i++){
    		if(itemId == this.subscriptionItems[i]["itemId"]){
	    		itemObj = Ext.clone(this.subscriptionItems[i]);
	    		break;
    		}
    	}
		var jsonData = {
				"subscriptions":{
					"subscriptions_added":[]			
				}
		};
  		var criteria = [];
		for(var i=0;i< subscriptionVals.length;i++){
			var val = subscriptionVals[i];
			var criterion = {};
			criterion.name = val.paramName;
			criterion.value = val.paramValue;
			criteria.push(criterion);
		}
		jsonData.subscriptions.subscriptions_added.push({"criteria":criteria});
		 Ext.Ajax.request({
			    //url: '/BC/S/watchlist/tile/suggest/Subscription',
			 	url: '/LNS/subscription/ext/desktop/tile/getDesktopSuggestedTiles',
			    scope: this,
			    method: 'POST',
			    headers : {'Content-Type': 'application/json'},
			    jsonData:jsonData,
			    success: function(response,opts){
			    	var retObj = Ext.decode(Ext.String.trim(response.responseText));
			    	if(retObj.tileList) {
				    	this.tileList = retObj.tileList;
			    		me.suggestedTileTpl.overwrite(me.getEl().down(".content-items"),{
			    			tileList:this.tileList,
			    			selectedItemName:itemObj.itemName
			    		});
						var newTileEl = Ext.get(Ext.DomQuery.selectNode(".create-tile-input",me.getEl().dom));
						me.newTileTxtComp = Ext.create("Ext.form.field.Text", {
							name: 'txtNewTileName',
							width:180,
							hideMode:'visibility',
							emptyText: 'New Tile Name',
							cls: 'new-folder-name-text',	
							renderTo:newTileEl,
							enableKeyEvents:true,
							listeners:{
								keyup:function(obj) {
									var saveBtn = Ext.get(Ext.DomQuery.selectNode(".create-tile-btn",me.getEl().dom));
									if(obj.getValue().length > 0) {
										if(saveBtn.hasCls("create-tile-btn-disabled")) {
											saveBtn.removeCls("create-tile-btn-disabled");
										}
									} else {
										if(!saveBtn.hasCls("create-tile-btn-disabled")) {
											saveBtn.addCls("create-tile-btn-disabled");
										}
									}
								}
							}
						});
						me.newTileTxtComp.setValue(itemObj.itemName);
			    		me.parentContainer.fireEvent("resizeBody");
			    	}
			    },
			    failure: function(response,opts){
			    	me.displayMsgDialog({
	   					msg: "Watch failed &mdash; please try again later",
	   					desc: "Error while retrieving suggested watch items"
	   				});
			    }
		 });

	},
	doSubscribableItemLookup:function() {
		var me = this;
		var params = {
		    	"pubID": this.pubId,
		    	"maxCompanyThreshold": this.maxCompanyThreshold,
		    	"maxAnalystThreshold": this.maxAnalystThreshold,
		    	"maxCountryThreshold": this.maxCountryThreshold,
		    	"maxSectorThreshold": this.maxSectorThreshold,
		    	"maxCurrencyThreshold":this.maxCurrencyThreshold,
		    	"maxCurrencyGroupThreshold":this.maxCurrencyGroupThreshold,
		    	"maxCurrencyPairThreshold":this.maxCurrencyPairThreshold
		};
		var isSubscribeForClient = (me.forBCLIds && me.forBCLIds.length > 0) ? true : false;
		var isSubscribeSingleClient = (me.forBCLIds && me.forBCLIds.length == 1) ? true : false;
		if(isSubscribeSingleClient) {
			params.userID = me.forBCLIds[0];
		}
		var subscriptionPubIdLookupRequest = Ext.Ajax.request({
		    url: '/RSL/servlets/dv.data?requestType=GET_SUBSCRIPTION_ITEMS&contentType=JSON',
		    params: params,
		    scope: this,
		    method: 'POST',
		    success: function(response,opts){
		    	try {
	   				var retObj = Ext.decode(Ext.String.trim(response.responseText));
	   				var subscriptionItems = retObj.subscriptionItems;
	   				this.languagePreferences = retObj.languagePreferences;
	   				
	   			}catch(e){
			    	me.displayMsgDialog({
	   					msg: "Subscription failed &mdash; please try again later"
	   				});
	   				return;
	   			}
	   			if(subscriptionItems.length == 0){
	   				me.alternateSubscriptionTpl.overwrite(me.getEl().down(".content-items"));
					me.parentContainer.fireEvent("resizeBody");
	   			}else{
	   				this.subscriptionItemMap = new Ext.util.HashMap();
	   				this.subscriptionItems = subscriptionItems;
			    	for(var i=0; i < this.subscriptionItems.length; i++){
			    		var itemObj = this.subscriptionItems[i];
			    		itemObj.itemPK = itemObj.itemId+"_"+itemObj["itemType"]+"_"+i;  
			    		var subscriptionParamArray = [];
			    		subscriptionParamArray = [{paramName: itemObj["itemType"],paramValue: itemObj.itemId}];
			    		if("SECTIONID" == itemObj["itemType"]){
				    		var hasLanguageFlag = false;
				    		if(itemObj.extraParams && itemObj.extraParams.length > 0){
				    			for(var j=0; j < itemObj.extraParams.length;j++){
				    				var extraParam = itemObj.extraParams[j];
				    				if(extraParam.paramName == "LANGUAGES"){
				    					hasLanguageFlag = true;
				    				}
				    			}
				    		}
				    		if(hasLanguageFlag === false){
				    			// For SectionID, language is always english if not provided by server side
				    			subscriptionParamArray.push({paramName: 'LANGUAGES', paramValue:'ENG'});
				    		}
			    		}
			    		if(itemObj.extraParams && itemObj.extraParams.length > 0){
			    			for(var j=0; j < itemObj.extraParams.length;j++){
			    				var extraParam = itemObj.extraParams[j];
			    				subscriptionParamArray.push({paramName: extraParam.paramName, paramValue: extraParam.paramValue});
			    			}
			    		}
			    		this.subscriptionItemMap.add(itemObj.itemPK,subscriptionParamArray);
			    	}
			    	var subscriptionItemsByGroupMap = new Ext.util.HashMap();
					for(var i=0; i< this.subscriptionItems.length;i++){
						var subObj = me.subscriptionItems[i];
				    	var type = subObj["itemTypeDisplay"];
			    		if(!subscriptionItemsByGroupMap.containsKey(type)){
			    			var a = [];
			    			subscriptionItemsByGroupMap.add(type,a);
			    		}
			    		var items = subscriptionItemsByGroupMap.get(type);
			    		items.push(subObj);
					}
					me.subscriptionItemsByGroupMap = subscriptionItemsByGroupMap;
					me.contentTpl.overwrite(me.getEl().down(".content-items"),me.subscriptionItemsByGroupMap);
					me.parentContainer.fireEvent("resizeBody");
	   			}
	   			
		    },
		    failure: function(response,opts){
		    	me.displayMsgDialog({
   					msg: "Subscription failed &mdash; please try again later"
   				});
		    	return;
	   				
		    }
		});
	},
	displayMsgDialog : function(msg,successFlag){
		watchGlobalEvent.fireEvent("removeActiveSelection");
		var popupRect = WatchUtils.findInPagePopupRect(400,200);
		if(!this.confPanel) {
			this.confPanel = this.targetWindow.WatchUtils.getConfPanel();
		}
		this.confPanel.setPosition( popupRect.x ,  popupRect.y);
		this.confPanel.show();
		if(successFlag) {
			this.successMsgTpl.overwrite(this.confPanel.getEl().down(".content"),msg);
		} else {
			this.errorMsgTpl.overwrite(this.confPanel.getEl().down(".content"),msg);
		}
		if(msg.hideMsgTimeOut) {
			this.confPanel.clearMsgTimeOut();
		} else {
			this.confPanel.addMsgTimeOut();
		}
		this.confPanel.doComponentLayout();
	}
});

Ext.define('ActionUtils' ,{
	statics: {
	    msgTpl:new Ext.XTemplate('<div class="message-container">',
				'<div>{msg}</div>',
			'</div>'
		),
		getChromeVersion:function() {     
		    var raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
		    return raw ? parseInt(raw[2], 10) : false;
		},
		getParameterByName:function(name, url) {
		    if (!url) url = window.location.href;
		    name = name.replace(/[\[\]]/g, "\\$&");
		    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		        results = regex.exec(url);
		    if (!results) return null;
		    if (!results[2]) return '';
		    return decodeURIComponent(results[2].replace(/\+/g, " "));
		},
		printPublication:function(pubId,pubTitle) {
			var popupContentWindow = top.frames["popupContent"];
			if(popupContentWindow){
				var myIFrameContent = popupContentWindow.document.body.innerHTML;
				if(myIFrameContent.indexOf('type="application/pdf"') > -1) {
					var frameId = "print_pub";
					var usedFrame = document.getElementById(frameId);
			    	var content = null;
			    	
				    if (usedFrame) {
				      usedFrame.parentNode.removeChild(usedFrame);
				    }
				    
					var isIE = /*@cc_on!@*/false || !!document.documentMode;
					var isEdge = !isIE && !!window.StyleMedia;
					if(isIE) {
				    	content = popupContentWindow.document.getElementsByTagName("object")[0];
						content.print();
					} else {
						var dataURL = popupContentWindow.document.getElementsByTagName("object")[0].data;
						var docID = this.getParameterByName("docID",dataURL);
						var url = "/RSL/servlets/dv.search?docID=" + docID + "&streamFile=YES&fastWebView=NO&applicationID=BCLPRINT";
						if(this.getChromeVersion() < 48) {
							var winParams = "width=1100,height=900,scrollbars=yes,resizable=yes,status=yes,toolbar=no,menubar=no,location=no,top=0,left=0";
							var win = window.open("/RSR_S/html/print.html?docID=" + docID, "bcl_print", winParams);
							win.opener = self;							
						} else {
							var printEl = document.createElement('iframe');
					    	printEl.setAttribute('style', 'display:none;');
					    	printEl.setAttribute('id', frameId);
					    	printEl.setAttribute('src', url);
					    	document.getElementsByTagName('body')[0].appendChild(printEl);
					    	printEl.onload = function () {
				        		printEl.focus();
				        		printEl.contentWindow.print();
				        		return false;
					        }
						}
					}
				} else {
					var popupContent = document.getElementById("popupContent");
					popupContent.contentWindow.focus();
					popupContent.contentWindow.print();
				}
			}
			return false;
		},
		finishPrintPdfIe: function(printEl) {
			var me = this;
		    // wait until pdf is ready to print
		    if (typeof printEl.print === 'undefined') {
		      setTimeout(function () { me.finishPrintPdfIe(printEl) }, 1000);
		    } else {
		    	printEl.focus();
		    	printEl.print()
		     // remove embed (just because it isn't 100% hidden when using h/w = 0)
		      //setTimeout(function () { printEl.parentNode.removeChild(printEl) }, 2000)
		    }
		},
		sendEmail:function(pubId,pubTitle) {
			this.displayMsgDialog({
				msg:'Sending ' + pubTitle + ' to your email...'
			})
			var params = {pubID: pubId};
			Ext.Ajax.request({
			    url: '/LNS/subscription/ext/email/me?characterSet=UTF-8',
			    params: params,
			    scope: this,
			    method: 'POST',
			    success: function(response,opts){
					var retObj = Ext.decode(Ext.String.trim(response.responseText));
		   			if(retObj.success === true) {
		   				this.displayMsgDialog({
		   					msg: pubTitle + ' has been emailed to you'
		   				})
		   			} else {
		   				this.displayMsgDialog({
		   					msg: 'Email failed &mdash; please try again later<br/><i>' + pubTitle
		   				})
		   			}
		   			this.confPanel = null;
			    },
			    failure: function(response,opts){
	   				this.displayMsgDialog({
	   					msg: 'Email failed &mdash; please try again later<br/><i>' + pubTitle
	   				})
	   				this.confPanel = null;
			    }
			});
		},
		getEncodedLink:function(pubId) {
			this.displayMsgDialog({
				msg:'Loading...'
			})
			var params = {pubId: pubId};
			 Ext.Ajax.request({
				    url: "/DDL/jsp/BCLEncodedLinks.jsp?action=getEncodedLinksByPubID",
				    scope: this,
				    params: params,
				    method: 'GET',
				    success: function(response,opts){
			   			var retObj = Ext.decode(Ext.String.trim(response.responseText));
			   			var msg = "Sorry, some error occurred. Please try again later";
			   			var linkValue ="";
			   			if ((retObj.encodedLinks) && (retObj.encodedLinks.length >0)) {
			   				linkValue = retObj.encodedLinks[0].encodedURI;
			   				if (Ext.isDefined(window.clipboardData)) {
			   					window.clipboardData.setData("Text", linkValue);
			   					msg = "The link has been copied to your clipboard";
			   				} else {
			   					msg = "<span>Link" + '</span><br><input type="text" class="linkText" onClick="event.preventDefault();this.focus();this.setSelectionRange(0, 9999);return false;" value="'+ linkValue +'"/>';			   					
			   				}
			   				
			   			}
				    	//var linkValue = (retObj.encodedLinks && retObj.encodedLinks.length >0 && retObj.encodedLinks[0].encodedURI) || "Sorry, some error occurred. Please try again later";
				    	this.displayMsgDialog({
							msg:msg
						})
						this.confPanel = null;
				    },
				    failure: function(response,opts){
				    	this.confPanel = null;
				    }
				});
		},
		displayMsgDialog : function(msg){
			var popupRect = WatchUtils.findInPagePopupRect(400,200);
			if(!this.confPanel) {
				this.confPanel = WatchUtils.getConfPanel();
			}
			this.confPanel.show();
			this.confPanel.setPosition( popupRect.x ,  popupRect.y);
			this.msgTpl.overwrite(this.confPanel.getEl().down(".content"),msg);
			this.confPanel.doComponentLayout();
		}
	}
	
});

Ext.define('com.barclays.DV.view.tap.sharenew.WorkBookItemPanel' ,{
	extend : 'Ext.Component',
	cls: 'flyoutItemPanel flyoutWorkBookItemPanel',
	floating:true,
	shadow:false,
	data:[],
    config: {
    	pubId : '',
    	pubTitle: '',
    	languagePreferences : [],
    	inPage:false
    },
	initComponent:function() {
		var me = this;
		Ext.applyIf(me, {
		    tpl: new Ext.XTemplate('<div class="content">',
		    		'<img class="{[this.addCls()]}" src="/RSR_S/nyfipubs/barcap/images/iconsUtility/talkBubble_up.png"/>',
		    		'<div class="content-items">',
		    			'<p class="loading">',
		    				'Loading data. Please wait.....',
		    			'</p>',
	    			'</div>',
		    '</div>',
		    '<tpl if="this.needIframe()">',
            				'<iframe class="iframeshimFlyoutPanel iframeshimFlyoutWorkbook" frameborder="0" scrolling="no">',
						'<html><head></head><body></body></html>',
					'</iframe>',
				'</tpl>',{
				needIframe : function(){
					return WatchUtils.isIframeShimRequired();
				},
		    	addCls:function() {
	    			return me.inPage ? 'leftBubbleTop' : "rightBubbleTop";
	    		}
		    }),
		    contentTpl: new Ext.XTemplate('<div class="workbook-info">',
		    	'<div class="workbook-header">',
					'<div class="clickable btn cancel-btn"><a href="#">Cancel</a></div>',
					'<h3 style="float:left;">Add to Briefcase</h3>',
					'<div class="clickable btn save-btn"><a href="#">Save</a></div>',
					'<div style="width:0;height:0;clear:both;"></div>',
				'</div>',
				'<div class="workbook-details">',
					'<div class="publication-title">{[this.getPublicationTitle()]}</div>',
					'<div class="pub-folder-details">',	    		
						'<div class="thumbnail-image">',
							'<img src="{publicationDetails.thumbnailURI}"></img>',
						'</div>',
						'<div class="workbook-folders-details">',		    			
							'<div class="workbook-folders-cmbo"></div>',
							'<div class="new-folder"></div>',						
							'<div class="folder-comments"></div>',    							
						'</div>',			
					'</div>',
				'</div>',
			'</div>',
				{				
				getPublicationTitle: function() {
		    			return me.pubTitle;
		    		}
		    }),
		     alternateWorkbookTpl : new Ext.XTemplate(
		        	'<p style="text-align:left" class="alternateWorkbookTpl">',
		        		'Unable to get your briefcase details. Please go to ',
		        		'<a href="#" onclick="window.open(\'/BC/barcaplive?url=%2FBC%2FS%2Fworkbook%2Ffoldersclippings&menuCode=MENU_FI_WELCOME\', \'\', \'\'); return false;">',
		        			'<b class="cat">Briefcase</b>',
		        		'</a>',
		        		' to manage your briefcase items.',
		    		'</p>'
			),	
		    msgTpl:new Ext.XTemplate('<div class="message-container">',
					'<p>{msg}',
						'<tpl if="this.getFolderName(values).length &gt; 0">',
		    				'<b> "{folderName}" </b>',		    				
		    			'</tpl>',
	    			'</p>',
				'</div>',{
		    	getFolderName:function(values) {
		    			return values.folderName;
		    		}
		    	}
			)
		});
		me.callParent(arguments);
	},
	afterRender:function() {
		this.callParent(arguments);
		this.getEl().on({
			click : {
				scope:this,
				fn :this.handleClickableClick,
				delegate : '.clickable'
			}
		});
		this.getPublicationDetails();
	},
	getPublicationDetails: function() {
		var me = this;
		var publicationDetailsObj = {};
		Ext.Ajax.request({
			url: "/RSL/servlets/dv.search?characterSet=UTF-8&resultDetail=MOBILE&outputFormat=JSON&applicationID=DOCVIEW&dateRange=25+years&ignoreMobileLanguage=YES",
			scope: this,
			method: 'GET',
			params: {'pubIDSearch': me.pubId},
			success: function(response,opts){
				var retObj = Ext.decode(Ext.String.trim(response.responseText));
				var msgObj = {};
				if (retObj && retObj.RESEARCH && retObj.RESEARCH.LINK) {
					var linkDetails = retObj.RESEARCH.LINK;
					publicationDetailsObj.pubID = linkDetails.PUBID;
					publicationDetailsObj.pubDate = linkDetails.PUBDATE;
					publicationDetailsObj.pubTitle = linkDetails.TITLE_MIXED;
					publicationDetailsObj.thumbnailURI  = linkDetails.THUMBNAIL_IMAGE_URL;
					publicationDetailsObj.fromURI = linkDetails.URI;
					var tagDetails = linkDetails.TAG;
					for (var i = 0, len = tagDetails.length; i < len ; i++) {
						if(tagDetails[i].TAGTYPE === "L1_TITLE") {
							publicationDetailsObj.level1Title = tagDetails[i].TAGVALUE;
						} else if(tagDetails[i].TAGTYPE === "L2_TITLE") {
							publicationDetailsObj.level2Title = tagDetails[i].TAGVALUE;
						}
					}
					if(linkDetails.FILETYPE && linkDetails.FILETYPE.length > 0 && linkDetails.FILETYPE.toUpperCase() == "HTM") {
						publicationDetailsObj.type = "Web";
					} else {
						publicationDetailsObj.type = "Publication";
					}
					me.publicationDetails = publicationDetailsObj;
					me.workbookItemLookup();
				} else {
					me.alternateWorkbookTpl.overwrite(me.getEl().down(".content-items"));
				}
			},
		    failure: function(response,opts){
				me.displayMsgDialog({msg:"Briefcase operation failed. Please try again later"});
		    }
		});
	},
	workbookItemLookup:function() {
		var me = this;
		Ext.Ajax.request({
			url: "/BC/S/workbook/folders",
			scope: this,
			method: 'GET',
			success: function(response,opts){
				if (!Ext.isEmpty(response.responseText)) {
					var retObj = Ext.decode(Ext.String.trim(response.responseText));
				}
				me.contentTpl.overwrite(me.getEl().down(".content-items"), {publicationDetails:me.publicationDetails});
				var workfolderCmbContainerComp = Ext.ComponentQuery.query('container[cls=workbookCmbContainer]');
				if (workfolderCmbContainerComp.length > 0) {
					Ext.getCmp(Ext.ComponentQuery.query('container[cls=workbookCmbContainer]')[0].id).destroy();
					Ext.getCmp(Ext.ComponentQuery.query('textfield[cls=new-folder-name-text]')[0].id).destroy();
					Ext.getCmp(Ext.ComponentQuery.query('textarea[cls=comments-text]')[0].id).destroy();
				}				
				var workbookFoldersPlaceHolderEle = me.getEl().down(".workbook-folders-cmbo");
				var cmbContainer = Ext.create('Ext.Container', {
					cls:'workbookCmbContainer',	
					renderTo:workbookFoldersPlaceHolderEle
				});
				this.folders = retObj.folders; 
				this.workbookFolderCombo = Ext.create('com.barclays.PubSubscription.view.WorkbookFolders', {
					storeData:retObj.folders,
					parentContainer:me
				});
				cmbContainer.add(this.workbookFolderCombo);
				
				var createFolderPlaceHolderEle = me.getEl().down(".new-folder");
				this.wbFolderTxtComp = Ext.create("Ext.form.field.Text", {
					name: 'txtNewFolderName',
					hideMode:'visibility',
					emptyText: 'New Folder Name',
					cls: 'new-folder-name-text',	
					hidden:true,				
					renderTo:createFolderPlaceHolderEle,
					enableKeyEvents:true,
					listeners:{
						keyup:function(obj) {
							var saveBtn = Ext.get(Ext.DomQuery.selectNode(".save-btn",me.getEl().dom));
							if(obj.getValue().length > 0) {
								if(saveBtn.hasCls("subscribe-btn-disabled")) {
									saveBtn.removeCls("subscribe-btn-disabled");
								}
							} else {
								if(!saveBtn.hasCls("subscribe-btn-disabled")) {
									saveBtn.addCls("subscribe-btn-disabled");
								}
							}
						}
					}
				});
				var folderCommentsPlaceHolderEle = me.getEl().down(".folder-comments");
				this.wbFolderTxtAreaComp = Ext.create("Ext.form.field.TextArea", {
					name: 'txtFolderComments',
					emptyText: 'Comment',
					cls: 'comments-text',
					renderTo:folderCommentsPlaceHolderEle
				});
				
				me.doComponentLayout();
				me.parentContainer.fireEvent("resizeBody");
			},
		    failure: function(response,opts){
				me.displayMsgDialog({msg:"Briefcase operation failed. Please try again later"});
		    }
		});
	},
	handleClickableClick:function(e,t) {
		e.preventDefault();
		var me = this;
		var element = Ext.get(t);
		if(element.hasCls("cancel-btn")) {
			watchGlobalEvent.fireEvent("removeActiveSelection");
			me.parentContainer.hideFlyoutPanel();
		} else if(element.hasCls("save-btn") && !element.hasCls("subscribe-btn-disabled")) {
			var folderId = this.workbookFolderCombo.getValue();
			if (folderId == -1) {
				var folderName = this.wbFolderTxtComp.getValue();
				if(me.validate(folderName)) {
					this.parentContainer.hideFlyoutPanel();
					me.createFolder(folderName);
				}
			} else if (folderId != null){
				me.updateFolder();
			}
		}
		return false;
	},
	validate:function(folderName) {
		var me = this;
		var folders = this.folders;
		for(var i = 0, len = folders.length; i < len; i++) {
			if(folders[i].name.toUpperCase() == folderName.toUpperCase()) {
				if(!this.alertPanel) {
					this.mask  = new Ext.LoadMask(this.getEl().down(".workbook-details"),{msg:"Please wait...",msgCls:'alert-mask-msg'});
					this.alertPanel = this.targetWindow.WatchUtils.getAlertPanel(me);
				}
				try {
					this.mask.show();
				} catch(e) {}
				this.alertPanel.alert("A folder already exists with that name, please try another name");
				var pos = me.getPosition();
				var x = pos[0] + (me.getWidth() - me.alertPanel.getWidth())/2;
				var y = pos[1] + (me.getHeight() - me.alertPanel.getHeight())/2;
				me.alertPanel.setPosition(x,y);
				//(new Ext.ZIndexManager(me.getEl())).bringToFront(me.alertPanel);
				return false;
			}
		}
		return true;
	},
	getFolderDetailsToUpdate: function(folderId) {
		var folderDetails = {};
		if ((folderId) && (!Ext.isEmpty(folderId))) {
			folderDetails.folderId = folderId;
			folderDetails.folderName = this.wbFolderTxtComp.getValue();
		} else {
			folderDetails.folderId = this.workbookFolderCombo.getValue();
			folderDetails.folderName = this.workbookFolderCombo.rawValue;			
		}
		folderDetails.comments = this.wbFolderTxtAreaComp.getValue();
		return folderDetails;
	},
	updateFolder: function(folderId) {
		var me = this;		
		//me.displayMsgDialog({msg: 'Updating Workbook...'});
		var userEnteredDetails = me.getFolderDetailsToUpdate(folderId);		
		
		var publicationDetailsObj = {};
		publicationDetailsObj.fromId= me.publicationDetails.pubID;
		publicationDetailsObj.clippingType= me.publicationDetails.type;
		publicationDetailsObj.fromTitle= me.publicationDetails.pubTitle;
		publicationDetailsObj.date= me.publicationDetails.pubDate;
		publicationDetailsObj.fromURI = me.publicationDetails.fromURI;
		publicationDetailsObj.thumbnailURI  = me.publicationDetails.thumbnailURI;
		publicationDetailsObj.fromSourceLogo  = me.publicationDetails.fromSourceLogo;
		if(me.publicationDetails.level1Title && me.publicationDetails.level1Title.length > 0) {
			publicationDetailsObj.heading1 =me.publicationDetails.level1Title;
		}
		if(me.publicationDetails.level2Title && me.publicationDetails.level2Title.length > 0) {
			publicationDetailsObj.heading2 =me.publicationDetails.level2Title;
		}
		if (userEnteredDetails.comments && userEnteredDetails.comments.length > 0) {
			publicationDetailsObj.comments = userEnteredDetails.comments;
		}
		publicationDetailsObj.params = {
				pubDate:me.publicationDetails.pubDate,
				id:me.publicationDetails.pubID
		};
		var paramsJsonData = Ext.JSON.encode(publicationDetailsObj);

		this.showMask();
		Ext.Ajax.request({
			url: "/BC/S/workbook/folder/" + userEnteredDetails.folderId + "/clippings/",
			scope: this,
			params: paramsJsonData,
			method: 'PUT',
			headers : {'Content-Type': 'application/json'},
			success: function(response,opts){
				var retObj = Ext.decode(Ext.String.trim(response.responseText));
				var msgObj = {};
				if (retObj.id) {
					msgObj.msg = "<a onclick=\"window.open('/BC/barcaplive?url=%2FBC%2FS%2Fworkbook%2Ffoldersclippings&menuCode=MENU_FI_WELCOME'); return false;\" href='#'>" + userEnteredDetails.folderName + "</a> folder has been updated";
				} else {
					msgObj.msg = "Briefcase operation failed. Please try again later";
				}
				this.hideMask();
				this.parentContainer.hideFlyoutPanel();
				me.displayMsgDialog(msgObj);
			},
		    failure: function(response,opts){		
		    	this.hideMask();
				var retObj = Ext.decode(Ext.String.trim(response.responseText));
				if (retObj.code === "OPERATION_DENIED" && retObj.message === "Duplicate Clipping") {
					if(!this.alertPanel) {
						this.mask  = new Ext.LoadMask(this.getEl().down(".workbook-details"),{msg:"Please wait...",msgCls:'alert-mask-msg'});
						this.alertPanel = this.targetWindow.WatchUtils.getAlertPanel(me);
					}
					try{
						this.mask.show();
					} catch(e){}
					this.alertPanel.alert("This publication already exists in the folder you have selected.");
					var pos = me.getPosition();
					var x = pos[0] + (me.getWidth() - me.alertPanel.getWidth())/2;
					var y = pos[1] + (me.getHeight() - me.alertPanel.getHeight())/2;
					me.alertPanel.setPosition(x,y);
					//(new Ext.ZIndexManager(me.getEl())).bringToFront(me.alertPanel);
					return false;
				} 
				me.displayMsgDialog({msg:"Briefcase operation failed. Please try again later"});
		    }
		});
	},
	showMask:function() {
        if(!this.loadMask) {
        	this.loadMask =  new Ext.LoadMask(this.getEl(),{
        		msg:"Please wait..."
        	});
        }
        this.loadMask.show();
	},
	hideMask:function() {
		 if(this.loadMask) {
			 this.loadMask.hide();
		 }
	},
	createFolder: function(folderName) {
		var me = this;
		me.displayMsgDialog({msg: 'Updating Briefcase...'});
		var params = {};
		params.name = folderName;
		var paramsJsonData = Ext.JSON.encode(params);
		Ext.Ajax.request({
			url: "/BC/S/workbook/folders",
			scope: this,
			params: paramsJsonData,
			method: 'PUT',
		    headers : {'Content-Type': 'application/json'},
			success: function(response,opts){
		    		var statusText = Ext.String.trim(response.statusText);				
				var msgObj = {};
				if (statusText == 'Created') {
					var responseText = Ext.decode(response.responseText);
					//msgObj.msg = "New folder <b>" + folderName + "</b> has been created sucessfully ";
					me.updateFolder(responseText.id);
				} else {
					msgObj.msg = "Briefcase operation failed. Please try again later";
					me.displayMsgDialog(msgObj);
				}				
			},
		    failure: function(response,opts){
				me.displayMsgDialog({msg:"Briefcase operation failed. Please try again later"});
		    }
		});
	},
	toggleNewFolderTextControl: function(value) {
		var saveBtn = Ext.get(Ext.DomQuery.selectNode(".save-btn",this.getEl().dom));
		if (value == -1) {
			if(!saveBtn.hasCls("subscribe-btn-disabled")) {
				saveBtn.addCls("subscribe-btn-disabled");
			}
			this.wbFolderTxtComp.show();			
		} else {
			if(saveBtn.hasCls("subscribe-btn-disabled")) {
				saveBtn.removeCls("subscribe-btn-disabled");
			}
			this.wbFolderTxtComp.hide();	
			this.wbFolderTxtComp.setValue("");
		}
	},
	displayMsgDialog : function(msg,tplName){		
		watchGlobalEvent.fireEvent("removeActiveSelection");
		var popupRect = WatchUtils.findInPagePopupRect(400,200);
		if(!this.confPanel) {
			this.confPanel = this.targetWindow.WatchUtils.getConfPanel();
		} 
		this.confPanel.setPosition( popupRect.x ,  popupRect.y);
		this.confPanel .show();
		this.msgTpl.overwrite(this.confPanel.getEl().down(".content"),msg);
		this.confPanel.doComponentLayout();
	}	
});

Ext.define('com.barclays.PubSubscription.view.WorkbookFolders' ,{
	extend:'Ext.form.ComboBox',
	alias: 'widget.workbookFolders',
	queryMode: 'local',
	itemId:'workbookCmb',
	cls:'workbookCmb',
	width:260,
	editable:false,
	valueField:'id',
	displayField:'name',
	listConfig: {
		cls:'workbook-bound-list',
		shadow:false
	},
	tpl: new Ext.XTemplate(
			'<ul class="workbook-folders-items">',
				'<tpl for=".">',
	            	'<li class="x-boundlist-item workbook-folders-items {[this.addCls(xindex)]}">',
	            		'<div style="cursor:pointer;" class="workbook-folders-items" style="width:192px;">{name}</div>',
	            	'</li>',
				'</tpl>',
			'</ul>', {
				addCls:function(index) {
					return index %2 == 0 ? "workbook-folder-item-even" : "workbook-folder-item-odd";
				}
			}
	),
	store: new Ext.data.Store({
		data:[],
		fields:['id','name']
    }),
	listeners:{
		select:function(obj, records) {
			Ext.EventObject.stopEvent();
			var value = obj.getValue();
			this.parentContainer.toggleNewFolderTextControl(value);
		},
		expand: function(field) {		
			var me =this;
			var x = me.getPicker().x - 1;
            var workbookCmbEL = me.parentContainer.getEl().down(".workbookCmbContainer");
            var y = (workbookCmbEL.getY() + workbookCmbEL.getHeight()) - 2;
			me.getPicker().setPosition(x,y);
			setTimeout(function(){
				me.mon(me.parentContainer.getEl(), 'click', me.handleClick,me);				
			},10);
		},
		collapse: function(field) {			
			this.mun(this.parentContainer.getEl(), 'click', this.handleClick);
		}
	},
	handleClick:function() {
		this.collapse();
	},
	beforeRender: function() {		
		this.callParent(arguments);
		this.listConfig.renderTo = this.parentContainer.inPage ? Ext.getBody() : window.parent.document.body;				
	},
	afterRender:function() {
		this.callParent(arguments);
		var me = this;
		this.store.loadData(this.storeData);		
		this.store.sort('name','ASC');
		var defaultFolderIndex = (this.store.find('name','My Folder') != -1) ? this.store.find('name','My Folder') : 0;
		if (this.store.getAt(defaultFolderIndex)) {
			this.setValue(this.store.getAt(defaultFolderIndex).get('id'));
		}
		this.store.insert(0,{'id':-1, 'name':'Add a New Folder'});
	}
});

Ext.define('com.barclays.DV.view.tap.sharenew.FlyoutShareNewToolActionPanel' ,{
	extend : 'Ext.Component',
	cls: 'flyoutItemPanel flyOut flyoutShareNewToolActionPanel',
	floating:true,
	shadow:false,
	data:[],
	initComponent:function() {
		var me = this;
		Ext.applyIf(me, {
		    tpl: new Ext.XTemplate('<div class="content">',
			    		'<img class="{[this.addCls()]}" src="/RSR_S/nyfipubs/barcap/images/iconsUtility/talkBubbleWhite_top.png"/>',
			    		'<div class="content-items">',
			    			'<ul>',
			    				'<tpl if="this.showViewDocuments()">',
			    					'<li type="viewDocument" class="view-document viewDocumenteIcon clickable"><a href="#"><span>View</span></a></li>',
			    				'</tpl>',
			    				'<tpl if="this.isNotAnalystSubscribe() && this.isMResearchAllow() && !this.isMResearchDeny()">',
		    						'<li type="watch" class="watch watchIcon clickable"><a href="#"><span>Watch</span></a></li>',
		    						'<li type="addToWorkBook" class="addToWorkBook addToWorkBookIcon clickable"><a href="#"><span>Add to Briefcase</span></a></li>',
		    					'</tpl>',
		    					'<li type="subscribeMe" class="subscribe-me subscribeMeIcon clickable"><a href="#"><span>Subscribe</span></a></li>',
		    					'<tpl if="this.isNotAnalystSubscribe()">',
				    				'<li type="emailMe" class="emailMe emailMeIcon clickable"><a href="#"><span>Email Me</span></a></li>',
			    					'<tpl if="this.isMResearchAllow() && !this.isMResearchDeny()">',
			    						'<li type="shareTool" class="shareTool shareToolIcon clickable"><a href="#"><span>Share</span></a></li>',
			    					'</tpl>',
									'<tpl if="this.showLibrary()">',
			    						'<li type="library" class="library libraryIcon clickable"><a href="#"><span>Library</span></a></li>',
			    					'</tpl>',
		    					'</tpl>',
		    					'<tpl if="this.showPrint()">',
		    						'<li type="print" class="print printIcon clickable"><a href="#"><span>Print</span></a></li>',
		    					'</tpl>',
			    				'<tpl if="this.isEmployee() && !this.isWealthEmployee()">',
	    							'<li class="internal">INTERNAL</li>',
				    				'<li type="subscribeClient" class="subscribe-client subscribeClientIcon clickable"><a href="#"><span>Subscribe Client</span></a></li>',
				    				'<tpl if="this.isNotAnalystSubscribe()">',
				    					'<li type="emailTool" class="emailTool emailToolIcon clickable"><a href="#"><span>Email Tool</span></a></li>',
				    					'<tpl if="this.showAdmin()">',
				    						'<li type="pubMaintLink" class="pubMaintLink pubMaintLinkIcon clickable"><a href="#"><span>Document Admin</span></a></li>',
				    					'</tpl>',
				    					'<li type="encodedLink" class="encodedLink encodedLinkIcon clickable"><a href="#"><span>Link</span></a></li>',				    					
				    				'</tpl>',
			    				'</tpl>',
			    			'</ul>',
		    			'</div>',
			'</div>',
            '<tpl if="this.needIframe()">',
            	'<iframe class="iframeshimFlyoutPanel iframeshimFlyoutSubscribePanel" frameborder="0" scrolling="no">',
					'<html><head></head><body></body></html>',
				'</iframe>',
			'</tpl>',{
				needIframe : function(){
					return WatchUtils.isIframeShimRequired();
				},
				isEmployee:function() {
					return me.isEmployee;
				},
				isWealthEmployee:function() {
					return me.isWealthEmployee;
				},
				showLibrary:function() {
					return me.libraryURL && me.libraryURL.length > 0;
				},
		    	addCls:function() {
	    			return me.inPage ? 'leftBubbleTop' : "rightBubbleTop";
	    		},
	    		isNotAnalystSubscribe:function() {
	    			return !me.analystSubscribe;
	    		},
	    		isMResearchDeny:function() {
	    			return me.isMResearchDeny;
	    		},
	    		isMResearchAllow:function() {
	    			return me.isMResearchAllow;
	    		},
	    		showViewDocuments:function() {
	    			return me.publicationURI && me.publicationURI.length > 0;
	    		},
	    		showPrint:function() {
	    			return me.showPrint;
	    		},
	    		showAdmin:function() {
	    			return me.inPage;
	    		}
		    })
		});
		me.callParent(arguments);
	},
	afterRender:function() {
		this.callParent(arguments);
		this.getEl().on({
			click : {
				scope:this,
				fn :this.handleClickableClick,
				delegate : '.clickable',
				stopPropagation:true
			}
		});
	},
	handleClickableClick:function(e,t) {
		e.preventDefault();
		var me = this;
		var type = t.getAttribute("type");
		if(type == "watch" || type == "subscribeMe" || 
				type == "subscribeClient" || type == "addToWorkBook") {
			this.parentContainer.fireEvent("flyOut",{
				type:type
			});	
		} else {
			watchGlobalEvent.fireEvent("removeActiveSelection");
			me.parentContainer.hideFlyoutPanel();
			if(type == "emailMe") {
				me.targetWindow.ActionUtils.sendEmail(me.pubId,me.pubTitle);		
			} else if(type == "emailTool") {
				sendDVAdhocEmail(me.pubId,me.docId,me.pubTitle);				
			} else if(type == "print") {
				me.targetWindow.ActionUtils.printPublication(me.pubId,me.pubTitle);		
			}else if(type == "shareTool") {
				Ext.Ajax.request({
					url: "/RSL/servlets/dv.search?characterSet=UTF-8&resultDetail=MOBILE&outputFormat=JSON&applicationID=DOCVIEW&dateRange=25+years&ignoreMobileLanguage=YES",
					scope: this,
					method: 'GET',
					params: {'pubIDSearch': me.pubId},
					success: function(response,opts){
						var retObj = Ext.decode(Ext.String.trim(response.responseText));
						var msgObj = {};
						if (retObj && retObj.RESEARCH && retObj.RESEARCH.LINK) {
							var linkDetails = retObj.RESEARCH.LINK;
							var publicationItems = [];
							var publicationDetailsObj = {};
							if(linkDetails.FILETYPE && linkDetails.FILETYPE.length > 0 && linkDetails.FILETYPE.toUpperCase() == "HTM") {
								publicationDetailsObj.type = "Web";
							} else {
								publicationDetailsObj.type = "Publication";
							}
							publicationDetailsObj.id= me.pubId;
							publicationDetailsObj.date= Ext.Date.parse(linkDetails.PUBDATE,"m/d/y");
							publicationDetailsObj.url = linkDetails.URI;
							publicationDetailsObj.thumbnailURI  = linkDetails.THUMBNAIL_IMAGE_URL;
							publicationDetailsObj.summary = linkDetails.SUMMARY;
							var tagDetails = linkDetails.TAG;
							for (var i = 0, len = tagDetails.length; i < len ; i++) {
								if(tagDetails[i].TAGTYPE === "L1_TITLE") {
									publicationDetailsObj.heading1 = tagDetails[i].TAGVALUE;
								} else if(tagDetails[i].TAGTYPE === "L2_TITLE") {
									publicationDetailsObj.heading2 = tagDetails[i].TAGVALUE;
								}
							}
							publicationItems[0] = publicationDetailsObj;
							if(me.inPage) {
								addToShare({
									items:publicationItems
								},{
									isPopup:me.inPage ? false : true
								});
							} else {
								window.parent.addToShare({
									items:publicationItems
								},{
									isPopup:me.inPage ? false : true
								},me.portalShareCallBack);
								if(WatchUtils.isIframeShimRequired() && Ext.isChrome) {
									WatchUtils.insertIframeForChrome("100%","100%","0px");
								}
							}
						} 
					},
				    failure: function(response,opts){

				    }
				}); 
			} if(type == "viewDocument") {
				DVOpenWindow(me.publicationURI,0,0,'');
			} else if(type == "encodedLink") {
				me.targetWindow.ActionUtils.getEncodedLink(me.pubId);
			} else if(type == "addToOutlook") {
				DVOpenWindow(me.outlookUri,0,0,'');
			} else if(type == "library") {
				DVOpenWindow(me.libraryURL,0,0,'');
			} else if(type == "pubMaintLink") {
				if(!me.adminPubId) {
					me.adminPubId = me.pubId;
				}
				var adminURL = "/DDS/cgi-bin/nph-dvMaintenance.pl?pubId=" + me.adminPubId;
				DVOpenWindow(adminURL,1100, 900,'MAINTENANCE_' + me.adminPubId);
			}
		}
		return false;
	},
	portalShareCallBack:function() {
		var me = this;
		if(WatchUtils.isIframeShimRequired() && Ext.isChrome) {
			var el =Ext.get(window.parent.document.getElementById("compose-panel-container"));
			if(!el) {
				WatchUtils.removeIframeForChrome();
			} else {
				setTimeout(function() {
					WatchUtils.removeIframeForChrome();
				},2000);	
			}
		}
	}
});


Ext.define('com.barclays.DV.view.sharenew.ShareNewToolActionPanel' ,{
	extend : 'Ext.Component',
	alias:'widget.shareNewToolActionPanel',
	cls:'shareNewToolActionPanel',
	config: {
		isEmployee: false,
		isWealthEmployee: false,
		isHNWClient: false,
		isBarcorpRetail: false,
		isQuickLinksEnabled:false,
		isMResearchDeny:false,
		isMResearchAllow:false,
		showPrint:false,
		userLogin: '',
		pubId: '',
		publicationURI:'',
		docId: '',
		pubTitle: '',
		outlookUri:'',
		targetWindow: '',
		subscriptionVals:[]
	},
	initComponent:function() {
		var me = this;
		me.addEvents("subscribe","action");
		me.on("subscribe",me.subscribe);
		me.on("action",me.action);
		me.on("flyOut",me.flyout);
		me.on("resizeBody",me.resizeBody);
		this.relayEvents(watchGlobalEvent,["hideActivePanel"]);
    	WatchUtils.setHNWClient(this.isHNWClient);
    	WatchUtils.setBarcorpRetail(this.isBarcorpRetail);
    	Ext.EventManager.onWindowResize(this.handleWatchResize, me);
		var me = this;
		Ext.applyIf(me, {
		    inPageTpl : new Ext.XTemplate('<div class="clickable watch-list inPage">',
		    			'<ul style="overflow:auto">',
		    				'<tpl if="this.showQuickLinks()">',
		    					'<li type="quickLinks" id="{[this.getQuickLinksId()]}" class="quickLinks quickLinksIcon clickable {[this.addQuickLinkState(values)]}"><a href="#"></a></li>',
		    				'</tpl>',
		    				'<li type="flyout" class="action actionIcon clickable"><a href="#"></a></li>',
		    			'</ul>',
		    			'<div style="clear:both"></div>',
	    			'</div>',{
					addQuickLinkState:function(values) {
						return values.isQuickLinksEnabled ? "quickLinksActiveIcon" : "";
					},
					showQuickLinks:function() {
						return me.isMResearchAllow && !me.isMResearchDeny;
					},
					getQuickLinksId:function() {
						return (me.sourceElementId && me.sourceElementId .length > 0) ? "quicklinks_" + me.sourceElementId : "quicklinks_" + me.pubId;
					}
	    		}
		    ),
		    popupTpl : new Ext.XTemplate('<div class="clickable watch-list popup">',
						'<ul>',
							'<tpl if="this.showQuickLinks()">',
								'<li type="quickLinks" id="quicklinks_{pubId}" class="quickLinks quickLinksIcon clickable {[this.addQuickLinkState(values)]}"><a href="#"></a></li>',
							'</tpl>',
							'<li type="flyout" class="action actionIcon clickable"><a href="#"></a></li>',
						'</ul>',
						'<div style="clear:both"></div>',
					'</div>',{
					addQuickLinkState:function(values) {
						return values.isQuickLinksEnabled ? "quickLinksActiveIcon" : "";
					},
					showQuickLinks:function() {
						return me.isMResearchAllow && !me.isMResearchDeny;
					}
				}
		    ),
		    analystSubscribeTpl : new Ext.XTemplate('<div class="clickable analystSubscribeIcon inPage">',
					'<div type="analyst-subscribe-flyout"  style="margin-top:-4px; !important;" class="analystSubscribe subscribe subscribeIcon clickable"><a href="#"></a></div>',
					'<span style="display:inline-block" type="analyst-subscribe-flyout" class="analystSubscribe subscribeText clickable">Subscribe</span>',
				'</div>'
		    )			
		});
		me.callParent(arguments);
	},
    afterRender : function() {
		this.callParent(arguments);
		if(this.inPage) {
			if (this.isSubscribeAnalyst) {
				this.analystSubscribeTpl.overwrite(this.getEl(),{});
			} else {
				this.inPageTpl.overwrite(this.getEl(),{
					pubId:this.pubId,
					isQuickLinksEnabled:this.isQuickLinksEnabled
				});
			}
		} else {
			this.popupTpl.overwrite(this.getEl(),{
				pubId:this.pubId,
				isQuickLinksEnabled:this.isQuickLinksEnabled
			});
		}
		this.getEl().on({
			click : {
				scope:this,
				fn :this.handleClickableClick,
				delegate : '.clickable',
				stopPropagation:true
			}
		});
	},
	handleClickableClick:function(e,t) {
		e.preventDefault();
		var me = this;
		var element = Ext.get(t);
		if(element.hasCls("action") || element.hasCls("analystSubscribe")) {
			watchGlobalEvent.fireEvent("removeActiveSelection");
			var type = t.getAttribute("type");
			this.selectedElement =  Ext.get(t);
			me.showFlyoutPanel(type);
		} else if(element.hasCls("quickLinks")) {
			watchGlobalEvent.fireEvent("hideActivePanel");
			Ext.Ajax.request({
				url: "/RSL/servlets/dv.search?characterSet=UTF-8&resultDetail=MOBILE&outputFormat=JSON&applicationID=DOCVIEW&dateRange=25+years&ignoreMobileLanguage=YES",
				scope: this,
				method: 'GET',
				params: {'pubIDSearch': this.pubId},
				success: function(response,opts){
					var retObj = Ext.decode(Ext.String.trim(response.responseText));
					var msgObj = {};
					if (retObj && retObj.RESEARCH && retObj.RESEARCH.LINK) {
						var linkDetails = retObj.RESEARCH.LINK;
						var publicationDetailsObj = {};
						if(linkDetails.FILETYPE && linkDetails.FILETYPE.length > 0 && linkDetails.FILETYPE.toUpperCase() == "HTM") {
							publicationDetailsObj.type = "Web";
						} else {
							publicationDetailsObj.type = "Publication";
						}
						publicationDetailsObj.id= linkDetails.PUBID;
						publicationDetailsObj.documentId= linkDetails.DOCID;
						publicationDetailsObj.date= Ext.Date.format(Ext.Date.parse(linkDetails.PUBDATE,"m/d/y"),"m/d/Y");
						publicationDetailsObj.url = linkDetails.URI;
						publicationDetailsObj.thumbnailURI  = linkDetails.THUMBNAIL_IMAGE_URL;
						publicationDetailsObj.summary = linkDetails.SUMMARY;
						publicationDetailsObj.sourceElementId = t.getAttribute("id");
						var tagDetails = linkDetails.TAG;
						for (var i = 0, len = tagDetails.length; i < len ; i++) {
							if(tagDetails[i].TAGTYPE === "L1_TITLE") {
								publicationDetailsObj.heading1 = tagDetails[i].TAGVALUE;
							} else if(tagDetails[i].TAGTYPE === "L2_TITLE") {
								publicationDetailsObj.heading2 = tagDetails[i].TAGVALUE;
							}
						}
						var options = {
								isPopup:this.inPage ? false: true,
								iconCls:'quickLinksActiveIcon'
						};
						if(!this.inPage) {
							options.iFrameId = 'popupLogo';
						}
						if(window.addToQuickLinks) {
							addToQuickLinks(publicationDetailsObj,options,e);
						} else {
							window.parent.addToQuickLinks(publicationDetailsObj,options,e);
						}

					} 
				},
			    failure: function(response,opts){
					me.displayMsgDialog({msg:"Share failed. Please try again later"});
			    }
			}); 
		}
		return false;
	},
	showFlyoutPanel:function(type,extraParams,e,t) {
		var me = this;
		if(me.activePanel == type) {
			watchGlobalEvent.fireEvent("hideActivePanel");
			return;
		}
		watchGlobalEvent.fireEvent("hideActivePanel");
		me.on("hideActivePanel",me.hideFlyoutPanel,me);
		var bodyEl = me.targetWindow.document.body;
		if(type == "flyout" || (me.isEmployee && !me.isWealthEmployee && type == "analyst-subscribe-flyout")) {
			me.activePanel = type;
			me.currentPanel  = Ext.create("com.barclays.DV.view.tap.sharenew.FlyoutShareNewToolActionPanel",{
				renderTo:bodyEl,
				parentContainer:me,
    			pubId:me.pubId,
    			adminPubId:me.adminPubId,
    			publicationURI:me.publicationURI,
    			pubTitle:me.pubTitle,
    			docId:me.docId,
				outlookUri:me.outlookUri,
				inPage:me.inPage,
				isEmployee:me.isEmployee,
				isWealthEmployee: me.isWealthEmployee,
				isMResearchDeny:me.isMResearchDeny,
				isMResearchAllow:me.isMResearchAllow,
				targetWindow:me.targetWindow,
				libraryURL:me.libraryURL,
				showPrint:me.showPrint,
				analystSubscribe: (type == "analyst-subscribe-flyout") ? true : false
			});
			me.setPos();
			me.resizeBody();
		} else if(type == "watch") {
			me.activePanel = "watch";
			me.currentPanel  = Ext.create("com.barclays.DV.view.tap.sharenew.WatchItemPanel",{
				renderTo:bodyEl,
				parentContainer:me,
    			pubId:me.pubId,
    			isMultipart:me.isMultipart,
    			inPage:me.inPage,
    			targetWindow:me.targetWindow
    		});
			me.setPos();
			me.resizeBody();
		}  else if((!me.isEmployee && type == "subscribe") 
				|| (!me.isEmployee && type == "analyst-subscribe-flyout") 
				|| (me.isWealthEmployee && type == "analyst-subscribe-flyout") 
				|| type == "subscribeMe") {
			me.activePanel = "subscribeMe";
			me.currentPanel  = Ext.create("com.barclays.DV.view.tap.sharenew.SubscriptionItemPanel",{
				renderTo:bodyEl,
				parentContainer:me,
    			pubId:me.pubId,
    			inPage:me.inPage,
				isWealthEmployee: me.isWealthEmployee,
				isMResearchDeny:me.isMResearchDeny,
				isMResearchAllow:me.isMResearchAllow,
    			isMultipart:me.isMultipart,
    			forBCLIds:(extraParams) ? extraParams.forBCLIds : [],
    			targetWindow:me.targetWindow,
    			subscriptionVals:me.subscriptionVals
    		});
			me.setPos();
			me.resizeBody();
		} else if(type == "subscribeClient") {
			me.activePanel = "subscribeClient";
			me.currentPanel = me.targetWindow.WatchUtils.getSubscribeClientPanel({
				parentContainer:me,
    			pubId:me.pubId,
    			inPage:me.inPage,
				isWealthEmployee: me.isWealthEmployee,
				isMResearchDeny:me.isMResearchDeny,
				isMResearchAllow:me.isMResearchAllow,
    			isMultipart:me.isMultipart,
    			targetWindow:me.targetWindow,
    			subscriptionVals:me.subscriptionVals
			});
			me.currentPanel.show();
			me.setPos();
			me.resizeBody("subscribe_client");
		} else if(type == "addToWorkBook") {
				me.activePanel = "addToWorkBook";
				me.currentPanel  = Ext.create("com.barclays.DV.view.tap.sharenew.WorkBookItemPanel",{
					renderTo:bodyEl,
					parentContainer:me,
	    			pubId:me.pubId,
	    			pubTitle:me.pubTitle,
	    			inPage:me.inPage,
	    			targetWindow:me.targetWindow
	    		});
				me.setPos();
				me.resizeBody();
		}
		setTimeout(function() {
			Ext.getBody().on("click",me.hidePanel,me);
		},1);
	},
	resizeBody:function(type) {
		var me= this;
		if(this.inPage) {
			var bodyHeight = Ext.getBody().getHeight();
			var currentPanelBottomPos = this.currentPanel.getEl().getY() + this.currentPanel.getHeight();
			currentPanelBottomPos = (type == "subscribe_client") ? currentPanelBottomPos + 660 : currentPanelBottomPos;
			if(currentPanelBottomPos > bodyHeight) {
				var newHeight = bodyHeight + (currentPanelBottomPos  - bodyHeight) + 20;
				newHeight = (type == "subscribe_client") ? newHeight + 660 : newHeight;
				Ext.getBody().setHeight(newHeight);
				this.clearHeight = true;
				resizeMainWindow();
				resizeIframe();
			}
		} else {
			this.clearHeight = false;
			if(WatchUtils.isIframeShimRequired() && type != "subscribe_client") {
				var iframeshimFlyoutActionPanel = Ext.get(Ext.DomQuery.selectNode(".iframeshimFlyoutPanel",me.currentPanel.getEl().dom));
				iframeshimFlyoutActionPanel.setWidth(me.currentPanel.getWidth());
				iframeshimFlyoutActionPanel.setHeight(me.currentPanel.getHeight());
				me.currentPanel.getEl().dom.style.zIndex = 99999;
				if(Ext.isChrome) {
					var width = me.currentPanel.getWidth() + "px";
					var height = 0;
					var releatedResearchEl = Ext.get(Ext.DomQuery.selectNode(".related-research",Ext.getBody().dom));
					if(releatedResearchEl && releatedResearchEl.isVisible()) {
						height = me.currentPanel.getHeight() - 90 + "px";
					} else {
						height = me.currentPanel.getHeight() - 10 + "px";
					}
					var left = me.currentPanel.getEl().getX() + "px";
					WatchUtils.insertIframeForChrome(width,height,left);
				}
			} else if(WatchUtils.isIframeShimRequired() && type == "subscribe_client" && Ext.isChrome) {
				var width = me.currentPanel.getWidth() + "px";
				var left = me.currentPanel.getEl().getX() + "px";
				WatchUtils.insertIframeForChrome(width,"100%",left);
			}
		}
	},
	handleWatchResize: function(){
		if(this.selectedElement) {
			this.setPos();
		}
	},
	setPos:function() {
		var me = this;
		var x=0, y=0;
		var box = this.selectedElement.getBox();
		if(this.activePanel == "analyst-subscribe-flyout") {
			x = this.inPage ? box.x + box.width/2 - 35 : (box.x + box.width/2 + 32 )- this.currentPanel.getWidth();
			y = this.inPage ? box.y + box.height - 6 : box.y + box.height - 8;
			this.currentPanel.setPosition(x,y);
		} else if(this.activePanel == "subscribeClient" || 
			this.activePanel == "addToWorkBook" || 
			this.activePanel == "watch" || 
			this.activePanel == "flyout" ||
			this.activePanel == "subscribeMe") {

			x = this.calculateXValue(box.x, box.width, this.currentPanel.getWidth());			
			var bubbleTopPosition = (box.x - x) + ((box.width - 20)/2);

			if(this.inPage) {
				this.currentPanel.getEl().down(".leftBubbleTop").dom.style.marginLeft = bubbleTopPosition + "px";						
			} else {
				this.currentPanel.getEl().down(".rightBubbleTop").dom.style.marginLeft = bubbleTopPosition + "px";	;
			}
		
			y = this.inPage ? box.y + box.height - 6 : box.y + box.height - 8;
			this.currentPanel.setPosition(x , y);
		}
		setTimeout(function(){
			me.recalculatePos(me,box);
		},100);
	},
	recalculatePos:function(obj,oldBox) {
		var box = obj.selectedElement.getBox();
		if(oldBox.x != box.x) {
			obj.setPos();
		}
	},
	calculateXValue: function(currentX, currentWidth, currentPanelWidth) {
		var x = 0;
		var offSetPosition = 0;
		var bodyWidth = Ext.getBody().getWidth();
        var rightSideWidth = bodyWidth - currentX;
        var leftSideWidth = bodyWidth - rightSideWidth;
		if(this.activePanel == "subscribeClient") { 
			offSetPosition = 50;
	        if(leftSideWidth > rightSideWidth) {
	        	x = (currentPanelWidth > leftSideWidth) ? bodyWidth - (offSetPosition + currentPanelWidth) 
        											: (leftSideWidth - currentPanelWidth) + offSetPosition;
	        } else {
	        	x = (currentPanelWidth > rightSideWidth) ? bodyWidth - (offSetPosition + currentPanelWidth)
        											 : currentX - offSetPosition;
	        }
		} else {
	        offSetPosition = 5;
	        if (currentPanelWidth <  rightSideWidth + offSetPosition) {
	        	x =  currentX - offSetPosition;
	        } else {
	            x =  (leftSideWidth - currentPanelWidth) + offSetPosition + 45;
	        }
		}

		return x;
	},
	subscribe:function(params) {
		this.showFlyoutPanel(params.type,params);
	},
	action:function(params) {
		this.showFlyoutPanel(params.type);
	},
	flyout:function(params) {
		this.showFlyoutPanel(params.type);
	},
	hidePanel:function(e,t) {
		var el = this.targetWindow.Ext.getBody().down(".flyoutItemPanel");
		if(el && !el.contains(t)) {
			watchGlobalEvent.fireEvent("removeActiveSelection");
		}
		this.hideFlyoutPanel(e,t);
	},
	hideFlyoutPanel:function(e,t) {
    	var me = this;
    	var el = me.targetWindow.Ext.getBody().down(".flyoutItemPanel");
    	var tObj = Ext.get(t);
    	
    	if (tObj && (tObj.hasCls('close-icon') || tObj.hasCls('next-btn') || tObj.hasCls('workbook-folders-items'))) {
    		return false;
    	}
    	
     	if(el && !el.contains(t)) {
			me.un("hideActivePanel",me.hideFlyoutPanel,me);
			me.targetWindow.Ext.getBody().un("click",me.hidePanel,me);
    		me.activePanel = "";
    		el.dom.parentNode.removeChild(el.dom);
    		if(WatchUtils.isIframeShimRequired() && Ext.isChrome) {
    			WatchUtils.removeIframeForChrome();
    		}
    		if(this.clearHeight) {
        		Ext.getBody().dom.style.height = "";
        		resizeMainWindow();    		
        		resizeIframe();
    		}
         	el = me.targetWindow.Ext.getBody().down(".alertPanel");
         	if(el) {
         		el.dom.parentNode.removeChild(el.dom);
         	}
         	
        	el = me.targetWindow.Ext.getBody().down(".flyoutClientInfoPanel");
        	if(el) {
        		el.dom.parentNode.removeChild(el.dom);
        	}
    	}
     	
     	el = me.targetWindow.Ext.getBody().down(".shareResult");
     	if(el && !el.contains(t)) {
     		me.activePanel = "";
     		el.dom.parentNode.removeChild(el.dom);
     	}
    	return false; 
	}
});

Ext.define('PublicationUtitlityHelper',{
	alias:'PublicationUtitlityHelper',
	init:function(publicationsUtilities) {
		var me = this; 
		if(!window.publicationsUtility.userDetails) {
			me.getUserPermission(publicationsUtilities);
		} else {
			me.getPublicationDetails(publicationsUtilities);
		}
	},
	getUserPermission:function(publicationsUtilities) {
		var me = this; 
		Ext.Ajax.request({
			url: '/RSL/jsp/invokeNugget.jsp?nuggetID=GET_GROUP_MEMBERSHIP_JSON',
			method: 'get',
			success: function(response) {
				var retObj = Ext.decode(Ext.String.trim(response.responseText));
				if(retObj.permissions && retObj.permissions.length > 0) {
					var host = parent.window.location.host;
					var isEmployee = Ext.Array.contains(retObj.permissions, "EMPLOYEE_ONLY");
					var isMResearchAllow = Ext.Array.contains(retObj.permissions, "RSR_MRESEARCH");
					if(isEmployee && host.indexOf(".barclayscorporate.com") >= 0) {
						isEmployee = false;
						isMResearchAllow = false;
					}
					window.publicationsUtility.userDetails = {
							userId:retObj.user,
							permission:{
								isEmployee:isEmployee,
								isIndexClient:Ext.Array.contains(retObj.permissions, "RSR_INDEX_ONLY"),
								isWealthEmployee:Ext.Array.contains(retObj.permissions, "WEALTH_EMPLOYEE_ONLY"),
								isHNWClient:Ext.Array.contains(retObj.permissions, "RSR_WEALTH_HNW_EXCLUDE"),
								isBarcorpRetail:Ext.Array.contains(retObj.permissions, "RSR_BARCORP_RETAIL_EXCLUDE"),
								isMResearchAllow:isMResearchAllow,
								isMResearchDeny:Ext.Array.contains(retObj.permissions, "RSR_MRESEARCH_DENY")
							}
					};
					me.getPublicationDetails(publicationsUtilities);
				}
			},
			failure: function() {
				com.barclays.DV.view.Utils.showMsg("PublicationUtitlity - Error","Error while retrieving user permissions");
			}
			
		});
	},
	getPublicationDetails:function(publicationsUtilities) {
		var me = this; 
		var url = "/RSL/servlets/dv.xslProcessor?xslURL=/RSL/xsl/publicationReaderJSON.xsl&viewerTitle=0&contentType=json&characterSet=UTF-8&showSRCID=1";
		var xmlURL = "/RSL/servlets/dv.search?dateRange=25+years&resultDetail=LONG&characterSet=UTF-8&numResults=999&deptType=hidden";
		var pubIds = "";
		for(var i = 0, len = publicationsUtilities.length; i < len; i++) {
			pubIds += "&pubIDSearch=" + publicationsUtilities[i].pubId;
		}
		xmlURL += pubIds;
		Ext.Ajax.request({
			url: url,
			params:{xmlURL:xmlURL},
			scope: this,
			success: function(response,opts){
				var retObj = Ext.decode(Ext.String.trim(response.responseText));
				var publicationsMap = new Ext.util.HashMap();
				if (retObj && retObj.publications && retObj.publications.length > 0) {
					for(var i = 0, len = retObj.publications.length; i < len; i++) {
						publicationsMap.add(retObj.publications[i].pubId,retObj.publications[i]);
					}
					if(window.publicationsUtility.userDetails.permission.isMResearchAllow 
							&& !window.publicationsUtility.userDetails.permission.isMResearchDeny) {
						me.getQuickLinks(publicationsUtilities,publicationsMap);	
					} else {
						me.renderPublicationUtility(publicationsUtilities,publicationsMap,[]);						
					}
				} 
			},
		    failure: function(response,opts){
				com.barclays.DV.view.Utils.showMsg("PublicationUtitlity - Error","Error while retrieving publication details");
		    }
		}); 
	},
	getQuickLinks:function(publicationsUtilities,publicationsMap) {
		var me = this; 
		Ext.Ajax.request({
			url:'/BC/S/shareItem/getAllFromQuickLists',
			scope: this,
			success: function(response,opts){
				var quickLinks = [];
				var quickLinkObjs = Ext.decode(Ext.String.trim(response.responseText));
				for(var i = 0;i < quickLinkObjs.length; i++) {
					quickLinks[i] = quickLinkObjs[i].id;
				}
				me.renderPublicationUtility(publicationsUtilities,publicationsMap,quickLinks);
			},
		    failure: function(response,opts){
				me.renderPublicationUtility(publicationsUtilities,publicationsMap,[]);
		    }
		});
	},
	renderPublicationUtility:function(publicationsUtilities, publicationsMap,quickLinks) {
		for(var i = 0, len = publicationsUtilities.length; i < len; i++) {
			var publication = publicationsMap.get(publicationsUtilities[i].pubId);
			if(publication) {
	   			var pubTypeName = publication.pubTypeName.toUpperCase();
	   			var userDetails = window.publicationsUtility.userDetails;
				if(publication.client == "1"  
						&& (publication.hidden == 0 || (publication.hidden == "1" && publication.deptId == "228"))
						&& (publication.groupId != "4" || (publication.groupId == "4" && (publication.deptId == "216" || publication.deptId == "257" || publication.deptId == "269" || publication.deptId == "275"))) //Show utility for indices if its sepcified dept
						&& pubTypeName.indexOf("PENDING APPROVAL") < 0
						&& pubTypeName.indexOf("PENDING RELEASE") < 0
						&& pubTypeName.indexOf("DROPPED COVERAGE") < 0) {
					Ext.suspendLayouts();
					var pubId = publication.deptId == '228' ? (publication.srcId || publication.pubId) : publication.pubId
					Ext.create('com.barclays.DV.view.sharenew.ShareNewToolActionPanel',{
						 renderTo:Ext.get(publicationsUtilities[i].sourceElementId),
						 sourceElementId:publicationsUtilities[i].sourceElementId,
						 pubId:pubId,
					     adminPubId:publication.pubId,
						 docId:publication.docId,
						 pubDate:publication.pubDate,
						 pubURI:publication.uri,
						 pubTitle:publication.title,
						 level1Title:publication.l1Title,
						 level2Title:publication.l2Title,
						 inPage:true,
						 globalInPage: false,
						 isEmployee:userDetails.permission.isEmployee,
						 isIndexClient:userDetails.permission.isIndexClient,
						 isWealthEmployee:userDetails.permission.isWealthEmployee,
						 isHNWClient:userDetails.permission.isHNWClient,
						 isBarcorpRetail:userDetails.permission.isBarcorpRetail,
						 isMResearchAllow:userDetails.permission.isMResearchAllow,
						 isMResearchDeny:userDetails.permission.isMResearchDeny,
						 userLogin:userDetails.userId,
						 isQuickLinksEnabled:Ext.Array.contains(quickLinks,pubId) ? true : false,
						 targetWindow: window,
						 libraryURL:publicationsUtilities[i].libraryURL
					 });
					Ext.resumeLayouts();
				}
			}
		}
	}
});


Ext.define('com.barclays.DV.view.PublicationDot' ,{
	extend:'Ext.Container',
	cls:'publicationDot',
	alias: 'widget.publicationDot',
	data:[],
	config: {
		isEmployee: false
	},
	initComponent:function() {
		var me = this;
		Ext.applyIf(me, {
			tpl: new Ext.XTemplate(
					'<tpl if="this.isEmployee()">',
						'<tpl if="this.showCustomImage()">',
							'<img style="display:block;cursor:pointer;padding:4px;padding-left:0;" class="dotLink clickable {[this.getIconCls()]}"  url="{[this.getURL()]}"  pubId="{[this.getPubId()]}" src="{[this.getCustomImage()]}" />',
						'<tpl else>',
							'<a style="cursor:pointer;padding:4px;padding-left:0;" class="dotLink clickable {[this.getIconCls()]}" url="{[this.getURL()]}"  pubId="{[this.getPubId()]}" href="#">&bull;</a>',
						'</tpl>',
					'</tpl>',{
						getPubId:function() {
							return me.pubId;
						},
						getURL:function() {
							return me.url;
						},
						isEmployee:function() {
							return me.isEmployee;
						},
						showCustomImage:function() {
							return me.imageURL && me.imageURL.length > 0;
						},
						getCustomImage:function() {
							return me.imageURL;
						},
						getIconCls:function() {
							return (me.iconCls && me.iconCls.length > 0) ? me.iconCls : "";
						}
					}
			)
		});
		me.callParent(arguments);
	},
	afterRender:function() {
		var me = this;
		var dotLinkEl = Ext.get(Ext.DomQuery.selectNode(".dotLink",me.getEl().dom));
		if(dotLinkEl) {
			this.getEl().on({
				click : {
					fn : function(e,t){
						me.handleClickableClick(e,t);
					},
					delegate : '.clickable'
				}	
			});
			if(!window.publicationToolInfoPanel) {
				window.publicationToolInfoPanel = Ext.create("com.barclays.DV.view.PublicationToolInfoPanel",{
					renderTo:Ext.getBody()
				});			
			}
			dotLinkEl.on('mouseover', function(event) {
				if(!event.within(dotLinkEl, true)){
					event.preventDefault();
					window.publicationToolInfoPanel.showWin(dotLinkEl,me.pubId);
					return false;
				}
			});
			dotLinkEl.on('mouseout', function(event) {
				if(!event.within(window.publicationToolInfoPanel.getEl(), true)){
					event.preventDefault();
					window.publicationToolInfoPanel.hideWin();
					return false;
				}
			});
		}
	},
	handleClickableClick : function(e,t){
		e.preventDefault();
		var elem = Ext.get(t);
		if(elem.hasCls("dotLink")){
			DVOpenWindow(t.getAttribute("url"),1100, 900,'MAINTENANCE_'+t.getAttribute("pubId"));
		}
		return false;
	}
});


Ext.define('com.barclays.DV.view.PublicationToolInfoPanel' ,{
	extend : 'Ext.Component',
	cls: 'flyoutPublicationToolInfoPanel',
	floating:true,
	shadow:false,
	hidden:true,
	data:[],
	initComponent:function() {
		var me = this;
		Ext.applyIf(me, {
		    tpl: new Ext.XTemplate('<div class="content">',
		    		'<img class="leftBubbleTop" src="/RSR_S/nyfipubs/barcap/images/iconsUtility/talkBubble_up.png"/>',
		    		'<div class="content-items">',
	    			'</div>',
		    '</div>'),
		    contentTpl: new Ext.XTemplate('<div class="pub-info">',
		    	'<div class="pub-info-header">',
					'<h3>Publication Info</h3>',
					'<div style="width:0;height:0;clear:both;"></div>',
				'</div>',
				'<tpl>',
					'<div class="thumbnail-image">',
						'<img class="pub-image" src="{publicationDetailsObj.thumbnailURI}"></img>',
					'</div>',
					'<div class="large-thumbnail-image">',
						'<img class="large-pub-image"  src="{publicationDetailsObj.thumbnailURI}"></img>',
					'</div>',
					'<div class="pub-details">',
						'<div class="pub-item">',	
							'<ul>',
								'<li class="itemTitle">Basic Info</li>',
								'<li><div class="pub-label">Publication ID </div> <div class="pub-data">{publicationDetailsObj.pubId}</div></li>',
								'<li><div class="pub-label">Publication Date </div><div class="pub-data">{[this.formatPubDate(values.publicationDetailsObj.pubDate)]}</div></li>',
								'<li><div class="pub-label">Submitted </div><div class="pub-data">{publicationDetailsObj.submittedDate}</div></li>',
								'<li><div class="pub-label">Completed </div><div class="pub-data">{[this.formatDate(values.publicationDetailsObj.completedDate)]}</div></li>',
								'<li><div class="pub-label">{[this.getReleaseLabel(values)]} </div><div class="pub-data">{[this.formatDate(values.publicationDetailsObj.releasedDate)]}</div></li>',
								'<tpl if="this.showLastReleaseDate(values)">',
									'<li><div class="pub-label">Last released </div><div class="pub-data">{[this.formatDate(values.publicationDetailsObj.lastReleasedDate)]}</div></li>',
								'</tpl>',
								'<li><div class="pub-label">Last modified </div><div class="pub-data">{[this.formatDate(values.publicationDetailsObj.modifiedDate)]}</div></li>',
								'<li><div class="pub-label">Set for release </div><div class="pub-data">{publicationDetailsObj.setForRelease}</div></li>',
								'<li><div class="pub-label">Expiration date </div><div class="pub-data">{publicationDetailsObj.expirationDate }</div></li>',
								'<li><div class="pub-label">Group </div><div class="pub-data">{publicationDetailsObj.groupName} ({publicationDetailsObj.groupId})</div></li>',
								'<li><div class="pub-label">Department </div><div class="pub-data">{publicationDetailsObj.deptName} ({publicationDetailsObj.deptId})</div></li>',
								'<li><div class="pub-label">Publication type </div><div class="pub-data">{publicationDetailsObj.pubTypeName} ({publicationDetailsObj.pubTypeId})</div></li>',
								'<li><div class="pub-label">Document type </div><div class="pub-data">{publicationDetailsObj.docTypeName} ({publicationDetailsObj.docTypeId})</div></li>',
								'<li><div class="pub-label">Product </div><div class="pub-data">{publicationDetailsObj.productName} ({publicationDetailsObj.productId})</div></li>',
								'<li><div class="pub-label">Sub product </div><div class="pub-data">{publicationDetailsObj.subProductName} ({publicationDetailsObj.subProductId})</div></li>',
								'<li><div class="pub-label">Report type </div><div class="pub-data">{publicationDetailsObj.reportType}</div></li>',
							'</ul>',
							'<ul class="tagsUL">',
								'<li class="tagheaderli itemTitle">Tags</li>',
								'<tpl for="publicationDetailsObj.tags">',
									'<tpl if="tagValueAlt != tagCode">',
										'<li><div class="pub-label">{tagType} </div><div class="pub-data">{tagValueAlt}  ({tagCode})</div></li>',
									'</tpl>',
									'<tpl if="tagValueAlt == tagCode">',
										'<li><div class="pub-label">{tagType} </div><div class="pub-data">{tagValueAlt}</div></li>',
									'</tpl>',
								'</tpl>',
							'</ul>',
						'</div>',
					'</div>',
				'</tpl>',
			'</div>',
				{				
				getPublicationTitle: function() {
		    			return me.pubTitle;
		    	},
		    	formatPubDate:function(dateVal){
		    		if(dateVal == "N/A") return dateVal;
		    		return Ext.Date.format(Ext.Date.parse(dateVal,"m/d/y"),"d M Y");
		    	},
		    	formatDate:function(dateVal){
		    		if(dateVal == "N/A") return dateVal;
		    		return Ext.Date.format(Ext.Date.parse(dateVal,"m/d/y H:i:s"),"d M Y, H:i:s");
		    	},
		    	showLastReleaseDate:function(values) {
		    		if(values.publicationDetailsObj.lastReleasedDate && values.publicationDetailsObj.lastReleasedDate.length > 0) {
		    			return true;
		    		}
		    		return false;
		    	},
		    	getReleaseLabel:function(values) {
		    		if(this.showLastReleaseDate(values)) {
		    			return "First released";
		    		}
		    		return "Released";
		    	}
		    })
		});
		me.callParent(arguments);
	},
	afterRender:function() {
		this.callParent(arguments);
		var me = this;
		me.getEl().on('mouseout', function(event) {
			if(!event.within(me.getEl(), true)){
				me.hide();
			}
		});
	},
	showWin:function(dotLinkEl,pubId) {
		var me = this;
		if(!me.isVisible()) {
			var contentEl = Ext.get(Ext.DomQuery.selectNode(".content-items",me.getEl().dom));
			contentEl.setHTML("");
			me.show();
		}
		var box = dotLinkEl.getBox();
		this.getPublicationDetails(pubId);
		//var x = box.x + box.width/2 - 25;
		var x = this.calculateXValue(box.x, box.width, this.getWidth());	
		var bubbleTopPosition = (box.x - x) + ((box.width - 20)/2) - 3;
		this.getEl().down(".leftBubbleTop").dom.style.marginLeft = bubbleTopPosition + "px";		
		var y = box.y + box.height - 6;
		this.setPosition(x,y);
	},
	hideWin:function() {
		this.hide();
		if(this.clearHeight) {
			this.clearHeight = false;
    		Ext.getBody().dom.style.height = "";
    		resizeMainWindow();    		
    		resizeIframe();
		}
	},
	calculateXValue: function(currentX, currentWidth, currentPanelWidth) {
		var x = 0;
		var offSetPosition = 20;
		var bodyWidth = Ext.getBody().getWidth();
        var rightSideWidth = bodyWidth - currentX;
        var leftSideWidth = bodyWidth - rightSideWidth;
		x = (currentPanelWidth > rightSideWidth) ? bodyWidth - (offSetPosition + currentPanelWidth)
				 : currentX - offSetPosition;
		return x;
	},
	resizeBody:function(type) {
		var bodyHeight = Ext.getBody().getHeight();
		var currentPanelBottomPos = this.getEl().getY() + this.getHeight();
		if(currentPanelBottomPos > bodyHeight) {
			this.clearHeight = true;
			var newHeight = bodyHeight + (currentPanelBottomPos  - bodyHeight) + 20;
			Ext.getBody().setHeight(newHeight);
			resizeMainWindow();
			resizeIframe();
		}
	},
	getPublicationDetails: function(pubId) {
		var me = this;
		Ext.Ajax.request({
			url: "/DDL/servlets/dv.search?characterSet=UTF-8&deptType=HIDDEN&resultDetail=LONG&applicationID=DOCVIEW&dateRange=25+years",
			scope: this,
			method: 'GET',
			params: {'pubIDSearch': pubId},
			success: function(response,opts){
				var publicationDetailsObj = {};
				var publications = Ext.DomQuery.select("RESEARCH > LINK",response.responseXML);
				publicationXML = publications[0];
				publicationDetailsObj.pubId = Ext.DomQuery.selectValue("@PUBID",publicationXML);
				publicationDetailsObj.pubDate = Ext.DomQuery.selectValue("PUBDATE",publicationXML);
				publicationDetailsObj.expirationDate = Ext.DomQuery.selectValue("EXPDATE",publicationXML);
				publicationDetailsObj.groupId = Ext.DomQuery.selectValue("GROUPID",publicationXML);
				publicationDetailsObj.groupName = Ext.DomQuery.selectValue("GROUPNAME",publicationXML);
				publicationDetailsObj.deptId = Ext.DomQuery.selectValue("DEPTID",publicationXML);
				publicationDetailsObj.deptName = Ext.DomQuery.selectValue("DEPTNAME",publicationXML);
				publicationDetailsObj.pubTypeId = Ext.DomQuery.selectValue("PUBTYPEID",publicationXML);
				publicationDetailsObj.pubTypeName = Ext.DomQuery.selectValue("PUBTYPENAME",publicationXML);
				
				publicationDetailsObj.completedDate = Ext.DomQuery.selectValue("COMPLETED_DATE",publicationXML);
				if(publicationDetailsObj.completedDate == null || publicationDetailsObj.completedDate.length == 0) {
					publicationDetailsObj.completedDate = "N/A";
				}
				publicationDetailsObj.releasedDate = Ext.DomQuery.selectValue("CRTEDATE",publicationXML);
				if(publicationDetailsObj.releasedDate == null 
						|| publicationDetailsObj.releasedDate.length == 0
						|| publicationDetailsObj.pubTypeName.toUpperCase() == 'PENDING APPROVAL'
						|| publicationDetailsObj.pubTypeName.toUpperCase() == 'PENDING RELEASE') {
					publicationDetailsObj.releasedDate = "N/A";
				}
				publicationDetailsObj.lastReleasedDate = Ext.DomQuery.selectValue("LAST_RELEASED_DATE",publicationXML);
				publicationDetailsObj.modifiedDate = Ext.DomQuery.selectValue("UPDTDATE",publicationXML);
				if(publicationDetailsObj.modifiedDate == null || publicationDetailsObj.modifiedDate.length == 0) {
					publicationDetailsObj.modifiedDate = "N/A";
				}
				
				publicationDetailsObj.docTypeId = Ext.DomQuery.selectValue("DOCTYPEID",publicationXML);
				if(publicationDetailsObj.docTypeId == null || publicationDetailsObj.docTypeId.length == 0) {
					publicationDetailsObj.docTypeId = "N/A";
				}
				publicationDetailsObj.docTypeName = Ext.DomQuery.selectValue("DOCTYPENAME",publicationXML);
				if(publicationDetailsObj.docTypeName == null || publicationDetailsObj.docTypeName.length == 0) {
					publicationDetailsObj.docTypeName = "MULTIPLE";
				}
				publicationDetailsObj.productId = Ext.DomQuery.selectValue("PRODUCTID",publicationXML);
				if(publicationDetailsObj.productId == null || publicationDetailsObj.productId.length == 0) {
					publicationDetailsObj.productId = "N/A";
				}
				publicationDetailsObj.productName = Ext.DomQuery.selectValue("PRODUCTNAME",publicationXML);
				if(publicationDetailsObj.productName == null || publicationDetailsObj.productName.length == 0) {
					publicationDetailsObj.productName = "N/A";
				}
				publicationDetailsObj.subProductId = Ext.DomQuery.selectValue("SUBPRODUCTID",publicationXML);
				if(publicationDetailsObj.subProductId == null || publicationDetailsObj.subProductId.length == 0) {
					publicationDetailsObj.subProductId = "N/A";
				}
				publicationDetailsObj.subProductName = Ext.DomQuery.selectValue("SUBPRODUCTNAME",publicationXML);
				if(publicationDetailsObj.subProductName == null || publicationDetailsObj.subProductName.length == 0) {
					publicationDetailsObj.subProductName = "N/A";
				}
				publicationDetailsObj.reportType = Ext.DomQuery.selectValue("REPORTTYPE",publicationXML);
				publicationDetailsObj.thumbnailURI = Ext.DomQuery.selectValue("THUMBNAIL_IMAGE_URL",publicationXML);
				var tagXMLs = Ext.DomQuery.select("TAG",publicationXML);
				var tags = [];
				if(tagXMLs.length > 0) {
					for(var i = 0, len = tagXMLs.length; i < len; i++) {
						var tagType = Ext.DomQuery.selectValue("TAGTYPE",tagXMLs[i]);
						var tagCode = Ext.DomQuery.selectValue("TAGCODE",tagXMLs[i]);
						var tagValueAlt = Ext.DomQuery.selectValue("TAGVALUE_ALTERNATE",tagXMLs[i]);
						tags.push({tagType:tagType,tagCode:tagCode,tagValueAlt:tagValueAlt});
						if(tagType == "MISC.CREATED_TS") {
							publicationDetailsObj.submittedDate = Ext.Date.format(Ext.Date.parse(tagValueAlt,"D M j H:i:s Y"),"d M Y, H:i:s");
						}else if(tagType == "BB_TAGS.PA_TRIGGER") {
							var dateVal = tagValueAlt.split("~");
							if(dateVal[0] && dateVal[0].length > 0) {
								publicationDetailsObj.setForRelease = Ext.Date.format(Ext.Date.parse(dateVal[0],"c"),"d M Y, H:i");
								publicationDetailsObj.setForRelease += " " + dateVal[3];
							} else {
								publicationDetailsObj.setForRelease = "N/A";
							}
						}
					}
				}
				if(publicationDetailsObj.submittedDate == null || publicationDetailsObj.submittedDate.length == 0) {
					publicationDetailsObj.submittedDate = "N/A";
				}
				if(publicationDetailsObj.setForRelease == null || publicationDetailsObj.setForRelease.length == 0) {
					publicationDetailsObj.setForRelease = "N/A";
				}
				Ext.Array.sort(tags,function(a,b){
					return a.tagType < b.tagType ? -1 : 1;
				});
				publicationDetailsObj.tags = tags;
				me.contentTpl.overwrite(me.getEl().down(".content-items"), {publicationDetailsObj:publicationDetailsObj});
				var pubImageEL = this.getEl().down(".pub-image");
				var largePubImageEL = this.getEl().down(".large-thumbnail-image");
				pubImageEL.on('mouseover', function(event) {
					largePubImageEL.setVisible(true);
				});
				largePubImageEL.on('mouseout', function(event) {
					largePubImageEL.setVisible(false);
				});
				me.resizeBody();
			},
		    failure: function(response,opts){
		    }
		});
	}
});

