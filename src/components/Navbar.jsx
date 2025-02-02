import React from 'react';
import './Navbar.css';
import logo from '../assets/logo.png';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className='navbar'>
        <div className='navbar-left'>
            {/* Membungkus logo dengan Link */}
            <NavLink to="/about-us">
                <img src={logo} alt='Logo' />
            </NavLink>
            <ul>
                <li><NavLink to="/home" activeClassName="active">Overview</NavLink></li>
                <li><NavLink to="/assesment" activeClassName="active">Assesment Form</NavLink></li>
                <li><NavLink to="/AIDec" activeClassName="active">AI Detector</NavLink></li>
                <li><NavLink to="/Mine" activeClassName="active">My Form</NavLink></li>
                <li><NavLink to="/Department" activeClassName="active">Department Form</NavLink></li>
                <li><NavLink to="/about-us" activeClassName="active">About Us</NavLink></li>
            </ul>
        </div>
    </div>
  );
}

export default Navbar;
