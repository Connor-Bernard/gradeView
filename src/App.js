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
import LogOut from './views/logout';
import jwtDecode from 'jwt-decode';

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

function LoginRoute(props){
	if(props.token !== null){
		try{
			jwtDecode(props.token);
			return (<LogOut />);
		} catch (InvalidTokenError) {
			return(<Login />)
		}
	} else {
		return(<Login />)
	}
}

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
							<Route path="/login" element={<LoginRoute token={localStorage.getItem('token')}/>} />
							<Route path='/buckets' element={<Buckets />} />
						</Routes>
					</Router>
				</div>
			</div>
		</ThemeProvider>
	);
}
