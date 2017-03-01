$(document).ready(function(){
	
	  $(".toc").click(function(e){
		  e.preventDefault();
		  toggleTOC();
		  return false;
	  });
	 
	 $('.toc__section-link').each(function(i, tocSectionLinkEL) {
		 $(tocSectionLinkEL).click(function() {
			 var sectionId = $(tocSectionLinkEL).attr("toc_link_id");
			 var sectionEl = $(document).find("[toc_id='" + sectionId + "']");
			 
			 var tocheight = $(".toc").height();
			 var scrollTop = 0;
			 if(tocheight < 50) {
				 scrollTop = $(sectionEl).offset().top - tocheight;
			 } else {
				 scrollTop = $(sectionEl).offset().top;
			 }
			 $('html, body').animate({
				 scrollTop: scrollTop
			  }, 1000);
		 });
	 });
	 
	 
	 $('.toc__chapter-link').each(function(i, tocChapterLinkEL) {
		 $(tocChapterLinkEL).click(function() {
			 var chapterId = $(tocChapterLinkEL).attr("toc_link_id");
			 var chapterEl = $(document).find("[chapter_id='" + chapterId + "']");
			 
			 if(chapterEl.hasClass("is-visible")) return;
			 
			 var tocSectionNav = $(".active-nav-section");
			 tocSectionNav.removeClass(".active-nav-section");
			 tocSectionNav.addClass("is-hidden");
			 
			 var tocCurrentSectionNav = $(tocChapterLinkEL).closest("ul").find("li > ul.nav");
			 tocCurrentSectionNav.removeClass("is-hidden");
			 tocCurrentSectionNav.addClass("active-nav-section");
	 
			 var visibleChapterEL = $(document).find(".visible-chapter");
			 visibleChapterEL.removeClass("is-visible");
			 visibleChapterEL.addClass("is-hidden");
			 
			 chapterEl.removeClass("is-hidden");
			 chapterEl.addClass("is-visible visible-chapter");
		 
		 });
	 });
	 
	 $('.disclosure-link').each(function(i, discLinkEL) {
		 $(discLinkEL).click(function() {
			 var disclosure = $(this).closest(".certifications-disclosures").find(".back-page-disclosure");
			 $(disclosure).slideToggle();	
		 });
		 
	 });
	 
	 function toggleTOC() {
		 $(".toc__toc").slideToggle('test',function(){
			 if($(this).is(":visible")) {
				 $("body").bind('click', toggleTOC);
			 } else {
				 $("body").unbind('click', toggleTOC);
			 }
		 });
	 }
 
});