import React, { useEffect } from 'react';
import "./Header.css";
import { auth } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { toast } from 'react-toastify';
import userImg from "../../Assets/user.svg";
function Header() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if(user){
      navigate("/dashboard");
    }
  }, [user, loading])
  
  function logoutFnc() {
    try{
      signOut(auth)
      .then(() => {
        // Sign-out successful.
        toast.success("Logged Out Successfully!");
        navigate("/");
      }).catch((error) => {
        toast.error(error.message);
        // An error happened.
      });
      
    }catch(e){
    toast.error(e.message);
    }
  }

  return (
    <div className='Navbar'>
      <p className='logo'>Financify.</p>
      {user && (
      <div style={{display:"flex", alignItems: "center", gap: "0.7rem"}}> 
      <img src={user.photoURL?user.photoURL:userImg}  style={{borderRadius: "50%", height:"1.5rem" , width:"1.5rem"}}/>
      <p className='logo link'onClick={logoutFnc}>
        Logout
        </p>
        </div> )}
      
    </div>
  );
}

export default Header