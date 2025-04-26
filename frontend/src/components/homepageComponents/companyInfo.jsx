import React from "react";
import firstImg from "../../static/images/first-img.jpeg";
import secondImg from "../../static/images/second-img.jpeg";


function CompanyInfoSectionLandingPage() {
  return (
    <>
      <section
        id="trusted"
        class="company-info-section d-flex align-items-center "
      >
        <div class="company-info-box px-primary d-flex align-items-center">
          <div class="info-side">
            <div class="info-side-box d-flex">
              <h2 class="company-info-main-text">
                Empowering your financial future
              </h2>
              <p class="info-text">
                Managing your money shouldn’t be complicated. Our powerful
                finance tracking platform helps you track your income, expenses,
                savings, and investments—all in one place.{" "}
              </p>
              <div class="btns-box d-flex">
                <button class="login-btn get-started">Get Started</button>
                <button class="login-btn">Learn More</button>
              </div>
            </div>
          </div>

          <div class="pictures-side d-flex">
            <div class="first-pic-box">
              <img src={firstImg} alt="" />
            </div>
            <div class="second-pic-box d-flex">
              <div class="info-box">
                <p class="info-text">Lorem ipsum dolor sit amet consectetur </p>
              </div>

              <div className="second-picture-box">
                <img src={secondImg} alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default CompanyInfoSectionLandingPage;
