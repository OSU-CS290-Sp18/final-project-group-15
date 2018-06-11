var fs = require('fs');
var path = require('path');
var bodyParse = require('body-parser');
var exphbs = require('express-handlebars');
var express = require("express");
var app = express();

var trendingArticles = [];

app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');
app.use(bodyParse.json());

app.get("/", function(req, res){
    fs.readFile(path.join(__dirname, '/articles.json'), (err, data) =>{
        if(!err) var articlesJSON = JSON.parse(data);
        console.log('Getting Root Path...');
        res.render('articleContainer', {
            articles: articlesJSON
        });
    });
});

app.use('/renderArticle/:index/:flag', (req, res) => {
    fs.readFile(path.join(__dirname, '/articles.json'), (err, data) => {
        if(!err) var articlesJSON = JSON.parse(data);
        console.log("FLAG: ", req.params.flag);
        if(Number(req.params.flag)) var article = trendingArticles[Number(req.params.index)];
        else var article = articlesJSON[Number(req.params.index)];

        res.render('articleView',{
            articleText: article.articleText,
            articleTitle: article.articleTitle
        });

        for(i = 0; i < trendingArticles.length; i++){
            if(trendingArticles[i].articleTitle === article.title){
                trendingArticles[i].clicks++;
                return;
            }
        }

        var temp = {};
        temp['articleTitle'] = article.articleTitle;
        temp['articleText'] = article.articleText;
        temp['clicks'] = 1;
        console.log(temp);
        trendingArticles.push(temp);
    });
});

app.post('/postArticle', (req, res) => {
    fs.readFile(path.join(__dirname, '/articles.json'), (err, data) => {
        if(!err) var articlesJSON = JSON.parse(data);

        articlesJSON.push({articleTitle: req.body.articleTitle, articleText: req.body.articleText});
        console.log(articlesJSON);
        fs.writeFile('articles.json', JSON.stringify(articlesJSON));
    });

});

app.get('/write', (req, res) => {
    res.render('writeArticle');
});

app.get('/trending', (req, res) => {
    res.render('trendingView', {
        trendingArticles: trendingArticles
    });
});

app.get('/people', (req, res) => {
    res.render('peopleView');
});

app.get('/about', (req, res) => {
    res.render('aboutView');
});

app.get('/contact', (req, res) => {
    res.render('contactView');
});

app.get('/services', (req, res) => {
    res.render('servicesView');
});

app.get('/github/:profile', (req, res) => {
    res.status(301).redirect('https://github.com/' + req.params.profile);
});

app.get('/clients', (req, res) => {
    res.render('clientsView');
});

app.use("/:filename", (req, res) => {
    console.log("REQUEST: ", req.url);
    console.log("DIRECTORY: ", __dirname);
    if(req.params.filename != '' && req.params.filename.indexOf('.') > -1){
        fs.readFile(path.join(__dirname, "/public", req.params.filename), (err, data) => {
            if(!err) {
                res.writeHead(200, {'Content-Type': 'text/' + req.params.filename.split('.')[1]});
                return res.end(data);
            }
            res.status(404).render("404", {url : req.params.filename});
        });
    }
    console.log("hi");
});

app.listen(8000, function(){
    console.log("Listening on port 8000...");
});
