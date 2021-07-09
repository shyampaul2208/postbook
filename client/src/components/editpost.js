import react, { useEffect, useState } from "react"
import axios from "axios";
import FileBase from "react-file-base64";
import { Route, Redirect } from "react-router-dom";

function Editpost(props){

    const [post,setPost]=useState(null);
    
     useEffect(()=>{
         axios.get(`/post/${props.match.params.id}`).then((res)=>{
            setPost(res.data[0]);
         }).catch(err=>{
             console.log(err)
         })
     },[])


    const[isSubmitted,setIsSubmitted]=useState(false);
   
    function handleDescriptionChange(event){
     const value=event.target.value
     const name=event.target.name
     setPost((prev)=>{
         return {
             ...prev,
             [name]:value
         }
     })
    }

  
      
    
    

   
      
    


    function formSubmit(event){
        event.preventDefault()
    

        
        
        if(post.selectedFile || post.description)
        {

        
        axios.patch(`/post/${props.match.params.id}`,post).then((res)=>{
          console.log(res);
          setIsSubmitted(true)
        }).catch(err=>{
          console.log(err);
        })
      } else{
          alert("please add some content")
        }
      

     
      
      
      
        
       
        
    }
       
        
    







    return(
        <div className="container-fluid">
        {
          
          post==null ? <h1>loading ...</h1> :
        

        <div className="card addpost">
      

        <img className="image" src={post.selectedFile} />
        
      <form onSubmit={formSubmit}>
        <textarea
        className="addDescription"
          onChange={handleDescriptionChange}
          value={post.description}
          name="description"
          placeholder="description"
          rows="3"
        />
        <button
        className="btn btn-dark"
        type="submit">
          update
        </button>
      </form>

      {isSubmitted && <Redirect
              to={{
                pathname: "/myposts",
                state: {
                  from: props.location
                }
              }}
            />}
    
    </div>
        }
        </div>
    );
    

}


export default Editpost;