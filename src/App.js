import Home from "./home/Home";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./auth/Login";
import Register from "./auth/Register";
import Callback from "./callback/Callback";
import Review from "./review/Review";

function App() {
  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/home" element={<Home />} />
        <Route path="/review" element={<Review />} />
        <Route path="/register" element={<Register />} />
        <Route path="/callback" element={<Callback />} />
      </Routes>
    </Router>
  );
}
    
export default App;
