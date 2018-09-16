var express = require("express");
var path = require("path");
var app = express();
var bodyParser= require('body-parser');
var mongoose = require('mongoose');

var ReviewSchema = new mongoose.Schema({
    rating: Number,
    comment: String},
    {timestamps:true}
);
var CakeSchema = new mongoose.Schema({
    baker: String,
    image:String,
    rating:Number,
    reviews:[ReviewSchema]},
    {timestamps: true}
);



mongoose.model('Cake', CakeSchema); // We are setting this Schema in our Models as 'User'
var Cake = mongoose.model('Cake');
mongoose.model('Review', ReviewSchema); // We are setting this Schema in our Models as 'User'
var Review = mongoose.model('Review');
mongoose.connect('mongodb://localhost/RateCakes');
mongoose.Promise = global.Promise;


app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './static')));
app.use(express.static( __dirname + '/public/dist/public' ));

app.get('/cakes', function(req,res){
    Cake.find({}, function(err,cakes){
        if (err){
            console.log('no cakes')
            res.redirect('/')
        }
        else{
            console.log('found cakes');
            res.json(cakes);
        }
    })
})



app.post('/newcake', function(req,res){
    var cake = new Cake({baker:req.body.baker, image: req.body.image});
        cake.save(function(err){
            if (err){
                console.log('couldnt create')
                res.json('couldnt make')
            }
            else{
                console.log('cake created')
                res.json('made cake');
                }
        })
    })
app.put('/newreview/:cakeid', function(req,res){
    var review = new Review({rating:req.body.rating,comment: req.body.comment});
    review.save(function(err){
        if (err){
            console.log("problem creating review")
        }
        else{
            console.log('successfully created review');
            Cake.findOneAndUpdate({_id: req.params.cakeid},{$push: {reviews:review}},function(err,data){
                if(err){
                    console.log("problem linking review to cake")
                }
                else{
                    console.log("successfully linked review to cake");
                    res.json('added the review');
                };
            });
        };
    });
});

app.delete('/remove/:id', function(req,res){
    Cake.deleteOne({_id:req.params.id}, function(err,task){
        if(err){
            console.log('couldnt destroy')
            res.json('not deleted');
        }
        else{
            console.log('destroyed')
            res.json('deleted')
        }
    });
});

app.put('/update/:id/:title',function(req,res){
    Cake.update({_id:req.params.id},{$set:{title:req.params.title}}, function(err,task){
        if (err){
            console.log('cant update')
            res.redirect('/')
        }
        else{
            console.log('updated')
            res.redirect('/')
        }
    })
})

app.get('/:id', function(req,res){
    Cake.find({_id:req.params.id}, function(err,cake){
        if (cake.length !=0){
            console.log('found this cake')
                    res.json(cake)
                }
        else{
            console.log('this cake dont exist')
            res.redirect('/');
        }
    })
});

app.listen(8000,function(){
    console.log("listening on port 8000");
})