import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./style.css";
import Request from "../../utils/request"; 

const EmailIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PhoneIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4741 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77383 17.3147 6.72534 15.2662 5.19 12.85C3.49998 10.2412 2.44824 7.27099 2.12 4.18C2.09501 3.90347 2.12788 3.62476 2.2165 3.36162C2.30513 3.09849 2.44757 2.85669 2.63477 2.65162C2.82196 2.44655 3.04981 2.28271 3.30379 2.17052C3.55778 2.05834 3.83221 2.00026 4.11 2H7.11C7.59531 1.99522 8.06579 2.16708 8.43376 2.48353C8.80173 2.79998 9.04208 3.23945 9.11 3.72C9.23651 4.68007 9.47141 5.62273 9.81 6.53C9.94454 6.88792 9.97366 7.27691 9.89391 7.65088C9.81415 8.02485 9.62886 8.36811 9.36 8.64L8.09 9.91C9.51356 12.4135 11.5865 14.4864 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9752 14.1858 16.3491 14.1061C16.7231 14.0263 17.1121 14.0554 17.47 14.19C18.3773 14.5286 19.3199 14.7635 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0126 16.4296 22 16.92Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LocationIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ContactPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: ""
  });
  
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    error: false,
    message: "",
    isSubmitting: false
  });
  
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    const handleScroll = () => {
      const sections = document.querySelectorAll('.contact__animate-on-scroll');
      
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const isVisible = (rect.top <= window.innerHeight * 0.75);
        
        if (isVisible) {
          section.classList.add('contact__animate-visible');
        }
      });
    };
    
    // Initial check on load
    setTimeout(handleScroll, 100);
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.fullName || !formData.email || !formData.message) {
      setFormStatus({
        submitted: false,
        error: true,
        message: "Please fill in all required fields.",
        isSubmitting: false
      });
      return;
    }
    
    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormStatus({
        submitted: false,
        error: true,
        message: "Please enter a valid email address.",
        isSubmitting: false
      });
      return;
    }
    
    try {
      setFormStatus({
        ...formStatus,
        isSubmitting: true
      });
      
      // Send the data to the backend
      const response = await Request.post('/contact/', formData);
      
      setFormStatus({
        submitted: true,
        error: false,
        message: response.data?.message || "Thank you for your message! We'll get back to you soon.",
        isSubmitting: false
      });
      
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        message: ""
      });
      
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Contact form submission error:", error);
      
      setFormStatus({
        submitted: false,
        error: true,
        message: error.message || "An error occurred. Please try again later.",
        isSubmitting: false
      });
    }
  };
  
  return (
    <div className="contact__page">
      <div className="contact__background-decoration">
        <div className="contact__background-orb contact__orb1"></div>
        <div className="contact__background-orb contact__orb2"></div>
        <div className="contact__background-orb contact__orb3"></div>
      </div>
      
      {/* Header section */}
      <section className="contact__header-section">
        <div className="contact__container">
          <div className={`contact__header-content contact__animate-on-scroll ${isVisible ? 'contact__animate-visible' : ''}`}>
            <h1>Get in Touch</h1>
            <p className="contact__subtitle">
              Have questions or feedback? We'd love to hear from you. Fill out the form below
              and our team will get back to you as soon as possible.
            </p>
            
            {formStatus.submitted && (
              <div className="contact__success-message">
                <div className="contact__success-icon">
                  <CheckIcon />
                </div>
                <p>{formStatus.message}</p>
              </div>
            )}
            
            {formStatus.error && (
              <div className="contact__error-message">
                <p>{formStatus.message}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="contact__header-decoration">
          <div className="contact__header-glow"></div>
        </div>
      </section>
      
      {/* Contact Grid Section */}
      <section className="contact__main-section">
        <div className="contact__container">
          <div className="contact__grid">
            <div className="contact__form-container contact__animate-on-scroll">
              <div className="contact__form-card">
                <h2>Send Us a Message</h2>
                <form className="contact__form" onSubmit={handleSubmit}>
                  <div className="contact__form-group">
                    <label htmlFor="fullName">Full Name *</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      required
                      disabled={formStatus.isSubmitting}
                    />
                  </div>
                  
                  <div className="contact__form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Your email address"
                      required
                      disabled={formStatus.isSubmitting}
                    />
                  </div>
                  
                  <div className="contact__form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Your phone number (optional)"
                      disabled={formStatus.isSubmitting}
                    />
                  </div>
                  
                  <div className="contact__form-group">
                    <label htmlFor="message">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="How can we help you?"
                      rows="5"
                      required
                      disabled={formStatus.isSubmitting}
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="contact__submit-button"
                    disabled={formStatus.isSubmitting}
                  >
                    {formStatus.isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </div>
            </div>
            
            <div className="contact__info-container contact__animate-on-scroll">
              <div className="contact__info-card">
                <h2>Contact Information</h2>
                <p className="contact__info-intro">
                  Our team is available Monday through Friday from 9:00 AM to 5:00 PM.
                  We strive to respond to all inquiries within 24 hours.
                </p>
                
                <div className="contact__info-items">
                  <div className="contact__info-item">
                    <div className="contact__info-icon">
                      <EmailIcon />
                    </div>
                    <div className="contact__info-content">
                      <h3>Email Us</h3>
                      <a href="mailto:support@financetracker.com">support@financetracker.com</a>
                    </div>
                  </div>
                  
                  <div className="contact__info-item">
                    <div className="contact__info-icon">
                      <PhoneIcon />
                    </div>
                    <div className="contact__info-content">
                      <h3>Call Us</h3>
                      <a href="tel:+448001234567">+44 (800) 123-4567</a>
                    </div>
                  </div>
                  
                  <div className="contact__info-item">
                    <div className="contact__info-icon">
                      <LocationIcon />
                    </div>
                    <div className="contact__info-content">
                      <h3>Visit Us</h3>
                      <p>123 Finance Street, Suite 500<br />London, EC1A 1BB</p>
                    </div>
                  </div>
                </div>
                
                <div className="contact__social-links">
                  <h3>Follow Us</h3>
                  <div className="contact__social-icons">
                    <a href="https://twitter.com" className="contact__social-icon" aria-label="Twitter">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 4.01C21.0424 4.67548 19.9821 5.19211 18.86 5.54C18.2577 4.84751 17.4573 4.35418 16.567 4.12085C15.6767 3.88753 14.7395 3.92427 13.8821 4.22426C13.0247 4.52425 12.2884 5.0719 11.773 5.8C11.2575 6.52811 10.9877 7.40577 11 8.3V9.3C9.36831 9.35384 7.75122 8.99742 6.29165 8.2733C4.83208 7.54918 3.57791 6.47953 2.67 5.16C2.67 5.16 -0.830001 13.16 8.17 16.76C6.25975 18.0352 3.98418 18.6894 1.67 18.66C10.67 23.06 21.67 18.66 21.67 8.26C21.6674 7.98312 21.6401 7.7075 21.59 7.44C22.6147 6.44145 23.3399 5.18621 23.69 3.81L22 4.01Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                    <a href="https://facebook.com" className="contact__social-icon" aria-label="Facebook">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                    <a href="https://instagram.com" className="contact__social-icon" aria-label="Instagram">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 2H7C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16 11.37C16.1234 12.2022 15.9813 13.0522 15.5938 13.799C15.2063 14.5458 14.5931 15.1514 13.8416 15.5297C13.0901 15.9079 12.2384 16.0396 11.4078 15.9059C10.5771 15.7723 9.80976 15.3801 9.21484 14.7852C8.61991 14.1902 8.22773 13.4229 8.09406 12.5922C7.9604 11.7615 8.09206 10.9099 8.47032 10.1584C8.84858 9.40685 9.45418 8.79374 10.201 8.40624C10.9478 8.01874 11.7978 7.87659 12.63 8C13.4789 8.12588 14.2648 8.52146 14.8717 9.12831C15.4785 9.73515 15.8741 10.5211 16 11.37Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M17.5 6.5H17.51" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                    <a href="https://linkedin.com" className="contact__social-icon" aria-label="LinkedIn">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M6 9H2V21H6V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="contact__faq-card">
                <h3>Frequently Asked Questions</h3>
                <ul className="contact__faq-list">
                  <li>
                    <Link to="/how-to-use">How do I get started with Finance Tracker?</Link>
                  </li>
                  <li>
                    <Link to="/features">What features are included in the free plan?</Link>
                  </li>
                  <li>
                    <Link to="/how-to-use">Is my financial data secure?</Link>
                  </li>
                  <li>
                    <Link to="/how-to-use">How do I connect my bank accounts?</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Final CTA Section */}
      <section className="contact__cta-section contact__animate-on-scroll">
        <div className="contact__container">
          <div className="contact__cta-content">
            <h2>Ready to take control of your finances?</h2>
            <p>Join thousands of users who have transformed their financial lives</p>
            <div className="contact__cta-buttons">
              <Link to="/register" className="contact__primary-button">Get Started For Free</Link>
              <Link to="/features" className="contact__secondary-button">Explore Features</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;