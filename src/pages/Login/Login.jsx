import React, { useState } from "react";
import "./Login.css";
import logo from "../../assets/logo.png";
import { login, signup } from "../../firebase";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [signState, setSignState] = useState("Sign In");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [registeredUsers, setRegisteredUsers] = useState({});
    const navigate = useNavigate();

    const isValidEmail = (email) => email.endsWith("@gmail.com");
    const isRegisteredUser = (email, password) => registeredUsers[email] === password;
    
    const userAuth = async (event) => {
        event.preventDefault();

        if (signState === "Sign In") {
            if (!email || !password) {
                return alert("Email and password must be filled in!");
            }
            if (!isValidEmail(email)) {
                return alert("Email must use @gmail.com!");
            }
            if (!isRegisteredUser(email, password)) {
                return alert("Incorrect email or password, or the account is not registered!");
            }
            try {
                await login(email, password);
                localStorage.setItem("userEmail", email);
                alert("Login successful!");
                navigate("/home");
            } catch (error) {
                console.error(error);
                alert(`Login failed: ${error.message}`);

            }
        } else {
            if (!name) {
                return alert("Name must be filled in!");
            }
            if (!email) {
                return alert("Email must be filled in!");
            }
            if (!isValidEmail(email)) {
                return alert("Email must use @gmail.com!");
            }
            if (!password) {
                return alert("Password must be filled in!");
            }
            try {
                await signup(name, email, password);
                setRegisteredUsers((prev) => ({ ...prev, [email]: password }));
                alert("Registration successful! Please log in.");
                setSignState("Sign In");
                setEmail(email);
                setPassword("");
            } catch (error) {
                console.error(error);
                alert(`Registration failed: ${error.message}`);
            }
        }
    };

    return (
        <div className='login'>
            <div className="login-form">
                <img src={logo} className='login-logo' alt='Logo' />
                <form onSubmit={userAuth}>
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
        </div>
    );
}

export default Login;