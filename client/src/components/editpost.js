import react, { useEffect, useState } from "react"
import axios from "axios";
import FileBase from "react-file-base64";
import { Route, Redirect } from "react-router-dom";

function Editpost(props){

    const [post,setPost]=useState(null);
    
     useEffect(()=>{
         axios.get(`https://friendly-celsius-82819.herokuapp.com/post/${props.match.params.id}`,{withCredentials:true}).then((res)=>{
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

        
        axios.patch(`https://friendly-celsius-82819.herokuapp.com/post/${props.match.params.id}`,post,{withCredentials:true}).then((res)=>{
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
        <FileBase
        type="file"
        multiple={false}
        onDone={({base64})=>setPost({...post,selectedFile:base64})}
        value={post.selectedFile}
        
         />


        <textarea
        className="addDescription"
          onChange={handleDescriptionChange}
          value={post.description}
          name="description"
          placeholder="description"
          rows="3"
        />
        <button
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