import React, { useEffect, useState } from "react";
import axios from "axios";
import Post from "./Post";



function Feed(props){

  const[posts,setPosts]=useState([]);

  

  useEffect(()=>{

    axios.get("https://friendly-celsius-82819.herokuapp.com/login/success",{withCredentials:true}).then((response)=>{
    
    setPosts(response.data)

      }).catch(err=>{
    console.log(err);

  })
},[])












    return(
        <div className="container-fluid">
        
       <div className="total">
        
         <div className="greeting">
           <h1>welcome {props.user.name}</h1> 
         </div>
         <div>
         {posts.length ?
           
            posts.map((image)=>{
             return <div className="card"><Post className="card" key={image._id} userid={props.user._id} imageid={image._id} text={image.description} src={image.selectedFile} creator={image.createdBy.name} likes={image.likes}/> </div>
          })
           :  <h3>loading...</h3>}
         </div>

      </div>

      </div>
            )
}

export default Feed;


 