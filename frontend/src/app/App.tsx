import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
    HomePage,
    LoginPage,
    SignUpPage,
    ProfilePage,
    ClubPage,
    SettingsPage,
    NotFoundPage,
} from "../pages";
import { StoreProvider } from "./providers";

const router = createBrowserRouter([
    { path: "/", element: <HomePage /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/signup", element: <SignUpPage /> },
    { path: "/settings", element: <SettingsPage /> },
    { path: "/profile/:id", element: <ProfilePage /> },
    { path: "/club/:id", element: <ClubPage /> },
    { path: "*", element: <NotFoundPage /> },
]);

export function App() {
    return (
        <StoreProvider>
            <RouterProvider router={router} />
        </StoreProvider>
    );
}

export default App;
