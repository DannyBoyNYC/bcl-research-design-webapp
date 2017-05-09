var manageClientGlobalEvent = Ext.create('Ext.Component');

Ext.define('com.barclays.PubSubscription.view.ManageClientPanel' ,{
	extend:'Ext.Container',
	cls:'manageClientPanel',
	alias: 'widget.manageClientPanel',
	bubbleEvents:['subscribeForClient'],
	selectedClientPanel:{},
	initComponent:function() {
		var me =this;
		Ext.applyIf(me, {
			items:[{
				xtype:'manageSelectedClientPanel',
				itemId:'manageSelectedClientPanel' 
			},{
				xtype:'container',
				itemId:'manageClientComp'
			}]
		});
		me.callParent(arguments);	
	},
	afterRender:function() {
		this.callParent(arguments);	
		var manageClientComp = Ext.create('com.barclays.PubSubscription.view.ManageClientComp',{
			parentContainer:this,
			selectedClientPanel:this.down('#manageSelectedClientPanel')
		});	
		this.down("#manageClientComp").add(manageClientComp);
	}
});


Ext.define('com.barclays.PubSubscription.view.ManageClientComp' ,{
	extend:'Ext.Container',
	alias: 'widget.manageClientComp',
	bubbleEvents:['afterNext','subscribeForClient'],
	failedCRMIds:[],
	initComponent:function() {
		var me =this;
		me.relayEvents(manageClientGlobalEvent,["itemAdded","itemRemoved"]);
		me.on("afterNext",me.subscribeForClient);
		Ext.applyIf(me, {
			items:[{
				xtype:'component',
				data:[],
				cls:'manage-client-tabs',
				tpl: new Ext.XTemplate(
						'<div>',
							'<ul style="margin-top:10px;margin-bottom:8px;">',
								'<li><a  class="tab default-tab active-tab client" href="#">Clients</a></li>',
								'<li><a class="tab default-tab list" href="#">My lists</a></li>',
								'<li><a class="tab default-tab employee" href="#">Employees</a></li>',
							'</ul>',
							'<div style="clear:both"></div>',
						'</div>'
				)
			},{

				xtype:'container',
				itemId:'clientView',
				layout:'card',
				items:[{
					xtype:'searchClientOrEmpComp',
					selectedClientPanel:me.selectedClientPanel,
					isEmployeeTab:false,
					inputWidth:190
				},{
					xtype:'listComp',
					selectedClientPanel:me.selectedClientPanel
				},{
					xtype:'searchClientOrEmpComp',
					selectedClientPanel:me.selectedClientPanel,
					isEmployeeTab:true,
					inputWidth:313
				}]
			
			}]
		});
		me.callParent(arguments);	
	},
	afterRender: function() {
		this.callParent(arguments);
		this.getEl().on({
			click : {
				scope:this,
				fn :this.handleTabChange,
				delegate : '.tab'
			}	
		});
		this.getEl().on({
			click : {
				scope:this,
				fn :this.handleClickableClick,
				delegate : '.clickable'
			}	
		});
	},
	showMask:function() {
		try {
	        if(!this.clientMask) {
	        	this.clientMask =  new Ext.LoadMask(this.getEl(),{
	        		msg:"Please wait..."
	        	});
	        }
	        this.clientMask.show();
		} catch(e) {}
	},
	hideMask:function() {
		try {
			this.clientMask.hide();
		} catch(e) {}
	},
	handleClickableClick:function(e,t) {
		e.preventDefault();
		var element = Ext.get(t);
		if(element.hasCls("delete")) {
			t.parentNode.parentNode.removeChild(t.parentNode);
		}
		return false;
	},
	handleTabChange:function(e,t) {
		var me = this;
		e.preventDefault();
		var element = Ext.get(t);
		var activeTabEl = Ext.get(Ext.DomQuery.selectNode(".active-tab",me.getEl().dom));
		if(activeTabEl && activeTabEl != null) {
			activeTabEl.removeCls("active-tab");
		}
		if(!element.hasCls("active-tab")) {
			element.addCls("active-tab");
			var tabIndex = element.dom.getAttribute("tabIndex");
		}
		if(element.hasCls("client")) {
			this.down("#clientView").getLayout().setActiveItem(0);
		} else if(element.hasCls("list")){
			this.down("#clientView").getLayout().setActiveItem(1);
		} else if(element.hasCls("employee")){
			this.down("#clientView").getLayout().setActiveItem(2);
		} 
		return false;
	},
	subscribeForClient:function() {
		this.failedCRMIds = [];
		var selectedListMap = this.selectedClientPanel.selectedListMap;
		var keys = selectedListMap.getKeys();
		var crmContacts = [];
		for(var i = 0, len = keys.length; i < len; i++) {
			var obj = selectedListMap.get(keys[i]);
			var selectedContacts = obj.selectedContacts;
			for(var j = 0, contactsLen = selectedContacts.length; j < contactsLen; j++) {
				if(selectedContacts[j].webUserID == "" || selectedContacts[j].webUserID.length == 0) {
					crmContacts.push({
						key:keys[i],
						contact:selectedContacts[j]
					});
				}
			}
		}
		if(crmContacts.length > 0) {
			this.showMask();
			this.pendingRequests =  crmContacts.length;
			this.completedRequests = 0;
			for(var i = 0, len = crmContacts.length; i < len; i++) {
				this.createAccount(crmContacts[i].key,crmContacts[i].contact)
			}
		} else {
			this.fireEvent("subscribeForClient",{
				selectedListMap:this.selectedClientPanel.selectedListMap,
				failedCRMIds:[]
			});
		}
	},
	createAccount:function(key,contact) {
		var params = {
				crmID : contact.crmID,
				action : "createClientAccount"
			};
			Ext.Ajax.request({
			    url: '/DDL/jsp/BCLSignupAccountCreationService.jsp?characterSet=UTF-8',
			    params: params,
			    scope: this,
			    method: 'POST',
			    success: function(response,opts){
					++this.completedRequests;
					var retObj = Ext.decode(Ext.String.trim(response.responseText));
					if(retObj.webUserID){
						var obj = this.selectedClientPanel.selectedListMap.get(key);
						var selectedContacts = obj.selectedContacts;
						for(var j = 0, contactsLen = selectedContacts.length; j < contactsLen; j++) {
							if(selectedContacts[j].crmID == contact.crmID) {
								selectedContacts[j].webUserID = retObj.webUserID;
							}
						}
					}
					else if(retObj.errorCode) {
						contact.message = retObj.message;
						this.failedCRMIds.push(contact);
						var obj = this.selectedClientPanel.selectedListMap.get(key);
						var selectedContacts = obj.selectedContacts;
						if(selectedContacts.length == 1) {
							this.selectedClientPanel.selectedListMap.removeAtKey(key);
						} else {
							for(var j = 0, contactsLen = selectedContacts.length; j < contactsLen; j++) {
								if(selectedContacts[j].crmID == contact.crmID) {
									Ext.Array.remove(selectedContacts,selectedContacts[j]);
								}
							}							
						}
					}
					if(this.pendingRequests == this.completedRequests) {
						this.pendingRequests = 0;
						this.completedRequests = 0;
						this.fireEvent("subscribeForClient",{
							selectedListMap:this.selectedClientPanel.selectedListMap,
							failedCRMIds:this.failedCRMIds
						});
						this.hideMask();
					}
				},
				failure: function(response,opts){
					this.pendingRequests = 0;
					this.completedRequests = 0;
					this.hideMask();
					com.barclays.DV.view.Utils.showMsg("Subscriptions - Error","Error while signing up for new BCLIDs");
				}
			});
	}
	
});

Ext.define('com.barclays.PubSubscription.view.ListComp' ,{
	extend:'Ext.Container',
	alias: 'widget.listComp',
	cls:'listComp',
	bubbleEvents:['afterNext'],
	layout:'vbox',
	style:'margin-top:10px',
	initComponent:function() {
		var me =this;
		this.relayEvents(this.selectedClientPanel,["contactAdded","contactRemoved"]);
		this.on("contactAdded",me.contactAdded);
		this.on("contactRemoved",me.contactRemoved);
		Ext.applyIf(me, {
			noRecordsTpl:new Ext.XTemplate('<div>No lists found.</div>',
					'<div class="clickable next-btn-container" style="display:none;"><a href="#" class="clickable next-btn next-btn-disabled">Next</a></div>'
			),		
			listTpl: new Ext.XTemplate('<div class="list-container">',
					'<div style="display:inline;">',
						'<ul class="list-name-ul">',
						'<tpl for=".">',
							'<li class="clickable list list-name-li" listName="{[this.getEncodedListname(values)]}">{.}</li>',
						'</tpl>',
						'</ul>',
					'</div>',
					'<div class="list-item-container">',
					'<ul id="list-details" class="list-details"></ul>',
					'</div>',
					'<div style="width:0;height:0;clear:both"></div>',
					'</div>',					
					'<div class="next-btn-container"><a href="#" class="clickable next-btn next-btn-disabled">Next</a></div>',{
						getEncodedListname:function(values) {
							return escape(values);
						}
				}
			),
			selectedListTpl:new Ext.XTemplate(
				'<li class="list-item-all">',
						'<div class="clickable selectAll">Select All&nbsp;</div>',
						'<div class="clickable all-list-checkbox">&nbsp;</div>',
						'<div style="width:0;height:0;clear:both;"></div>',
				'</li>',
				'<tpl for=".">',
					'<li class="list-item">',
						'<div class="list-record">{fn}&nbsp;{ln}&nbsp; . &nbsp;<a href="mailto:{mail}" class="companyMail">{mail}</a>&nbsp; . &nbsp; <span class="companyName">{[this.getFirmName(values)]}</span></div>',
						'<div userId="{[this.getUser(values)]}" class="clickable list-checkbox {[this.addCheckBoxCls(values)]}" style="cursor:pointer;">&nbsp;</div>',
						'<div style="width:0;height:0;clear:both;"></div>',
					'</li>',
				'</tpl>',
				{
					addCheckBoxCls: function(values) {
						var user = (values.user && values.user.length > 0) ?  values.user : values.sourceId;
						if (me.selectedListName && me.selectedClientPanel.selectedListMap.containsKey(me.selectedListName)) {
							var selectedContacts = me.selectedClientPanel.selectedListMap.get(me.selectedListName).selectedContacts;
							for(var j = 0, contactsLen = selectedContacts.length; j < contactsLen; j++) {
								if(user == selectedContacts[j].webUserID || user == selectedContacts[j].crmID) {
									return "list-checkbox-checked";
								}
							}
						}
					},
					getUser:function(values) {
						if(values.user && values.user.length > 0) {
							return values.user;
						}
						return values.sourceId;
					},
					getFirmName:function(values) {
						return values.firm.toLowerCase();
					}
				}
			)
		});
		me.callParent(arguments);	
	},
	afterRender:function() {
		this.callParent(arguments);	
		var me = this;
		this.getEl().on({
			click : {
				scope:this,
				fn :this.handleClickableClick,
				delegate : '.clickable'
			},
			mouseover : {
				fn : function(e,t){
					me.handleMouseOver(e,t);
				},
				delegate : '.clickable'
			},
			mouseout : {
				fn : function(e,t){
					me.handleMouseOut(e,t);
				},
				delegate : '.clickable'
			}
		});
		this.loadLists();
	},
	handleMouseOver:function(e,t) {
		e.preventDefault();
		var me = this;
		var element = Ext.get(t);
		if(element.hasCls("list")) {
			if(!element.hasCls("list-focus")) {
				element.addCls("list-focus")
			}
		}
		return false;
	},
	handleMouseOut:function(e,t) {
		e.preventDefault();
		var me = this;
		var element = Ext.get(t);
		if(element.hasCls("list")) {
			element.removeCls("list-focus")
		}
		return false;
	},
	handleMouseEvents:function() {
		var me = this;
		var listNameEl = Ext.get(Ext.DomQuery.selectNode(".list-name-ul",me.getEl().dom));	
		listNameEl.on('mouseover', function(event) {
			if(!event.within(listNameEl, true)){
				listNameEl.dom.style.overflowY = "auto";
			}
		});
		listNameEl.on('mouseout', function(event) {
			if(!event.within(listNameEl, true)){
				listNameEl.dom.style.overflowY = "hidden";
			}
		});
	},
	handleClickableClick:function(e,t) {
		e.preventDefault();
		var me = this;
		var element = Ext.get(t);
		if(element.hasCls("list")) {
			var activeListEl = Ext.get(Ext.DomQuery.selectNode(".active-list",me.getEl().dom));
			if(activeListEl && activeListEl != null) {
				activeListEl.removeCls("active-list");
			}
			element.addCls("active-list");
			var name = unescape(t.getAttribute("listName"));
			this.selectedListName = name;
			var contacts = me.listMap.get(name);
			Ext.get("list-details").setHTML("");
			me.selectedListTpl.append(Ext.get("list-details"),contacts);
			var listBoxCheckedEls = Ext.DomQuery.select(".list-checkbox-checked",me.getEl().dom);
			if(listBoxCheckedEls && listBoxCheckedEls.length == contacts.length) {
				var allCheckBoxEl = Ext.get(Ext.DomQuery.selectNode(".all-list-checkbox",me.getEl().dom));
				allCheckBoxEl.toggleCls("all-list-checkbox-checked");
			}
			me.doComponentLayout();
		} else if(element.hasCls("list-checkbox-checked")) { 
			element.toggleCls("list-checkbox-checked");
			me.addSelectedContacts();
		} else if(element.hasCls("list-checkbox")) {
			element.toggleCls("list-checkbox-checked");
			me.addSelectedContacts();
		} else if(element.hasCls("all-list-checkbox") || element.hasCls("selectAll")) {
			var allCheckBoxEl = Ext.get(Ext.DomQuery.selectNode(".all-list-checkbox",me.getEl().dom));
			var checkAll = false;
			allCheckBoxEl.toggleCls("all-list-checkbox-checked");
			if(allCheckBoxEl.hasCls("all-list-checkbox-checked")) {
				checkAll = true;
			}
			Ext.Array.each(Ext.DomQuery.select(".list-checkbox",me.getEl().dom),function(item){
				var itemEl = Ext.get(item);
				if(checkAll) {
					if(!itemEl.hasCls("list-checkbox-checked")) {
						itemEl.addCls("list-checkbox-checked");
					}
				} else {
					itemEl.removeCls("list-checkbox-checked");
				}
			});
			me.addSelectedContacts();
		} else if(element.hasCls("next-btn-enabled")) {
			this.fireEvent("afterNext",{
				selectedListMap:this.selectedClientPanel.selectedListMap
			});
		}
		return false;
	},
	
	addSelectedContacts: function() {
		var me = this;
		var activeListEl = Ext.get(Ext.DomQuery.selectNode(".active-list",me.getEl().dom));
		var listName = unescape(activeListEl.dom.getAttribute("listName"));
		var selectedContacts = [];
		var listCheckBoxElements = Ext.DomQuery.select(".list-checkbox",me.getEl().dom);
		var numberOfContacts = listCheckBoxElements.length;
		Ext.Array.each(listCheckBoxElements,function(item){
			var itemEl = Ext.get(item);
			if(itemEl.hasCls("list-checkbox-checked")) {
				var userId = itemEl.dom.getAttribute("userId");
				var contacts = me.listMap.get(listName);
				for(var i =0, len = contacts.length; i < len; i++) {
					if(contacts[i].user == userId || contacts[i].sourceId == userId) {
						var user = {};
						if(contacts[i].user == userId) {
							user.webUserID = userId;
						} else {
							user.crmID = userId;
						}
						user.fullName = contacts[i].ln + ", " + contacts[i].fn;
						user.firmName = contacts[i].firm;
						user.primaryEmail = contacts[i].mail;
						selectedContacts.push(user);
					}
				}
			}
		});
		if(selectedContacts.length > 0) {
			var displayName = listName + " (" + selectedContacts.length + " people)";
			var obj = {
					displayName:displayName,	
					isList:true,
					selectedContacts:selectedContacts
			};
			manageClientGlobalEvent.fireEvent("itemAdded",{
				key:listName,
				isList:true,
				selectedContacts:obj
			});				
		} else {
			manageClientGlobalEvent.fireEvent("itemRemoved",{
				key:listName,
				isList:true
			});
		}
		var selectAllCheckBoxEle = Ext.get(Ext.DomQuery.selectNode(".all-list-checkbox",me.getEl().dom));
		if (numberOfContacts == selectedContacts.length) {
			if (!selectAllCheckBoxEle.hasCls('all-list-checkbox-checked')) {
				selectAllCheckBoxEle.toggleCls('all-list-checkbox-checked');
			}
		} else {
			if (selectAllCheckBoxEle.hasCls('all-list-checkbox-checked')) {
				selectAllCheckBoxEle.toggleCls('all-list-checkbox-checked');
			}
		}
		me.doComponentLayout();
	},
	contactAdded:function(isNextBtnEnabled) {
		var nextBtnEl = Ext.get(Ext.DomQuery.selectNode(".next-btn",this.getEl().dom));
		nextBtnEl.parent().show();
		if(!nextBtnEl.hasCls("next-btn-enabled")) {
			nextBtnEl.removeCls("next-btn-disabled");
			nextBtnEl.addCls("next-btn-enabled");
		}
	},	
	contactRemoved: function(params) {
		var me = this;
		var selectedContacts = 0;
		var activeListEl = Ext.get(Ext.DomQuery.selectNode(".active-list",me.getEl().dom));
		if (this.selectedClientPanel.selectedListMap.getCount() == 0) {
			var nextBtnEl = Ext.get(Ext.DomQuery.selectNode(".next-btn",me.getEl().dom));
			if (activeListEl == null) {
				nextBtnEl.parent().hide();
			}
			if(!nextBtnEl.hasCls("next-btn-disabled")) {
				nextBtnEl.removeCls("next-btn-enabled");
				nextBtnEl.addCls("next-btn-disabled");
			}
		}
		if (activeListEl == null) {
			return;
		}
		var listName = unescape(activeListEl.dom.getAttribute("listName"));
		if (listName != params.key) {
			return;
		}
		var listCheckBoxElements = Ext.DomQuery.select(".list-checkbox",me.getEl().dom);
		Ext.Array.each(listCheckBoxElements,function(item){
			var itemEl = Ext.get(item);
			if(itemEl.hasCls("list-checkbox-checked")) {
				itemEl.toggleCls("list-checkbox-checked");
				selectedContacts++;
			}
		});
		
		var listCheckBoxElements = Ext.DomQuery.select(".list-checkbox",me.getEl().dom);
		var numberOfContacts = listCheckBoxElements.length;
		
		if (numberOfContacts != selectedContacts.length) {
			var selectAllCheckBoxEle = Ext.get(Ext.DomQuery.selectNode(".all-list-checkbox",me.getEl().dom));
			if (selectAllCheckBoxEle.hasCls('all-list-checkbox-checked')) {
				selectAllCheckBoxEle.toggleCls('all-list-checkbox-checked');
			}
		}
	},
	loadLists:function() {
		var me = this;
		this.isListLoaded = false;
		Ext.Ajax.request({
 		    url: '/BC/S/connect?service=list',
 		    scope: this,
 		    success: function(response,opts){
 		    	var response = Ext.decode(Ext.String.trim(response.responseText));
 		    	var listNames = [];
		    	me.listMap = new Ext.util.HashMap();
 		    	for (var listName in response) {
 		    		listNames.push(listName);
 		    		me.listMap.add(listName,response[listName]);
 		    	}
 		    	if(listNames.length == 0) {
 		    		me.noRecordsTpl.overwrite(me.getEl(),{});
 		    	} else {
 		    		me.listTpl.overwrite(me.getEl(),listNames);
 	 				var contacts = me.listMap.get(listNames[0]);
 	 				if(Ext.get("list-details")) {
	 	 				Ext.get("list-details").setHTML("");
	 	 				me.selectedListTpl.append(Ext.get("list-details"),contacts);
	 	 				Ext.get(Ext.DomQuery.selectNode(".list",me.getEl().dom)).addCls("active-list");
 	 				}
 	 				this.handleMouseEvents();
 		    	}
	 			resizeMainWindow();
 		    	this.isListLoaded = true;
 		    	this.hideMask();
  	 		},
 		    failure: function(response,opts){
  	 			com.barclays.DV.view.Utils.showMsg("Subscriptions - Error","Error while retrieving list details");
  	 			this.isListLoaded = true;
  	 			this.hideMask();
 		    }
		});
	},
	listeners:{
		activate:function() {
			if(!this.isListLoaded) {
				this.showMask();
			} 
		}
	},
	showMask:function() {
		try {
	        if(!this.clientMask) {
	        	this.clientMask =  new Ext.LoadMask(this.getEl(),{
	        		msg:"Please wait..."
	        	});
	        }
	        this.clientMask.show();
		} catch(e) {}
	},
	hideMask:function() {
		try {
			if(this.clientMask) {
				this.clientMask.hide();
			}
		} catch(e) {}
	}
	
});
Ext.define('com.barclays.PubSubscription.view.SearchClientOrEmpComp' ,{
	extend:'Ext.Container',
	alias: 'widget.searchClientOrEmpComp',
	cls:'searchClientOrEmpComp',
	bubbleEvents:['afterNext'],
	layout: {
		type: 'anchor'
	},
	contactAdded:function() {
		this.down("#infoComp").show();
		var nextBtnEl = Ext.get(Ext.DomQuery.selectNode(".next-btn",this.getEl().dom));
		nextBtnEl.show();
		if(!nextBtnEl.hasCls("next-btn-enabled")) {
			nextBtnEl.removeCls("next-btn-disabled");
			nextBtnEl.addCls("next-btn-enabled");
		}
	},
	contactRemoved:function(params) {
		var record = this.findGridStoreRecord(this.down("#searchClientOrEmpResultGrid").getStore(), params.key);
		this.down("#searchClientOrEmpResultGrid").getSelectionModel().deselect(record);
		var nextBtnEl = Ext.get(Ext.DomQuery.selectNode(".next-btn",this.getEl().dom));
		if (this.selectedClientPanel.selectedListMap.getCount() == 0) {
			if(!nextBtnEl.hasCls("next-btn-disabled")) {
				nextBtnEl.removeCls("next-btn-enabled");
				nextBtnEl.addCls("next-btn-disabled");
			}
			if (this.down("#searchClientOrEmpResultGrid").getStore().getCount() == 0) {
				this.down("#infoComp").hide();
			}
		}
	},
	findGridStoreRecord: function(storeInst,keyValue) {
		var recIndex = storeInst.findBy(function(storeRecord, recId) { 
			return storeRecord.get('webUserID') == keyValue || storeRecord.get('crmID') == keyValue;
		});
		if (recIndex != -1) {
			return storeInst.getAt(recIndex);
		}
	},
	manageNextBtnVisibility: function() {
		var nextBtnEl = Ext.get(Ext.DomQuery.selectNode(".next-btn",this.getEl().dom));
		if (this.selectedClientPanel.selectedListMap.getCount() > 0) {
			nextBtnEl.show();
		} else {
			nextBtnEl.hide();
		}
	},
	initComponent:function() {
		var me =this;
		this.relayEvents(this.selectedClientPanel,["contactAdded","contactRemoved"]);
		this.on("contactAdded",me.contactAdded);
		this.on("contactRemoved",me.contactRemoved);
		Ext.applyIf(me, {
			items:[{
				xtype:'container',
				layout: {
					type: 'hbox'
				},
				style:'margin-top:10px;margin-bottom:20px;',
				items:[{
					xtype:'container',
					style:'margin-top:20px;',
					/*layout:{
						type: 'vbox',
						align: 'stretch'
					},*/
					
					items:[{
						xtype:'textfield',
				    	emptyText:'First Name',
				    	itemId:'firstName',
				    	cls: 'filterTxtContainer',
				    	enableKeyEvents:true,
				    	width:me.inputWidth,
				    	listeners:{
							'specialKey': function( field, e ){
								if ( e.getKey() == e.RETURN || e.getKey() == e.ENTER ) {
									me.doSearch();
								}
							},
							keyup:function(obj,e) {
								setTimeout(function(){
									if(e.getKey() != e.TAB) {
										me.down("#businessCenter").setValue("");
										me.down("#email").setValue("");
									}
								},1);
							}
						}
					},{
						xtype:'textfield',
				    	emptyText:'Last Name',
				    	style:'margin-top:14px;',
				    	enableKeyEvents:true,
				    	cls: 'filterTxtContainer',
				    	itemId:'lastName',
				    	width:me.inputWidth,
				    	listeners:{
							'specialKey': function( field, e ){
								if ( e.getKey() == e.RETURN || e.getKey() == e.ENTER ) {
									me.doSearch();
								}
							},
							keyup:function(obj,e) {
								setTimeout(function(){
									if(e.getKey() != e.TAB) {
										me.down("#businessCenter").setValue("");
										me.down("#email").setValue("");
									}
								},1);
							}
						}
					}]
				},{
					xtype:'component',
					data:[],
					hidden:me.isEmployeeTab,
					tpl:'<div class="divider_or"></div>'
				},{
					xtype:'textfield',
			    	emptyText:'Buying Center',
			    	itemId:'businessCenter',
			    	enableKeyEvents:true,
			    	style:'margin-top:20px;',
			    	cls: 'filterTxtContainer',
			    	width:me.inputWidth,
			    	listeners:{
						'specialKey': function( field, e ){
							if ( e.getKey() == e.RETURN || e.getKey() == e.ENTER ) {
								me.doSearch();
							}
						},
						keyup:function(obj,e) {
							setTimeout(function(){
								if(e.getKey() != e.TAB) {
									me.down("#firstName").setValue("");
									me.down("#lastName").setValue("");
									me.down("#email").setValue("");
								}
							},1);
						}
					}
				},{
					xtype:'component',
					data:[],
					tpl:'<div class="divider_or"></div>'
				},{
					xtype:'textfield',
			    	emptyText:'Email',
			    	itemId:'email',
			    	enableKeyEvents:true,
			    	style:'margin-top:20px;',
			    	cls: 'filterTxtContainer',
			    	width:me.inputWidth,
			    	listeners:{
						'specialKey': function( field, e ){
							if ( e.getKey() == e.RETURN || e.getKey() == e.ENTER ) {
								me.doSearch();
							}
						},
						keyup:function(obj,e) {
							setTimeout(function(){
								if(e.getKey() != e.TAB) {
									me.down("#firstName").setValue("");
									me.down("#lastName").setValue("");
									me.down("#businessCenter").setValue("");									
								}
							},1);
						}
					}
				}]
			},{
				xtype:'component',
				data:[],
				tpl: new Ext.XTemplate('<div class="search-btn-container"><a href="#" class="clickable search searchButton">Search</a></div>')
			},{
				xtype:'component',
				itemId:'infoComp',
				cls:'infoComp',
				data:[],
				hidden:true,
				tpl: new Ext.XTemplate(
						'<div class="searchResultInfo">',
							'<div style="float:left"class="searchResultsLbl"></div>',
							'<div class="next-btn-container"><a href="#" class="clickable next-btn next-btn-disabled">Next</a></div>',
							'<div style="clear:both"></div>',
						'</div>'
				)
			
			},{
				xtype:'searchClientOrEmpResultGrid',
				hidden:true,
				itemId:'searchClientOrEmpResultGrid'
			}]
		});
		me.callParent(arguments);	
	},
	afterRender:function() {
		this.callParent(arguments);	
		if(this.isEmployeeTab) {
			this.down("#businessCenter").setVisible(false);
			this.down("#searchClientOrEmpResultGrid").columns[2].setVisible(false);
		}
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
		var element = Ext.get(t);
		if(element.hasCls("search")) {
			this.doSearch()
		} else if(element.hasCls("next-btn-enabled")) {
			this.fireEvent("afterNext",{
				selectedListMap:this.selectedClientPanel.selectedListMap
			});
		}
		return false;
	},
	showMask:function() {
		try {
	        if(!this.searchMask) {
	        	this.searchMask =  new Ext.LoadMask(this.getEl(),{
	        		msg:"Please wait..."
	        	});
	        }
	        this.searchMask.show();
		} catch(e) {}
	},
	hideMask:function() {
		try {
			this.searchMask.hide();
		} catch(e) {}
	},
	validate:function() {
		var me = this;
		var lastName = me.down("#lastName").getValue();
		var firstName = me.down("#firstName").getValue();
		var firmName = me.down("#businessCenter").getValue();
		var email = me.down("#email").getValue();
		var isError = false;
		var errorMessage = "";
		if(lastName.length == 0 && firstName.length == 0 && firmName.length == 0 && email.length == 0) {
			isError = true;
			errorMessage = "Please enter search criteria.";
		} else {
		     var lastNameLength = 0;
			 var firstNameLength = 0;
			 if(lastName.length > 0 || firstName.length > 0){
				 var sum = firstName.length + lastName.length;	
				 if(sum < 2 || !/(?=(?:.*?[A-Za-z0-9]){2})/.test(firstName + lastName)){
					 isError = true;
					 errorMessage = "Please enter at least 2 alphanumeric characters to search by First Name/Last Name.";
				 }
			 } else if(firmName.length > 0 && (firmName.length < 2 || !/(?=(?:.*?[A-Za-z0-9]){2})/.test(firmName))) {
				 isError = true;
				 errorMessage = "Please enter at least 2 alphanumeric characters to search by Buying Center.";
			 } else if(email.length > 0 && (email.length < 2 || !/(?=(?:.*?[A-Za-z0-9]){2})/.test(email))) {
				 isError = true;
				 errorMessage = "Please enter at least 2 alphanumeric characters to search by Email.";
			 }
		}
		 if(isError) {
			 me.down("#infoComp").show();
	 		 var searchResultsLblEl = Ext.get(Ext.DomQuery.selectNode(".searchResultsLbl",me.getEl().dom));
		 	 searchResultsLblEl.setHTML(errorMessage);
		 	 me.manageNextBtnVisibility();
			 return false;
		 }
		 return true;
	},
	doSearch:function() {
		var me =this;
		me.down("#searchClientOrEmpResultGrid").hide();		 		
		me.down("#infoComp").hide();		 		
		var lastName = me.down("#lastName").getValue();
		var firstName = me.down("#firstName").getValue();
		var firmName = me.down("#businessCenter").getValue();
		var email = me.down("#email").getValue();
		var isInternal = me.isEmployeeTab ? true : false;
		if(me.validate()) {
			this.showMask();
			Ext.Ajax.request({
				url: '/DDL/jsp/BCLSignupService.jsp?characterSet=UTF-8&action=search',
				scope: this,
				params: {lastName:lastName,firstName:firstName,firmName:firmName,email:email,isInternal:isInternal},
				success: function(response,opts){
		    		var retObj = Ext.decode(Ext.String.trim(response.responseText));
			 		var accounts = retObj.accounts;
		 			me.down("#infoComp").show();
		 			var searchResultsLblEl = Ext.get(Ext.DomQuery.selectNode(".searchResultsLbl",me.getEl().dom));
		 			var nextBtnEl = Ext.get(Ext.DomQuery.selectNode(".next-btn-container",me.getEl().dom));
			 		if(accounts) {
			 			if(accounts.length > 0) {
			 				var plural = (accounts.length > 1) ? " results found" : " result found";
			 				var message = accounts.length + plural;
				 			searchResultsLblEl.setHTML(message);
				 			nextBtnEl.setVisible(true);
				 			me.down("#searchClientOrEmpResultGrid").show();
			 				me.down("#searchClientOrEmpResultGrid").store.loadData(accounts);
			 			} else {
				 			//nextBtnEl.setVisible(false);
				 			me.manageNextBtnVisibility();
				 			searchResultsLblEl.setHTML("No results found");
			 			}
			 		} else {
			 			var errorCode = retObj.errorCode;
			 			me.manageNextBtnVisibility();
			 			//nextBtnEl.setVisible(false);			 			
						if(errorCode == 50006) {
				 			searchResultsLblEl.setHTML("Too many results found. Please refine your search criteria.");
						} else {
				 			searchResultsLblEl.setHTML(retObj.message);
						}
			 		}
			 		resizeMainWindow();
			 		this.hideMask();
				},
				failure: function(response,opts){
					com.barclays.DV.view.Utils.showMsg("Subscriptions - Error","Error while retrieving Client/Employee details based on Search critieria");
					this.hideMask();
				}
			});			
		}
	}
	
});


Ext.define('com.barclays.PubSubscription.view.SearchClientOrEmpResultGrid',{
	extend: 'Ext.grid.Panel',
	alias: 'widget.searchClientOrEmpResultGrid',
	cls:'searchResultGrid',
	viewConfig: {
		preserveScrollOnRefresh: true
	},
	initComponent:function() {
		var me = this;
		Ext.applyIf(me, {
			selModel:Ext.create("Ext.selection.CheckboxModel",{ showHeaderCheckbox:false, checkOnly: true,  flex:3/100 }),
			store:  new Ext.data.Store({
				fields:['fullName','webUserID','firstName','lastName','emailAddress','firmName', 'crmID','isInternal']
			}),
			columns:[{
				   text: 'NAME',
				   dataIndex: 'fullName',
				   flex: 30/100,
				   sortable:true
			    },
			    {
			    	text: 'BUYING CENTER',
				   sortable: true,
				   dataIndex: 'firmName',
				   flex: 37 /100
			    },
			    {
			       text: 'EMAIL',
				   sortable: true,
				   dataIndex: 'emailAddress',
				   cls:'email',
				   flex: 23 /100
			    }
			]
	   });
	   me.callParent(arguments);
	},
	listeners:{
		select:function(obj,record) {
			var selectedContacts = [];
			var recKey = "";
			if(record.data.webUserID && record.data.webUserID.length > 0) {
				recKey = record.data.webUserID;
			} else {
				recKey = record.data.crmID;
			}
			selectedContacts.push(record.data);
			var obj = {
				displayName:record.data.fullName,	
				isList:false,
				selectedContacts:selectedContacts
			};
			manageClientGlobalEvent.fireEvent("itemAdded",{
				key: recKey,
				isList:false,
				selectedContacts:obj
			});
		},
		deselect:function(obj,record) {
			var recKey = "";
			if(record.data.webUserID && record.data.webUserID.length > 0) {
				recKey = record.data.webUserID;
			} else {
				recKey = record.data.crmID;
			}
			manageClientGlobalEvent.fireEvent("itemRemoved",{
				key:recKey
			});
		}
	}
});

Ext.define('com.barclays.PubSubscription.view.ManageClienInfoPanel' ,{
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
								'<div class="header" style="width:200px;border-right:#e4e4e4 1px solid;float:left;"><div class="headerColumn">BUYING CENTER</div></div>',
								'<div class="header" style="width:450px;float:left;"><div class="headerColumn">Email</div></div>',
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
	        	'<iframe class="iframeshimFlyoutClientInfo" frameborder="0" scrolling="no">',
					'<html><head></head><body></body></html>',
				'</iframe>',
			'</tpl>',{
		    		needIframe : function(){
					var needIframeShim = false;
					if(Ext.isIE || Ext.isGecko){
						var popupContentWindow = top.frames["popupContent"];
						if(popupContentWindow){
							try{
								var myIFrame = document.getElementById("popupContent");
		   						var content = popupContentWindow.document.body.innerHTML;
		   						if(content.indexOf('<embed type="application/pdf"') == 0  
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
		} else if(elem.hasCls("select") && !elem.hasCls("selectButton-inactive")) {
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
						var obj = {
								displayName:selectedContact.fullName,	
								isList:false,
								selectedContacts:this.selectedContacts
						};
						manageClientGlobalEvent.fireEvent("itemAdded",{
							key:this.activeKey,
							isList:false,
							selectedContacts:obj
						});	
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
			this.selectedContacts = {};
			Ext.getBody().un("click",this.hideClienInfoPanel,this);
		}
	},
	hideClienInfoPanel:function() {
		this.hide();
	}
});

Ext.define('com.barclays.PubSubscription.view.ManageSelectedClientPanel' ,{
	extend:'Ext.Component',
	alias: 'widget.manageSelectedClientPanel',
	cls:'selectedClientPanel',
	autoScroll: true,
	selectedListMap:new Ext.util.HashMap(),
	data:{},
	tpl: new Ext.XTemplate(
			'<div class="selected-items-layout">',
            	'<div class="selected-items-box"></div>',
            '</div>'
    ),
    itemTpl: new Ext.XTemplate(
            '<div class="selected-item" item-key="{[this.getEscapedKey(values)]}">',            	
                '<div style="float:left" isList="{isList}" class="clickable display-name">{name}&nbsp;{[this.getEmail(values)]}</div>',
                '<div class="close-icon clickable delete"></div>',
                '<div style="height:0;clear:both"></div>',
             '</div>',{
            	getEscapedKey:function(values) {
            		return escape(values.key);
            	},
            	getEmail:function(values) {
            		if(!values.isList) {
            			var email = values.usePrimaryEmail ? values.primaryEmail : values.alternateEmail;
            			return  "(" + values.email + ")";
            		}
            	}
            }
    ),
	initComponent:function() {
		var me =this;
		me.relayEvents(manageClientGlobalEvent,["itemAdded","itemRemoved"]);
		me.on('itemRemoved',function(params) {
			me.removeItem(params.key);
		});
		me.on('itemAdded',function(params) {
			me.addItem(params);
		});
		me.callParent(arguments);
	},
	afterRender: function() {
		this.callParent(arguments);
		this.getEl().on({
			click : {
				scope:this,
				fn :this.handleClickableClick,
				delegate : '.clickable'
			}	
		});
		this.refresh();
	},
	handleClickableClick:function(e,t) {
		e.preventDefault();
		var me = this;
		var element = Ext.get(t);
		if(element.hasCls("delete")) {
			var key = unescape(t.parentNode.getAttribute('item-key'));
			me.removeItem(key);
		} else if(element.hasCls("display-name")) {
			var isList = t.getAttribute('isList');
			var key = unescape(t.parentNode.getAttribute('item-key'));
			var selectedContacts = me.selectedListMap.get(key).selectedContacts;
			var selectedContact = selectedContacts[0];
			if(isList == "true") {
				me.showFlyout(t,selectedContacts);
			} else {
				Ext.Ajax.request({
					url: "/LNS/subscription/service/getEmails",
					params:{forBCLId:selectedContact.webUserID},
					scope: this,
					success: function(response,opts){
						var retObj = Ext.JSON.decode(response.responseText);
						if(retObj.primary && retObj.primary != null) {
							selectedContact.primaryEmail = retObj.primary;
						}
						if(retObj.alternate && retObj.alternate != null) {
							selectedContact.alternateEmail = retObj.alternate;
						}
						if(retObj.use && retObj.use == "primary") {
							selectedContact.usePrimaryEmail = true;
						} else {
							selectedContact.usePrimaryEmail = false;
						}
						me.showFlyout(t,selectedContacts);
					},
					failure: function(response,opts){
						com.barclays.DV.view.Utils.showMsg("Subscriptions - Error","Error while retrieving email");
					}
			   });
			}
		}
		return false;
	},
	showFlyout:function(t,selectedContacts) {
		var element = Ext.get(t);
		var box = element.getBox();
		var key = unescape(t.parentNode.getAttribute('item-key'));
		if(!this.clientInfoPanel) {
			this.clientInfoPanel = Ext.create("com.barclays.PubSubscription.view.ManageClienInfoPanel");				
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
	},
	addItem:function(params) {
		var me =this;
		var map = me.selectedListMap;
		if(map.containsKey(params.key)) {
			me.selectedListMap.add(params.key,params.selectedContacts);
			Ext.Array.each(Ext.DomQuery.select(".selected-item",me.getEl().dom),function(item){
	    		var itemEl = Ext.get(item);
				var displayNameEL = Ext.get(Ext.DomQuery.selectNode(".display-name",itemEl.dom));
				var key = unescape(itemEl.getAttribute('item-key'));
				if(params.key == key) {
					if(params.isList) {
						displayNameEL.setHTML(params.selectedContacts.displayName);						
					} else {
						var selectedContact = params.selectedContacts.selectedContacts[0];
						var email = selectedContact.usePrimaryEmail ? selectedContact.primaryEmail : selectedContact.alternateEmail;
						var html = params.selectedContacts.displayName + " (" + email + ")";
						displayNameEL.setHTML(html);	
					}
					return;
				}
	   		});	
		} else {
			if(!params.isList) {
				var selectedContact = params.selectedContacts.selectedContacts[0];
				if(selectedContact.webUserID && selectedContact.webUserID.length > 0) {
					me.selectedListMap.add(params.key,params.selectedContacts);
					this.getEmails(selectedContact,params.key,params.selectedContacts.displayName);
				} else {
					this.showMask();
					var reqparams = {
							crmID : selectedContact.crmID,
							action : "createClientAccount"
					};
					Ext.Ajax.request({
					    url: '/DDL/jsp/BCLSignupAccountCreationService.jsp?characterSet=UTF-8',
					    params: reqparams,
					    scope: this,
					    method: 'POST',
					    success: function(response,opts){
							var retObj = Ext.decode(Ext.String.trim(response.responseText));
							if(retObj.webUserID){
								selectedContact.webUserID = retObj.webUserID;
								params.key = retObj.webUserID;
								me.selectedListMap.add(params.key,params.selectedContacts);
								this.hideMask();
								this.getEmails(selectedContact,params.key,params.selectedContacts.displayName);
							}
							else if(retObj.errorCode) {
								this.hideMask();
								com.barclays.DV.view.Utils.showMsg("Subscriptions - Error","Error while creating BCL ID");
							}
						},
						failure: function(response,opts){
							this.hideMask();
							com.barclays.DV.view.Utils.showMsg("Subscriptions - Error","Error while creating BCL ID");
						}
					});
				}

			} else {
				me.selectedListMap.add(params.key,params.selectedContacts);
				var selectedElemEL = Ext.get(Ext.DomQuery.selectNode(".selected-items-box",me.getEl().dom));
				me.itemTpl.append(selectedElemEL,{
					name:params.selectedContacts.displayName,
					isList:true,
					key:params.key
				});
			}
		}
		if(me.hidden) {
			me.show();
		}
		resizeMainWindow();
		this.fireEvent("contactAdded"); 
		return false;
	},
	showMask:function() {
        try {
			if(!this.clientMask) {
	        	var manageComp = Ext.ComponentQuery.query('container[cls=manageClientPanel]')[0];
	        	this.clientMask =  new Ext.LoadMask(manageComp.getEl(),{
	        		msg:"Please wait...",
	        		msgCls:'manage-clientpanel-mask'
	        	});
	        }
	        this.clientMask.show();
        } catch(e) {}
	},
	hideMask:function() {
		try {
			this.clientMask.hide();
		} catch(e) {}
	},
	getEmails:function(selectedContact,key,displayName) {
		this.showMask();
		Ext.Ajax.request({
			url: "/LNS/subscription/service/getEmails",
			params:{forBCLId:selectedContact.webUserID},
			scope: this,
			success: function(response,opts){
				var retObj = Ext.JSON.decode(response.responseText);
				if(retObj.primary && retObj.primary != null) {
					selectedContact.primaryEmail = retObj.primary;
				}
				if(retObj.alternate && retObj.alternate != null) {
					selectedContact.alternateEmail = retObj.alternate;
				}
				selectedContact.usePrimaryEmail = (retObj.use && retObj.use == "primary") ? true : false;
				var selectedElemEL = Ext.get(Ext.DomQuery.selectNode(".selected-items-box",this.getEl().dom));
				this.itemTpl.append(selectedElemEL,{
					name:displayName,
					isList:false,
					email:selectedContact.usePrimaryEmail ? retObj.primary : retObj.alternate,
					key:key
				});
				this.hideMask();
			},
			failure: function(response,opts){
				this.hideMask();
				com.barclays.DV.view.Utils.showMsg("Subscriptions - Error","Error while retrieving email");
			}
		});
	},
	removeItem:function(key) {
		var isKeyRemoved = this.selectedListMap.removeAtKey(key);
		if(isKeyRemoved) {
			Ext.Array.each(Ext.DomQuery.select(".selected-item",this.getEl().dom),function(item){
				var itemEl = Ext.get(item);
				var itemKey = unescape(itemEl.getAttribute('item-key'));
				if (key == itemKey) {
					itemEl.dom.parentNode.removeChild(itemEl.dom)
				}
			});
			if(this.selectedListMap.getCount() == 0) {
				var selectedElemEL = Ext.get(Ext.DomQuery.selectNode(".selected-items-box",this.getEl().dom));
				selectedElemEL.setHTML("");
				this.hide();
			}
			resizeMainWindow();
			if(this.clientInfoPanel && this.clientInfoPanel.isVisible()) {
				this.clientInfoPanel.hide();
			}
			this.fireEvent("contactRemoved",{
				key:key
			});		
		}
		return false;
	},
	refresh:function() {
		var selectedElemEL = Ext.get(Ext.DomQuery.selectNode(".selected-items-box",this.getEl().dom));
		selectedElemEL.setHTML("");
		this.selectedListMap = new Ext.util.HashMap();
		this.displayMap = new Ext.util.HashMap();
		this.hide();
	}
});

    