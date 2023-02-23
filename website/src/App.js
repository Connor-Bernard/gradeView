import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './css/app.css';
import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom';
import PrivateRoutes from './components/privateRoutes';
import NavBar from './components/NavBar';
import Home from './views/home';
import Login from './views/login';
import Buckets from './views/buckets';
import HTTPError from './views/httpError';

const theme = createTheme({
	palette: {
		primary: {
			main:"#00284e"
		},
		secondary: {
			main:"#e3a83b",
		},
	},
	typography: {
		fontFamily: [
			'Roboto'
		],
	},
});

export default function App() {
	return (
		<ThemeProvider theme={theme}>
			<div className="app">
				<div className="nav">
					<NavBar />
				</div>
				<div className="content">
					<BrowserRouter>
						<Routes>
							<Route exact path='/login' element={localStorage.getItem('token') ? <Navigate to='/' /> : <Login />} />
							<Route exact path='/buckets' element={<Buckets />} />
							<Route element={<PrivateRoutes />}>
								<Route exact path='/' element={<Home />} />
							</Route>
							<Route exact path='/serverError' element={<HTTPError errorCode={500}/>} />
							<Route exact path='/clientError' element={<HTTPError errorCode={400}/>} />
							<Route exact path='*' element={<HTTPError errorCode={404} />} />
						</Routes>
					</BrowserRouter>
				</div>
			</div>
		</ThemeProvider>
	);
}
