import React from "react";
import { Route, Routes } from "react-router-dom";
import HomeLayout from "./layouts/homeLayout/layout";
import LoginPage from "./pages/login/login";
import RegisterPage from "./pages/register/register";
import ProtectedRoute from "./utils/protectedRoute";
import DashboardLayout from "./layouts/dashboardLayout/layout";
import DashboardHomepage from "./pages/dashboardPages/dashboardHomepage/dashboardHomepage";
import ExpensesPage from "./pages/dashboardPages/expensesPage/expensesPage";
import BankConnectionPage from "./pages/dashboardPages/connectBankPage/connectBankPage";
import AnalyticsPage from "./pages/dashboardPages/analyticsPage/analyticsPage";
import NotificationsPage from "./pages/dashboardPages/notificationsPage/notificationsPage";
import FeaturesPage from "./pages/featuresPage/featuresPage";
import HomePage from "./pages/homepage/homepage";
import HowToUsePage from "./pages/howToUsePage/howToUse";
import NotFoundPage from "./pages/notFound/notFound";

export default function Router() {
    return (
        <>
            <Routes>
                <Route path="/" element={<HomeLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="register" element={<RegisterPage />} />
                    <Route path="features" element={<FeaturesPage />} />
                    <Route path="how-to-use" element={<HowToUsePage />} />
                <Route path="*" element={<NotFoundPage />} />
                </Route>

                <Route element={<ProtectedRoute />}>
                    <Route path="dashboard" element={<DashboardLayout />}>
                        <Route index element={<DashboardHomepage />} />
                        <Route path="expenses" element={<ExpensesPage />} />
                        <Route path="banks" element={<BankConnectionPage />} />
                        <Route path="analytics" element={<AnalyticsPage />} />
                        <Route path="notifications" element={<NotificationsPage />} />
                    </Route>
                </Route>

                
            </Routes>
        </>
    );
}