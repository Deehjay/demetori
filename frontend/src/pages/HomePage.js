import React from "react";

const HomePage = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-base-100 overflow-hidden">
      <div className="flex-grow flex justify-center items-center">
        <img
          className="rounded max-w-xl max-h-[80vh] object-contain"
          src="https://i.imgur.com/iQ4zsiG.png"
          alt="Demetori Logo"
        />
      </div>
    </div>
  );
};

export default HomePage;
