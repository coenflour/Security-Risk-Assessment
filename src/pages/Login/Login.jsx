import React, {useState} from "react"
import './Login.css'
import logo from '../../assets/logo.png'
import { login, signup} from '../../firebase'
import { useNavigate } from 'react-router-dom'

const Login = () => {

    const [signState, setSignState] = useState("Sign In");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const user_auth = async (event) => {
        event.preventDefault();
      
        if (!email.endsWith("@gmail.com")) {
          alert("Email harus menggunakan @gmail.com!");
          return;
        }
      
        try {
          if (signState === "Sign In") {
            await login(email, password);
            localStorage.setItem("userEmail", email); // Simpan email ke localStorage
            alert("Login berhasil!");
            navigate('/home');
          } else {
            await signup(name, email, password);
            alert("Registrasi berhasil! Silakan login.");
            setSignState("Sign In");
            setEmail(email);
            setPassword(password);
          }
        } catch (error) {
          console.error(error);
          alert(`${signState} gagal: ${error.message}`);
        }
    };     

    return (
        <div className='login'>
            <img src={logo} className='login-logo' alt='' />
            <div className="login-form">
                <h1>{signState}</h1>
                <form>
                    {signState==="Sign Up"? 
                    <input value={name} onChange={(e)=>{setName(e.target.value)}} type="text" placeholder="Your Name" />:<></>}
                    <input value={email} onChange={(e)=>{setEmail(e.target.value)}} type="email" placeholder="Your Email" />
                    <input value={password} onChange={(e)=>{setPassword(e.target.value)}} type="password" placeholder="Password" />
                    <button onClick={user_auth} type="submit">{signState}</button>
                    <div className="remember">
                        <input type="checkbox" />
                        <label htmlFor="">Remember Me</label>
                    </div>
                </form>
                <div className="form-switch">
                    {signState==="Sign In"? 
                    <p>Don't have an account? <span onClick={()=>{setSignState("Sign Up")}}>Sign Up</span></p>:
                    <p>Already have an account? <span onClick={()=>{setSignState("Sign In")}}>Sign In</span></p>}
                </div>
            </div>
        </div>
    )
}
export default Login;