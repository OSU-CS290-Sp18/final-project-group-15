window.onload = function(){
    function filterArticles(fText){
        var articleContainers = $(".acl");
        var articles = $(".acl-text");
        var titles = $(".acl-title");
        console.log(articleContainers, articles, titles);
        var filterText = fText.toUpperCase();
        if(filterText === ''){
            console.log("refreshing...");
            articleContainers.each(function(){
                $(this).show();
            });
        }

        for(i = 0; i < articleContainers.length; i++){
            var articleText = articles[i] ? articles[i].innerText.toUpperCase() : '';
            var articleTitle = titles[i] ? titles[i].innerText.toUpperCase() : '';

            if(articleText.indexOf(filterText) > -1 || articleTitle.indexOf(filterText) > -1){
                articleContainers[i].style.display = 'flex';
                continue;
            }
            articleContainers[i].style.display = 'none';
        }
    }
    $(".post-article").on('click', function(e){
        var text = $('.new-article-input')[0].value;
        var title = $('.new-title-input')[0].value;
        console.log({Text: text, Title: title});
        if(!title || !text){
            alert("Please Fill the Presented Fields");
            return;
        }
        var request = new XMLHttpRequest();
        request.open("POST", '/postArticle');
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({articleText: text, articleTitle: title}));
    });
    $('.archive-article').on('click', function(e){
        var text = $('.new-article-input')[0].value;
        var title = $('.new-title-input')[0].value;
        if(!title || !text){
            alert("Please Fill the Presented Fields");
            return;
        }
        var request = new XMLHttpRequest();
        request.open("POST", '/archiveArticle');
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({articleText: text, articleTitle: title}));
    });
    $(".acl").on('click', function(e){
        var flag = window.location.href.split('/')[3] === 'trending' ? 1 : 0;
        window.location.replace(window.location.href.split('/')[0] + "renderArticle/" + $(this).index() + "/" + flag);
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
