var fs = require('fs');
var path = require('path');
var bodyParse = require('body-parser');
var exphbs = require('express-handlebars');
var express = require("express");
var app = express();


app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');
app.use(bodyParse.json());

app.get("/", function(req, res){
    fs.readFile(path.join(__dirname, '/articles.json'), (err, data) =>{
        if(!err) var articlesJSON = JSON.parse(data);

        res.render('articleContainer', {
            articles: articlesJSON
        });
    });
});
app.post("/renderArticle/:title", (req, res) => {
    console.log(req.body);
    res.render('articleView',{
        articleText: req.body.articleText,
        articleTitle: req.body.articleTitle
    });
});
app.post('/postArticle', (req, res) => {
    fs.readFile(path.join(__dirname, '/articles.json'), (err, data) => {
        if(!err) var articlesJSON = JSON.parse(data);

        articlesJSON.push({title: req.body.articleTitle, text: req.body.articleText});
        console.log(articlesJSON);
        fs.writeFile('articles.json', JSON.stringify(articlesJSON));
    });

});
app.get('/write', (req, res) => {
    res.render('writeArticle');
});
app.use(express.static('public'));
// app.use("/:filename", (req, res, next) => {
//     console.log("REQ: ", req.url, req.body);
//     if (req.params.filename != "") {
//         if(req.params.filename.indexOf('.') === -1){
//             if(req.params.filename.indexOf('Title')){
//                 res.render("articleView", {
//                     articleText: req.body.articleText,
//                     articleTitle: req.body.articleTitle
//                 });
//                 return;
//             }
//         }
//         fs.readFile(path.join(__dirname, "/public", req.params.filename), (err, data) => {
//             if(!err) {
//                 res.writeHead(200, {'Content-Type': 'text/' + req.params.filename.split('.')[1]});
//                 return res.end(data);
//             }
//             res.status(404).render("404", {url : req.params.filename});
//         });
//     }
// });

app.listen(8000, function(){
    console.log("Listening on port 8000...");
});
