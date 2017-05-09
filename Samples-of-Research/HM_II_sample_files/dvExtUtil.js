Ext.Ajax.timeout = 90000;


Ext.define('com.barclays.DV.view.picker.DatePicker',{
	extend: 'Ext.picker.Date',
	alias:'widget.dvdatepicker',
	cls:'dv-date-picker',
	width:180,
	dayNames:['SU','M','TU','W','TH','F','SA'],
	showToday:false,
	monthYearText:'',
	ariaTitle:'',
	showMonthPicker : function() {
		return;
	},
	afterRender:function() {
			var obj = this;
			Ext.Array.each(Ext.DomQuery.select(".date-picker-prev-month",this.getEl().dom),function(item){
	    		var itemEl = Ext.get(item);
	   			itemEl.on("click",function(e,t){
	   				e.preventDefault();
	   				obj.setValue(Ext.Date.add(obj.getValue(), Ext.Date.MONTH, -1));
	   				return false;
	   			});
	   		});	
			Ext.Array.each(Ext.DomQuery.select(".date-picker-next-month",this.getEl().dom),function(item){
	    		var itemEl = Ext.get(item);
	   			itemEl.on("click",function(e,t){
	   				e.preventDefault();
	   				obj.setValue(Ext.Date.add(obj.getValue(), Ext.Date.MONTH, 1));
	   				return false;
	   			});
	   		});				
			Ext.Array.each(Ext.DomQuery.select(".date-picker-prev-year",this.getEl().dom),function(item){
	    		var itemEl = Ext.get(item);
	   			itemEl.on("click",function(e,t){
	   				e.preventDefault();
	   				obj.setValue(Ext.Date.add(obj.getValue(), Ext.Date.YEAR, -1));
	   				return false;
	   			});
	   		});	
			Ext.Array.each(Ext.DomQuery.select(".date-picker-next-year",this.getEl().dom),function(item){
	    		var itemEl = Ext.get(item);
	   			itemEl.on("click",function(e,t){
	   				e.preventDefault();
	   				obj.setValue(Ext.Date.add(obj.getValue(), Ext.Date.YEAR, 1));
	   				return false;
	   			});
	   		});					
			Ext.get(Ext.DomQuery.selectNode(".date-picker-yesterday",this.getEl().dom)).on("click",function(e,t) {
				obj.setValue(Ext.Date.add(obj.getValue(), Ext.Date.DAY, -1));
			});
			Ext.get(Ext.DomQuery.selectNode(".date-picker-prev-week",this.getEl().dom)).on("click",function(e,t) {
				obj.setValue(Ext.Date.add(obj.getValue(), Ext.Date.DAY, -7));
			});
			Ext.get(Ext.DomQuery.selectNode(".date-picker-half-year",this.getEl().dom)).on("click",function(e,t) {
				obj.setValue(Ext.Date.add(obj.getValue(), Ext.Date.MONTH, -6));
			});
			Ext.get(Ext.DomQuery.selectNode(".date-picker-today",this.getEl().dom)).on("click",function(e,t) {
				obj.setValue(new Date());
			});	
			this.callParent(arguments);
	},
	renderTpl: [
	            '<div id="{id}-innerEl" role="grid">',
	                '<div role="presentation" class="{baseCls}-header">',
	                    '<div class="{baseCls}-prev-year"><a id="{id}-prevYearEl" class="date-picker-prev-year" href="#" role="button" ></a></div>',
	                    '<div class="{baseCls}-prev"><a id="{id}-prevEl" href="#" class="date-picker-prev-month" role="button" ></a></div>',
	                    '<div class="{baseCls}-month" id="{id}-middleBtnEl">{%this.renderMonthBtn(values, out)%}</div>',
	                    '<div class="{baseCls}-next"><a id="{id}-nextEl" href="#"class="date-picker-next-month" role="button" ></a></div>',
	                    '<div class="{baseCls}-next-year"><a id="{id}-nextYearEl" class="date-picker-next-year" href="#" role="button" ></a></div>',
	                '</div>',
	                '<table id="{id}-eventEl" class="{baseCls}-inner" cellspacing="0" role="presentation">',
	                    '<thead role="presentation"><tr role="presentation">',
	                        '<tpl for="dayNames">',
	                            '<th role="columnheader" title="{.}"><span>{.:this.firstInitial}</span></th>',
	                        '</tpl>',
	                    '</tr></thead>',
	                    '<tbody role="presentation"><tr role="presentation">',
	                        '<tpl for="days">',
	                            '{#:this.isEndOfWeek}',
	                            '<td role="gridcell" id="{[Ext.id()]}">',
	                                '<a role="presentation" href="#" hidefocus="on" class="{parent.baseCls}-date" tabIndex="1">',
	                                    '<em role="presentation"><span role="presentation"></span></em>',
	                                '</a>',
	                            '</td>',
	                        '</tpl>',
	                    '</tr></tbody>',
	                '</table>',
	                '<tpl if="showToday">',
	                	'<div id="{id}-footerEl" role="presentation" class="{baseCls}-footer">{%this.renderTodayBtn(values, out)%}</div>',
	                '</tpl>',
                    '<div id="{id}-footerEl" role="presentation" class="{baseCls}-footer-panel">',
                    	'<ul style="float:right">',
                    		'<li><a class="date-picker-yesterday" href="#">Yesterday</a></li>',
                    		'<li><a class="date-picker-prev-month" href="#">-1 Month</a></li>',
                    		'<li><a class="date-picker-prev-year" href="#">-1 Year</a></li>',
            			'</ul>',     
                    	'<ul>',
                    		'<li><a class="date-picker-today" href="#">Today</a></li>',
                    		'<li><a class="date-picker-prev-week" href="#">-1 Week</a></li>',
                    		'<li><a class="date-picker-half-year" href="#">-6 Months</a></li>',
                    	'</ul>',
            		'</div>',		                
	            '</div>',
	            {
	                firstInitial: function(value) {
	                    return value.substring(0,2);
	                },
	                isEndOfWeek: function(value) {
	                    // convert from 1 based index to 0 based
	                    // by decrementing value once.
	                    value--;
	                    var end = value % 7 === 0 && value !== 0;
	                    return end ? '</tr><tr role="row">' : '';
	                },
	                renderTodayBtn: function(values, out) {
	                    Ext.DomHelper.generateMarkup(values.$comp.todayBtn.getRenderTree(), out);
	                },
	                renderMonthBtn: function(values, out) {
	                    Ext.DomHelper.generateMarkup(values.$comp.monthBtn.getRenderTree(), out);
	                }
	            }
	        ]
});

Ext.define('com.barclays.DV.view.DateField',{
	extend:'Ext.form.field.Date',
	alias:'widget.dvdatefield',
	hideTrigger : true,
	showToday:false,
	shadow:false,
	afterRender : function(){
		this.callParent(arguments);
		var that = this;
		this.getEl().on({
			click : {
				fn : function(e,t){
					that.onTriggerClick();
					that.focus(100);
				}
			}	
		});
	},
    createPicker: function() {
		var me = this,
        format = Ext.String.format;
		return Ext.create('com.barclays.DV.view.picker.DatePicker',{
            pickerField: me,
            ownerCt: me.ownerCt,
            renderTo: document.body,
            floating: true,
            hidden: true,
            focusOnShow: true,
            minDate: me.minValue,
            maxDate: me.maxValue,
            disabledDatesRE: me.disabledDatesRE,
            disabledDatesText: me.disabledDatesText,
            disabledDays: me.disabledDays,
            disabledDaysText: me.disabledDaysText,
            format: me.format,
            shadow:me.shadow,
            showToday: me.showToday,
            startDay: me.startDay,
            minText: format(me.minText, me.formatDate(me.minValue)),
            maxText: format(me.maxText, me.formatDate(me.maxValue)),
            listeners: {
                scope: me,
                select: me.onSelect
            },
            keyNavConfig: {
                esc: function() {
                    me.collapse();
                }
            }
		});
    }
	
});


Ext.define('com.barclays.DV.view.ThreadBarrier',{
	completedThreadCount:0,
	timeoutHandle: null,
	resultMap:[],
	requestMap: [],
	abortFlag: false,
	startTime: 0,
	config:{
		timeout:90000, //in millisecs , default 10sec
		timeoutCallbackFn: null,
		successCallbackFn: null,
		ajaxRequestConfigObjectsMap: {}, // map of ajax request configuration object except success and failure
		numberOfThread: 0,
		idToConsider: ''
		
	},
	constructor: function(config){
		if(!config.allOrNone){
			config.allOrNone = "YES";
		}
		this.initConfig(config);
		return this;
	},
	isAborted: function(){
		this.abortFlag =  (this.abortFlag || (this.startTime - (new Date()).getTime()) > this.timeout);
		return this.abortFlag;
	},
	meetingPoint: function(itemPK,result){
		if(this.isAborted() || ("_REQUEST_FAILED_" == result && "YES" === this.allOrNone)){
  			this.handleTimeout();
  		}
		this.resultMap[itemPK]= result;
		this.completedThreadCount++;
		//this.requestMap[itemPK] = null;
		delete this.requestMap[itemPK];
		if(this.completedThreadCount == this.numberOfThread){
			this.successCallbackFn(this.resultMap);
			window.clearTimeout(this.timeoutHandle);
		}
	},
	handleTimeout: function(){
		this.abortProcess();
		this.timeoutCallbackFn(this.resultMap);
	},
	abortProcess: function(){
		this.abortFlag = true;
		window.clearTimeout(this.timeoutHandle);
		for(var reqKey in this.requestMap){
			if(this.requestMap[reqKey]){
				Ext.Ajax.abort(this.requestMap[reqKey]);
				delete this.requestMap[reqKey];
			}
		}
	},
	start: function(){
		var that = this;
		this.abortFlag = false;
		this.startTime = (new Date()).getTime();
		this.resultMap = [];
		this.requestMap = [];		
		this.timeoutHandle = setTimeout(function(){
			that.handleTimeout();
		},this.timeout);
		for(var itemPK in  this.ajaxRequestConfigObjectsMap){
			var ajaxParamObject = this.ajaxRequestConfigObjectsMap[itemPK];
			ajaxParamObject.itemPKV = itemPK;
			ajaxParamObject.success = function(response,opts){
	   			var retObj = Ext.decode(Ext.String.trim(response.responseText));
	   			that.meetingPoint(opts.itemPKV,retObj);
		    };
		    
		    ajaxParamObject.failure = function(response,opts){
		    	var reqObj = that.requestMap[opts.itemPKV];
		    	if(!reqObj || !reqObj.hasOwnProperty("aborted") || reqObj.aborted != true){
		    		that.meetingPoint(opts.itemPKV,"_REQUEST_FAILED_");
		    	}
		    };
	   		
	  		var requestObj = Ext.Ajax.request(ajaxParamObject);
			that.requestMap[itemPK] = requestObj;
			
		};
		
	}
});

Ext.define('com.barclays.DV.view.MessageBody',{
	extend: 'Ext.Component',
	alias: 'widget.dvmessagebody',
	data: [],
	tpl: new Ext.XTemplate('<div>',
		'<div class="short-desc-container">',
			'<div>',
				'Sorry, an error has occurred. You may notify us by sending an e-mail to <a href="mailto:xraRTBResearchPublic@barclayscapital.com?subject={title}&cc=fieqweb@barclayscapital.com&body={[this.getLongDescParam(values)]}">xraRTBResearchPublic@barclayscapital.com</a>.',
			'</div>',
		'</div>',
		'<div style="position:relative;text-align:right;padding:5px 10px"><a href="#" class="showDetailBtn">Show Detail</a></div>',
		'<div class="long-desc-container" style="display:none;">',
		'<div class="longDescInner">',
			'{[this.getLongDesc(values)]}',
		'</div>',
		'</div>',
		
	'</div>',{
		getShortDesc: function(values){
			var shortDesc = values.shortDesc || "Sorry, an error has occurred.";
			
		},
		getLongDescParam: function(values){
			var longDesc = Ext.String.trim(values.longDesc || "Sorry, an error has occurred.");
			longDesc = longDesc.replace(/\n/g,'%0A');
			longDesc = encodeURI(longDesc);
			return longDesc.substring(0,200);
		},
		getLongDesc: function(values){
			var longDesc = Ext.String.trim(values.longDesc || "Sorry, an error has occurred.");
			longDesc = longDesc.replace(/\n/g,'%0A');
			longDesc = Ext.String.htmlEncode(longDesc);
			return longDesc;
		}
	}),
	afterRender: function(){
		var that = this;
		Ext.get(Ext.DomQuery.selectNode("a.showDetailBtn",this.getEl().dom)).on("click",function(e,t){
			e.preventDefault();
			var state = t.getAttribute("state");
			if("collapse" == state){
				Ext.get(Ext.DomQuery.selectNode("div.long-desc-container",that.getEl().dom)).setDisplayed("none");
				t.setAttribute("state","expand");
				/* will make the animation consistent later
				that.msgBox.getEl().setHeight(100,{
					duration: 300,
					callback: function(){
						that.msgBox.setHeight(100);
						Ext.get(Ext.DomQuery.selectNode("div.long-desc-container",that.getEl().dom)).setDisplayed("none");
					}
				});
				*/
				that.msgBox.setHeight(100);
				t.innerHTML = "Show Detail";
			}else{
				Ext.get(Ext.DomQuery.selectNode("div.long-desc-container",that.getEl().dom)).setDisplayed("block");
				t.setAttribute("state","collapse");
				/*
				that.msgBox.getEl().setHeight(220, {
					duration: 300,
					callback: function(){
						that.msgBox.setHeight(220);
					}
				});
				*/
				that.msgBox.setHeight(220);
				t.innerHTML = "Hide Detail";
			}
			return false;
		});
		
		this.callParent(arguments);
	}
});

Ext.define('com.barclays.DV.view.Utils',{
	statics: {
		showMsg: function(title,longDesc,shortDesc){
	
			var findInPagePopupRect = function(){
			var bodyWidth = Ext.getBody().getWidth();
			var windowWidth = 400;
			var x = (bodyWidth - windowWidth)/2;
			
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
				if(outerHeight > viewportHeight){
					visibleHeightForThisFrame = viewportHeight - effectiveWindowTop;  
				}
			}else{
				var scrollTop = document.body.scrollTop;
				visibleHeightForThisFrame = viewportHeight;	
				if("popupContent" == window.name){ // when inside docview popup
					visibleHeightForThisFrame -= 55;
				}
			}
			
			var windowHeight =  220;
			var yMin = (visibleHeightForThisFrame - windowHeight) / 2;
			var y = scrollTop - currentWindowTop  + yMin;
			y = Math.max(y,yMin);
			
			return {x:x , y : y, width: windowWidth, height: windowHeight};
		}
	
			var popupRect = findInPagePopupRect();
	
			title = title || "Error";
			shortDesc = shortDesc || "Sorry, an error has occurred.";
			
			var msgBox = Ext.create('Ext.window.Window',{
			    title: title,
				y: popupRect.y,
				x : popupRect.x,
			    icon: '/BC_S/bcl_s/icn/exclamation.gif',
			    iconCls: 'warning-icon',
			    cls: "DVMessageBox",
			    modal: true,
			    width: 400,
			    buttonAlign: 'center',
			    shadow: false,
			    onEsc: function(){
			    	msgBox.close();
			    }
			});
			
			msgBox.add(
				{
			    	xtype: 'dvmessagebody',
			    	data: {
			    		title: title,
			    		shortDesc: shortDesc,
			    		longDesc: longDesc
			    	},
			    	msgBox: msgBox
			    }
			);
			msgBox.show();
		},
		showInpagePopup: function(url) {
			var findInPagePopupRect = function(){
				var bodyWidth = Ext.getBody().getWidth();
				var windowWidth = Math.round(bodyWidth * .7);
				var x = (bodyWidth - windowWidth)/2;
				
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
					if(outerHeight > viewportHeight){
						visibleHeightForThisFrame = viewportHeight - effectiveWindowTop;  
					}
				}else{
					var scrollTop = document.body.scrollTop;
					visibleHeightForThisFrame = viewportHeight;	
					if("popupContent" == window.name){ // when inside docview popup
						visibleHeightForThisFrame -= 55;
					}
				}
				
				var windowHeight =  Math.round(visibleHeightForThisFrame * .85);
				var yMin = (visibleHeightForThisFrame - windowHeight) / 2;
				var y = scrollTop - currentWindowTop  + yMin;
				y = Math.max(y,yMin);
				
				return {x:x , y : y, width: windowWidth, height: windowHeight};
			}
			
			var popupRect = findInPagePopupRect();
			var winObj = Ext.create('Ext.window.Window',{
				width: popupRect.width,
				height: popupRect.height,
				maxHeight: popupRect.height,
				minHeight: Math.max(400,popupRect.height),
				modal: true,
				shadow:'frame',
				shadowOffset :7,
				y: popupRect.y,
				x : popupRect.x,
				cls: 'inpage-popup-window ',
				items:[{
					xtype:'container',
					width: (popupRect.width - 78) ,
					loader :{
						url : url,
						loadMask: true,
						autoLoad: true,
						renderer : 'html',
						callback: function(x,y,z){
							
						}
					}
				}],
				
				dockedItems : [
					{
						xtype: 'component',
						style:'width:800px',
						tpl: new Ext.XTemplate('<div class="inner-body">',
						'<a href="#" class="window-close-btn">X</a>',
						'<div style="clear:both"></div>',
						'</div>'),
						data: [],
						cls: 'custom-header'
					}				
				],
				title: '',
				header: false,
				frame:true,
				bodyCls: 'win-body ',
				listeners :{
					click : {
						element: 'el',
						fn : function(e,t){
							if(Ext.get(t).hasCls("window-close-btn")){
								winObj.close();
								e.preventDefault();
								return false;
							}
						}
					},
					show:function() {
						var me = this;
						Ext.select('.x-mask').addListener('click', function() {
		                    me.close();
		                });
						var item = Ext.DomQuery.selectNode(".x-window-body",me.getEl().dom);
						Ext.get(item).dom.style.overflow = "hidden";
						this.getEl().on('mouseover', function(event) {
							var item = Ext.DomQuery.selectNode(".x-window-body",me.getEl().dom);
							if(!event.within(me.getEl(), true)){
								Ext.get(item).dom.style.overflow = "auto";
							}
						});
						this.getEl().on('mouseout', function(event) {
							var item = Ext.DomQuery.selectNode(".x-window-body",me.getEl().dom);
							if(!event.within(me.getEl(), true)){
								Ext.get(item).dom.style.overflow = "hidden";
							}
						});
					}
				}
			}).show();
		},
		resizeMainWindow : function(){
			if(!Ext.isIE && window != window.parent && window.parent["BCResizeScreen"]){
				try{
					window.parent["BCResizeScreen"]();
				}catch(e){}
			}
		},
		fixPNGIE6 : function(){
			if(Ext.isIE6){
				try{
					var pngs = Ext.dom.Query.select("img[@src$=png]");
					Ext.Array.each(pngs,function(img){
						if(!img.getAttribute("pngfixed")){
							var imgID = (img.id) ? "id='" + img.id + "' " : "";
							var imgClass = (img.className) ? "class='" + img.className + "' " : "";
							var imgTitle = (img.title) ? "title='" + img.title + "' " : "title='" + img.alt + "' ";
							var imgStyle = "display:inline-block;" + img.style.cssText;
							if (img.align == "left") imgStyle = "float:left;" + imgStyle;
							if (img.align == "right") imgStyle = "float:right;" + imgStyle;
							if (img.parentElement.href) imgStyle = "cursor:hand;" + imgStyle;
							var strNewHTML = "<div " + imgID + imgClass + imgTitle
							+ " style=\"" + "width:" + img.width + "px; height:" + img.height + "px;" + imgStyle + ";"
							+ "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader"
							+ "(src=\'" + img.src + "\', sizingMethod='scale');\"></div>";
							img.outerHTML = strNewHTML;
						}
					});
				}catch(e){
				}
			}
		}
		
	}
});


Ext.define('DocView.Ext.ui.selection.CustomCheckboxModel',{
	extend: 'Ext.selection.CheckboxModel',
	selectAll: function(suppressEvent) {
        var me = this,
            selections = me.store.getRange(),
            i = 0,
            len = selections.length,
            start = me.getSelection().length;

        me.bulkChange = true;
        for (; i < len; i++) {
        	 var record = selections[i];
        	 if (!record.data.isDisabled){             
        		 me.doSelect(selections[i], true, suppressEvent);       
			 }
        }
        delete me.bulkChange;
        // fire selection change only if the number of selections differs
        me.maybeFireSelectionChange(me.getSelection().length !== start);
    },
    renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
    	if(rowIndex ==0 && colIndex == 0) {
    		this.determineHeaderCheckBox();
    	}
		if(!record.data.isDisabled) {
	        metaData.tdCls = Ext.baseCSSPrefix + 'grid-cell-special';
	        return '<div class="' + Ext.baseCSSPrefix + 'grid-row-checker">&#160;</div>';
	 	} else {
	 		metaData.tdCls = Ext.baseCSSPrefix + 'grid-cell-special';
	 		return '<div class="' + Ext.baseCSSPrefix + 'grid-row-checker-disabled">&#160;</div>';
	 	}
	
    },
    determineHeaderCheckBox: function() {
    	var view     = this.views[0];
    	var headerCt = view.headerCt;
    	 if(this.store.disabledRecordCount === this.store.getCount()) {
			 headerCt.getHeaderAtIndex(0).removeCls("x-column-header-checkbox");
			 headerCt.getHeaderAtIndex(0).addCls("x-column-header-checkbox-disabled");
		 }  else {
			 headerCt.getHeaderAtIndex(0).removeCls("x-column-header-checkbox-disabled");
			 headerCt.getHeaderAtIndex(0).addCls("x-column-header-checkbox");
		 }
    },
    beforeselect: function( rowModel, record,index, eOpts ) {
		if(!record.data.isDisabled) {
			return true;
		} else {
			return false;;
		}
	},
	selectionChange:function() {
		 var hdSelectStatus = this.selected.getCount() === (this.store.getCount() - this.store.disabledRecordCount);
	     this.toggleUiHeader(hdSelectStatus);
	}
		
});

Ext.define('DocView.Ext.ui.selection.CustomRadioModel',{
	extend: 'DocView.Ext.ui.selection.CustomCheckboxModel',
	mode: 'SINGLE',
	showHeaderCheckbox: false,
	renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
		if(!record.data.isDisabled) {
	        metaData.tdCls = '';
	        return '<div class="' + Ext.baseCSSPrefix + 'grid-row-radio">&#160;</div>';
	 	} else {
	 		metaData.tdCls = '';
	 		return '<div class="' + Ext.baseCSSPrefix + 'grid-row-radio-disabled">&#160;</div>';
	 	}
	
    }
		
});


/**
BELOW CODES ARE GENERIC OLD CODE (APART FROM SIMILAR CODE FOR MULTIPART IN mpUtil.js) 
TO DISPLAY SUBSCRIPTION,LIBRARY AND EMAIL LINKS. GOING FORWARD, USE share.js. IT IS USED 
ONLY IN featuredMainPublcationNugget.js WHICH WAS DEVELOPED ACCORDING TO NEW HOMEPAGE'S
OLD DESIGN (WHICH WAS DISCARDED). WE CAN REMOVE THIS CODE.  

**/


Ext.define('com.barclays.DV.view.ToolActionPanelEventBus' ,{
	extend: 'Ext.util.Observable',
    constructor: function(){
        this.callParent(arguments);
        this.addEvents("panelOpened","forBCLIDUpdated");
    }
});

Ext.define('com.barclays.DV.view.ToolActionPanelWrapper' ,{
	extend : 'Ext.Component',
	alias : 'widget.DVToolActionPanelWrapper',
	componentCls: "clearfix",
	data : {},
	tpl : ['<tpl for="."><ul class="clearfix linkbar">',
		'<tpl if="this.showSubscription(values)">',
			'<li class="link-item subscription-link"><a class="first" href="#">Subscribe</a></li>',
		'</tpl>',
		'<tpl if="this.showLibrary(values)">',
			'<li class="link-item library-link"><a href="#">Library</a></li>',
		'</tpl>',
		'<tpl if="this.showEmail(values)">',
			'<li class="link-item email-link"><a href="#">Email</a></li>',
		'</tpl>',
		'</ul><br/>',
		'<div class="action-panel-placeholder" style="width:100%;position:relative;"></div>',
		'</tpl>',{
			showSubscription: function(values){
				var t = values;
				return values.showSubscription;
			},
			showLibrary: function(values){
				return values.showLibrary;
			},
			showEmail: function(values){
				return values.showEmail;
			}
		}
	],
	
	afterRender: function(){
		this.callParent(arguments);
		this.getEl().on("click", this.handleLinkItemClicked, this,{
			delegate: '.link-item'
		});
		this.panelPlaceholder = Ext.get(Ext.DomQuery.selectNode(".action-panel-placeholder",this.getEl().dom));
		var dataObj = {};
		dataObj.data = this.payload;
		dataObj.width = this.panelPlaceholder.getWidth();
		dataObj.renderTo = this.panelPlaceholder;
		this.payload.renderTo = this.panelPlaceholder;
		this.toolPanel = Ext.create('com.barclays.DV.view.ToolActionPanel',this.payload);
		this.toolPanel.show();
		
	},
	handleLinkItemClicked: function(evt,node){
		var el = Ext.get(node);
		var containerNode = Ext.DomQuery.selectNode(".action-panel-container",this.getEl().dom);
		var containerEl = Ext.get(containerNode);
		this.toolPanel.show();
		if(el.hasCls("subscription-link")){
			this.toolPanel.handleSubscribeClick();
		}else if(el.hasCls("library-link")){
			this.toolPanel.handleLibraryClick();
		}else if(el.hasCls("email-link")){
			this.toolPanel.handleEmailClick();
		} 
	}
});

/*
subscriptionData:{
	isMenuTreeSubscription : true|false
	subscriptionLookupPubId : pubId //use menuToSubscription api to figure out the linkid
	subscriptionVals://array of name value pair, eg, [{paramName:"SECTIONID",paramValue:"123"},{paramName:"LANGUAGES",paramValue:"ENG,JPN"}]
} 	

emailMeData:
	object with pubId ,title and uri 
	{
	pubId: publication.pubId,
	title: publication.title,
	uri:uri
	}, 
	
	or array of these if multiple values 
	[
		{pubId: publication.pubId,title: publication.title,uri:uri},
		{pubId: publication.pubId,title: publication.title,uri:uri}
	]
	or lookup function with signature fn(callbackFn) and pass above mentioned array as first parameter	
	{
		lookupFn : fn,
		refObj : refObj,
		arguments : array //so that we can do lookupFn.apply(refObj,arguments)
	}



*/

Ext.define('com.barclays.DV.view.ToolActionPanel' ,{
	extend : 'Ext.Component',
	floating: true,
	cls: ' tap hidden',
	data: {},
    alias : 'widget.DVToolActionPanel',
	hideSignal: false,
	currentToolType: '',
	outstandingRequests: {},
    subscriptionBarrier: null,
    config: {
    	subscriptionData: {
	        isMenuTreeSubscription : false,
	        subscriptionLookupPubId : '',
	        subscriptionVals : null,
			subscriptionDisplayLabel: '',
		 	subscriptionLinkQuery: '',
		 	subscriptionLabelPrefix: '',
		 	languagePreferences: []
        },
        emailMeData :{}
    },
    constructor: function(initialConfig){
    	if(!initialConfig){
    		initialConfig = {};
    	}
    	if(!initialConfig.subscriptionData){
    		initialConfig.subscriptionData = {};
    	}
    	if(!initialConfig.subscriptionData.isMenuTreeSubscription){
    		initialConfig.subscriptionData.isMenuTreeSubscription = false; 
    	}
    	if(!initialConfig.subscriptionData.subscriptionLookupPubId){
    		initialConfig.subscriptionData.subscriptionLookupPubId = ''; 
    	}
    	if(!initialConfig.subscriptionData.subscriptionVals){
    		initialConfig.subscriptionData.subscriptionVals = null; 
    	}
    	if(!initialConfig.subscriptionData.subscriptionDisplayLabel){
    		initialConfig.subscriptionData.subscriptionDisplayLabel = ''; 
    	}
    	if(!initialConfig.subscriptionData.subscriptionLinkQuery){
    		initialConfig.subscriptionData.subscriptionLinkQuery = ''; 
    	}
    	if(!initialConfig.subscriptionData.subscriptionLabelPrefix){
    		initialConfig.subscriptionData.subscriptionLabelPrefix = ''; 
    	}
    	if(!initialConfig.subscriptionData.languagePreferences){
    		initialConfig.subscriptionData.languagePreferences = []; 
    	}
    	
    	this.callParent(arguments);
    },
    tpl : [	'<div  style="" class="tap-wrapper">',
			'<div class="tool-top-border" style=""></div>',
			'<div class="action-panel-container" style="overflow:hidden;position:relative;background-color:#000;">',
				'<div class="action-panel-content-wrapper">',
				'<div style="height: 1px;line-height:1px;"> </div>',//prevent margin collapse
				'<div class="action-panel-content" style=""></div>',
				'<div style="height: 1px;line-height:1px;"> </div>',//prevent margin collapse
				'</div>',
			'</div>',
			'<div class="tool-bottom-border" style="-moz-border-radius-bottomleft:10px;-moz-border-radius-bottomright:10px;height:10px;background-color:#000;"></div>',
			'</div>'
	],
    loadingTemplate: new Ext.XTemplate(
    	'<div class="loading" style="text-align:center;vertical-align:middle;height:40px">',
    	'</div>'
    ),
    afterRender: function(){
    	this.callParent(arguments);
		this.containerEl = Ext.get(Ext.DomQuery.selectNode(".action-panel-container",this.getEl().dom));
		this.contentEl = Ext.get(Ext.DomQuery.selectNode(".action-panel-content",this.getEl().dom));
		this.contentWrapperEl = Ext.get(Ext.DomQuery.selectNode(".action-panel-content-wrapper",this.getEl().dom));
		
		if(!window["com.barclays.DV.view.ToolActionPanelEventBusIns"]){
			window["com.barclays.DV.view.ToolActionPanelEventBusIns"] = new com.barclays.DV.view.ToolActionPanelEventBus();
		}
		this.eventBus = window["com.barclays.DV.view.ToolActionPanelEventBusIns"];
		this.eventBus.addListener("panelOpened",this.handleOtherPanelOpened,this);
    },
    handleOtherPanelOpened: function(x,y,z){
    	if(x !== this){
    		this.hideContent();
    	}
    },
	showLoading: function(toolType,callback){
		if(this.hideSignal === true || toolType != this.currentToolType){
			return;
		}
		var firstTime = this.hasCls("hidden");//this is first being displayed
		this.removeCls("hidden");
		if(firstTime === true){
			this.containerEl.setHeight("1px");
		}
		this.loadingTemplate.overwrite(this.contentEl);
		var that = this;
		var anim = this.containerEl.getActiveAnimation();
    	
		if(this.animation){
			this.animation.end();
		}

		this.animation = new Ext.fx.Anim({
			target: this.containerEl,
			duration: 150,
			from:{
				height: this.containerEl.getHeight()
			},
			to:{
				height:(Ext.get(Ext.DomQuery.selectNode(".loading",this.containerEl.dom))).getHeight()
			}
		});
			
	},
	showLocalLoading: function(containerEl,toolType){
		if(toolType != this.currentToolType){
			return;
		}
		this.loadingTemplate.overwrite(containerEl);

		var that = this;
		var anim = this.containerEl.getActiveAnimation();
    	
		if(this.animation){
			this.animation.end();
		}

		this.animation = new Ext.fx.Anim({
			target: this.containerEl,
			duration: 150,
			from:{
				height: this.containerEl.getHeight()
			},
			to:{
				height: this.contentWrapperEl.getHeight()
			}
		});
			
	},
	showContent: function(html,toolType){
		if(this.hideSignal === true || toolType != this.currentToolType){
			return;
		}
		
		var that = this;
		var anim = this.containerEl.getActiveAnimation();
    	
		if(this.animation){
			this.animation.end();
		}

		this.contentEl.dom.innerHTML = html;
		this.removeCls("hidden");
		
		this.animation = new Ext.fx.Anim({
			target: this.containerEl,
			duration: 300,
			from:{
				height: this.containerEl.getHeight()
			},
			to:{
				height: this.contentWrapperEl.getHeight()
			}
		});
		
	},
	showContentWithRenderFunction: function(renderFunction,toolType){
		if(this.hideSignal === true || toolType != this.currentToolType){
			return;
		}
		
		var that = this;
		var anim = this.containerEl.getActiveAnimation();
    	
		if(this.animation){
			this.animation.end();
		}
		
		renderFunction();
		
		this.removeCls("hidden");
		
		this.animation = new Ext.fx.Anim({
			target: this.containerEl,
			duration: 300,
			from:{
				height: this.containerEl.getHeight()
			},
			to:{
				height: this.contentWrapperEl.getHeight()
			}
		});
		
	},
	hideContent: function(){
		this.hideSignal = true;
		this.currentToolType = '';
		this.resetComponent();
		var that = this;
		var anim = this.containerEl.getActiveAnimation();
    	
		if(this.animation){
			this.animation.end();
		}
		
		this.animation = new Ext.fx.Anim({
			target: this.containerEl,
			duration: 150,
			from:{
			},
			to:{
				height:0
			},
			callback: function(){
				that.addCls("hidden");
			}
		});
		
	},
	prepareShow: function(currentToolType){
		this.resetComponent();
		this.hideSignal = false;
		this.eventBus.fireEvent("panelOpened",this);
		this.currentToolType = currentToolType;
		
	},
	abortAllOutstandingRequests: function(){
    	if(this.subscriptionData.barrier){
    		this.subscriptionData.barrier.abortProcess();
    	}
    	if(this.outstandingRequests){
    		for(var reqName in this.outstandingRequests){
    			if(this.outstandingRequests[reqName]){
    				try{
    					console.log("aborting"+reqName);
    				}catch(e){
    				
    				}
    				Ext.Ajax.abort(this.outstandingRequests[reqName]);
    			}
    		}
    	}
    },
    
    resetComponent: function(){
    	//console.log("reseting");
    	
    	this.abortAllOutstandingRequests();
    	this.subscriptionData.result = "";
  		this.subscriptionData.subscriptionResultFlag = "";
  		this.subscriptionData.subscriptionActionFlag = "";
  		if(this.subscriptionData.barrier){
  			this.subscriptionData.barrier.abortProcess();
  		}
  		
    },
    /** Subscription related stuffs starts **/
    
    //templates starts
    alternateSubscriptionTemplate: new Ext.XTemplate(
    	'<form style="display:block">',
    	'<p style="text-align:left">',
    		'Sorry, it is not possible to subscribe to this publication from this page.  Please use the ',
    		'<a href="#" class="message-link" onclick="DVOpenWindow(\'/BC/barcaplive?menuCode=MENU_RSR_ALERT_PAGE\',0,0,\'\');return false;">',
    			'<b class="cat">subscriptions page</b>',
    		'</a>',
    		' instead.',
    	'</p>',
    	'<tpl for=".">',
    	'<a class="button yes" href="#">OK</a>',
    	'</tpl>',
    	'<form>'
    ),
    /*
    	obj={
    		action:ADD | REMOVE,
    	}
    */
    addRemoveSubscriptionTemplate: new Ext.XTemplate(
    	'<form style="display:block">',
    	'<p style="text-align:left">',
    		'<tpl if="this.isAdd(values)">',
    			'Add {subscriptionLabelPrefix} ',
    			'<tpl if="!this.hasSubscriptionLinkQuery(values)">',
    				'<b class="cat">{[this.getDisplayLabel(values)]}</b>',
    			'</tpl>',
    			'<tpl if="this.hasSubscriptionLinkQuery(values)">',
    				'<a class="message-link"  href="#" uri="{subscriptionLinkQuery}" onclick="DVOpenWindow(\'{subscriptionLinkQuery}\',0, 0,\'\');return false;"><b class="cat">{[this.getDisplayLabel(values)]}</b></a>',
    			'</tpl>',
    			'<tpl if="this.getSubscriberLabel() == &quot;your&quot;">',
    				' to <span class="subscriber-name">{[this.getSubscriberLabel()]}</span> email subscriptions?',
    			'</tpl>',
    			'<tpl if="this.getSubscriberLabel() != &quot;your&quot;">',
					' to <a href="#" class="selfOtherSubscriptionLink {[this.isShowingOther()]}"><span class="subscriber-name" style="cursor:pointer;text-decoration:underline">{[this.getSubscriberLabel()]}</span></a> email subscriptions?',
				'</tpl>',    			
    		'</tpl>',
    		'<tpl if="!this.isAdd(values)">',
    			'<tpl if="this.getSubscriberLabel() == &quot;your&quot;">',
    				'<span class="subscriber-name">{[this.getSubscriberLabelForRemove()]}</span> currently subscribed to {subscriptionLabelPrefix} ',
    			'</tpl>',
    			'<tpl if="this.getSubscriberLabel() != &quot;your&quot;">',
					'<a href="#" class="selfOtherSubscriptionLink {[this.isShowingOther()]}"><span class="subscriber-name" style="cursor:pointer;text-decoration:underline">{[this.getSubscriberLabelForRemove()]}</span> </a> is already subscribed to {subscriptionLabelPrefix} ',
    			'</tpl>',
    			'<tpl if="!this.hasSubscriptionLinkQuery(values)">',
    				'<b class="cat">{[this.getDisplayLabel(values)]}</b>',
    			'</tpl>',
    			'<tpl if="this.hasSubscriptionLinkQuery(values)">',
    				'<a class="message-link"  href="#" uri="{subscriptionLinkQuery}" onclick="DVOpenWindow(\'{subscriptionLinkQuery}\',0, 0,\'\');return false;"><b class="cat">{[this.getDisplayLabel(values)]}</b></a>',
    			'</tpl>',
    			'. &nbsp;Remove?',
    		'</tpl>',
    	'</p>',
    	'<tpl for=".">',
    	'<a class="button yes" actionCommand="{result}" href="#">Yes</a>',
    	'<a class="button no" href="#">No</a>',
    	'</tpl>',
    	'<tpl if="isEmployee == true">',
	    	'<tpl if="isWealthEmployee == false">',
				'<p style="text-align:left" class="client-subscription-link">',
		    	'<tpl if="this.getSubscriberLabel() == &quot;your&quot;">',
					' <a href="#" class="selfOtherSubscriptionLink {[this.isShowingOther()]}" style="cursor:pointer;text-decoration:underline">Manage a client\'s subscriptions</a>',
				'</tpl>',
		    	'<tpl if="this.getSubscriberLabel() != &quot;your&quot;">',
						'<a href="#" class="selfOtherSubscriptionLink remove-other-link " style="cursor:pointer;text-decoration:underline">Clear client selection</a>',
				'</tpl>',				
				'</p>', 
			'</tpl>',
		'</tpl>',
    	'<form>',{
    		getDisplayLabel :function(vals){
    			var retVal = vals.subscriptionDisplayLabel || vals.displayLabel
    			return Ext.String.trim(retVal);
    		},
    		hasSubscriptionLinkQuery: function(vals){
    			var retValue =  vals.subscriptionLinkQuery && vals.subscriptionLinkQuery != "";
    			return retValue;
    		},
    		isAdd: function(vals){
    			return vals.result == "ADD";
    		},
    		getSubscriberLabel: function(){
    			var label = "your";
    			if(window["DocViewSubscriptionSelectedContact"]){
    				var selectedContact = window["DocViewSubscriptionSelectedContact"];
    				if(selectedContact){
    					var lastName = selectedContact["lastName"];
    					if(lastName) {
    						lastName += "'s";
    					}
    					label = selectedContact["firstName"]+" " +lastName; 
    				}
    			}
    			return label;
    		},
    		isShowingOther: function(){
    			return window["DocViewSubscriptionSelectedContact"] ? "showing-other":"";
    		},
    		getSubscriberLabelForRemove: function(){
    			var label = "You are";
    			if(window["DocViewSubscriptionSelectedContact"]){
    				var selectedContact = window["DocViewSubscriptionSelectedContact"];
    				if(selectedContact){
    					var lastName = selectedContact["lastName"];
    					label = selectedContact["firstName"]+" " +lastName;
    					 
    				}
    			}
    			return label;
    		}
    	}
    ),
    
    subscriptionResultTemplate: new Ext.XTemplate(
    	'<form style="display:block">',
    	'<p style="text-align:left">',
    		'<tpl if="values.subscriptionResultFlag == &quot;SUCCESS&quot;">',
    			'<tpl if="values.subscriptionActionFlag == &quot;ADD&quot;">',
	    			'<div>',
	    				'{[this.getSubscriberLabel()]} been successfully subscribed to {subscriptionLabelPrefix} <b class="cat">{[this.getSubscriptionLabel(values)]}</b>.',
	    			'</div>',
    			'</tpl>',
    			'<tpl if="values.subscriptionActionFlag == &quot;REMOVE&quot;">',
	    			'<div>',
	    				'{[this.getSubscriberLabel()]} been successfully unsubscribed from {subscriptionLabelPrefix} <b class="cat">{[this.getSubscriptionLabel(values)]}</b>.',
	    			'</div>',
    			'</tpl>',
    			
    		'</tpl>',
    		'<tpl if="values.subscriptionResultFlag == &quot;FAILURE&quot;">',
    			'<div>',
    				'An error has occurred, please try again later.',
    			'</div>',
    		'</tpl>',
    	'</p>',
    	'<a class="button ok" href="#">OK</a>',
    	'<form>',{
    		getSubscriptionLabel: function(obj){
    			return obj["subscriptionDisplayLabel"] || obj["displayLabel"];
    		},
    		getSubscriberLabel: function(){
    			var label = "You have";
    			if(window["DocViewSubscriptionSelectedContact"]){
    				var selectedContact = window["DocViewSubscriptionSelectedContact"];
    				if(selectedContact){
    					var lastName = selectedContact["lastName"];
    					label = selectedContact["firstName"]+" " +lastName;
    					label += " has"; 
    				}
    			}
    			return label;
    		}
    	}
    ),
    multipleSubscriptionTemplate: new Ext.XTemplate(
    	'<div class="multiple-subscription-items">',
   			'<tpl for=".">',
	    		'<div class="subscription-item-container" style="margin-top:10px">',
		    		'<tpl if="this.isAdd(values)">',
		    			'Add {subscriptionLabelPrefix} ',
		    			'<a class="message-link"  href="#" uri="{itemQuery}" onclick="DVOpenWindow(\'{itemQuery}\',0, 0,\'\');return false;"><b class="cat">{itemName}</b></a>',
		    			'<tpl if="this.getSubscriberLabel() == &quot;your&quot;">',
		    				' to <span class="subscriber-name">{[this.getSubscriberLabel()]}</span> email subscriptions?',
		    			'</tpl>',
		    			'<tpl if="this.getSubscriberLabel() != &quot;your&quot;">',
							' to <a href="#" class="selfOtherSubscriptionLink {[this.isShowingOther()]}"><span class="subscriber-name" style="cursor:pointer;text-decoration:underline">{[this.getSubscriberLabel()]}</span></a> email subscriptions?',
						'</tpl>',    			
		    		'</tpl>',
		    		'<tpl if="!this.isAdd(values)">',
		    			'<tpl if="this.getSubscriberLabel() == &quot;your&quot;">',
	    					'<span class="subscriber-name">{[this.getSubscriberLabelForRemove()]}</span> currently subscribed to {subscriptionLabelPrefix} ',
		    			'</tpl>',
		    			'<tpl if="this.getSubscriberLabel() != &quot;your&quot;">',
							'<a href="#" class="selfOtherSubscriptionLink {[this.isShowingOther()]}"><span class="subscriber-name" style="cursor:pointer;text-decoration:underline">{[this.getSubscriberLabelForRemove()]}</span> </a> is already subscribed to {subscriptionLabelPrefix} ',
		    			'</tpl>',
		    			'<a class="message-link"  href="#" uri="{itemQuery}" onclick="DVOpenWindow(\'{itemQuery}\',0, 0,\'\');return false;"><b class="cat">{itemName}</b></a>',
		    			'. &nbsp;Remove?',
		    		'</tpl>',
		    		
		    		'<form style="display:block">',
    					'<a class="button yes" multiple="true" actionCommand="{addRemove}" itemId="{itemId}" itemPK="{itemPK}" href="#">Yes</a>',
 		    		'</form>',
		    		
	    		'</div>',
    		'</tpl>',
    		'<div style="margin-top:10px">',
    			'<form>',
    				'<a class="button close" href="#">Close</a>',
    		    	'<tpl if="isEmployee == true">',
    		    	'<tpl if="isWealthEmployee == false">',
    			    	'<tpl if="this.getSubscriberLabel() == &quot;your&quot;">',
    						'<p style="text-align:left" class="client-subscription-link">',
    							' <a href="#" class="selfOtherSubscriptionLink {[this.isShowingOther()]}" style="cursor:pointer;text-decoration:underline">Manage a client\'s subscriptions</a>',
    						'</p>',    	
    					'</tpl>',
    			    	'<tpl if="this.getSubscriberLabel() != &quot;your&quot;">',
    						'<p style="text-align:left" class="client-subscription-link">',
    							' <a href="#" class="selfOtherSubscriptionLink remove-other-link " style="cursor:pointer;text-decoration:underline">Clear client selection</a>',
    						'</p>',    	
    					'</tpl>',				
    				'</tpl>',
    			'</tpl>',  
    			'<form>',
    		'</div>',
    	'</div>',{
    		getDisplayLabel :function(vals){
    			return vals.subscriptionDisplayLabel || vals.displayLabel;
    		},
    		isAdd: function(vals){
    			return vals.addRemove == "ADD";
    		},
    		getSubscriberLabel: function(){
    			var label = "your";
    			if(window["DocViewSubscriptionSelectedContact"]){
    				var selectedContact = window["DocViewSubscriptionSelectedContact"];
    				if(selectedContact){
    					var lastName = selectedContact["lastName"];
    					if(lastName) {
    						lastName += "'s";
    					}
    					label = selectedContact["firstName"]+" " +lastName; 
    				}
    			}
    			return label;
    		},
    		isShowingOther: function(){
    			return window["DocViewSubscriptionSelectedContact"] ? "showing-other":"";
    		},
    		getSubscriberLabelForRemove: function(){
    			var label = "You are";
    			if(window["DocViewSubscriptionSelectedContact"]){
    				var selectedContact = window["DocViewSubscriptionSelectedContact"];
    				if(selectedContact){
    					var lastName = selectedContact["lastName"];
    					label = selectedContact["firstName"]+" " +lastName;
    					 
    				}
    			}
    			return label;
    		}
    	}
    ),
    messageSubscriptionTemplate: new Ext.XTemplate(
    	'<form style="display:block">',
    	'<tpl>',
    	'<p style="text-align:left">',
    		'{message}',
    	'</p>',
    	'<a class="button close" href="#">Close</a>',
    	'</tpl>',
    	'<form>'
    ),
    multipleSubscriptionResultItemTemplate: new Ext.XTemplate(
    	'<p style="text-align:left">',
    		'<tpl if="values.result == &quot;SUCCESS&quot;">',
    			'<tpl if="values.actionFlag == &quot;ADD&quot;">',
	    			'<div>',
	    				'{[this.getSubscriberLabel()]} been successfully subscribed to <a class="message-link" href="#" uri="{itemQuery}" onclick="DVOpenWindow(\'{itemQuery}\',0, 0,\'\');return false;"><b class="cat">{itemName}</b></a>.',
	    			'</div>',
    			'</tpl>',
    			'<tpl if="values.actionFlag == &quot;REMOVE&quot;">',
	    			'<div>',
	    				'{[this.getSubscriberLabel()]} been successfully unsubscribed from <a class="message-link"  href="#" uri="{itemQuery}" onclick="DVOpenWindow(\'{itemQuery}\',0, 0,\'\');return false;"><b class="cat">{itemName}</b></a>.',
	    			'</div>',
    			'</tpl>',
    			
    		'</tpl>',
    		'<tpl if="values.result == &quot;FAILURE&quot;">',
    			'<div>',
    				'An error has occurred, please try again later.',
    			'</div>',
    		'</tpl>',
    	'</p>',
    	'<form><a class="button ok" href="#">OK</a></form>',{
    		getSubscriptionLabel: function(obj){
    			return obj["subscriptionDisplayLabel"] || obj["displayLabel"];
    		},
    		getSubscriberLabel: function(){
    			var label = "You have";
    			if(window["DocViewSubscriptionSelectedContact"]){
    				var selectedContact = window["DocViewSubscriptionSelectedContact"];
    				if(selectedContact){
    					var lastName = selectedContact["lastName"];
    					label = selectedContact["firstName"]+" " +lastName;
    					label += " has"; 
    				}
    			}
    			return label;
    		}
    	}
    ),
    //templates ends
    
    getIdToConsider: function(){
    	return "sharmkal";
    },
    isSubscribingOther: function(){
    	return false;
    },
	handleSubscription: function(){
		if(this.subscriptionData.subscriptionLookupPubId){
	    	this.handleSubscriptionPubIdLookup();
	    }else{				
   			this.checkForSubscription();
   		}
	},
	
	
	handleSubscriptionPubIdLookup: function(){
		var that = this;
		var forBCLId = this.getIdToConsider();
		   				
		var subscriptionPubIdLookupRequest = Ext.Ajax.request({
		    url: '/RSL/jsp/MenuToSubscription.jsp?characterSet=UTF-8',
		    params: {"pubID":this.subscriptionData.subscriptionLookupPubId,"forBCLId":forBCLId},
		    scope: this,
		    method: 'POST',
		    success: function(response,opts){
		    	that.outstandingRequests["subscriptionPubIdLookupRequest"] = null;
	   			try{
	   				var retObj = Ext.decode(Ext.String.trim(response.responseText));
	   				var subscriptionItems = retObj["subscriptionItems"];
	   				this.languagePreferences = retObj["languagePreferences"];
	   			}catch(e){
	   				if(!that.outstandingRequests["subscriptionPubIdLookupRequest"] ||
	   					that.outstandingRequests["subscriptionPubIdLookupRequest"].aborted === false){
		   				com.barclays.DV.view.Utils.showMsg("Error handling subscription request","Decoding error in mapping.");
		   			}
	   				that.hideContent();
	   				return;
	   			}
	   			
	   			if(subscriptionItems.length == 0){
	   				that.handleAlternateSubscription();
	   			}else if(subscriptionItems.length == 1){
	   				var linkInfo = subscriptionItems[0];
	   				if("LINKID" == linkInfo.itemType){
		   				that.subscriptionData.subscriptionVals = [{paramName: 'LINKID', paramValue: linkInfo.itemId}];
		   				that.subscriptionData.isMenuTreeSubscription = true;
		   			}else if("TICKER" == linkInfo.itemType){
				    	that.subscriptionData.subscriptionVals = [{paramName: 'TICKER', paramValue: linkInfo.itemId}];
			    	}else if("SECTOR" == linkInfo.itemType){
				    	that.subscriptionData.subscriptionVals = [{paramName: 'SECTOR', paramValue: linkInfo.itemId}];
			    	}
			    	if(linkInfo.extraParams && linkInfo.extraParams.length > 0){
		    			for(var j=0; j < linkInfo.extraParams.length;j++){
		    				var extraParam = linkInfo.extraParams[j];
		    				that.subscriptionData.subscriptionVals.push({paramName: extraParam.paramName, paramValue: extraParam.paramValue});
		    			}
		    		}
   					that.subscriptionData.subscriptionDisplayLabel = that.subscriptionData.subscriptionDisplayLabel || linkInfo.itemName;
   					that.subscriptionData.subscriptionLinkQuery = linkInfo.itemQuery;
   					that.checkForSubscription();
	   			}else{
	   				this.subscriptionData.subscriptionItemMap = {};
	   				this.subscriptionData.subscriptionItems = subscriptionItems;
			    	for(var i=0; i < this.subscriptionData.subscriptionItems.length; i++){
			    		var itemObj = this.subscriptionData.subscriptionItems[i];
			    		itemObj.itemPK = itemObj.itemId+"_"+itemObj["itemType"]; //in order to avoid possible same itemId number in different itemtype 
			    		var subscriptionParamArray = [];
			    		if("LINKID" == itemObj["itemType"]){
				    		subscriptionParamArray = [{paramName: "LINKID",paramValue: itemObj.itemId}];
			    		}else if("TICKER" == itemObj["itemType"]){
				    		subscriptionParamArray = [{paramName: "TICKER",paramValue: itemObj.itemId}];
			    		}else if("SECTOR" == itemObj["itemType"]){
				    		subscriptionParamArray = [{paramName: "SECTOR",paramValue: itemObj.itemId}];
			    		}
			    		if(itemObj.extraParams && itemObj.extraParams.length > 0){
			    			for(var j=0; j < itemObj.extraParams.length;j++){
			    				var extraParam = itemObj.extraParams[j];
			    				subscriptionParamArray.push({paramName: extraParam.paramName, paramValue: extraParam.paramValue});
			    			}
			    		}
			    		this.subscriptionData.subscriptionItemMap[itemObj.itemPK] = subscriptionParamArray;
			    	}
	   				that.handleMultipleSubscription(this.subscriptionData.subscriptionItemMap,this.subscriptionData.subscriptionItems);
	   			}
	   			
		    },
		    failure: function(response,opts){
		    	if(!subscriptionPubIdLookupRequest || !subscriptionPubIdLookupRequest.aborted){
		    		com.barclays.DV.view.Utils.showMsg("Error handling subscription request","Error mapping to tree item. ");
		    	}
		    	that.outstandingRequests["subscriptionPubIdLookupRequest"] = null;
		    	
		    }
		    
		});
		this.outstandingRequests["subscriptionPubIdLookupRequest"] = subscriptionPubIdLookupRequest;
	},
	/**
	* @subscriptionItemMap = map of linkId vs link information used in subscription.
	*							
	* @subscriptionItems = 	array of subscription item object , link information obj with url and name for display.
							Alternatively, it may be map of lbcode vs analyst info for display 
	**/
	handleMultipleSubscription: function(){
		var that = this;
		var ajaxRequestConfigObjectsMap = {};
		var idToConsider = this.getIdToConsider();
    	for(var itemPK in this.subscriptionData.subscriptionItemMap){
    		var subscriptionItem = this.subscriptionData.subscriptionItemMap[itemPK];
    		
    		var params = {};
			var jsonDataObj = {
	  			"subscription" : {
	  				"criteria" : []
	  			},
	  			"requestTimestamp" : (new Date()).getTime(),
	  			"userIdType":"BclId",
	 			"forUserIds":[idToConsider]
	  		};
	  		
	  		var criteria = [];
			for(var i=0;i< subscriptionItem.length;i++){
				var val = subscriptionItem[i];
				var criterion = {};
				criterion.name = val.paramName;
				criterion.value = val.paramValue;
				criteria.push(criterion);
			}
			jsonDataObj.subscription.criteria = criteria;
			
			params.jsonData = encodeURI(Ext.encode(jsonDataObj));
	  		params.action = "CheckMultiSubscription";
	  		
	  		url = '/LNS/subscription/ext/jsonService?characterSet=UTF-8';
			
			var requestConfigObj = {
				url : "/LNS/subscription/ext/jsonService?characterSet=UTF-8",
				params : params,
				itemPKV: itemPK
			};
			    
	  		ajaxRequestConfigObjectsMap[itemPK] = requestConfigObj;
    	}
    	var barrier = Ext.create('com.barclays.DV.view.ThreadBarrier',{
				timeout: (that.subscriptionData.subscriptionItems.length * 90000),
				ajaxRequestConfigObjectsMap : ajaxRequestConfigObjectsMap,
				numberOfThread: that.subscriptionData.subscriptionItems.length,
				successCallbackFn: function(resultMap){
					
					for(var i=0; i< that.subscriptionData.subscriptionItems.length;i++){
						var subObj = that.subscriptionData.subscriptionItems[i];
						var itemId = subObj["itemPK"];
			    		var actionResult = resultMap[itemId];
			    		var  addRemove = "ADD";
			    		if("_REQUEST_FAILED_" == actionResult){
			    			//handle the failed request differently (either hide it or show with error)
			    			//for time being, treat it as add request
			    			//addRemove = "_REQUEST_FAILED_";
			    			addRemove = "ADD";
			    		} 
			    		
			    		if(actionResult[idToConsider] && actionResult[idToConsider]["subscribed"] == "current"){
				    		addRemove = "REMOVE";
				    	}
			    		subObj["addRemove"] = addRemove;
					}
					
					var displayMultipleSubscription = function(){
			    		var renderedElement = that.multipleSubscriptionTemplate.overwrite(that.contentEl,that.subscriptionData.subscriptionItems,true);
				    	Ext.Array.each(Ext.DomQuery.select("a.yes",renderedElement.dom),function(item){
				    		var itemEl = Ext.get(item);
				   			itemEl.on("click",that.handleMultipleSubscriptionItemYes,that);
				   		});
						var closeBtn = Ext.get(Ext.DomQuery.selectNode("a.close",renderedElement.dom));
				   		closeBtn.on("click",that.hideContent,that);
				   		
				   		Ext.Array.each(Ext.DomQuery.select("a.selfOtherSubscriptionLink",renderedElement.dom),function(item){
				    		var itemEl = Ext.get(item);
				   			itemEl.on("click",that.handleSelfOtherSubscriptionLink,that);
				   		});
			    	}
			    	
			    	this.subscriptionBarrier = null;
			    	that.showContentWithRenderFunction(displayMultipleSubscription,"SUBSCRIPTION");
		    	
				},
				timeoutCallbackFn: function(resultMap){
					var errorDisplayFn = function(){
			    		var renderedElement = that.messageSubscriptionTemplate.overwrite(that.contentEl,{message:"An error has occurred, please try again later"},true);
		   				var closeBtn = Ext.get(Ext.DomQuery.selectNode("a.close",renderedElement.dom));
					   	closeBtn.on("click",that.hideContent,that);	
				   	};
			    	that.showContentWithRenderFunction(errorDisplayFn,"SUBSCRIPTION");
				}
			}
		);
		if(this.currentToolType != "SUBSCRIPTION"){ //check to see if user already clicks another tool item
			return;
		}
		barrier.start();
		this.subscriptionData.barrier = barrier;
	},
    handleMultipleSubscriptionItemYes: function(e,t){
    	e.preventDefault();
		var container = Ext.get(t).up("div.subscription-item-container");
  		this.showLocalLoading(container,"SUBSCRIPTION");
  		
  		var actionFlag = t.getAttribute("actionCommand");
  		var itemId = t.getAttribute("itemId");
  		var itemPK = t.getAttribute("itemPK");
  		var subscriptionVals = this.subscriptionData.subscriptionItemMap[itemPK];
  		var itemObj = {};
  		for(var i=0; i < this.subscriptionData.subscriptionItems.length; i++){
    		if(itemId == this.subscriptionData.subscriptionItems[i]["itemId"]){
	    		itemObj = Ext.clone(this.subscriptionData.subscriptionItems[i]);
	    		break;
    		}
    	}
    	itemObj["actionFlag"] = actionFlag;
    	itemObj["container"] = container;
  		this.doSubscribe(actionFlag,subscriptionVals,this.renderMultipleSubscriptionItemResult,itemObj);
  		
  		return false;
    },
    renderMultipleSubscriptionItemResult: function(itemObj,resultFlag){ //true or false boolean
    	if(resultFlag === true){
    		itemObj.result = "SUCCESS";
    	}else{
    		itemObj.result = "FAILURE";
    	}
    	var that = this;
    	var fn = function(){
	    	var renderedElement = that.multipleSubscriptionResultItemTemplate.overwrite(itemObj.container,itemObj,true);
	    	var okBtn = Ext.get(Ext.DomQuery.selectNode("a.ok",itemObj.container.dom));
	   		okBtn.on("click",that.hideContent,that);
  		}
  		this.showContentWithRenderFunction(fn,"SUBSCRIPTION");
  		
    },
	checkForSubscription: function(){
		
    	var that = this;
		var params = {};
		
		var idToConsider = this.getIdToConsider();
		
		var jsonDataObj = {
  			"subscription" : {
  				"criteria" : []
  			},
  			"requestTimestamp" : (new Date()).getTime(),
  			"userIdType":"BclId",
 			"forUserIds": [idToConsider]
 
  		};
  		
  		var criteria = [];
		for(var i=0;i< this.subscriptionData.subscriptionVals.length;i++){
			var val = this.subscriptionData.subscriptionVals[i];
			var criterion = {};
			criterion.name = val.paramName;
			criterion.value = val.paramValue;
			criteria.push(criterion);
		}
		jsonDataObj.subscription.criteria = criteria;
		
		params.jsonData = encodeURI(Ext.encode(jsonDataObj));
  		params.action = "CheckMultiSubscription";
  		
  		
		var checkForSubscriptionRequest = Ext.Ajax.request({
		    url: '/LNS/subscription/ext/jsonService?characterSet=UTF-8',
		    params: params,
		    scope: this,
		    success: function(response,opts){
		    	that.outstandingRequests["checkForSubscriptionRequest"] = null;
		    	var retObj = Ext.decode(Ext.String.trim(response.responseText));
		    	if(retObj[idToConsider] && retObj[idToConsider]["subscribed"] == "current"){
		    		that.subscriptionData.result = "REMOVE";
		    	}else{
		    		that.subscriptionData.result = "ADD";
		    	}
		    	
		    	var checkSubscriptionRenderer = function(){
		    		var renderedElement = that.addRemoveSubscriptionTemplate.overwrite(that.contentEl,that.subscriptionData,true);
			    	var yesBtn = Ext.get(Ext.DomQuery.selectNode("a.yes",renderedElement.dom));
			   		var noBtn = Ext.get(Ext.DomQuery.selectNode("a.no",renderedElement.dom));
			   		Ext.Array.each(Ext.DomQuery.select("a.selfOtherSubscriptionLink",renderedElement.dom),function(item){
			    		var itemEl = Ext.get(item);
			   			itemEl.on("click",that.handleSelfOtherSubscriptionLink,that);
			   		});		
			   		yesBtn.on("click",that.handleSubscriptionYes,that);
			   		noBtn.on("click",that.hideContent,that);
		    	}
		    	that.showContentWithRenderFunction(checkSubscriptionRenderer,"SUBSCRIPTION");
		    	
		    },
		    failure: function(response,opts){
		    	that.outstandingRequests["checkForSubscriptionRequest"] = null;
		    	if(!checkForSubscriptionRequest || checkForSubscriptionRequest.aborted === false){
			    	this.helpAnimate(function(){
			    		var box = that.findBoxDifference();
		   				var renderedElement = that.messageSubscriptionTemplate.overwrite(that.tapContent,{message:"An error has occurred, please try again later."},true);
		   				var closeBtn = Ext.get(Ext.DomQuery.selectNode("a.close",renderedElement.dom));
					   	closeBtn.on("click",that.handleNo,that);	
				   		that.animateMe(box);
			    	});
		    	}
		    }
		});
		that.outstandingRequests["checkForSubscriptionRequest"] = checkForSubscriptionRequest;
    },
	handleAlternateSubscription: function(){
		var that = this;
		var myData = {};
    	var displayAlternateSubscription = function(){
    		var renderedElement = that.alternateSubscriptionTemplate.overwrite(that.contentEl,myData,true);
	    	var yesBtn = Ext.get(Ext.DomQuery.selectNode("a.yes",renderedElement.dom));
	   		yesBtn.on("click",that.hideContent,that);
		}
    	
    	this.showContentWithRenderFunction(displayAlternateSubscription,"SUBSCRIPTION");
	},
	handleSubscriptionYes: function(e,t){
    	e.preventDefault();
    	this.showLoading("SUBSCRIPTION")
  		var actionFlag = t.getAttribute("actionCommand");
  		//this.subscriptionData.actionFlag = actionFlag;
  		this.doSubscribe(actionFlag,this.subscriptionData.subscriptionVals);
  		return false;
    },
    /**
    callbackFunction : used for multiple subscription
    optionalParam : used for multiple subscription
    */
    doSubscribeHelper: function(actionFlag,subscriptionVals,callbackFunction,optionalParam){
		var that = this;
		var params = {};
		
  		
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
		}else{
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
  		//subscribe for selected contact if present
  		if(this.isSubscribingOther()){
  			params.forBCLId = this.getIdToConsider();
		}
  		params.deliveryPreference = "LINK";
    	var doSubscribeRequest = Ext.Ajax.request({
		    url: '/LNS/subscription/ext/jsonService?characterSet=UTF-8',
		    params: params,
		    scope: this,
		    success: function(response,opts){
		    	that.outstandingRequests["doSubscribeRequest"] = null;
		    	var retObj = Ext.decode(Ext.String.trim(response.responseText));
		    	var resultFlag = retObj && retObj["subscriptions"] && "SUCCESS" == retObj["subscriptions"]["returnStatus"];
		    	if(callbackFunction){
		    		callbackFunction.call(that,optionalParam,resultFlag);
		    	}else{
		    		that.subscriptionData.subscriptionResultFlag = (resultFlag ? "SUCCESS" : "FAILURE");
		    		this.subscriptionData.subscriptionActionFlag = actionFlag;
		    		that.renderSubscriptionResult(that.subscriptionData);
		    	}
		    },
		    failure: function(response,opts){
		    	that.outstandingRequests["doSubscribeRequest"] = null;
		    	if(callbackFunction){
		    		callbackFunction.call(that,optionalParam,false);
		    	}else{
		    		that.subscriptionData.subscriptionResultFlag = "FAILURE";
		    		this.subscriptionData.subscriptionActionFlag = actionFlag;
		    		that.renderSubscriptionResult(that.subscriptionData);
		    	}
		    }
		});
		that.outstandingRequests["doSubscribeRequest"] = doSubscribeRequest;
    	return false;
	},
    /**
    *@actionFlag ADD or REMOVE
    *@subscriptionVals  array of subscription criteria {paramName:"LINKID", paramValue:"1234"}
    *@callbackFunction optional function of signature fun(optionalParam,resultFlag) default is this.renderSubscriptionResult
    *@optionalParam optional extra param in callback function defualt is this.subscriptionData
    **/
	doSubscribe: function(actionFlag,subscriptionVals,callbackFunction,optionalParam){
		if("ADD" == actionFlag){
			//find language only if the operation is ADD
			var that = this;
			var itemType = "";
			var itemValue = "";
			for(var i=0;i< subscriptionVals.length;i++){
				var val = subscriptionVals[i];
				if("LINKID" == val.paramName || "SECTIONID" == val.paramName 
					|| "TICKER" == val.paramName || "SECTOR" == val.paramName
					|| "ANALYST" == val.paramName){
					itemType = val.paramName;
					itemValue = val.paramValue;
					break;
				}
			}
			if("LINKID" == itemType || "SECTIONID" == itemType){ //LINKID already has language information
				return that.doSubscribeHelper(actionFlag,subscriptionVals,callbackFunction,optionalParam);
			}else if("ANALYST" == itemType){
				var languageSearchRequest = Ext.Ajax.request({
				    url: "/RSL/jsp/MenuToSubscription.jsp?characterSet=UTF-8&returnSubscriptionItems=NO",
				    scope: this,
				    method: 'POST',
				    success: function(response,opts){
		    			that.outstandingRequests["languageSearchRequest"] = null;
			   			var retObj = Ext.decode(Ext.String.trim(response.responseText));
		   				that.subscriptionData.languagePreferences = retObj["languagePreferences"];
		   				var availableLanguages = [];
		   				for(var i=0;i< subscriptionVals.length;i++){
							var val = subscriptionVals[i];
							if("AVAILABLE_LANGUAGES" == val.paramName ){
								availableLanguages = (val.paramValue.replace(/\,$/,'')).split(",");
								break;
							}
						}
			   			var languagePrefs = that.subscriptionData.languagePreferences.join(",");
				   		if(availableLanguages.length > 0){
		   					//available languages exists
		   					var interSectLanguages = Ext.Array.intersect(that.subscriptionData.languagePreferences,availableLanguages);
		   					if(interSectLanguages.length > 0){
		   						//something common exists
		   						languagePrefs = interSectLanguages.join(",");
		   					}else{
		   						//else use all the available languages
		   						languagePrefs = availalableLanguages.join(",");
		   					}
		   				}
		   				
			   			subscriptionVals.push({paramName: "LANGUAGES", paramValue: languagePrefs});
			   			return that.doSubscribeHelper(actionFlag,subscriptionVals,callbackFunction,optionalParam);
				    },
				    failure: function(response,opts){
				    	that.outstandingRequests["languageSearchRequest"] = null;
				    	if(callbackFunction){
				    		callbackFunction.call(that,optionalParam,false);
				    	}
				    }
				});
			}else{
				var languageSearchUrl = "/RSL/servlets/dv.search?dateRange=6+month&numResults=100&searchByCache=yes&deptLanguage=ENG&deptLanguage=JPN&deptLanguage=CHI-CN&characterSet=UTF-8";
				if("TICKER" == itemType){
					languageSearchUrl += "&ticker"+itemValue;
				}else if("SECTOR" == itemType){
					languageSearchUrl += "&sector"+itemValue;
				}
				
				var languageSearchRequest = Ext.Ajax.request({
				    url: languageSearchUrl,
				    scope: this,
				    method: 'GET',
				    success: function(response,opts){
		    			that.outstandingRequests["languageSearchRequest"] = null;
			   			var responseText = response.responseText;
			   			
			   			//extract language
			   			var languagePrefs = that.subscriptionData.languagePreferences.join(",");
			   			if(responseText.indexOf("PGLANGUAGE") > 0){
			   				var startIndex = responseText.indexOf("<PGLANGUAGE>") + 12;
			   				var endIndex = responseText.indexOf("</PGLANGUAGE>");
			   				var availableLanguages = responseText.substring(startIndex,endIndex).split(",");;
			   				if(availableLanguages.length > 0){
			   					//available languages exists
			   					var interSectLanguages = Ext.Array.intersect(that.subscriptionData.languagePreferences,availableLanguages);
			   					if(interSectLanguages.length > 0){
			   						//something common exists
			   						languagePrefs = interSectLanguages.join(",");
			   					}else{
			   						//else use all the available languages
			   						languagePrefs = availableLanguages.join(",");
			   					}
			   				}
			   			}
			   			subscriptionVals.push({paramName: "LANGUAGES", paramValue: languagePrefs});
			   			return that.doSubscribeHelper(actionFlag,subscriptionVals,callbackFunction,optionalParam);
				    },
				    failure: function(response,opts){
				    	that.outstandingRequests["languageSearchRequest"] = null;
				    	if(callbackFunction){
				    		callbackFunction.call(that,optionalParam,false);
				    	}
				    }
				});
				that.outstandingRequests["languageSearchRequest"] = languageSearchRequest;
	    	
			} 
		}else{
			return this.doSubscribeHelper(actionFlag,subscriptionVals,callbackFunction,optionalParam);
		}
    },
    renderSubscriptionResult: function(myData){ //true or false boolean
    	var that = this;
    	var fn = function(){
	    	var renderedElement = that.subscriptionResultTemplate.overwrite(that.contentEl,myData,true);
	    	var okBtn = Ext.get(Ext.DomQuery.selectNode("a.ok",renderedElement.dom));
	   		okBtn.on("click",that.hideContent,that);
   		}
   		this.showContentWithRenderFunction(fn,"SUBSCRIPTION");
    },
	handleSubscribeClick: function(){
		if(this.currentToolType == "SUBSCRIPTION"){
			return;
		}
		this.prepareShow("SUBSCRIPTION");
		this.showLoading("SUBSCRIPTION");
		var height = ((Math.random()* 1000)% 300)+ 30+"px";
		var html = "<div style='height:"+height+";color:white;font-size:20px;background-color:black'>"+height+"</div>";
		var that = this;
		setTimeout(function(){
			that.handleSubscription();
			//that.handleAlternateSubscription();
		},1500);
	},
	
	/** Subscription related stuffs ends **/
	
	handleLibraryClick: function(){
		if(this.currentToolType == "LIBRARY"){
			return;
		}
		this.prepareShow("LIBRARY");
		this.showLoading("LIBRARY");
		//var height = ((Math.random()* 1000)% 300)+ 30+"px";
		var height = "100px";
		var html = "<div style='height:"+height+";color:white;font-size:20px;background-color:black'>Library Test</div>";
		var that = this;
		setTimeout(function(){
			that.showContent(html,"LIBRARY");
		},300);
	},
	
	
	/** Email related stuff starts **/
	
	/** Email related templates starts **/
	sendToMyEmailUnvailableTemplate: new Ext.XTemplate(
    	'<div class="email-item-container ">',
    		'<p style="text-align:left">',
	    		'No publications of this type are currently available.',
	    	'</p>',
		    '<form style="display:block">',
		    	'<a class="button no" href="#">Close</a>',
	    	'<form>',
    	'</div>'
    ),
	sendToMyEmailTemplate: new Ext.XTemplate(
    	'<div class="email-item-container ">',
    		'<p style="text-align:left">',
	    		'Send <a class="message-link" href="#" uri="{uri}" onclick="DVOpenWindow(\'{uri}\',0, 0,\'\');return false;"><b class="cat">{title}</b></a> to your email address?',
	    	'</p>',
		    '<form style="display:block">',
		    	'<a class="button yes" href="#" pubId="{pubId}" title="{title}"  uri="{uri}">Yes</a>',
		    	'<a class="button no" href="#">No</a>',
	    	'<form>',
    	'</div>'
    ),
    sendToMyEmailMultipleTemplate: new Ext.XTemplate(
    	'<div class="multiple-items">',
   			'<tpl for=".">',
	    		'<div class="email-item-container">',
		    		'<p style="text-align:left">',
			    		'Send <a class="message-link" href="#" uri="{uri}" onclick="DVOpenWindow(\'{uri}\',0, 0,\'\');return false;"><b class="cat">{title}</b></a> to your email address?',
			    	'</p>',
			    	'<form style="display:block">',
    					'<a class="button yes" pubId="{pubId}" multiple="true" title="{title}" href="#">Yes</a>',
		    		'</form>',
	    		'</div>',
    		'</tpl>',
    		'<div style="margin-top:10px">',
    			'<form>',
    				'<a class="button close" href="#">Close</a>',
    			'<form>',
    		'</div>',
    	'</div>'
    ),
    emailResultTemplate: new Ext.XTemplate(
    	'<form style="display:block">',
    	'<p style="text-align:left">',
    		'<tpl if="values.result == &quot;SUCCESS&quot;">',
    			'<div>',
    				'<a class="message-link" href="#" uri="{uri}" onclick="DVOpenWindow(\'{uri}\',0, 0,\'\');return false;"><b class="cat">{title}</b></a> has been successfully sent to your email address.',
			    '</div>',
    		'</tpl>',
    		'<tpl if="values.result == &quot;FAILURE&quot;">',
    			'<div>',
    				'An error has occurred, please try again later.',
    			'</div>',
    		'</tpl>',
    	'</p>',
    	'<tpl if="this.showOkButton(values)">',
    		'<a class="button ok" href="#">OK</a>',
    	'</tpl>',
    	'<form>',{
    		showOkButton: function(obj){
    			return true;//!obj.multiple;
    		}
    	}
    ),
    /** Email related templates starts **/
	
	emailMeRenderer: function(){
		var that = this;
		var fn = function(){
	    	var renderedElement = that.sendToMyEmailTemplate.overwrite(that.contentEl,that.emailMeData,true);
	   		var yesBtn = Ext.get(Ext.DomQuery.selectNode("a.yes",renderedElement.dom));
	   		var noBtn = Ext.get(Ext.DomQuery.selectNode("a.no",renderedElement.dom));
	   		yesBtn.on("click",that.handleEmailYes,that);
	   		noBtn.on("click",that.hideContent,that);
 		}
 		
 		this.showContentWithRenderFunction(fn,"EMAIL");
   	},
   	multipleEmailRenderer: function(emailValsArray){
		var that = this;
 		var box = that.findBoxDifference();
		var renderedElement = null;
		if(emailValsArray.length == 0){
 			renderedElement = this.messageHistoryTemplate.overwrite(this.tapContent,{message:"No publications of this type are currently available."},true);
 		}else{
  			renderedElement = this.sendToMyEmailMultipleTemplate.overwrite(this.tapContent,emailValsArray,true);
	   		Ext.Array.each(Ext.DomQuery.select("a.yes",renderedElement.dom),function(item,index,arr){
	   			Ext.get(item).on("click",that.handleEmailYes,that);
	   		});
		   		
	   	}
  		var closeBtn = Ext.get(Ext.DomQuery.selectNode("a.close",renderedElement.dom));
   		closeBtn.on("click",this.handleNo,this);	
  		this.animateMe(box);
	},
	
	handleEmailClick: function(){
		if(this.currentToolType == "EMAIL"){
			return;
		}
		this.prepareShow("EMAIL");
		this.showLoading("EMAIL");
		//var height = ((Math.random()* 1000)% 300)+ 30+"px";
		if(this.emailMeData.lookupFn){
			//handle lookup emaildata
		}else if(this.emailMeData.constructor == Array){
			this.multipleEmailRenderer();
		}else{
			this.emailMeRenderer();
		}
		/*
		var height = "100px";
		var html = "<div style='height:"+height+";color:white;font-size:20px;background-color:black'>Email Test</div>";
		var that = this;
		setTimeout(function(){
			that.showContent(html,"EMAIL");
		},100);
		*/
	},
    handleEmailYes: function(e,t){
    	e.preventDefault();
    	var that = this;
    	var pubId = t.getAttribute("pubId");
		var multiple = t.getAttribute("multiple");
		var title = t.getAttribute("title");
		var uri = t.getAttribute("uri");
		var params = {pubID: pubId};
		var emailItemContainer = Ext.get(t).up(".email-item-container");
		this.showLocalLoading(emailItemContainer,"EMAIL");
  		
    	var emailMeRequest = Ext.Ajax.request({
		    url: '/LNS/subscription/ext/email/me?characterSet=UTF-8',
		    params: params,
		    scope: this,
		    method: 'POST',
		    success: function(response,opts){
    			that.outstandingRequests["emailMeRequest"] = null;
	   			var retObj = Ext.decode(Ext.String.trim(response.responseText));
	   			that.renderEmailResult(retObj.success === true,multiple,title,uri,emailItemContainer);
		    },
		    failure: function(response,opts){
		    	that.outstandingRequests["emailMeRequest"] = null;
		    	that.renderEmailResult(false,multiple,title,uri,emailItemContainer);
		    }
		});
		that.outstandingRequests["emailMeRequest"] = emailMeRequest;
		
    	return false;
    },
    renderEmailResult: function(resultFlag,multiple,title,uri,emailItemContainer){ 
    	var tempData = {
    		title:title,
    		multiple: multiple,
    		uri: uri
    	};
		if(resultFlag === true){
    		tempData.result = "SUCCESS";
    	}else{
    		tempData.result = "FAILURE";
    	}
    	
    	var that = this;
    	var fn = function(){
	    	var renderedElement = that.emailResultTemplate.overwrite(emailItemContainer,tempData,true);
	    	var okBtn = Ext.get(Ext.DomQuery.selectNode("a.ok",renderedElement.dom));
	    	if(okBtn){
	   			okBtn.on("click",that.hideContent,that);
	   		}
   		}
  		
  		this.showContentWithRenderFunction(fn,"EMAIL");
    }
	
	/** Email related stuff ends **/
});

Ext.define('DVAlertBox',{
	extend: 'Ext.window.MessageBox',
	singleton: true,
	cls:'dv-alert'
});

Ext.define('com.barclays.DV.view.RandomImageGenerator', {
	darkImages:[],
	lightImages:[],
	currentIndex:0,
	constructor: function(directory,imageCap) {
		directory = directory || "/RSR_S/nyfipubs/barcap/blive-featured";
		directory += "/";
		this.imageCap = imageCap || 20;
		var startIndex = (Ext.Date.getDayOfYear(new Date()) % this.imageCap) +1;
		for(var i = 0, len = this.imageCap; i < len; i++) {
			var fileIndex = startIndex < 10 ? ("0" + startIndex) : startIndex;
			this.darkImages[i] = directory + fileIndex + "_img.png";
			this.lightImages[i] = directory + fileIndex + "_img_white.png";
			startIndex = (startIndex % this.imageCap) + 1;
		}
	},
	next:function() {
		var index = this.currentIndex % this.imageCap;
		++this.currentIndex;
		return (index % 2 == 0) ?  this.darkImages[index] : this.lightImages[index];
	}
});