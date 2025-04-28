import React from "react";
import { Outlet } from "react-router-dom";
import './style.css';
import Footer from "../../homepageComponents/footer";
import Navbar from "../../homepageComponents/navbar";


export default function HomeLayout() {


    return (
        <>
            <Navbar />
            <Outlet />
            <Footer />
        </>
    )
}