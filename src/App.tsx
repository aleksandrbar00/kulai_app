import { Provider } from "@/components/ui/provider";
import { ContentLayout } from "./components/layout/ContentLayout";
import { BrowserRouter, Route, Routes } from "react-router";
import { MainPage } from "./pages/MainPage";
import { QuestionsBankPage } from "./pages/QuestionsBankPage";
import { LessonManagerPage } from "./pages/LessonManagerPage";
import { HistoryPage } from "./pages/HistoryPage";
import { LessonProccessPage } from "./pages/LessonProccessPage";
import { LessonDetailsPage } from "./pages/LessonDetailsPage";
import { LessonContinueModal } from "./components/lesson/LessonContinueModal";
import { LoginPage, RegisterPage } from "./pages/AuthPages";
import { ProfilePage } from "./pages/ProfilePage";
import { AuthGuard } from "./components/auth/AuthGuard";
import { useEffect } from "react";
import { loadInitialState } from "./components/auth/authStore";

export const App = () => {
  useEffect(() => {
    loadInitialState();
  }, []);

  return (
    <Provider>
      <BrowserRouter>
        <ContentLayout>
          <LessonContinueModal />
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected routes */}
            <Route
              path="/"
              element={
                <AuthGuard>
                  <MainPage />
                </AuthGuard>
              }
            />
            <Route
              path="/profile"
              element={
                <AuthGuard>
                  <ProfilePage />
                </AuthGuard>
              }
            />
            <Route
              path="/question-bank"
              element={
                <AuthGuard>
                  <QuestionsBankPage />
                </AuthGuard>
              }
            />
            <Route
              path="/lesson"
              element={
                <AuthGuard>
                  <LessonManagerPage />
                </AuthGuard>
              }
            />
            <Route
              path="/lesson-process"
              element={
                <AuthGuard>
                  <LessonProccessPage />
                </AuthGuard>
              }
            />
            <Route
              path="/lesson-process/:lessonId"
              element={
                <AuthGuard>
                  <LessonProccessPage />
                </AuthGuard>
              }
            />
            <Route
              path="/lesson-details/:lessonId"
              element={
                <AuthGuard>
                  <LessonDetailsPage />
                </AuthGuard>
              }
            />
            <Route
              path="/history"
              element={
                <AuthGuard>
                  <HistoryPage />
                </AuthGuard>
              }
            />
          </Routes>
        </ContentLayout>
      </BrowserRouter>
    </Provider>
  );
};
