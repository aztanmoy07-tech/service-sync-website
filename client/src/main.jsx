import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

// ⚠️ REPLACE THIS WITH YOUR REAL ID FROM GOOGLE CLOUD CONSOLE
// If you don't have it yet, the app will still load, but Login won't work.
const GOOGLE_CLIENT_ID = "694918275866-bebala0gd44s4g2gsf6fvt7phpah9ste.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* This wrapper enables Google Login across the app */}
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
);
