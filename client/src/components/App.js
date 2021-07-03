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
    
    axios.get("https://friendly-celsius-82819.herokuapp.com/user",{withCredentials:true}).then((response)=>{
     
    
      if (response.status === 200){
        setIsAuthentcated(true)
        setUser(response.data.user);
      }
    }).catch(err=>{
      console.log(err);
    })
  },[])

  

  
  function handleLogin(){
    
    
     window.open("https://friendly-celsius-82819.herokuapp.com/auth/google", "_self");
  }
  

  return (
    <div className="container-fluid">
       <Navbar authentication={isAuthenticated} />

      { !isAuthenticated ?  <div> hello <button onClick={handleLogin}>login</button></div> :
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
