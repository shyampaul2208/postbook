const express=require("express")
const mongoose=require("mongoose");
const app=express()
const passport = require('passport');
const cookieSession = require('cookie-session');
const cookieParser = require("cookie-parser");
const cors=require("cors");

mongoose.connect("mongodb+srv://admin-shyam:shyampaul4041@cluster0.kodas.mongodb.net/instaDB",{useNewUrlParser:true,useUnifiedTopology:true});
const GoogleStrategy = require('passport-google-oauth20').Strategy;

  app.use(
      cors({
      origin: "http://localhost:3000", // allow to server to accept request from different origin
       methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
       credentials: true // allow session cookie from browser to pass through
      })
    );

  

  
app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({extended:true,limit: '50mb'}))




const userSchema=new mongoose.Schema({
    name:String,
    googleId:String,
    profileImage:String,
})

const User=mongoose.model("User",userSchema);

const postSchema=new mongoose.Schema({
    createdBy:userSchema,
    selectedFile:String,
    description:String,
    likes:{
      type:[String],
      default:[]
    }
})
const Post=mongoose.model("Post",postSchema);

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      
      done(err, user);
    });
  });

passport.use(new GoogleStrategy({
    clientID: "24468091533-938rp6vole9r6tfo206jcdmr7a2n209t.apps.googleusercontent.com",
    clientSecret:"0X7qBzs4hutXG7T8DvH-pyg2" ,
    callbackURL: "http://localhost:5000/auth/google/good"
  },
  function(accessToken, refreshToken, profile, cb) {
    
   User.findOne({googleId:profile.id},(err,res)=>{
     if(res){
       return cb(null,res)
     }else{
       new User({
         name:profile.displayName,
         googleId:profile.id,
         profileImage:profile.photos[0].value


       }).save().then((User)=>{
           cb(null,User)
       })
       
     }
   })
  }
));

app.use(cookieParser());

//Configure Session Storage
app.use(cookieSession({
  name: 'session-name',
  keys: ["key1","key2"]
}))


//Configure Passport
app.use(passport.initialize());
app.use(passport.session());


app.get('/failed', (req, res) => {
    res.send('<h1>Log in Failed :(</h1>')
  });

  const checkUserLoggedIn = (req, res, next) => {
    if(req.user){
       next();
    }
  }

  //Protected Route.


  app.get("/",checkUserLoggedIn,(req,res)=>{
    res.status(200).json({
      user:req.user,
      cookies:req.cookies
    });
})




app.get("/login/success", checkUserLoggedIn, (req, res) => {

  console.log("requested")
  Post.find({}).then((results)=>{
    res.json(results)
  }).catch(err=>{
    console.log(err)
  })
})



  // Auth Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/good', passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    res.redirect("http://localhost:3000");
  }
);



  app.get('/logout', (req, res)=>{
  
    req.logout();
    res.redirect("http://localhost:3000");
    
})

// app.use((req,res)=>{
//     res.json("error 404 not found")
//   })

  
app.post("/addpost",checkUserLoggedIn,(req,res)=>{
  

    const post=new Post({
        createdBy:req.user,
        selectedFile:req.body.selectedFile,
        description:req.body.description

    })
    post.save().then(()=>{
        res.json("successfully saved")
    })
   

})

   app.get("/myposts",checkUserLoggedIn,(req,res)=>{
   
    Post.find({createdBy:req.user},(err,results)=>{
        res.status(200).json(results);
    })
  
  })

app.get("/post/:id",checkUserLoggedIn,(req,res)=>{


  
    Post.find({_id:req.params.id}).then((result)=>{
        res.status(200).json(result)
    }).catch(err=>{
        res.json(err)
    })
})

app.get("/:userName",checkUserLoggedIn,(req,res)=>{

  const s = req.params.id;
const regex = new RegExp(s, 'i') // i for case insensitive
Post.find({"createdBy.name": {$regex: regex}}).then(results=>{
  res.json(results);
})


})




  app.delete("/post/:id",checkUserLoggedIn,(req,res)=>{
      Post.deleteOne({_id:req.params.id}).then(()=>{
          res.json("successfully deleted")
      })
})

app.patch("/post/:id",checkUserLoggedIn,(req,res)=>{
  
    
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(404).send("no post with that id");
    
    Post.updateOne(
        {_id:req.params.id},
        {$set: req.body},
        (err,results)=>{
            if(!err){
                res.send("successfully updated")
            }
        }
        )
})





  


  
  
  
    























let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}






app.listen(port,()=>{


    console.log("server is up and running")
})