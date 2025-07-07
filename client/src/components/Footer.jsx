import React from 'react';

const Footer = () => {
  return (
    <footer>
      <div className="f-info">
        <div className="f-info-socials">
          <a href="https://www.facebook.com">
            <i className="fa-brands fa-square-facebook"></i>
          </a>
          <a href="https://www.instagram.com/yasssshhhhhh_/">
            <i className="fa-brands fa-square-instagram"></i>
          </a>
          <a href="https://www.linkedin.com/in/yash-phuke-606126203">
            <i className="fa-brands fa-linkedin"></i>
          </a>
        </div>
        <div className="f-info-brand">&copy; StayScape Private Limited</div>
        <div className="f-info-links">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 