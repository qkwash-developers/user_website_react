import React, { useEffect, useRef, useState } from "react";
import "./Reward.css";
import SideMenu from "../components/SideMenu";

const Reward = () => {
    const canvasRef = useRef(null);
  const [scratched, setScratched] = useState(false);

  const rewardImage = "https://play-lh.googleusercontent.com/BzJZA1tLHBa6wX46kz6HAQnOxS1RcSdcD6ZNE4QOgd0NIFFp4QwAvFw9xhZo1KoGWg"; 

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

  
    canvas.width = 300;
    canvas.height = 250;

    
    ctx.fillStyle = "#758EB7";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = "20px Arial";
    ctx.fillStyle = "#666";
    ctx.textAlign = "center";
    ctx.fillText("REWARD", canvas.width / 2, canvas.height / 2);
  }, []);

  const handleMouseMove = (e) => {
    if (scratched) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;


    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();

   
    const scratchedPercentage = getScratchedPercentage(ctx, canvas);
    if (scratchedPercentage > 60) {
      setScratched(true);
    }
  };

  const getScratchedPercentage = (ctx, canvas) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const totalPixels = imageData.data.length / 4;
    let clearedPixels = 0;

    for (let i = 0; i < imageData.data.length; i += 4) {
      if (imageData.data[i + 3] === 0) {
        clearedPixels++;
      }
    }

    return (clearedPixels / totalPixels) * 100;
  };

  return (
 <div>
 <SideMenu/>
    <div className="scratch-card-container">
      {scratched ? (
        <div className="reward">
      
          <img
            src={rewardImage}
            alt="Reward"
            className="reward-image"
          />
        </div>
      ) : (
        <canvas
          ref={canvasRef}
          className="scratch-area"
          onMouseMove={handleMouseMove}
        />
      )}
    </div>
    
    </div>
  );
};
export default Reward;
