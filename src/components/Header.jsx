import React from 'react'
import './Header.css'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <div className="responsive-box">
    <div className="box-content">
      <div className="text-section slide-up">
        <h1 className="main-text">QK Wash</h1>
        <p className="sub-text slide-up">scan.pay.wash.move</p>
      </div>
   
      <div className="qr-section">
      <Link to="/qrcode-scanner" >
        <div className="qr-placeholder">
       
        <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 64 64" 
        className="qr-icon"
      >
        <rect x="10" y="10" width="44" height="44" fill="white" rx="4" ry="4" />
        <path 
          d="M14 14h8v2h-6v6h-2v-8zm28 0h8v8h-2v-6h-6v-2zm8 28h-8v-2h6v-6h2v8zm-36 0h8v8h-8v-8zm10-18h4v4h-4v-4zm6 0h4v4h-4v-4zm-6 6h4v4h-4v-4zm6 6h4v4h-4v-4z" 
          fill="black"
        />
      </svg>  
     
        </div>
        </Link>
      </div>
  
    </div>
  </div>
  )
}

export default Header
