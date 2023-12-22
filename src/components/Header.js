import React from "react";
import "./Header.css";
function Header() {
  return (
    <>
      <h1 className="header">
        <span>📝</span>
        <span
          style={{
            color: "#007bff",
          }}
        >
          To-Do-List
        </span>
        {/* <span style={{ textDecoration: "underline", color: "#007bff" }}>
          List
        </span> */}
      </h1>
    </>
  );
}

export default Header;
