import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

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
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{greeting}</p>
        <p>{dbGreeting}</p>
      </header>
    </div>
  );
}

export default App;
