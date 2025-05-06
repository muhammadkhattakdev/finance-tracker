import React from "react";
import { Outlet } from "react-router-dom";
import './style.css';
import Footer from "../../homepageComponents/footer";
import Navbar from "../../homepageComponents/navbar";
import Header from "../../homepageComponents/header";


export default function HomeLayout() {


    return (
        <>
            <Navbar />
            {/* <Header /> */}
            <Outlet />
            <Footer />
        </>
    )
}