import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ProfilePage from "./pages/ProfilePage";
import ClubPage from "./pages/ClubPage";
import SettingsPage from "./pages/SettingsPage";
import NotFoundPage from "./pages/NotFoundPage";

const router = createBrowserRouter([
    { path: "/", element: <HomePage /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/signup", element: <SignUpPage /> },
    { path: "/settings", element: <SettingsPage /> },
    { path: "/profile/:id", element: <ProfilePage /> },
    { path: "/club/:id", element: <ClubPage /> },
    { path: "*", element: <NotFoundPage /> },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
