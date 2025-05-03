import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import { AuthProvider } from './context/AuthContext.tsx'; // Importer AuthProvider

import App from './App.tsx';
import reportWebVitals from './reportWebVitals';

// TypeScript krever at vi spesifiserer elementet som root
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement // Sørger for at TypeScript forstår at dette er et HTML-element
);

root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);

// Hvis du vil starte å måle ytelsen i appen, kan du sende en funksjon
// for å logge resultater (for eksempel: reportWebVitals(console.log))
// eller sende til et analyse-endepunkt. Lær mer: https://bit.ly/CRA-vitals
reportWebVitals();
