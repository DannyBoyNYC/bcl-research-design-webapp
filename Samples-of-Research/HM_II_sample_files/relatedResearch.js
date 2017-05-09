Ext.Ajax.defaultHeaders = {
	    'Accept' : 'application/json'
};


Ext.define('com.barclays.RelatedResearch.Carousel', {
	extend:'Ext.Container',
	alias: 'widget.relatedResearchCarousel',
	initComponent:function() {
		var me = this;
		Ext.applyIf(me, {
			rightNavigationTpl: new Ext.XTemplate(
					'<div class="ux-carousel-nav nav-start">',
						'<div class="ux-carousel-nav-holder">',
							'<div class="ux-carousel-nav-next clickable"></div>',
							'<div class="ux-carousel-nav-prev clickable"></div>',
						'</div>',
					'</div>'
			),
			leftNavigationTpl: new Ext.XTemplate(
					'<div class="ux-carousel-nav nav-start">',
						'<div class="ux-carousel-nav-holder">',
							'<div class="ux-carousel-nav-prev clickable"></div>',
							'<div class="ux-carousel-nav-next clickable"></div>',
						'</div>',
					'</div>'
			)
		});
		this.callParent(arguments);
	},
	afterRender:function() {
		var me = this;
		this.containerEl.on({
			click : {
				scope:this,
				fn :this.handleClickableClick,
				delegate : '.clickable'
			}
		});
		this.addCarousel(this.containerEl,this.itemSelector);
   		setTimeout(function(){
			Ext.Array.each(Ext.DomQuery.select(".ux-carousel-nav",me.containerEl.dom),function(item){
				var navEl = Ext.get(item);
				if(navEl) {
					navEl.hide();
				}
			});
		},1);
	},
	handleClickableClick:function(e,t) {
		e.preventDefault();
		var elem = Ext.get(t);
		 if(elem.hasCls("ux-carousel-nav-next")) {
			this.setSlide(Number(this.activeSlide) + 1);
		} else if(elem.hasCls("ux-carousel-nav-prev")) {
			this.setSlide(Number(this.activeSlide) - 1);
		}
		return false;
	},
	addCarousel:function(el,itemSelector) {
		var me = this;
		var dh = Ext.DomHelper;
		var items = el.select(itemSelector,el);
		this.activeSlide = 0;
		this.slides = [];
		this.carouselContainer = dh.append(el, {cls: 'ux-carousel-container'}, true);
	    this.carouselSlidesWrap = dh.append(this.carouselContainer, {cls: 'ux-carousel-slides-wrap'}, true);
	    var maxHeight = 0;
	    this.carouselContainer.setStyle({width: '100%'});
        // set the dimensions of the container
        this.slideWidth = el.getWidth(true);
        //this.slideWidth += 2;
        this.slideHeight = el.getHeight(true);
	    items.appendTo(this.carouselSlidesWrap).each(function(item) {
            item = item.wrap({cls: 'ux-carousel-slide'});
            this.slides.push(item);
            item.setWidth(this.slideWidth + 'px');
            maxHeight = Math.max(maxHeight,item.dom.offsetHeight);
        }, this);
        
	    this.carouselSlidesWrap.setStyle({
            height:maxHeight + 'px',
            width: (this.slideWidth * this.slides.length) + 'px'
         });
         
        items.each(function(item) {
           	Ext.get(item).setHeight(maxHeight + 'px');
        });
        me.addLeftNav(el);
        me.addRightNav(el);
        me.setSlide(0, true);
	},
	addLeftNav:function(el) {
		this.leftNavigationTpl.append(el);
		var navEl = Ext.get(Ext.DomQuery.selectNode(".ux-carousel-nav",el.dom));
		navEl.addCls("ux-carousel-nav-left");
	},
	addRightNav:function(el) {
		this.rightNavigationTpl.append(el);
	},
    setSlide: function(index,initial) {
        if(!this.slides[index]) {
            return;
        }
        if(index == 0) {
			Ext.Array.each(Ext.DomQuery.select(".ux-carousel-nav",this.containerEl.dom),function(item){
				var navEl = Ext.get(item);
				if(navEl) {
					navEl.addCls("nav-start");
				}
			});
        } else {
        	Ext.Array.each(Ext.DomQuery.select(".ux-carousel-nav",this.containerEl.dom),function(item){
				var navEl = Ext.get(item);
				if(navEl) {
					navEl.removeCls("nav-start");
				}
			});
        }
        
        if(index == this.slides.length -1) {
        	Ext.Array.each(Ext.DomQuery.select(".ux-carousel-nav",this.containerEl.dom),function(item){
				var navEl = Ext.get(item);
				if(navEl) {
					navEl.addCls("nav-end");
				}
			});
        } else {
        	Ext.Array.each(Ext.DomQuery.select(".ux-carousel-nav",this.containerEl.dom),function(item){
				var navEl = Ext.get(item);
				if(navEl) {
					navEl.removeCls("nav-end");
				}
			});
        }        
        var offset = index * this.slideWidth;
        if(!initial) {
        	 var xNew = (-1 * offset) + this.carouselContainer.getX();
              this.carouselSlidesWrap.shift({
                  duration: 200,
                  x: xNew,
                  easing: 'easeIn'
              });
        } else {
        	this.carouselSlidesWrap.setStyle('left', '0');
        }
        this.activeSlide = index;
    }
	
});
Ext.define('com.barclays.RelatedResearch.view.PublicationList' ,{
	extend:'Ext.Container',
	alias: 'widget.publicationList',
	cls:'related-research',
	data:[],
	initComponent:function() {
		var me = this;
		Ext.applyIf(me, {
			tpl: new Ext.XTemplate('<div class="main-container">',
						'<div style="height:75px;" class="loading-placeholder"></div>',
					'</div>',
		            '<tpl if="this.needIframe()">',
			        	'<iframe style="display:none;" class="iframeshimRelatedResearch iframeshimRelatedResearch-expand" frameborder="0" scrolling="no">',
							'<html><head></head><body></body></html>',
						'</iframe>',
					'</tpl>',{
						needIframe : function(){
							return false;
						}
					}),
        			publicationsTpl: new Ext.XTemplate(
        					'<div class="related-research-container" style="z-index:9999;margin:0 20px;">',
        						'<div class="header">',
        							'<a href="#" class="related-research-icon related-research-icon-expand clickable"><span>Related Research</span></a>',
        						'</div>',
        						'<tpl if="this.showTestAlgo()">',
        							'<div class="header-algo feedback clickable">Test Algorithm</div>',
        						'</tpl>',
    							'<div class="content-holder" style="overflow:hidden">',
	    							'<div class="content" style="width: 98%; overflow:hidden;">',
		            					'<tpl for=".">',
		            							'<ul class="pub-row">',
			        								'<tpl for=".">',
			        									'<li class="pub-info">',
			        										'<div class="publications">',
			        										   '<div class="l1Title">',
			        												'<a href="#" class="l1-title clickable" pubId="{pubId}" uri="{[this.getUri(values)]}">{[this.getL1Title(values)]}</a>',
			        											'</div>',
			        										   '<div class="pubTitle">',
			        												'<a href="#" title="{[this.getL2TitleHover(values)]}" pubId="{pubId}" class="pub-title pub-title-{pubId} clickable" uri="{[this.getUri(values)]}">{[this.getL2Title(values)]}</a>',
			        								           '</div>',
			        											'<div>',
			        												'<div class="pubDate">{[Ext.Date.format(Ext.Date.parse(values.pubDate,"m/d/y"),"d M Y")]}</div>',
			        												'<div style="clear:both;"></div>',
			        											'</div>',
			        										'</div>',
			        									'</li>',
			        								'</tpl>',
		        								'</ul>',
		    							'</tpl>',
		    						'</div>',
		    					'</div>',
    						'</div>',{
        				   		getUri: function(values){
        				   			if(values.mpInfo && values.mpInfo.length > 0 && values.mpInfo[0].mpURL && values.mpInfo[0].mpURL.length > 0) {
        				   				return values.mpInfo[0].mpURL;
        				   			} 
        				   			return  values.uri;
        				   		},
        				   		getL1Title:function(values) {
        				   			return this.limitStr(values.l1Title,25);
        				   		},
        				   		getL2Title:function(values) {
        				   			return this.limitStr(values.l2TitleAlt,42);
        				   		},
        				   		limitStr:function(input,maxLength) {
        				   	   	 	var toLong = input.length > maxLength,
        				   	   	 		s_ = toLong ? input.substr(0,maxLength-1) : input;
        				   	   	 		s_ = toLong ? s_.substr(0,s_.lastIndexOf(' ')) : s_;
        				   	   	 	return  toLong ? s_ + '...' : s_;
        				   	    },
        				   	    showTestAlgo:function() {
        				   	    	return me.showTestAlgo;
        				   	    },
        				   	    getL2TitleHover:function(values) {
        				   	    	return values.l2Title.replace(/"/g, "&quot;").replace(/'/g, "&#039;");
        				   	    }
   					}),
   					buttonTpl: new Ext.XTemplate('<div id="related-research-button" style="z-index:9999;position:absolute;top:150px;" class="clickable header expand">Related Research</div>')
		});
		this.callParent(arguments);
	},
	afterRender:function() {
		this.getEl().on({
			click : {
				scope:this,
				fn :this.handleClickableClick,
				delegate : '.clickable'
			}
		});
		this.getPublications();
	},
	handleClickableClick:function(e,t) {
		e.preventDefault();
		var me = this;
		var iframeEL = Ext.get(Ext.DomQuery.selectNode(".iframeshimRelatedResearch",this.getEl().dom));
		var contentHolderEl = Ext.get(Ext.DomQuery.selectNode(".content-holder",this.getEl().dom));
		var elem = Ext.get(t);
		if(elem.hasCls("l1-title") || elem.hasCls("pub-title")) {
			var uri = t.getAttribute("uri");
			var pubId = t.getAttribute("pubId");
			uri += "&sourceNugget=RELRES";
			if(top.document.getElementById("popupContent")) {
				top.document.getElementById("popupContent").src= uri;
			} else {
				DVOpenWindow(uri,0,0,'');
			}
			if(me.showEventId && me.showEventId.length > 0) {
				Ext.Ajax.request({
					url: "/" + me.contextPath + '/jsp/recommendationWebserviceProxy.jsp?action=recommendation_tracking&clickedPubId=' + pubId + "&showEventId=" + me.showEventId,
				    scope: this,
				    success: function(response,opts){
				    	
				    }
				});
			}
		} else if(elem.hasCls("feedback")) {
			var url = "/BC/S/research/recommendationEvalTool/" + me.pubId;
			window.open(url);
		} else if(elem.hasCls("related-research-icon")) {
			elem.toggleCls("related-research-icon-expand");
			if(elem.hasCls("related-research-icon-expand")){
				Ext.create('Ext.fx.Anim', {
				    target: top.document.getElementById("popupLogo"),
				    duration: 500,
				    from: {
				        height: 48
				    },
				    to: {
				        height: 125
				    },
				    listeners:{
				    	afteranimate:function() {
				    		top.popupResizeIFrame();
				    	}
				    }
				});	
				Ext.create('Ext.fx.Anim', {
				    target: contentHolderEl,
				    duration: 500,
				    from: {
				        height: 0
				    },
				    to: {
				        height: me.contentHolderElHeight
				    }
				});	
			} else {
				Ext.create('Ext.fx.Anim', {
				    target: top.document.getElementById("popupLogo"),
				    duration: 500,
				    from: {
				        height: 125
				    },
				    to: {
				        height: 48
				    },
				    listeners:{
				    	afteranimate:function() {
				    		contentHolderEl.setHeight(0);
				    		top.popupResizeIFrame();
				    	}
				    }
				});	
			}			
		} 
		return false;
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
	getPublications:function() {
		var me = this;
		me.showMask();
		Ext.Ajax.request({
			url: "/" + me.contextPath + '/jsp/recommendationWebserviceProxy.jsp?recomSource=related_research&recomPubId=' + me.pubId,
		    scope: this,
		    success: function(response,opts){
	   				var publicationsResponseObj = Ext.decode(Ext.String.trim(response.responseText));
	   				if(publicationsResponseObj.publications && publicationsResponseObj.publications.length > 0) {
	   					if(publicationsResponseObj.pgQuery && publicationsResponseObj.pgQuery.indexOf("?") > -1) {
		   					var queryString = publicationsResponseObj.pgQuery.split("?");
			    	 		var queryParam = Ext.Object.fromQueryString(queryString[1].replace(/\+/g,"%20"));
			    	 		me.showEventId = (queryParam && queryParam.recommendTrackingID) ? decodeURIComponent(queryParam.recommendTrackingID) : null;
	   					}
	   					var publications = publicationsResponseObj.publications;
	   					var pubRows = [];
	   					while( publications.length > 0) {
	   						var pubs = publications.splice(0,5);
	   						pubRows.push(pubs);
	   					}
	   					var el = this.getEl().down(".main-container");
	   					if(el) {
		   					this.publicationsTpl.overwrite(el,pubRows);
	   					}
	   					var releatedResearchButton = top.document.getElementById("related-research-button");
	   		   		    var releatedResearchEL = Ext.get(Ext.DomQuery.selectNode(".content",this.getEl().dom));
	   		   		    if(releatedResearchEL && pubRows.length > 1) {
							Ext.create('com.barclays.RelatedResearch.Carousel',{
								containerEl:releatedResearchEL,
								itemSelector: 'ul.pub-row',
								renderTo:releatedResearchEL
							});
	   		   		    }
	   		  			me.handleMouseEvents();
	   					setTimeout(function(){
	   						var contentHolderEl = Ext.get(Ext.DomQuery.selectNode(".content-holder",me.getEl().dom));
	   						if(contentHolderEl){
		   						me.contentHolderElHeight = contentHolderEl.getHeight(); 
	   						}
	   					},100);
		    		} else {
		    			this.hide();
		    			if(window.hideRelatedResearch) {
		    				window.hideRelatedResearch();
		    			}
		    		}
	   				top.popupResizeIFrame();
	   				me.hideMask();
			},
			failure: function(response,opts){
				this.hideMask();
				this.hide();
    			if(window.hideRelatedResearch) {
    				window.hideRelatedResearch();
    			}				
				top.popupResizeIFrame();
		    	return;
		    }
		});
	},
	handleMouseEvents:function() {
		var me = this;
		me.getEl().on('mouseover', function(event) {
			if(!event.within(me.getEl(), true)){
				Ext.Array.each(Ext.DomQuery.select(".ux-carousel-nav",me.getEl().dom),function(item){
					var navEl = Ext.get(item);
					if(navEl) {
						navEl.show();
					}
				});
			}
		});
		me.getEl().on('mouseout', function(event) {
			if(!event.within(me.getEl(), true)){
				Ext.Array.each(Ext.DomQuery.select(".ux-carousel-nav",me.getEl().dom),function(item){
					var navEl = Ext.get(item);
					if(navEl) {
						navEl.hide();
					}
				});
			}
		});

	}
});