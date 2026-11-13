import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import StallList from "./pages/StallList";
import StallDetail from "./pages/StallDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateStall from "./pages/CreateStall";
import EditStall from "./pages/EditStall";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<StallList />} />
        <Route path="/stalls/:id" element={<StallDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/stalls/create" element={<CreateStall />} />
        <Route path="/stalls/:id/edit" element={<EditStall />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
