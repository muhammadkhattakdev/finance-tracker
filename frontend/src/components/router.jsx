import React from "react";
import { Route, Routes } from "react-router-dom";
import HomeLayout from "./layouts/homeLayout/layout";
import LandingPage from "./pages/homepage/homepage";
import LoginPage from "./pages/login/login";
import RegisterPage from "./pages/register/register";
import ProtectedRoute from "./utils/protectedRoute";
import DashboardLayout from "./layouts/dashboardLayout/layout";
import DashboardHomepage from "./pages/dashboardPages/dashboardHomepage/dashboardHomepage";
import ExpensesPage from "./pages/dashboardPages/expensesPage/expensesPage";
import BankConnectionPage from "./pages/dashboardPages/connectBankPage/connectBankPage";
import AnalyticsPage from "./pages/dashboardPages/analyticsPage/analyticsPage";

export default function Router() {
    return (
        <>
            <Routes>
                <Route path="/" element={<HomeLayout />}>
                    <Route index element={<LandingPage />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="register" element={<RegisterPage />} />
                </Route>

                <Route element={<ProtectedRoute />}>
                    <Route path="dashboard" element={<DashboardLayout />}>
                        <Route index element={<DashboardHomepage />} />
                        <Route path="expenses" element={<ExpensesPage />} />
                        <Route path="banks" element={<BankConnectionPage />} />
                        <Route path="analytics" element={<AnalyticsPage />} />
                    </Route>
                </Route>
                
                <Route path="*" element={<div>Page Not Found</div>} />
            </Routes>
        </>
    );
}