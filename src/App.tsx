
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Dashboard from "./pages/Dashboard";
import NewRepair from "./pages/NewRepair";
import Repositories from "./pages/Repositories";
import History from "./pages/History";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="repair" element={<NewRepair />} />
          <Route path="repositories" element={<Repositories />} />
          <Route path="history" element={<History />} />
          <Route path="*" element={<main className="not-found"><h1>404</h1><p>Page not found.</p></main>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
