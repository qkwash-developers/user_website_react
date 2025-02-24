import React, { useEffect, useState } from 'react'
import SideMenu from '../components/SideMenu'
import './Home.css'
import Header from '../components/Header';
import { FiCopy } from "react-icons/fi";
import RunningJob from '../components/RunningJob(Home)';
import ReferandEarn from '../components/ReferandEarn';


const Home = () => {




  return (
    <div>
      <SideMenu />
      <Header />
      <RunningJob />
      <ReferandEarn/>
    </div>
  )
}

export default Home
