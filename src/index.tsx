import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Asegúrate de importar BrowserRouter
import App from './App'; // Asumiendo que tu componente principal es App

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <BrowserRouter> 
    <App />
  </BrowserRouter>
);
