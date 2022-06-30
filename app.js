const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine" , "ejs");

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB")

const articalSchema = {
  title: String,
  content: String
}

const Artical = mongoose.model("Artical", articalSchema);

app.route("/articals")
  .get(function(req ,res){
  Artical.find({}, function(err, foundArticals){
    if(!err){
        res.send(foundArticals);
    }else{
        res.send(err);
    }
  });
})
  .post(function(req, res){
  const newArtical = new Artical({
    title: req.body.title,
    content: req.body.content
  });
  newArtical.save(function(err){
    if(!err){
      res.send("sucessfully added");
    } else{
      res.send(err);
    }

  });
})
  .delete(function(req, res){
  Artical.deleteMany({}, function(err){
    if(!err){
      res.send("sucessfully deleteed all Files");
    } else

      res.send(err);
    }
  });
});

app.route("/articals/:articalTitle")
  .get(function(req, res){
    Artical.findOne({title: req.params.articalTitle}, function(err, foundArtical){
      if(foundArtical){
        res.send(foundArtical)
      } else {
        res.send("No artical found");
      }
    });
  })

  .put(function(req, res){
    Artical.update(
      {title: req.params.articalTitle},
      {title: req.body.title, content:req.body.content},
      {overwrite: true},
      function(err){
        if(!err){
          res.send("Sucessfully updated");
        }
      }
    );
  })

  .patch(function(req, res){

    Artical.update(
      {title: req.params.articalTitle},
      {$set: req.body},
      function(err){
        if(!err){
          res.send("Sucessfully patched");
        } else{
          res.send(err);
        }
      }
    );
  })

  .delete(function(req, res){
    Artical.deleteOne(
      {title: req.params.artical},
      function(err){
        if(!err){
          res.send("Sucessfully Deleted");
        }
      }
    );
  });

app.listen(3000, function(){
  console.log("Server started at 3000");
});
