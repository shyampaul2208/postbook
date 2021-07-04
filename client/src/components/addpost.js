import react, { useEffect, useState } from "react"
import axios from "axios";
import FileBase from "react-file-base64";
import { Route, Redirect } from "react-router-dom";

function Addpost(props){

    const [post,setPost]=useState({
        description:"",
        selectedFile:null,
    });

    const[isSubmitted,setIsSubmitted]=useState(false);
    const[isuploaded,setIsuploaded]=useState(false);
    const [url,setUrl] = useState("");

    useEffect(()=>{
      
      if(url){
         
        setIsuploaded(true);
          
        axios.post("/newpost",{description:post.description,selectedFile:url}).then((res)=>{
          setIsSubmitted(true)
        }).catch(err=>{
          console.log(err);
        })
        

      }
     

    },[url])

    


   
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

        if(post.selectedFile){
          const formData=new FormData();
          formData.append("file",post.selectedFile);
          formData.append("upload_preset","ml_default");
          formData.append("cloud_name","dxiiqch27");

          axios.post("https://api.cloudinary.com/v1_1/dxiiqch27/image/upload",formData).then(res=>{
            setUrl(res.data.url);
           
          })

        }else{
          alert("please choose a file");
        }
      
        
      }

  

 
       
        
    







    return(
        <div className="container-fluid">

        {
           isuploaded ? <h2>adding post ...</h2> :
           <div className="card addpost">
        
        
        <form onSubmit={formSubmit}>
          
          <div>
  
          
          
         {post.selectedFile && <img className="image" src={post.selectedFile} />}
  
        
         
          <div>
           <FileBase
          type="file"
          multiple={false}
          onDone={({base64})=>setPost({...post,selectedFile:base64})}
          value={post.selectedFile}
          
           /> 

           
  
           </div>
           </div>
           
           
  
            
          
  
          <div>
          <textarea
          className="addDescription"
            onChange={handleDescriptionChange}
            value={post.description}
            name="description"
            placeholder="description"
            rows="2"
          />
          </div>
          <button
          type="submit">
            Add
          </button>
        </form>
  
        
  
         
      
      </div>


        }


       

    {isSubmitted && <Redirect
              to={{
                pathname: "/myposts",
                state: {
                  from: props.location
                }
              }}
            />}
    
        </div>
    );
    

}


export default Addpost;