import { Navigate, Route, Routes } from "react-router-dom"

import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import CheckEmailPage from "@/pages/auth/CheckEmailPage"
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage"
import LoginPage from "@/pages/auth/LoginPage"
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage"
import CategoriesPage from "@/pages/categories/CategoriesPage"
import DashboardPage from "@/pages/dashboard/DashboardPage"
import MediaLibraryPage from "@/pages/media/MediaLibraryPage"
import NewPostPage from "@/pages/posts/NewPostPage"
import PostsPage from "@/pages/posts/PostsPage"
import ProfilePage from "@/pages/profile/ProfilePage"
import GeneralSettingsPage from "@/pages/settings/GeneralSettingsPage"
import SeoSettingsPage from "@/pages/settings/SeoSettingsPage"
import TagsPage from "@/pages/tags/TagsPage"
import UsersPage from "@/pages/users/UsersPage"

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route
        path="/forgot-password/check-email"
        element={<CheckEmailPage />}
      />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/posts" element={<PostsPage />} />
        <Route path="/posts/new" element={<NewPostPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/tags" element={<TagsPage />} />
        <Route path="/media-library" element={<MediaLibraryPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/seo-settings" element={<SeoSettingsPage />} />
        <Route path="/general-settings" element={<GeneralSettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
