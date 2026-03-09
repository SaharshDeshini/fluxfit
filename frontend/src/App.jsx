import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import LoginPage from './pages/login';
import OnboardingPage from './pages/onboarding';
import DashboardPage from './pages/dashboard';
import WorkoutSessionPage from './pages/workout-session';
import NutritionPage from './pages/nutrition';
import WellnessPage from './pages/wellness';
import DietDashboardPage from './pages/diet-dashboard';
import ProfilePage from './pages/Profile';
import CommunityPage from './pages/community';
import WorkoutHistoryPage from './pages/workout-history';

function App() {
    return (
        <Router>
            <Toaster theme="dark" position="top-center" richColors />
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/onboarding" element={<OnboardingPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/workout" element={<WorkoutSessionPage />} />
                <Route path="/nutrition" element={<NutritionPage />} />
                <Route path="/wellness" element={<WellnessPage />} />
                <Route path="/diet-dashboard" element={<DietDashboardPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/community" element={<CommunityPage />} />
                <Route path="/workout-history" element={<WorkoutHistoryPage />} />
                <Route path="/" element={<LoginPage />} />
                <Route path="*" element={<DashboardPage />} />
            </Routes>
        </Router>
    );
}

export default App;
