// window.onload = function(){
//     $(".navElement:has(a)").on('click', function(e){
//         $(".navElement").removeClass("active");
//         $(this).addClass("active");
//     });
// }

var searchButton = document.getElementById("navbar-search-button");

var allArticles = document.getElementById("articles");
var articles = document.getElementsByClassName("acl");
var articleText = document.getElementsByClassName("acl-text");

var goodArticles = [];
var badArticles = [];

var originalArticles = [];

for(ii = 0; ii < allArticles.length; ii ++) {
    originalArticles.push(allArticles[ii]);
    console.log(articleText[ii]);
}

searchButton.addEventListener('click', doSearch);

function doSearch() {
    var artNum = articles.length;

    var query = document.getElementById("navbar-search-input");
    console.log(query.value);


    for(ii = 0; ii < artNum; ii ++) {
        var artText = articleText[ii];
        console.log(artText);
        if(artText.value != "") {
            if(artText.text.toUpperCase().indexOf(query.value.toUpperCase()) === -1) {
                badArticles.push(articles[ii]);
            } else {
                goodArticles.push(articles[ii]);
            }
        }
    }

    while(allArticles.firstChild){
        allArticles.removeChild(allArticles.firstChild);
        console.log("aaa");
    }

    for(ii = 0; ii < goodArticles.length; ii ++) {
        allArticles.push(goodArticles[ii]);
    }
}

searchButton.doSearch = function() {

    // while(articleContainer.firstChild){
    //     articleContainer.removeChild(articleContainer.firstChild);
    //     console.log("sjadifopas");
    // }

    var query = document.getElementByID("navbar-search-input");

    for(ii = 0; ii < articles.length; ii ++) {
        var artText = articles[ii].text;
        if(artText.value != ""){
            if((artText.text).toUpperCase().indexOf(query.value.toUpperCase()) === -1) {
                badArticles.push(articles[ii]);
                articleContainer.remove(articles[ii]);
            }
        }
    }

}
