import axios from "axios";
import { func } from "prop-types"
import React, { useEffect, useState } from "react"

function Post(props){

    const[isLiked,setIsLiked]=useState(null);
    const[postLikes,setLikes]=useState(props.likes);

   useEffect(()=>{

     
     if(postLikes.find(element=>element==props.userid)!=undefined){
        
         setIsLiked(true)
     }else{
    
         setIsLiked(false)
     }


   },[postLikes])

   

   


   function handleClick(){
       
       if(!isLiked){
           const finalLikes={likes:[...postLikes,props.userid]}
           
        
           axios.patch(`/post/${props.imageid}`,finalLikes).then(res=>{
              //console.log(res)
           }).catch(err=>{
               console.log(err);
           })

           setLikes(finalLikes.likes);
           
       }else
       {
        
           const finalLikes={likes:postLikes.filter((like)=>{
               return like!=props.userid;
           })}
           
           axios.patch(`/post/${props.imageid}`,finalLikes).then(res=>{
               console.log(res);
           }).catch(err=>{
               console.log(err);
           })

           setLikes(finalLikes.likes);
        }

        
   }
    

    

    return (
        <div className="post" >
            <h2 className="card-header">{props.creator}</h2>

            {
                props.src && <img className="image" src={props.src} alt="a image" loading="lazy" />
                
            }
            
            <div className="card-body">
            <p className="description">{props.text}</p>
           <div className="likebox">
            <span className="like" onClick={handleClick}>{isLiked ? <i class="fas fa-heart fa-2x love"></i>  : <i class="far fa-heart fa-2x"></i> }</span>
            <span>{
               isLiked ?
                postLikes.length-1==0 ? "you" : postLikes.length-1==1  ? "you and 1 other":  `you and ${postLikes.length-1} others`   :  postLikes.length 
            }
            </span>
            </div>
            
            
            </div>
        </div>
    )
}

export default Post;
    