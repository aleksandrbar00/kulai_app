import { Provider } from "@/components/ui/provider";
import { ContentLayout } from "./components/layout/ContentLayout";
import { BrowserRouter, Route, Routes } from "react-router";
import { MainPage } from "./pages/MainPage";
import { QuestionsBankPage } from "./pages/QuestionsBankPage/QuestionsBankPage";
import { LessonManagerPage } from "./pages/LessonPage";
import { HistoryPage } from "./pages/HistoryPage";
import { LessonProccessPage } from "./pages/LessonProccessPage/LessonProccessPage";
import { LessonGuard } from "./components/LessonGuard";
import { LessonContinueModal } from "./components/LessonContinueModal";

export const App = () => {
    return <Provider>
        <BrowserRouter>
            <ContentLayout>
                <LessonContinueModal />
                <Routes >
                    <Route path="/" element={<MainPage />} />
                    <Route path="/question-bank" element={<QuestionsBankPage />} />
                    <Route path="/lesson" element={<LessonManagerPage />} />
                    <Route path="/lesson-process" element={
                        <LessonGuard>
                            <LessonProccessPage />
                        </LessonGuard>
                    } />
                    <Route path="/lesson-process/:lessonId" element={
                        <LessonGuard>
                            <LessonProccessPage />
                        </LessonGuard>
                    } />
                    <Route path="/history" element={<HistoryPage />} />
                </Routes>
            </ContentLayout>
        </BrowserRouter>
    </Provider>
}