import React from 'react'
import './ReferandEarn.css'
import { FiCopy } from 'react-icons/fi'

const ReferandEarn = () => {


    const copyToClipboard = () => {
        navigator.clipboard.writeText("abscx123");
        alert("Code copied to clipboard!");
      };

  return (
    <div className='refer-box'>

    <h1 className="heading">Refer & Earn Points</h1>
    <p className="description">
    Refer Qk wash to your 
    <br className="responsive-break" />
    friends and get rewards
  </p>
    
    <div className="code-container">
      <p className="code">Copy your code: <span className="code-value">abscx123</span></p>
      <button className="copy-button" onClick={copyToClipboard}>
      <button className="copy-button" onClick={copyToClipboard}>
      <FiCopy size={20} />
    </button>
      </button>
      <div className="image-container">
       <img src="https://i0.wp.com/zapmoney.in/wp-content/uploads/2023/01/Group-783.png?fit=640%2C632&ssl=1" alt="Refer & Earn" className="right-image" />
     </div>
    </div>
  
    </div>
    
  
  )
}

export default ReferandEarn
