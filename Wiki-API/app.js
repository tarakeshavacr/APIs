const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const articleSchema = {
  title: String,
  content: String
};
const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
  .get(function(req, res) {
    Article.find({}, function(err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      }
    });
  })
  .post(function(req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });

    newArticle.save(function(err) {
      if (!err) {
        res.send("Successful sent an article");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function(req, res) {

    Article.deleteMany(function(err) {
      if (!err) {
        res.send("Successful deletion");
      } else {
        res.send(err);
      }
    });
  });

/////////////////////Dealing with a specific articles

app.route("/articles/:articleTitle")
  .get(function(req, res) {

    Article.findOne({
      title: req.params.articleTitle
    }, function(err, fa) {
      if (fa) {
        res.send(fa);
      } else {
        res.send("No articles were matched");
      }
    });
  })
  .put(function(req, res) {
    Article.update({
      title: req.params.articleTitle
    }, {
      title: req.body.title,
      content: req.body.content
    }, {
      overwrite: true
    }, function(err) {
      if (!err) {
        res.send("No errror");
      }
    })
  })
  .patch(function(req, res) {
      Article.update({
          title: req.params.articleTitle
        }, {
          $set: req.body
        },
        function(err) {
          if (!err) {
            res.send("Success");
          } else {
            res.send(err);
          }
        });
  })
  .delete(function(req,res){
    Article.deleteOne({title: req.params.articleTitle}, function(err){
      if(!err){
        res.send("Successful deletion.");
      } else{
        res.send(err);
      }
    })
  });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
