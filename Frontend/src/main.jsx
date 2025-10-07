import React from 'react';

import ReactDOM from 'react-dom/client';

import App from './App.jsx';

import './index.css';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import LoginPage from './pages/LoginPage.jsx';

import SignupPage from './pages/SignupPage.jsx';

import ProtectedRoute from './components/ProtectedRoute.jsx';

import ProfilePage from './pages/ProfilePage.jsx';

import LandingPage from './pages/LandingPage.jsx';

import RootLayout from './RootLayout.jsx';

import SettingsPage from './pages/SettingsPage.jsx';

import { ThemeProvider } from './context/ThemeContext';

import VerifyEmailPage from './pages/VerifyEmailPage.jsx';

import VerificationPage from './pages/VerificationPage.jsx';



// Define the routes

const router = createBrowserRouter([

  {

    path: '/',

    element: <RootLayout />,

    children: [

      { index: true, element: <LandingPage /> },

      {

        path: "settings", // Add the new route for settings

        element: (

          <ProtectedRoute>

            <SettingsPage />

          </ProtectedRoute>

        ),

      },

      {

        path: "/please-verify", // Add this new route

        element: <VerifyEmailPage />,

      },

      {

        path: "/verify/:token", // Add this new route with a token parameter

        element: <VerificationPage />,

      },

      {

        path: "chat",

        element: (

          <ProtectedRoute>

            <App />

          </ProtectedRoute>

        ),

      },

      {

        path: "login",

        element: <LoginPage />,

      },

      {

        path: "signup",

        element: <SignupPage />,

      },

      {

        path: "profile",

        element: (

          <ProtectedRoute>

            <ProfilePage />

          </ProtectedRoute>

        ),

      },

    ],

  },

]);



ReactDOM.createRoot(document.getElementById('root')).render(

  <React.StrictMode>

    {/* 2. Wrap your app with the ThemeProvider */}

    <ThemeProvider>

      <RouterProvider router={router} />

    </ThemeProvider>

  </React.StrictMode>,

);