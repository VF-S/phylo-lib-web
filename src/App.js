import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const factorial = (n) => {
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  const [num, setNum] = useState(0);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Learn React and save to reload.
        </p>
        <p>Factorial: {num}</p>
        <div>
          <input type="number" name="Factorial" onChange={(e) => setNum(factorial(e.target.value))}/>
        </div>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
