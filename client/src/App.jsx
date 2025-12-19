import React from 'react';
import Scacchiera from './components/scacchiera/scacchiera';
import './App.scss'; // ← Anche App dovrebbe avere il suo SCSS
import "./App.scss";

// Componente principale App
function App() {
  // Renderizzo il componente Scacchiera all'interno di un contentitore
  return (
    <div className="app-container">
      <h1>La mia App di Scacchi</h1>
      <Scacchiera />
    </div>
  );
}

export default App;
