(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['article.hbs'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<article class=\"acl\">\r\n  <div class=\"acl-content\">\r\n    <h1 class='acl-title'>"
    + alias4(((helper = (helper = helpers.articleTitle || (depth0 != null ? depth0.articleTitle : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"articleTitle","hash":{},"data":data}) : helper)))
    + "</h1>\r\n    <p class=\"acl-text\">\r\n      "
    + alias4(((helper = (helper = helpers.articleText || (depth0 != null ? depth0.articleText : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"articleText","hash":{},"data":data}) : helper)))
    + "\r\n    </p>\r\n  </div>\r\n</article>\r\n";
},"useData":true});
})();