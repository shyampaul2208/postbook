const express=require("express")
const mongoose=require("mongoose");
const app=express()
const passport = require('passport');
const cookieSession = require('cookie-session');

// const cors=require("cors");

mongoose.connect("mongodb+srv://admin-shyam:shyampaul4041@cluster0.kodas.mongodb.net/instaDB",{useNewUrlParser:true,useUnifiedTopology:true});
const GoogleStrategy = require('passport-google-oauth20').Strategy;



// app.set("trust proxy",1);

//   app.use(
//       cors({
//        origin: "https://blissful-ritchie-b74df9.netlify.app", // allow to server to accept request from different origin
//        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//        credentials: true // allow session cookie from browser to pass through
//       })
//     );

  

  
app.use(express.json({limit: '30mb'}))
app.use(express.urlencoded({extended:true,limit: '30mb'}))




const userSchema=new mongoose.Schema({
    name:String,
    googleId:String,
    profileImage:String,
});

const User=mongoose.model("User",userSchema);
const {ObjectId}=mongoose.Schema.Types;
const postSchema=new mongoose.Schema({
    createdBy:{
      type:ObjectId,
      ref:"User"
    },
    selectedFile:String,
    description:String,
    likes:{
      type:[String],
      default:[]
    }
},{timestamps:true})
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
    clientSecret:"W2UNhm_12AFprzzExMXofcqn" ,
    callbackURL: "https://friendly-celsius-82819.herokuapp.com/auth/google/good"
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
    }else{
      res.status(404);
    }
  }

  //Protected Route.



app.get("/user",checkUserLoggedIn,(req,res)=>{
  res.status(200).json({
    user:req.user
  });
})




app.get("/login/success", checkUserLoggedIn, (req, res) => {


  Post.find().populate("createdBy","_id name profileImage").sort("-createdAt").then((results)=>{
    res.json(results)
  }).catch(err=>{
    console.log(err)
  })
})



  // Auth Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/good', passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    
    res.redirect("/");
  }
);



app.get('/logout', (req, res)=>{
  
    req.logout();
    res.redirect("/");
    
})


  
app.post("/newpost",checkUserLoggedIn,(req,res)=>{
  
  const post=new Post({
    createdBy:req.user,
    selectedFile:req.body.selectedFile,
    description:req.body.description

})
post.save().then(()=>{
    res.json("successfully saved")
})


    

})

   app.get("/subposts",checkUserLoggedIn,(req,res)=>{
   
    Post.find({createdBy:req.user._id}).populate("createdBy", "_id name").then(results=>{
      res.status(200).json(results);
    }).catch(err=>{
      console.log(err);
    })
  
  })

app.get("/post/:id",checkUserLoggedIn,(req,res)=>{


  
    Post.find({_id:req.params.id}).then((result)=>{
        res.status(200).json(result)
    }).catch(err=>{
        res.json(err)
    })
})

app.get("/searched/:userName",checkUserLoggedIn,(req,res)=>{
 
  let userPattern=new RegExp(req.params.userName,"i");
  
  User.find({name:{$regex:userPattern}}).then(results=>{
    res.json(results);
  }).catch(err=>{
    console.log(err);
  })

})

app.get("/user/:userId",checkUserLoggedIn,(req,res)=>{
  Post.find({createdBy:req.params.userId}).populate("createdBy", "_id name").then(results=>{
    res.status(200).json(results);
  }).catch(err=>{
    console.log(err);
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





    app.use(express.static('client/build'));
    const path = require('path');
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })




  


  
  
  
    























let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}






app.listen(port,()=>{


    console.log("server is up and running")
})