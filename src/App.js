import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Display from './pages/Display';
import Report from './pages/Report';

function App() {

  const [greeting, setGreeting] = useState("");
  const [dbGreeting, setDbGreeting] = useState("");

  useEffect(() => {
    fetch('/api/hello_world')
      .then(response => response.json())
      .then(data => setGreeting(data.content));
  }, []);
  
  useEffect(() => {
    fetch('/api/db_hello_world')
      .then(response => response.json())
      .then(data => setDbGreeting(data.content));
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="/display" element={<Display />} />
          <Route path="/report" element={<Report />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
