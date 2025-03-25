import './App.css';
import { Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Display from './pages/Display';
import Report from './pages/Report';
import Layout from './components/Layout';

function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/display" element={<Display />} />
          <Route path="/report" element={<Report />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
