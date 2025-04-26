import React, { useState } from 'react';
import Header from '../../homepageComponents/header';
import Footer from '../../homepageComponents/footer';
import BannerSection from '../../homepageComponents/banner';
import TrustedSection from '../../homepageComponents/trusted';
import CompanyInfoSectionLandingPage from '../../homepageComponents/companyInfo';
import AboutSection from '../../homepageComponents/about';

function LandingPage() {
    const [loggedUser, setLoggedUser] = useState(false);
    const [isHome, setIsHome] = useState(true);

    return (
        <>
            <BannerSection />
            <TrustedSection />
            <CompanyInfoSectionLandingPage />
            <AboutSection />
        </>
    );
}

export default LandingPage;
