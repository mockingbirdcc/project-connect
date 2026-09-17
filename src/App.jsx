import { Routes, Route } from "react-router-dom";
import { AppProvider } from "./store/AppContext";
import NavBar from "./components/NavBar";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import People from "./pages/People";
import Connections from "./pages/Connections";
import Invitations from "./pages/Invitations";

function App() {
  return (
    <AppProvider>
      <NavBar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/people" element={<People />} />
          <Route path="/connections" element={<Connections />} />
          <Route path="/invitations" element={<Invitations />} />
        </Routes>
      </main>
    </AppProvider>
  );
}

export default App;
