import { Provider } from "@/components/ui/provider";
import { ContentLayout } from "./components/layout/ContentLayout";
import { BrowserRouter, Route, Routes } from "react-router";
import { MainPage } from "./pages/MainPage";
import { QuestionsBankPage } from "./pages/QuestionsBankPage/QuestionsBankPage";
import { LessonPage } from "./pages/LessonPage";
import { HistoryPage } from "./pages/HistoryPage";

export const App = () => {
    return <Provider>
        <BrowserRouter>
            <ContentLayout>
                <Routes >
                    <Route path="/" element={<MainPage />} />
                    <Route path="/question-bank" element={<QuestionsBankPage />} />
                    <Route path="/lesson" element={<LessonPage />} />
                    <Route path="/history" element={<HistoryPage />} />
                </Routes>
            </ContentLayout>
        </BrowserRouter>
    </Provider>
}