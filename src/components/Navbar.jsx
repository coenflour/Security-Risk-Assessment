import React from 'react';
import './Navbar.css';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className='navbar'>
        <div className='navbar-left'>
            <img src={logo} alt='' />
            <ul>
                <li><Link to="/home">Overview</Link></li>
                <li><Link to="/assesment">Assesment Form</Link></li>
                <li><Link to="/AIDec">AI Detector</Link></li>
                <li><Link to="/result">Result Form</Link></li>
                <li><Link to="/about-us">About Us</Link></li>
            </ul>
        </div>
    </div>
  );
}

export default Navbar;
