import React from 'react';
import './index.css';
import { render } from 'react-dom';
import { App } from './App';
import { ThemeProvider } from './contexts/ThemeContext';
render(<ThemeProvider>
    <App />
  </ThemeProvider>, document.getElementById('root'));