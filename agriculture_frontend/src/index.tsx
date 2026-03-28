// src/index.tsx
import { createRoot } from 'react-dom/client'; // Import from /client
import { App } from './App';

const container = document.getElementById('root');
const root = createRoot(container!); // Create root first
root.render(<App />);