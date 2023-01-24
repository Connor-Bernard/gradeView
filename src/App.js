import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './css/app.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './views/home';
import Login from './views/login';
import Buckets from './views/buckets';

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
							<Route exact path="/" element={<Home />} />
							<Route path="/login" element={<Login />} />
							<Route path='/buckets' element={<Buckets />} />
						</Routes>
					</Router>
				</div>
			</div>
		</ThemeProvider>
	);
}
