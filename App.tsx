import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { HistoryPage } from "./pages/HistoryPage";
import { HomePage } from "./pages/HomePage";
import { QuestionPage } from "./pages/QuestionPage";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/questions" element={<QuestionPage />} />
        <Route path="/history/:id" element={<HistoryPage />} />
      </Routes>
    </BrowserRouter>
  );
}
