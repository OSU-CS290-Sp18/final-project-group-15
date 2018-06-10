window.onload = function(){
    $(".navElement:has(a)").on('click', function(e){
        $(".navElement").removeClass("active");
        $(this).addClass("active");
    });
}

var searchButton = document.getElementById("navbar-search-button");

var allArticles = document.getElementById("articles");
var articles = document.getElementsByClassName("acl");
var articleText = document.getElementsByClassName("acl-text");

var goodArticles = [];
var badArticles = [];

var originalArticles = [];

var childrenRemoved = 0;

for(ii = 0; ii < allArticles.length; ii ++) {
    originalArticles.push(allArticles[ii]);
    console.log(articleText[ii]);
}

searchButton.addEventListener('click', doSearch);

function doSearch() {
    var artNum = articles.length;

    var query = document.getElementById("navbar-search-input");
    console.log("Searching for '" + query.value + "'");


    for(ii = 0; ii < artNum; ii ++) {
        var artText = articleText[ii];
        if(artText.textContent != "") {
            if(artText.textContent.toUpperCase().indexOf(query.value.toUpperCase()) === -1) {
                badArticles.push(articles[ii]);
            } else {
                goodArticles.push(articles[ii]);
            }
        }
    }

    console.log(allArticles + " ... before removing")
    while(allArticles.firstChild){
        allArticles.removeChild(allArticles.firstChild);
        console.log("removed child ... " + allArticles);
        childrenRemoved ++;
    }
    console.log(childrenRemoved + " posts removed");
    console.log(allArticles + " ... after removing");

    for(ii = 0; ii < goodArticles.length; ii ++) {
        console.log(goodArticles[ii]);
        allArticles.push(goodArticles[ii]);
    }


}

searchButton.doSearch = function() {
    console.log("hello");
}
