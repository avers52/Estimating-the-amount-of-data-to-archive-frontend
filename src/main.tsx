import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { registerSW } from 'virtual:pwa-register';
import { store } from './store';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

// Регистрация Service Worker для офлайн-работы и установки PWA
registerSW({ immediate: true });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);