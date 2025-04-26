import React from "react";
import { Outlet } from "react-router-dom";
import './style.css';
import Header from "../../homepageComponents/header";
import Footer from "../../homepageComponents/footer";


export default function HomeLayout() {


    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    )
}