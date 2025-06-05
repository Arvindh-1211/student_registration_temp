import './App.css';

import Header from './Components/Header';

import { NavLink, Outlet } from "react-router-dom";
import Pagination from './Components/Pagination';

function App() {
	return (
		<div className='app'>
			<div>
				<Header />
				<Outlet />
				<Pagination />
			</div>
		</div>
	);
}

export default App;
