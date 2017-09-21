'use strict';

//mql = media query list
var breakOne = '360'; // 360px  22.5em
var breakTwo = '760'; // 760px  46.25em
var breakThree = '980'; // 980px  61.25em
var breakFour = '1140'; // 1140px  71.25em
var breakFive = '1300'; // 1300px  81.25

var mqlBreakOne = window.matchMedia('(min-width: ' + breakOne + 'px)');
var mqlBreakTwo = window.matchMedia('(min-width: ' + breakTwo + 'px)');
var mqlBreakThree = window.matchMedia('(min-width: ' + breakThree + 'px)');
var mqlBreakFour = window.matchMedia('(min-width: ' + breakFour + 'px)');
var mqlBreakFive = window.matchMedia('(min-width: ' + breakFive + 'px)');

// content switcher for show
var switchlink = document.querySelector('.switch');
var switchh1 = document.querySelector('.switch-h1');
var switchh2 = document.querySelector('.switch-h2');
var switchlede = document.querySelector('.switch-lede');
var switchToc = document.querySelector('.switch-cont');

var htmlRoot = document.querySelector('html');

switchToc.style.display = 'none';

if (switchh2) {

	switchh2.style.display = 'none';
	switchh1.style.display = 'none';
	switchlede.style.display = 'none';
	switchlink.addEventListener('click', switcheroo);
}

function switcheroo() {
	htmlRoot.classList.add('in-chapter'); // add root class
	switchlink.parentNode.classList.toggle('active');

	switchh1.innerHTML = 'Focus';
	switchToc.style.display = 'block';
	switchh2.style.display = 'block';
	switchh1.style.display = 'block';
	switchlede.style.display = 'block';
	switchlede.classList.toggle('lede');
	switchh1.classList.toggle('alt');
	switchh2.classList.toggle('alt');
}

// end switcher for show


var toc = document.querySelector('.toc');
var toctoc = document.querySelector('.toc__toc');
var menuShow = document.querySelector('.menu-bug');
var contentHeader = document.querySelector('.content__header');
// const iconList = document.querySelector('.icon-list');
// var iconListIcons = [].slice.call(iconList.querySelectorAll('a'));

// open close toc
menuShow.addEventListener('click', function () {
	var tocCoords = toc.getBoundingClientRect();
	var topOfToc = tocCoords.height;
	toctoc.style.top = topOfToc + 'px';
	toctoc.classList.toggle('toc__open');
});

//window.scroll functions
//show menubar at top of page, make the icon list static

window.addEventListener('scroll', fixTop);
var tocCoords = toc.getBoundingClientRect();
var coords = { bottom: tocCoords.bottom + window.scrollY
	// console.log('The bottom of TOC is ' + coords.bottom + 'px from the top')
};function fixTop() {
	if (window.scrollY > coords.bottom) {
		toc.classList.add('fix-top');
		setTimeout(function () {
			toc.classList.add('fix-top-open');
		}, 0);
		// iconList.classList.add('posfixed')
	} else if (window.scrollY < coords.bottom) {
		toc.classList.remove('fix-top');
		toc.classList.remove('fix-top-open');
		// iconList.classList.remove('posfixed')
	}
}

//, parallax effect on image
window.addEventListener('scroll', staticize);
function staticize() {
	contentHeader.style.backgroundPosition = '50% ' + pageYOffset * -2.0 + 'px';
}
//END window.scroll functions

// footnotes
var fnlink = document.querySelector('.footnote-link');
var fntext = document.querySelector('.footnote-item');

function show() {
	this.classList.toggle('fn-expanded');
	fntext.classList.toggle('fn-displayed');
	setTimeout(animate, 100);
}
function animate() {
	fntext.classList.toggle('fn-expanded');
}
// support MAIN-2 page
if (fnlink) {
	fnlink.addEventListener('click', show);
}

// MARK OF THE UNICORN
// -- // -- // -- byline popovers
var popLinks = document.querySelectorAll('.byline a');
popLinks.forEach(function (popLink) {
	return popLink.addEventListener('click', popUpAction);
});

var popOver = document.createElement('div');
popOver.classList.add('popover');
document.body.append(popOver);

function popUpAction(e) {
	var templateSelector = this.getAttribute('href');
	var linkCoords = this.getBoundingClientRect();
	var coords = {
		bottom: linkCoords.bottom + window.scrollY,
		left: linkCoords.left + window.scrollX
	};
	popOver.style.position = 'absolute';
	popOver.style.top = coords.bottom + 4 + 'px';

	//mql = media query list
	var mql = window.matchMedia('(min-width: 760px)');

	if (mql.matches) {
		popOver.style.left = coords.left + 'px';
	} else {
		popOver.style.left = '1rem';
	}

	if (templateSelector === '#multiples') {
		popOver.innerHTML = popOverFragMultiples;
	} else if (templateSelector === '#single') {
		popOver.innerHTML = popOverFrag;
	} else if (templateSelector === '#icn-1') {
		popOver.innerHTML = popOverFragIcn01;
	} else if (templateSelector === '#icn-2') {
		popOver.innerHTML = popOverFragIcn02;
	} else if (templateSelector === '#icn-3') {
		popOver.innerHTML = popOverFragIcn03;
	}

	popOver.classList.toggle('show');
	var closePopover = popOver.querySelector('.close-popover');
	closePopover.addEventListener('click', function () {
		popOver.classList.remove('show');
	});
	e.preventDefault();
}

var popOverFrag = '\n<a class="close-popover" href="#00">\u2716\uFE0E</a>\n<div class="popover__content">\n<div>Bradley Rogoff, CFA<span class="popover-credentials">BCI, US</span> <span class="popover-credentials">High Grade Credit</span></div>\n<ul>\n<li><span class="md" aria-hidden="true" data-icon="&#xF430;"></span> <a href="#0">+1 (212) 526-4000</a></li>\n<li><span class="md" aria-hidden="true" data-icon="&#xF407;"></span> <a href="#0">Analyst\'s Page</a></li>\n<li><span class="md" aria-hidden="true" data-icon="&#xF379;"></span> <a href="#0">bradley.rogoff@barclays.com</a></li>\n</ul>\n</div>\n';

var popOverFragMultiples = '\n<a class="close-popover" href="#00">\u2716\uFE0E</a>\n<div class="popover__content multiple">\n<div>Multiple Analysts<span class="popover-credentials">BCI, US</span> <span class="popover-credentials">High Grade Credit</span></div>\n<ul>\n<li><span class="md" aria-hidden="true" data-icon="&#xF430;"></span> <a href="#0">+1 (212) 526-4000</a></li>\n<li><span class="md" aria-hidden="true" data-icon="&#xF407;"></span> <a href="#0">Analyst\'s Page</a></li>\n<li><span class="md" aria-hidden="true" data-icon="&#xF379;"></span> <a href="#0">shobit.gupta@barclays.com</a></li>\n</ul>\n</div>\n\n<div class="popover__content multiple">\n<div>Shobhit Gupta<span class="popover-credentials">BCI, US</span> <span class="popover-credentials">High Grade Credit</span></div>\n<ul>\n<li><span class="md" aria-hidden="true" data-icon="&#xF430;"></span> <a href="#0">+1 (212) 526-4000</a></li>\n<li><span class="md" aria-hidden="true" data-icon="&#xF407;"></span> <a href="#0">Analyst\'s Page</a></li>\n<li><span class="md" aria-hidden="true" data-icon="&#xF379;"></span> <a href="#0">shobit.gupta@barclays.com</a></li>\n</ul>\n</div>\n\n<div class="popover__content multiple">\n<div>Another Analyst, CFA<span class="popover-credentials">BCI, US</span> <span class="popover-credentials">High Grade Credit</span></div>\n<ul>\n<li><span class="md" aria-hidden="true" data-icon="&#xF430;"></span> <a href="#0">+1 (212) 526-4000</a></li>\n<li><span class="md" aria-hidden="true" data-icon="&#xF407;"></span> <a href="#0">Analyst\'s Page</a></li>\n<li><span class="md" aria-hidden="true" data-icon="&#xF379;"></span> <a href="#0">another.analyst@barclays.com</a></li>\n</ul>\n</div>\n';

var popOverFragIcn01 = '\n<a class="close-popover" href="#0">\u2716\uFE0E</a>\n<div class="popover__content">\n\n<div>Subscribe</div>\n<ul>\n<li><a href="#0">Add to Read Later</a> <input type="checkbox"> </li>\n<li><a href="#0">Clippings &amp; Annotations</a>\n<ul>\n<li><a href="#0">Annotation 1</a></li>\n<li><a href="#0">Annotation 2</a></li>\n</ul>\n</li>\n\n</ul>\n\n<div>Document Tools</div>\n<ul>\n<li><span class="md" aria-hidden="true" data-icon="\uF440"></span> <a href="#0">Add to Quicklist</a></li>\n<li><span class="md" aria-hidden="true" data-icon="\uF380"></span> <a href="#0">Add to Briefcase</a></li>\n<li><span class="md" aria-hidden="true" data-icon="\uF116"></span> <a href="#0">Email Me</a></li>\n<li><span class="md" aria-hidden="true" data-icon="\uF436"></span> <a href="#0">Share</a></li>\n<li><span class="md" aria-hidden="true" data-icon="\uF407"></span> <a href="#0">Subscribe Client</a></li>\n<li><span class="md" aria-hidden="true" data-icon="\uF395"></span> <a href="#0">Copy Link</a></li>\n</ul>\n\n</div>\n\n</div>\n';

var popOverFragIcn02 = '\n<a class="close-popover" href="#0">\u2716\uFE0E</a>\n<div class="popover__content">\n\n<div>Print PDF</div>\n<ul style="display: block">\n<li><a><span class="md" aria-hidden="true" data-icon="&#xE001;"></span> This chapter (3 pages)</a></li>\n<li><a><span class="md" aria-hidden="true" data-icon="&#xE001;"></span> US Credit Alpha (43 pages)</a></li>\n</ul>\n</div>\n</div>\n';

var popOverFragIcn03 = '\n<a class="close-popover" href="#0">\u2716\uFE0E</a>\n<div class="popover__content">\n\n<div>Attachments in this article</div>\n<ul style="display: block">\n<li> <a><span class="md" aria-hidden="true" data-icon="&#xE001;"></span> Sample PDF</a></li>\n<li> <a><span class="md" aria-hidden="true" data-icon="&#xE006;"></span> Sample Power Point</a></li>\n<li> <a><span class="md" aria-hidden="true" data-icon="&#xE003;"></span> Sample Word doc</a></li>\n<li> <a><span class="md" aria-hidden="true" data-icon="&#xE002;"></span> Sample Excel spreadsheet</a></li>\n</ul>\n</div>\n</div>\n';

// simulate clicking on a large table
var tablePopover = document.querySelector('.figure-header');
var tableToPop = document.querySelector('.figure-header + table');
var tablePopIcon = document.querySelector('.table-xl--btn');

// support MAIN-2
if (tablePopover) {
	tablePopover.addEventListener('click', showTable);
}

function showTable() {
	tableToPop.classList.toggle('table-pop');
	if (tableToPop.classList.contains('table-pop')) {
		tablePopIcon.innerHTML = '<img src="/svg/arrows-close.svg" />';
	} else {
		tablePopIcon.innerHTML = '<img src="/svg/arrows.svg" />';
	}
}

//# sourceMappingURL=scripts-min.js.map