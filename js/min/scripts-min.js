'use strict';

var toc = document.querySelector('.toc');
var toctoc = document.querySelector('.toc__toc');
var menuShow = document.querySelector('.menu-bug');
var contentHeader = document.querySelector('.content__header');
var iconList = document.querySelector('.icon-list');
var iconListIcons = [].slice.call(iconList.querySelectorAll('a'));

//mql = media query list
var breakOne = '22.5em'; // 360px
var breakTwo = '46.25em'; // 760px
var breakThree = '61.25em'; // 980px
var breakFour = '71.25em'; // 1140px
var breakFive = '81.25em'; // 1300px

var mqlBreakOne = window.matchMedia('(min-width: ' + breakOne + 'px)');
var mqlBreakTwo = window.matchMedia('(min-width: ' + breakTwo + 'px)');
var mqlBreakThree = window.matchMedia('(min-width: ' + breakThree + 'px)');
var mqlBreakFour = window.matchMedia('(min-width: ' + breakFour + 'px)');
var mqlBreakFive = window.matchMedia('(min-width: ' + breakFive + 'px)');

// open close toc
menuShow.addEventListener('click', function () {
	var tocCoords = toc.getBoundingClientRect();
	var topOfToc = tocCoords.height;
	toctoc.style.top = topOfToc + 'px';
	toctoc.classList.toggle('toc__open');
});

// show menubar at top of page, make the icon list static, parallax effect on image
window.addEventListener('scroll', staticize);

function staticize() {
	if (window.scrollY > 320) {
		toc.classList.add('fix-top');
		iconList.classList.add('posfixed');
	} else {
		contentHeader.style.backgroundPosition = '50% ' + pageYOffset * -1.5 + 'px';
		toc.classList.remove('fix-top');
		iconList.classList.remove('posfixed');
	}
}

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
fnlink.addEventListener('click', show);

// icon-bar in left column
iconListIcons.forEach(function (icon) {
	return icon.addEventListener('click', iconAction);
});

var iconPopover = document.querySelector('.popover');
var closePopover = document.querySelector('.close-popover');
closePopover.addEventListener('click', iconAction);

function iconAction() {
	iconPopover.classList.toggle('display-block');
	setTimeout(animateFade, 100);
}
function animateFade() {
	iconPopover.classList.toggle('active');
}

// byline popovers
var authorLinks = document.querySelectorAll('.byline a');
authorLinks.forEach(function (author) {
	return author.addEventListener('click', popUpAction);
});

var popOver = document.createElement('div');
popOver.classList.add('byline-popover');
document.body.append(popOver);

function popUpAction(e) {
	var linkCoords = this.getBoundingClientRect();
	var coords = {
		bottom: linkCoords.bottom + window.scrollY,
		left: linkCoords.left + window.scrollX
	};
	popOver.style.position = 'absolute';
	popOver.style.top = coords.bottom + 4 + 'px';

	//mql = media query list
	var mql = window.matchMedia('(min-width: 760px)');
	// console.log(breakTwo)

	if (mql.matches) {
		popOver.style.left = coords.left + 'px';
	} else {
		popOver.style.left = '1rem';
	}

	var popOverFrag = '\n\t<a class="close-popover" href="#00">\u2716\uFE0E</a>\n\t<div class="popover__content">\n\t<div>Bradley Rogoff, CFA<span class="popover-credentials">BCI, US</span> <span class="popover-credentials">High Grade Credit</span></div>\n\t<ul>\n\t<li><span class="md" aria-hidden="true" data-icon="&#xF430;"></span> <a href="#0">+1 (212) 526-4000</a></li>\n\t<li><span class="md" aria-hidden="true" data-icon="&#xF407;"></span> <a href="#0">Analyst\'s Page</a></li>\n\t<li><span class="md" aria-hidden="true" data-icon="&#xF379;"></span> <a href="#0">bradley.rogoff@barclays.com</a></li>\n\t</ul>\n\t</div>\n\t';

	popOver.innerHTML = popOverFrag;
	popOver.classList.toggle('show');
	var closePopover = popOver.querySelector('.close-popover');
	closePopover.addEventListener('click', function () {
		popOver.classList.remove('show');
	});
	e.preventDefault();
}
