import React from "react";
import ReactDOM from "react-dom/client"; // React 18+
import WorkoutTracker from "./App"; // Make sure App.js exports WorkoutTracker

const container = document.getElementById("root");

if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <WorkoutTracker />
    </React.StrictMode>
  );
} else {
  console.error("Root container not found.");
}
