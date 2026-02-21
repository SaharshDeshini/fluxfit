import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/OnboardingFlow";
import WorkoutSession from "./pages/WorkoutSession";
import DietDashboard from "./pages/DietDashboard";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup"; 
import Well from "./pages/Well";
import DailyCheckin from "./pages/DailyCheckin";
import Community from "./pages/Community";

export const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/onboarding", element: <Onboarding /> },
  { path: "/workout", element: <WorkoutSession /> },
  { path: "/diet", element: <DietDashboard /> },
  { path: "/profile", element: <Profile /> },
  { path: "/signup", element: <Signup /> },
  { path: "/Well", element: <Well /> },
  { path: "/daily-checkin", element: <DailyCheckin /> },
  { path: "/Community", element: <Community /> },
]);