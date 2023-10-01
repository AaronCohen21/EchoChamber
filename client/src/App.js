import { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [title, setTitle] = useState('Loading...');

  useEffect(() => {
    fetch('/test')
      .then(res => res.json())
      .then(payload => setTitle(payload.data));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          {title}
        </a>
      </header>
    </div>
  );
}

export default App;
