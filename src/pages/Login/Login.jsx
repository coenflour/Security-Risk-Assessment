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

    // Improved email validation
    const isValidEmail = (email) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email) && email.endsWith("@gmail.com");
    };

    const isRegisteredUser = (email, password) => registeredUsers[email] === password;
    
    const userAuth = async (event) => {
        event.preventDefault();

        // Reset any previous toast notifications
        toast.dismiss();

        // Common validation
        if (!email || !password) {
            return toast.error("Email and password must be filled in!");
        }

        if (!email) {
            return toast.error("Email is required!");
        }

        if (!isValidEmail(email)) {
            return toast.error("Please enter a valid Gmail address!");
        }

        if (signState === "Sign In") {
            if (!isRegisteredUser(email, password)) {
                return toast.error("Incorrect email or password, or the account is not registered!");
            }

            try {
                await login(email, password);
                localStorage.setItem("userEmail", email);
                localStorage.setItem("userName", name); // Simpan nama pengguna
                toast.success("Login successful!");
                setTimeout(() => {
                    if (localStorage.getItem("userEmail")) {
                        navigate("/home");
                    }
                }, 1500);
            } catch (error) {
                console.error(error);
                toast.error(`Login failed: ${error.message}`);
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
                setEmail(email);
                setPassword(password);  
            } catch (error) {
                console.error(error);
                toast.error(`Registration failed: ${error.message}`);
            }
        }
    };

    return (
        <div className="login">
            <div className="login-form">
                <img src={logo} className="login-logo" alt="Logo" />
                <form onSubmit={userAuth} noValidate> {/* Added noValidate to prevent browser validation */}
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

            {/* ToastContainer component to show the notifications */}
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
