import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './css/app.css';
import { Route, BrowserRouter as Router, Routes, Navigate } from 'react-router-dom';
import PrivateRoutes from './components/privateRoutes';
import NavBar from './components/NavBar';
import Home from './views/home';
import Login from './views/login';
import Buckets from './views/buckets';
import NotFound from './views/notFound';

const theme = createTheme({
	palette: {
		primary: {
			main:"#7253ed"
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
					<Router>
						<Routes>
							<Route exact path='/login' element={localStorage.getItem('token') ? <Navigate to='/' /> : <Login />} />
							<Route exact path='/buckets' element={<Buckets />} />
							<Route element={<PrivateRoutes />}>
								<Route exact path='/' element={<Home />} />
							</Route>
							<Route exact path='*' element={<NotFound />}/> 
						</Routes>
					</Router>
				</div>
			</div>
		</ThemeProvider>
	);
}
