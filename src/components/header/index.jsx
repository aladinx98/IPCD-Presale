import React from 'react'
import Logo from '../../images/logo.webp'
import './style.css'
import { Web3Button } from '@web3modal/react'

function Header() {
  

  return (
    <div className="header">
      <a href="https://ipcd.in/" target="_blank"><img src={Logo} alt="logo" /></a>
      <div>
      <Web3Button />
      </div>
    </div>
  );
};

export default Header;
