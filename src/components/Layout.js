import { Outlet, NavLink } from 'react-router-dom';

const Layout = () => {
    return (
        <div>
            <h1>Mood Tracker</h1>
            <nav>
                <ul>
                    <li>
                        <NavLink to="/">Home</NavLink>
                    </li>
                    <li>
                        <NavLink to="/display">Display Logs</NavLink>
                    </li>
                    <li>
                        <NavLink to="/display-mood">Display Moods</NavLink>
                    </li>
                    <li>
                        <NavLink to="/report">Generate Report</NavLink>
                    </li>
                </ul>
            </nav>
            <Outlet />
        </div>
    );
};

export default Layout;