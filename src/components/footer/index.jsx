import React from "react";
import "./style.css";

function Footer() {
  return (
    <div className="footer">
      <div className="footer-images">
        <div
          className="footer-block"
          onClick={() => {
            window.open("https://www.google.com", "_");
          }}
        >
         
        </div>
      </div>
      {/* <p className="rights text-yellow-600 ">All Rights Reserved By Horixon.io</p> */}
    </div>
  );
};

export default Footer;
