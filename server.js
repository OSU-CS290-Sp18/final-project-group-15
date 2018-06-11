var fs = require('fs');
var path = require('path');
var bodyParse = require('body-parser');
var exphbs = require('express-handlebars');
var hbs = require('handlebars');
var express = require("express");
var MongoClient = require('mongodb').MongoClient;
var uri = "mongodb+srv://eugene:munblit6369@cluster0-ma4ey.mongodb.net/news";
var url = 'mongodb://localhost:27017';
var app = express();

var dbArticles = [];
var trendingArticles = [];
var mongoDB;

app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');
app.use(bodyParse.json());

MongoClient.connect(uri,
     {server:
         {reconnectTries: Number.MAX_VALUE,
          reconnectInterval: 1000}}, function(err, client){
    mongoDB = client.db('news');

    const collection = client.db('news').collection('articles');
    var articlesCursor = collection.find();
    articlesCursor.toArray(function(err, articleDocs){
        if(err){
            throw err
        }
        else{
            console.log(articleDocs);
            fs.readFile(path.join(__dirname, '/articles.json'), (err, data) =>{
                if(!JSON.parse(data))  fs.writeFile('articles.json', JSON.stringify(articleDocs));

                var articlesJSON = JSON.parse(data);
                console.log(articlesJSON);
                for(i = 0; i < articlesJSON.length; i++){
                    var a = articlesJSON[i];
                    if(a.clicks > 0) trendingArticles.push(a);
                }
                if(trendingArticles.length > 0){
                    trendingArticles = sortArticles();
                }
            });

        }
    });

});

function sortArticles(){
    var newArticles = [];
    var smallest = true;
    console.log("Sorting articles...");
    newArticles.push(trendingArticles[0]);

    for(i = 1; i < trendingArticles.length; i++){
        smallest = true;
        var TA = trendingArticles[i];

        for(j = 0; j < newArticles.length; j++){
            if(newArticles[j].clicks < TA.clicks){
                newArticles.splice(j, 0, TA);
                smallest = false;
                break;
            }
        }

        if(smallest) newArticles.push(TA);
    }

    return newArticles;
}
hbs.registerHelper('splitNewLines', function(text){
    text = hbs.Utils.escapeExpression(text);
    text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
    return new hbs.SafeString(text);
});

hbs.registerHelper('ifEquals', function(a, b, options){
    if(a === b) return options.fn(this);
    return options.inverse(this);
});

app.get("/", function(req, res){
    fs.readFile(path.join(__dirname, '/articles.json'), (err, data) =>{
        if(!err) var articlesJSON = JSON.parse(data);
        console.log('Getting Root Path...');

        MongoClient.connect(uri,
             {server:
                 {reconnectTries: Number.MAX_VALUE,
                  reconnectInterval: 1000}}, function(err, client){
            mongoDB = client.db('news');

            const collection = client.db('news').collection('articles');

            var articlesCursor = collection.find();
            articlesCursor.toArray(function(err, articles){
                res.render('articleContainer',{
                    articles: articles
                });
            });
        });
    });
});

app.use('/renderArticle/:index/:flag', (req, res) => {
    fs.readFile(path.join(__dirname, '/articles.json'), (err, data) => {
        if(!err) var articlesJSON = JSON.parse(data);

        if(Number(req.params.flag)) var article = trendingArticles[Number(req.params.index)];
        else var article = articlesJSON[Number(req.params.index)];

        if(!article){
            mongoDB.collection('article').find().toArray(function(err, articles){
                if(articles.length == req.params.index+1){
                    article = articles[req.params.index];
                }
            });
        }

        res.render('articleView',{
            articleText: article.articleText,
            articleTitle: article.articleTitle
        });

        console.log("\n\nTRENDING ARTICLES:", trendingArticles ,"\n\n");

        for(i = 0; i < trendingArticles.length; i++){
            if(trendingArticles[i] == undefined) break;
            if(trendingArticles[i].articleTitle == article.articleTitle){
                trendingArticles[i].clicks++;

                for(j = 0; j < articlesJSON.length; j++){
                    var a = articlesJSON[i];
                    if(trendingArticles[i].articleTitle == a.articleTitle){
                        a.clicks++;
                        mongoDB.collection('article').updateOne({_id: a._id}, {$set: a});

                        break;
                    }
                }

                fs.writeFile('articles.json', JSON.stringify(articlesJSON));

                trendingArticles = sortArticles();

                return;
            }
        }

        var temp = {};
        temp['_id'] = article._id;
        temp['articleTitle'] = article.articleTitle;
        temp['articleText'] = article.articleText;
        temp['clicks'] = 1;
        trendingArticles.push(temp);

        for(j = 0; j < articlesJSON.length; j++){
            var a = articlesJSON[i];
            if(trendingArticles[i].articleTitle == a.articleTitle){
                a.clicks++;
                mongoDB.collection('article').updateOne({_id: a._id}, {$set: a});

                break;
            }
        }
        fs.writeFile('articles.json', JSON.stringify(articlesJSON));

        trendingArticles = sortArticles();
        console.log('\n\n');
        trendingArticles = sortArticles();

        console.log("\n\n");

    });
});

app.post('/postArticle', (req, res) => {
    console.log("Reached /postArticle endpoint...");
    fs.readFile(path.join(__dirname, '/articles.json'), (err, data) => {
        if(!err) var articlesJSON = JSON.parse(data);

        console.log("NEW ENTRY: ", {articleTitle: req.body.articleTitle, articleText: req.body.articleText, clicks: 0});
        articlesJSON.push({articleTitle: req.body.articleTitle, articleText: req.body.articleText, clicks: 0});
        mongoDB.collection('articles').insertOne({articleTitle: req.body.articleTitle, articleText: req.body.articleText, clicks: 0});

        fs.writeFile('articles.json', JSON.stringify(articlesJSON));
    });
});


app.post('/archiveArticle', (req, res) => {
    mongoDB.collection('articles').insertOne({articleTitle: req.body.articleTitle, articleText: req.body.articleText, clicks: 0});
    console.log("Reached /archiveArticle endpoint...");
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

app.get('/archives', (req, res) => {
    mongoDB.collection('articles').find().toArray(function(err, articles){
        if(err) throw err;
        else
            res.render('articleContainer',{
                articles: articles
            });
    });

});

app.get('/github/:profile', (req, res) => {
    res.status(301).redirect('https://github.com/' + req.params.profile);
});

app.get('/clients', (req, res) => {
    res.render('clientsView');
});

app.use("/:filename", (req, res) => {
    // console.log("REQUEST: ", req.url);
    // console.log("DIRECTORY: ", __dirname);
    if(req.params.filename != '' && req.params.filename.indexOf('.') > -1){
        fs.readFile(path.join(__dirname, "/public", req.params.filename), (err, data) => {
            if(!err) {
                res.writeHead(200, {'Content-Type': 'text/' + req.params.filename.split('.')[1]});
                return res.end(data);
            }
            res.status(404).render("404", {url : req.params.filename});
        });
    }
});

app.listen(8000, function(){
    console.log("Listening on port 8000...");
});
