import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/tokens.css';
import './styles/app.css';
import { Root } from './Root';

createRoot(document.getElementById('root')!).render(<React.StrictMode><Root /></React.StrictMode>);
