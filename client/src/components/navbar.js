import React from "react"
import {Link} from "react-router-dom";


function Navbar(props){

 function handleLogout(event){
     event.preventDefault()
    window.open("https://friendly-celsius-82819.herokuapp.com/logout", "_self");

    
 }



    return(
        <nav className="navbar sticky-top navbar-expand-lg navbar-dark bg-dark">
        <a className="navbar-brand" href="">Instaclone</a>
       <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>

      {  props.authentication &&
         
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          
           <ul className="navbar-nav ml-auto">
           <li className="nav-item">
                <Link to="/search" className="nav-link" href="">Search</Link>
            </li>
            <li className="nav-item">
                <Link to="/" className="nav-link" href="">Feed</Link>
            </li>
             <li className="nav-item">
                <Link to="/myposts" className="nav-link" href="">Myposts</Link>
            </li>
            <li className="nav-item">
                <Link to="/addpost" className="nav-link" href="">Addpost</Link>
            </li>

            
            <li className="nav-item">
                <a onClick={handleLogout} className="nav-link" href="">Logout</a>
            </li>
        </ul>
        </div> 
      }

      
    </nav>    
    
    )
}
    


export default Navbar;