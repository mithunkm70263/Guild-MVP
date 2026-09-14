import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import ApplicationForm from './components/ApplicationForm.jsx';
import GetStartedPage from './components/GetStartedPage.jsx';
import LoginPage from './components/LoginPage.jsx';
import ConnectPage from './components/ConnectPage.jsx';
import BuilderTracksPage from './components/BuilderTracksPage.jsx';
import YouTubeApplicationPage from './components/YouTubeApplicationPage.jsx';
import AIAppApplicationPage from './components/AIAppApplicationPage.jsx';
import AISaaSApplicationPage from './components/AISaaSApplicationPage.jsx';
import VibeCoderApplicationPage from './components/VibeCoderApplicationPage.jsx';
import DashboardPage from './components/DashboardPage.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/get-started" element={<GetStartedPage />} />
        <Route path="/builder" element={<BuilderTracksPage />} />
        <Route path="/builder/youtube" element={<YouTubeApplicationPage />} />
        <Route path="/builder/ai-app" element={<AIAppApplicationPage />} />
        <Route path="/builder/ai-saas" element={<AISaaSApplicationPage />} />
        <Route path="/builder/vibecoder" element={<VibeCoderApplicationPage />} />
        <Route path="/apply" element={<ApplicationForm />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/connect" element={<ConnectPage />} />
        <Route path="/dashboard/*" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
