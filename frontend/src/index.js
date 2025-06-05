import './index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from 'react-redux';
import { PersistGate } from "redux-persist/integration/react";

import App from './App';
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from './Components/ProtectedRoute'
import routes from './routes/routes';
import { store, persistor } from './store/store';
import RegisterPage from './pages/RegisterPage';

const router = createBrowserRouter([
	{
		path: "/login",
		element: <LoginPage />
	},
	// {
	// 	path: "/register",
	// 	element: <ProtectedRoute users={["admin"]}> <RegisterPage /> </ProtectedRoute>
	// },
	{
		path: "/",
		element: <ProtectedRoute> <App /> </ProtectedRoute>,
		children: routes
	},
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<Provider store={store}>
			<PersistGate persistor={persistor}>
				<RouterProvider router={router} >
					<App />
				</RouterProvider>
			</PersistGate>
		</Provider>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
