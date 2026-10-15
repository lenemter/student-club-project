import { createBrowserRouter, Navigate, Outlet, RouterProvider } from "react-router-dom";
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
import { useStore } from "./providers/StoreContext";
import { LoadingState } from "../shared/ui";

function ProtectedRoute() {
    const { currentUser, isLoading } = useStore();

    if (isLoading) {
        return (
            <main className="bg-background min-h-screen px-4 py-8 flex flex-col items-center justify-center">
                <LoadingState message="Проверка авторизации..." />
            </main>
        );
    }

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

function PublicOnlyRoute() {
    const { currentUser, isLoading } = useStore();

    if (isLoading) {
        return (
            <main className="bg-background min-h-screen px-4 py-8 flex flex-col items-center justify-center">
                <LoadingState message="Загрузка..." />
            </main>
        );
    }

    if (currentUser) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

const router = createBrowserRouter([
    {
        element: <ProtectedRoute />,
        children: [
            { path: "/", element: <HomePage /> },
            { path: "/settings", element: <SettingsPage /> },
            { path: "/profile/:id", element: <ProfilePage /> },
            { path: "/club/:id", element: <ClubPage /> },
        ],
    },
    {
        element: <PublicOnlyRoute />,
        children: [
            { path: "/login", element: <LoginPage /> },
            { path: "/signup", element: <SignUpPage /> },
        ],
    },
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

