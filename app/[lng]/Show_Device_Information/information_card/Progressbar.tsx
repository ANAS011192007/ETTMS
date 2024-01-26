"use client";
import ProgressBar from "@ramonak/react-progress-bar";
import React from "react";

const Progressbar = ({ completed }: { completed: number }) => {
  return (
    <div>
      {" "}
      <ProgressBar
        isLabelVisible={false}
        bgColor="#008000"
        baseBgColor="#B2BEB5"
        completed={completed}
      />
    </div>
  );
};

export default Progressbar;
