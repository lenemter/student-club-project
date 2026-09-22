import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import ProfilePage from './pages/ProfilePage'
import ClubPage from './pages/ClubPage'

const router = createBrowserRouter([
    { path: "/", element: <HomePage /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/signup", element: <SignUpPage /> },
    { path: "/profile", element: <ProfilePage /> },
    { path: "/another-profile", element: <ProfilePage /> },
    { path: "/club", element: <ClubPage /> },
])

function App() {
    return <RouterProvider router={router} />
}

export default App
