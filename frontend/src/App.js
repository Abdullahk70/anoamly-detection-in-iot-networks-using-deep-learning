import { Route,Routes } from "react-router-dom";
import HomeScreen from "./components/HomeScreen";
import { useState } from "react";
function App() {

  return (
    <Routes>
      <Route path="/" element={<HomeScreen screen={"Home"}/>}/>
      <Route path="/upload" element={<HomeScreen screen={"upload"}/>}/>
      <Route path="/normalization" element={<HomeScreen screen={"normalization"}/>}/>
      <Route path="/feature-selection" element={<HomeScreen screen={"feature-selection"}/>}/>
      <Route path="/encoding" element={<HomeScreen screen={"encoding"}/>}/>
      <Route path="/outlier-detection" element={<HomeScreen screen={"outlier-detection"}/>}/>
      <Route path="/visualization" element={<HomeScreen screen={"visualization"}/>}/>
      <Route path="/data-splitting" element={<HomeScreen screen={"data-splitting"}/>}/>
      <Route path="/export-data" element={<HomeScreen screen={"export-data"}/>}/>
      <Route path="/csv-display" element={<HomeScreen screen={"csv"}/>}/>
      <Route path="/faq" element={<HomeScreen screen={"faq"}/>}/>

    </Routes>
  );
}

export default App;
