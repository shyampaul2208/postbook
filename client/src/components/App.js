import React, { useEffect, useState } from "react"
import Navbar from  "./navbar"
import {BrowserRouter as Router,Route} from "react-router-dom";
import Feed from "./feed"
import Posts from "./myposts"
import AddPost from "./addpost";
import EditPost from "./editpost";
import axios from "axios";
import Search from "./search";


function App() {

  const [isAuthenticated,setIsAuthentcated]=useState(false);
  const[user,setUser]=useState({});

useEffect(()=>{
 axios.get("/user").then(res=>{
  if (res.status === 200){
    setIsAuthentcated(true)
    setUser(res.data.user);
  }
 })
},[])
 
  
  function handleLogin(){
    
    window.open("https://friendly-celsius-82819.herokuapp.com/auth/google","_self")
  }
      
  
  
  

  return (
    <div className="container-fluid">
       <Navbar authentication={isAuthenticated} />

      { !isAuthenticated ?  <div className="login"> 
      <h2>Hello There !!</h2>
       
       <p>please login to continue</p>

       <button className="btn btn-primary" onClick={handleLogin}>Sign in with <i class="fab fa-google"></i></button></div> :
      <div>
        
        <Route
          exact
          path='/'
          render={() => (
          <Feed user={user} />
         )}
        />
         <Route
          exact
          path='/myposts'
          render={() => (
          <Posts user={user} />
         )}
        />
        <Route
          exact
          path='/search'
          render={() => (
          <Search user={user} />
         )}
        />
        <Route path="/addpost" exact component={AddPost}  />
        <Route path="/myposts/edit/:id" exact component={EditPost} />
 
        </div>
       }
     </div>

  );
      }
      


export default App;
