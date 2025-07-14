import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './components/Register';
import Login from './components/Login';
import About from './pages/About';
import Navbar from './components/Navbar';
import Profile from './components/Profile';

function App() {
  return (
    <>
      <Navbar />
      <div className="pt-16"> {/* Adjust padding to avoid overlap with fixed navbar */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </>
  );
}

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         {/* <Route path="/register" element={<Register />} /> */}
//       </Routes>
//     </Router>
//   );
// }

export default App;
