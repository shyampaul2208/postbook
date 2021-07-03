import React, { useEffect, useState } from "react"
import axios from "axios";
import Post from "./Post";
import {Link} from "react-router-dom";

function MyPosts(props){
    
   const [myuploads,setMyuploads]=useState([]);
   const user=props.user;

   useEffect(()=>{
     axios.get("https://friendly-celsius-82819.herokuapp.com/myposts",{withCredentials:true}).then((res)=>{
     setMyuploads(res.data)
     }).catch(err=>{
        console.log(err)
     })
   },[])

   function handleDelete(event){
      event.preventDefault()
      const id=event.target.name;
      axios.delete(`https://friendly-celsius-82819.herokuapp.com/post/${id}`,{withCredentials:true}).then((res)=>{
         console.log(res)
         setMyuploads(prev=>{
            return prev.filter(image=>{
               return image._id!=id
            })
         })
      }).catch(err=>{
         console.log(err)
      })
   }

   

  


   return (
    <div className="container-fluid">
      {myuploads.length ?
       myuploads.map((image,index)=>{
          return (
             <div className="card">
             <Post key={image._id} userid={user._id} imageid={image._id} text={image.description} src={image.selectedFile} creator={image.createdBy.name} likes={image.likes} />
             <div className="delandedit">
             <button key={index} name={image._id}  onClick={handleDelete}>DELETE</button>
             <button><Link to={`/myposts/edit/${image._id}`}> EDIT</Link></button>
             </div>
             </div>
          )
          
       }) : <h1>loading ...</h1>
    }
    </div>
   )

        
        
         

}

export default MyPosts;