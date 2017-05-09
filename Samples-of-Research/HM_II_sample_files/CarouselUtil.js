Ext.ns('Ext.ux');

Ext.ux.Carousel = Ext.extend(Ext.util.Observable, {
    interval: 3,
    transitionDuration: 1,
    transitionType: 'carousel',
    transitionEasing: 'easeOut',
    itemSelector: 'img',
    activeSlide: 0,
    autoPlay: false,
    showPlayButton: false,
    pauseOnNavigate: false,
    wrap: false,
    autoWrap:false,
    freezeOnHover: false,
    navigationOnHover: false,
    hideNavigation: false,
    freezeOnTransition:false,
    width: null,
    height: null,

    constructor: function(el, config) {
        config = config || {};
        Ext.apply(this, config);

        Ext.ux.Carousel.superclass.constructor.call(this, config);

        this.addEvents(
            'beforeprev',
            'prev',
            'beforenext',
            'next',
            'change',
            'play',
            'pause',
            'freeze',
            'unfreeze'
        );
        this.el = el;
        this.slides = this.els = [];
        this.navigationPages = [];
        
        if(this.autoPlay || this.showPlayButton) {
            //this.wrap = true;
        };

        if(this.autoPlay && typeof config.showPlayButton === 'undefined') {
            this.showPlayButton = true;
        }

        this.initMarkup();
        this.initEvents();

        if(this.carouselSize > 0) {
            this.refresh();
        }
    },

    initMarkup: function() {
        var dh = Ext.DomHelper;
        
        this.carouselSize = 0;
        var items = this.el.select(this.itemSelector,this.el);
        this.els.container = dh.append(this.el, {cls: 'ux-carousel-container'}, true);
        this.els.slidesWrap = dh.append(this.els.container, {cls: 'ux-carousel-slides-wrap'}, true);

        this.els.navigation = dh.append(this.els.container, {cls: 'ux-carousel-nav'}, true).hide();
        
        this.els.navigationHolder = dh.append(this.els.navigation, {cls: 'ux-carousel-nav-holder'}, true);

        if(this.showPlayButton) {
            this.els.navPlay = dh.append(this.els.navigationHolder, {tag: 'a', href: '#', cls: 'ux-carousel-nav-play'}, true);
        }
      
        // set the dimensions of the container
        this.slideWidth = this.width || (this.el.getWidth(true));
        //this.slideWidth += 2;
        this.slideHeight = this.height || this.el.getHeight(true);

        this.els.container.setStyle({
           width: '100%'
           
        });
        var maxHeight = 0;
        this.els.navPrev = dh.append(this.els.navigationHolder, {tag: 'div', cls: 'ux-carousel-nav-prev'}, true);
        items.appendTo(this.els.slidesWrap).each(function(item) {
            item = item.wrap({cls: 'ux-carousel-slide'});
            this.slides.push(item);
            item.setWidth(this.slideWidth + 'px');
            maxHeight = Math.max(maxHeight,item.dom.offsetHeight);
        }, this);
        
        this.els.slidesWrap.setStyle({
            height:maxHeight + 'px'
         });
         
        items.each(function(item) {
           	Ext.get(item).setHeight(maxHeight + 'px');
        });
        
        this.carouselSize = this.slides.length;
        if(this.carouselSize > 0) {
        	 this.els.navDot = dh.append(this.els.navigationHolder, {tag: 'div', cls: 'ux-carousel-nav-dot'}, true);
	        for(var i = 0; i < this.carouselSize; i++) {
	        	this.els.navigationLink = dh.append(this.els.navDot, {tag: 'a', href: '#', index:i, cls: 'ux-carousel-default'}, true);
	        	this.navigationPages.push(this.els.navigationLink);
	        	this.showByIndex(i);
	        	if(i == 0 && this.activeSlide == 0) {
	        		this.els.navigationLink.dom.setAttribute('class','ux-carousel-active');
	        		if(Ext.isIE7 || Ext.isIE6){
	        			this.els.navigationLink.dom.className = 'ux-carousel-active';
	        		}
	        	}
	        }
        }
        this.els.navNext = dh.append(this.els.navigationHolder, {tag: 'div', index:i, cls: 'ux-carousel-nav-next'}, true);
        if(this.navigationOnHover) {
            this.els.navigation.setStyle('top', (-1*this.els.navigation.getHeight()) + 'px');
        }
        dh.append(this.els.navigationHolder, {tag: 'div', index:i, cls: 'ux-carousel-nav-end'}, true);
        this.el.clip();
    },
    showByIndex: function(index) {
    	this.els.navigationLink.on('click', function(ev,obj) {
    		this.navigationPages[this.activeSlide].dom.setAttribute('class','ux-carousel-default');
    		if(Ext.isIE7 || Ext.isIE6){
	        	this.navigationPages[this.activeSlide].dom.className = 'ux-carousel-default';
	        }
    		obj.setAttribute('class','ux-carousel-active');
    		if(Ext.isIE7 || Ext.isIE6){
	        	obj.className = 'ux-carousel-active';
	        }
    		ev.preventDefault();
            var target = ev.getTarget();
            target.blur();
            this.activeSlide  = index;
            this.setSlide(this.activeSlide);
        }, this);
    },
    initEvents: function() {
        this.els.navPrev.on('click', function(ev) {
            ev.preventDefault();
            var target = ev.getTarget();
            target.blur();            
            //if(Ext.fly(target).hasClass('ux-carousel-nav-disabled')) return;
            this.prev();
        }, this);

        this.els.navNext.on('click', function(ev) {
            ev.preventDefault();
            var target = ev.getTarget();
            target.blur();
            //if(Ext.fly(target).hasClass('ux-carousel-nav-disabled')) return;
            this.next();
        }, this);

        if(this.showPlayButton) {
            this.els.navPlay.on('click', function(ev){
                ev.preventDefault();
                ev.getTarget().blur();
                if(this.playing) {
                    this.pause();
                }
                else {
                    this.play();
                }
            }, this);
        };

        if(this.freezeOnHover) {
            this.els.container.on('mouseenter', function(){
                if(this.playing) {
                    this.fireEvent('freeze', this.slides[this.activeSlide]);
                    this.freezeOnTransition = true;
                    if(this.playTaskBuffer) {
                    	this.playTaskBuffer.cancel();
                    }
                    Ext.TaskManager.stop(this.playTask);
                }
            }, this);
            this.els.container.on('mouseleave', function(){
            	if(this.playing) {
	            	this.freezeOnTransition = false;
            		this.fireEvent('unfreeze', this.slides[this.activeSlide]);
            		 if(this.playTaskBuffer) {
            			 this.playTaskBuffer.delay(this.interval*1000);
            		 }
            	}
            }, this);
        };

        if(this.navigationOnHover) {
            this.els.container.on('mouseenter', function(){
                if(!this.navigationShown) {
                    this.navigationShown = true;
                    this.els.navigation.stopFx(false).shift({
                        y: this.els.container.getY(),
                        duration: this.transitionDuration
                    })
                }
            }, this);

            this.els.container.on('mouseleave', function(){
                if(this.navigationShown) {
                    this.navigationShown = false;
                    this.els.navigation.stopFx(false).shift({
                        y: this.els.navigation.getHeight() - this.els.container.getY(),
                        duration: this.transitionDuration
                    })
                }
            }, this);
        }

        if(this.interval && this.autoPlay) {
            this.play();
        };
    },

    prev: function() {
        if (this.fireEvent('beforeprev') === false) {
            return;
        }
        if(this.pauseOnNavigate) {
            this.pause();
        }
        this.navigationPages[this.activeSlide].dom.setAttribute('class','ux-carousel-default');
        if(Ext.isIE7 || Ext.isIE6){
	        this.navigationPages[this.activeSlide].dom.className = 'ux-carousel-default';
	    }
    	this.setSlide(Number(this.activeSlide) - 1);
        this.navigationPages[this.activeSlide].dom.setAttribute('class','ux-carousel-active');
        if(Ext.isIE7 || Ext.isIE6){
	    	this.navigationPages[this.activeSlide].dom.className = 'ux-carousel-active';
	    }
    	this.fireEvent('prev', this.activeSlide);        
        return this; 
    },
    
    next: function() {
        if(this.fireEvent('beforenext') === false) {
            return;
        }
        if(this.pauseOnNavigate) {
            this.pause();
        }
        this.navigationPages[this.activeSlide].dom.setAttribute('class','ux-carousel-default');
        if(Ext.isIE7 || Ext.isIE6){
	    	this.navigationPages[this.activeSlide].dom.className = 'ux-carousel-default';
	    }
    	this.setSlide(Number(this.activeSlide) + 1);
        this.navigationPages[this.activeSlide].dom.setAttribute('class','ux-carousel-active');
        if(Ext.isIE7 || Ext.isIE6){
	    	this.navigationPages[this.activeSlide].dom.className = 'ux-carousel-active';
	   	}
    	this.fireEvent('next', this.activeSlide);        
        return this;         
    },

    play: function() {
        if(!this.playing) {
            this.playTask = this.playTask || {
                run: function() {
            		if(!this.freezeOnTransition) {
            			if(!this.autoWrap && !this.slides[this.activeSlide+1]) {
            				 return;
            			 }
	                    this.playing = true;
	                    this.navigationPages[this.activeSlide].dom.setAttribute('class','ux-carousel-default');
	                    if(Ext.isIE7 || Ext.isIE6){
	    					this.navigationPages[this.activeSlide].dom.className = 'ux-carousel-default';
	    				}
	                    if(this.autoWrap && !this.slides[this.activeSlide+1]) {
	                    	this.setSlide(0);
	                    	this.navigationPages[0].dom.setAttribute('class','ux-carousel-active');
		                    if(Ext.isIE7 || Ext.isIE6){
		    					this.navigationPages[0].dom.className = 'ux-carousel-active';
		    				}	 
	                    } else {
	    					this.setSlide(this.activeSlide+1);
		                    this.navigationPages[this.activeSlide].dom.setAttribute('class','ux-carousel-active');
		                    if(Ext.isIE7 || Ext.isIE6){
		    					this.navigationPages[this.activeSlide].dom.className = 'ux-carousel-active';
		    				}	                    	
	                    }
    	    		}
                },
                interval: this.interval*1000,
                scope: this
            };
            
            this.playTaskBuffer = this.playTaskBuffer || new Ext.util.DelayedTask(function() {
                Ext.TaskManager.start(this.playTask);
            }, this);
            this.playTaskBuffer.delay(this.interval*1000);
            this.playing = true;
            if(this.showPlayButton) {
               // this.els.navPlay.addClass('ux-carousel-playing');
            }
            this.fireEvent('play');
        }        
        return this;
    },

    pause: function() {
        if(this.playing) {
            Ext.TaskManager.stop(this.playTask);
            this.playTaskBuffer.cancel();
            this.playing = false;
            if(this.showPlayButton) {
            	try{
                	this.els.navPlay.removeClass('ux-carousel-playing');
                }catch(e){
                	
                }
            }
            this.fireEvent('pause');
        }        
        return this;
    },
        
    clear: function() {
        this.els.slidesWrap.update('');
        this.slides = [];
        this.carouselSize = 0;
        this.pause();
        return this;
    },
    
    add: function(el, refresh) {
        var item = Ext.fly(el).appendTo(this.els.slidesWrap).wrap({cls: 'ux-carousel-slide'});
        item.setWidth(this.slideWidth + 'px').setHeight(this.slideHeight + 'px');
        this.slides.push(item);                        
        if(refresh) {
            this.refresh();
        }        
        return this;
    },
    
    refresh: function() {
        this.carouselSize = this.slides.length;
        this.els.slidesWrap.setWidth((this.slideWidth * this.carouselSize) + 'px');
        if(this.carouselSize > 0) {
            if(!this.hideNavigation) this.els.navigation.show();
            if(!this.activeSlide) {
            	this.activeSlide = 0;
                this.setSlide(0, true);
            } else {
                this.setSlide(this.activeSlide - 1, true);
                this.next();
            }
        }                
        return this;        
    },
    
    setSlide: function(index, initial) {
        if(!this.wrap && !this.slides[index]) {
            return;
        }
        else if(this.wrap) {
            if(index < 0) {
                index = this.carouselSize-1;
            }
            else if(index > this.carouselSize-1) {
                index = 0;
            }
        }
        if(!this.slides[index]) {
            return;
        }
	   	
       // this.els.caption.update(this.slides[index].child(':first-child', true).title || '');
        var offset = index * this.slideWidth;
        if (!initial) {
            switch (this.transitionType) {
                case 'fade':
                    this.slides[index].setOpacity(0);
                    this.slides[this.activeSlide].stopFx(false).fadeOut({
                        duration: this.transitionDuration / 2,
                        callback: function(){
                            this.els.slidesWrap.setStyle('left', (-1 * offset) + 'px');
                            this.slides[this.activeSlide].setOpacity(1);
                            this.slides[index].fadeIn({
                                duration: this.transitionDuration / 2
                            });
                        },
                        scope: this
                    })
                    break;

                default:
                    var xNew = (-1 * offset) + this.els.container.getX();
                   // this.els.slidesWrap.stopFx(false);
                    this.els.slidesWrap.shift({
                        duration: this.transitionDuration,
                        x: xNew,
                        easing: this.transitionEasing
                    });
                    break;
            }
        }
        else {
            this.els.slidesWrap.setStyle('left', '0');
        }
        this.navigationPages[this.activeSlide].dom.setAttribute('class','ux-carousel-default');
        if(Ext.isIE7 || Ext.isIE6){
	    	this.navigationPages[this.activeSlide].dom.className = 'ux-carousel-default';
	   	}
    	this.activeSlide = index;
        this.navigationPages[this.activeSlide].dom.setAttribute('class','ux-carousel-active');
        if(Ext.isIE7 || Ext.isIE6){
	    	this.navigationPages[this.activeSlide].dom.className = 'ux-carousel-active';
	    }
    	this.fireEvent('change', this.slides[index], index)
    },

    updateNav: function() {

    }
});
