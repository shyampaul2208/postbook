import React, { useEffect, useState } from "react"
import axios from "axios";
import Post from "./Post";
import {Link} from "react-router-dom";

function MyPosts(props){
    
   const [myuploads,setMyuploads]=useState([]);
   const [requested,setRequested]=useState(false);
   const user=props.user;

   useEffect(()=>{
     axios.get("/subposts").then((res)=>{
        
     setRequested(true)   
     setMyuploads(res.data)
     }).catch(err=>{
        console.log(err)
     })
   },[])

   function handleDelete(event){
      event.preventDefault()
      const id=event.target.name;
      axios.delete(`/post/${id}`).then((res)=>{
      
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
     
     {
        !requested ? <h1>loading...</h1> :

        myuploads.length ?
       myuploads.map((image,index)=>{
          return (
             <div className="card">
             <Post key={image._id} userid={user._id} imageid={image._id} text={image.description} src={image.selectedFile} creator={image.createdBy.name} likes={image.likes} />
             <div className="delandedit">
             <button className="btn btn-light"   key={index} name={image._id}  onClick={handleDelete}><i class="fas fa-trash-alt"></i></button>

             <button className="btn btn-light del"><Link to={`/myposts/edit/${image._id}`}><i class="far fa-edit"></i></Link></button>
             </div>
             </div>
          )
          
       }) : <div className="emptyposts"> <h1>you haven't posted anything </h1> <button className="btn btn-dark"><Link className="mypostadd" to="/addpost">Add Post</Link>  </button> </div>

     }
    

     
    </div>
   )

        
        
         

}

export default MyPosts;