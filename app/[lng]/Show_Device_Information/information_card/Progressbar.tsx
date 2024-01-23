"use client";
import ProgressBar from "@ramonak/react-progress-bar";
import React from "react";

const Progressbar = ({ completed }: { completed: number }) => {
  return (
    <div>
      {" "}
      <ProgressBar
        isLabelVisible={false}
        bgColor="#0D47A1"
        completed={completed}
      />
    </div>
  );
};

export default Progressbar;
