var scrolldelay =0
function pageScroll() {
    window.scrollBy(0,50); 
    scrolldelay = setTimeout('pageScroll()',50); 
    if(document.documentElement.scrollHeight-850 <document.documentElement.scrollTop )
    {
        clearTimeout(scrolldelay);
    }
}
document.getElementsByTagName("body")[0].addEventListener("wheel", function(){
    clearTimeout(scrolldelay);
});

