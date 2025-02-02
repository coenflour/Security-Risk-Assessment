import React, { useState } from "react";
import "./Login.css";
import logo from "../../assets/logo.png";
import { login, signup } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';  
import 'react-toastify/dist/ReactToastify.css'; 


const Login = () => {
    const [signState, setSignState] = useState("Sign In");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [registeredUsers, setRegisteredUsers] = useState({});
    const navigate = useNavigate();

    const isValidEmail = (email) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email) && email.endsWith("@gmail.com");
    };

    const isRegisteredUser = async (email) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, "dummy");
            return !!userCredential.user;
        } catch (error) {
            return false;
        }
    };    
    
    const userAuth = async (event) => {
        event.preventDefault();
        toast.dismiss();
    
        if (!email || !password) {
            return toast.error("Email and password must be filled in!");
        }
    
        if (!isValidEmail(email)) {
            return toast.error("Please enter a valid Gmail address!");
        }
    
        if (signState === "Sign In") {
            try {
                const user = await login(email, password);
                localStorage.setItem("userEmail", email);
                localStorage.setItem("userName", user.name); 
                toast.success("Login successful!");
                setTimeout(() => navigate("/home"), 1500);
            } catch (error) {
                console.error(error);
                toast.error(error.message);  
            }            
        } else {
            if (!name) {
                return toast.error("Name must be filled in!");
            }
    
            if (password.length < 8) {
                return toast.error("Password should be at least 8 characters!");
            }
    
            try {
                await signup(name, email, password);
                setRegisteredUsers((prev) => ({ ...prev, [email]: password }));
                toast.success("Registration successful! Please log in.");
                setSignState("Sign In");
            } catch (error) {
                console.error(error);
                return toast.error(`Registration failed: ${error.message}`);
            }
        }
    };
    

    return (
        <div className="login">
            <div className="login-form">
                <img src={logo} className="login-logo" alt="Logo" />
                <form onSubmit={userAuth} noValidate>
                    {signState === "Sign Up" && (
                        <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Enter Name" />
                    )}
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter Email" />
                    <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
                    <button type="submit">
                        {signState}
                    </button>
                </form>

                <div className="form-switch">
                    {signState === "Sign In" ? (
                        <p>Don't have an account? <span onClick={() => setSignState("Sign Up")}>Sign Up</span></p>
                    ) : (
                        <p>Already have an account? <span onClick={() => setSignState("Sign In")}>Sign In</span></p>
                    )}
                </div>
            </div>

            <ToastContainer 
                position="top-right" 
                autoClose={3000} 
                hideProgressBar={true} 
                closeButton={true} 
                newestOnTop={false} 
                rtl={false} 
                pauseOnFocusLoss={false} 
                draggable 
                pauseOnHover={false} 
            />
        </div>
    );
};

export default Login;
