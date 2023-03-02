import { Route, Routes } from "@solidjs/router";
import { lazy } from "solid-js";

import HomeScreen from "../screens/Home";

const SettingsScreen = lazy(() => import("../screens/Settings"));

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" component={HomeScreen} />
      <Route path="/settings" component={SettingsScreen} />
    </Routes>
  )
}

export default AppRoutes;
