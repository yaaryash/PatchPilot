import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Dashboard from "./pages/Dashboard";
import NewRepair from "./pages/NewRepair";
import Repositories from "./pages/Repositories";
import History from "./pages/History";
import RepairDetails from "./pages/RepairDetails";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import ApiTest from "./pages/ApiTest";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="/api-test" element={<ApiTest />} />
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="repair" element={<NewRepair />} />
          <Route path="repositories" element={<Repositories />} />
          <Route path="history" element={<History />} />
          <Route path="repairs/:repairId" element={<RepairDetails />} />

          <Route
            path="*"
            element={
              <main className="not-found">
                <h1>404</h1>
                <p>Page not found.</p>
              </main>
            }
          />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
