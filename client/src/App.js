import { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [title, setTitle] = useState('Error: Cannot Connect To Backend');

  useEffect(() => {
    fetch('/api/v1/status')
      .then(res => res.json())
      .then(payload => {
        if (payload.status === 'alive') {
          setTitle('Backend Connected Successfully!');
        }
      });
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
