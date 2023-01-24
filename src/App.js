
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './views/home';
import Login from './views/login';
import NavBar from './components/NavBar';

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

function App() {
	return (
		<ThemeProvider theme={theme}>
			<NavBar />
			<Router>
				<Routes>
					<Route exact path="/" element={<Home />}/>
					<Route path="/login" element={<Login />}/>
				</Routes>
			</Router>
		</ThemeProvider>
	);
}

export default App;
