window.onload = function(){
    var articleContainers = $(".acl");
    var articles = $(".acl-text");

    function filterArticles(fText){
        var filterText = fText.toUpperCase();
        if(filterText === ''){
            console.log("refreshing...");
            articleContainers.each(function(){
                $(this).show();
            });
        }

        for(i = 0; i < articles.length; i++){
            var trueText = articles[i].innerText.toUpperCase();
            if(trueText.indexOf(filterText) > -1) continue;
            articleContainers[i].style.display = 'none';
        }
    }

    $(".acl-content").on('click', function(e){
        var request = new XMLHttpRequest();
        request.open("POST", '/renderArticle/' + $(this)[0].childNodes[1].innerText);
        request.setRequestHeader('Content-Type', 'application/json');
        console.log($(this));
        request.send(JSON.stringify({articleText: $(this)[0].childNodes[3].innerText, articleTitle: $(this)[0].childNodes[1].innerText}));
        window.location.replace(window.location.href + "renderArticle/" + $(this)[0].childNodes[1].innerText);
    });
    $(".navElement:has(a)").on('click', function(e){
        $(".navElement").removeClass("active");
        $(this).addClass("active");
    });
    $("#navbar-search-input").on('keypress', function(e){
        if(e.keyCode == 13){
            filterArticles($(this).val());
        }
    });
}

//
// var searchButton = document.getElementById("navbar-search-button");
//
// var allArticles = document.getElementById("articles");
// var articles = document.getElementsByClassName("acl");
// var articleText = document.getElementsByClassName("acl-text");
//
// var goodArticles = [];
// var badArticles = [];
//
// var originalArticles = [];
//
// var childrenRemoved = 0;
//
// for(ii = 0; ii < allArticles.length; ii ++) {
//     originalArticles.push(allArticles[ii]);
//     console.log(articleText[ii]);
// }
//
// searchButton.addEventListener('click', doSearch);
//
// function doSearch() {
//     var artNum = articles.length;
//
//     var query = document.getElementById("navbar-search-input");
//     console.log("Searching for '" + query.value + "'");
//
//
//     for(ii = 0; ii < artNum; ii ++) {
//         var artText = articleText[ii];
//         if(artText.textContent != "") {
//             if(artText.textContent.toUpperCase().indexOf(query.value.toUpperCase()) === -1) {
//                 badArticles.push(articles[ii]);
//             } else {
//                 goodArticles.push(articles[ii]);
//             }
//         }
//     }
//
//     console.log(allArticles + " ... before removing")
//     while(allArticles.firstChild){
//         allArticles.removeChild(allArticles.firstChild);
//         console.log("removed child ... " + allArticles);
//         childrenRemoved ++;
//     }
//     console.log(childrenRemoved + " posts removed");
//     console.log(allArticles + " ... after removing");
//
//     for(ii = 0; ii < goodArticles.length; ii ++) {
//         console.log(goodArticles[ii]);
//         allArticles.push(goodArticles[ii]);
//     }
//
//
// }
//
// searchButton.doSearch = function() {
//     console.log("hello");
// }
