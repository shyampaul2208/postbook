import axios from "axios";
import React, { useEffect, useState } from "react";
import Post from "./Post";

function Search(props){
const[content,setContent]=useState("");
const[users,setUsers]=useState([]);
const[posts,setPosts]=useState([]);
const user=props.user;
 
function handleChange(event){
    const matter=event.target.value;
    setContent(matter);
}

function handleClick(){
    if(content){

    
    axios.get(`https://friendly-celsius-82819.herokuapp.com/${content}`,{withCredentials:true}).then((res)=>{  
    setUsers(res.data);
    setPosts([]);
    }).catch(err=>console.log(err));

    }
}

function callPosts(event){
    

  setContent(event.target.value);
    
    axios.get(`https://friendly-celsius-82819.herokuapp.com/user/${event.target.name}`,{withCredentials:true}).then((res)=>{ 
    setPosts(res.data);
    setUsers([]);
    
    }).catch(err=>console.log(err));

    
}






   


 return(
     <div>
     <div class="searchbox">
     
     <input className="search" type="text" value={content} onChange={handleChange} placeholder="search" />
     <button onClick={handleClick}>search</button>
     </div>
      
     <div>
         {
        
                users.map((person)=>{
             return <button className="card" name={person._id} value={person.name} onClick={callPosts}> {person.name}</button>
          })
         }
         
     </div>

    <div>
         {
        
                posts.map((image)=>{
             return <div className="card"><Post className="card" key={image._id} userid={props.user._id} imageid={image._id} text={image.description} src={image.selectedFile} creator={image.createdBy.name} likes={image.likes}/> </div>
          })
         }
         
     </div>



     
     </div>

 );
}

export default Search;