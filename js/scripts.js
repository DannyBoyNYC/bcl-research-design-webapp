const toc = document.querySelector('.toc');
const toctoc = document.querySelector('.toc__toc');
const menuShow = document.querySelector('.menu-bug');
const contentHeader = document.querySelector('.content__header');
const iconList = document.querySelector('.icon-list');
var iconListIcons = [].slice.call(iconList.querySelectorAll('a'));


//mql = media query list
const breakOne = '22.5em'; // 360px
const breakTwo = '46.25em'; // 760px
const breakThree = '61.25em'; // 980px
const breakFour = '71.25em'; // 1140px
const breakFive = '81.25em'; // 1300px

const mqlBreakOne = window.matchMedia(`(min-width: ${breakOne}px)`);
const mqlBreakTwo = window.matchMedia(`(min-width: ${breakTwo}px)`);
const mqlBreakThree = window.matchMedia(`(min-width: ${breakThree}px)`);
const mqlBreakFour = window.matchMedia(`(min-width: ${breakFour}px)`);
const mqlBreakFive = window.matchMedia(`(min-width: ${breakFive}px)`);

// open close toc
menuShow.addEventListener('click', function () {
	const tocCoords = toc.getBoundingClientRect();
	const topOfToc = (tocCoords.height)
	toctoc.style.top = topOfToc + 'px';
	toctoc.classList.toggle('toc__open');
});

// show menubar at top of page, make the icon list static, parallax effect on image
window.addEventListener('scroll', staticize);

function staticize(){
	if (window.scrollY > 330) {
		toc.classList.add('fix-top')
		setTimeout(function(){
			toc.classList.add('fix-top-open')
		}, 500)
		iconList.classList.add('posfixed')
	} else {
		contentHeader.style.backgroundPosition = '50% ' + (pageYOffset * -1.5) + 'px';
		toc.classList.remove('fix-top')
		toc.classList.remove('fix-top-open')
		iconList.classList.remove('posfixed')
	}
}

// footnotes
const fnlink = document.querySelector('.footnote-link');
const fntext = document.querySelector('.footnote-item');

function show(){
	this.classList.toggle('fn-expanded');
	fntext.classList.toggle('fn-displayed');
	setTimeout(animate, 100);
}
function animate(){
	fntext.classList.toggle('fn-expanded');
}
fnlink.addEventListener('click', show);


// icon-bar in left column
iconListIcons.forEach(icon => icon.addEventListener('click', iconAction));

const iconPopover = document.querySelector('.popover');
const closePopover = document.querySelector('.close-popover');
closePopover.addEventListener('click', iconAction);

function iconAction(){
	iconPopover.classList.toggle('display-block');
	setTimeout(animateFade, 100);
}
function animateFade(){
	iconPopover.classList.toggle('active');
}

// byline popovers
const authorLinks = document.querySelectorAll('.byline a');
authorLinks.forEach( author => author.addEventListener('click', popUpAction));

const popOver = document.createElement('div');
popOver.classList.add('byline-popover');
document.body.append(popOver)

function popUpAction(e){
	const linkCoords = this.getBoundingClientRect();
	const coords = {
		bottom: linkCoords.bottom + window.scrollY,
		left: linkCoords.left + window.scrollX
	}
	popOver.style.position = 'absolute'
	popOver.style.top = `${coords.bottom + 4}px`; 

	//mql = media query list
	let mql = window.matchMedia('(min-width: 760px)');
	// console.log(breakTwo)

	if (mql.matches) {
		popOver.style.left = `${coords.left}px`;
	} else {
		popOver.style.left = `1rem`;
	}

	const popOverFrag = `
	<a class="close-popover" href="#00">✖︎</a>
	<div class="popover__content">
	<div>Bradley Rogoff, CFA<span class="popover-credentials">BCI, US</span> <span class="popover-credentials">High Grade Credit</span></div>
	<ul>
	<li><span class="md" aria-hidden="true" data-icon="&#xF430;"></span> <a href="#0">+1 (212) 526-4000</a></li>
	<li><span class="md" aria-hidden="true" data-icon="&#xF407;"></span> <a href="#0">Analyst's Page</a></li>
	<li><span class="md" aria-hidden="true" data-icon="&#xF379;"></span> <a href="#0">bradley.rogoff@barclays.com</a></li>
	</ul>
	</div>
	`;

	popOver.innerHTML = popOverFrag;
	popOver.classList.toggle('show');
	const closePopover = popOver.querySelector('.close-popover');
	closePopover.addEventListener('click', function(){
		popOver.classList.remove('show');
	})
	e.preventDefault();
}







































