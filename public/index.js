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
    $(".post-article").on('click', function(e){
        var request = new XMLHttpRequest();
        request.open("POST", '/postArticle');
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({articleText: $('.new-article-input')[0].value, articleTitle: $('.new-title-input')[0].value}));
    });
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
