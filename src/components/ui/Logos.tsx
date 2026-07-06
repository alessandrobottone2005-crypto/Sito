import React from "react";

export function LogosGroup() {
  return (
    <div
      className="flex items-center"
      style={{
        filter: "drop-shadow(0px 0px 12px rgba(255,215,0,0.6))",
        transition: "filter 0.3s ease",
      }}
      onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.filter = "drop-shadow(0px 0px 20px rgba(255,215,0,0.9))")}
      onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.filter = "drop-shadow(0px 0px 12px rgba(255,215,0,0.6))")}
    >
      <img 
        src="/logos-navbar_molecule.png" 
        alt="Batman & Sideshow Logos" 
        style={{ height: "66px", width: "auto" }} 
      />
    </div>
  );
}
