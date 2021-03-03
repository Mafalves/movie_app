import React from "react";
import Search from './components/Search/Search';
import './App.css';

const App = () => {
  return (
    <div >
      <div className="app-header">
        <h1 className="app-title">React Movies App</h1>
      </div>
      <Search />
    </div>
  );
}

export default App;
