import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import Input from "./input";
import Request from "../utils/request";

const SignupSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  firstName: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .required('First name is required'),
  lastName: Yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .required('Last name is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const SignUp = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (values, { setSubmitting, resetForm }) => {
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      // Prepare user data - using the field names expected by the backend
      const userData = {
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        password: values.password,
        confirm_password: values.confirmPassword
      };
      
      // Call the register method from our Request utility
      await Request.register(userData);
      
      // Reset the form after successful registration
      resetForm();
      
      // Redirect to login page
      navigate('/login', { 
        state: { 
          message: 'Registration successful! Please log in with your new account.' 
        } 
      });
    } catch (error) {
      // Display error message
      setErrorMessage(error.message || 'Registration failed. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <section className="login-section d-flex align-items-center">
      <div className="login-containerr">
        <div className="login-box px-primary d-flex">
          <div className="login-header d-flex align-items-center">
            <h2 className="sign-in-text">
              Sign up to <span className="blue-text">finance tracker</span>
            </h2>
            <p className="login-info-text">
              Create an account to start managing your finances efficiently.
            </p>
          </div>
          <Formik
            initialValues={{
              email: "",
              firstName: "",
              lastName: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={SignupSchema}
            onSubmit={handleSignup}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="login-form d-flex">
                <div className="login-input-box d-flex">
                  <label htmlFor="email" className="login-input-box-label">
                    Email
                  </label>
                  <Input
                    style={{ width: "100%" }}
                    name="email"
                    type="email"
                    className="login-input"
                    placeholder="Your email address"
                    required
                  />
                  {errors.email && touched.email && (
                    <div className="error-message">{errors.email}</div>
                  )}
                </div>
                <div className="login-input-box d-flex">
                  <label htmlFor="firstName" className="login-input-box-label">
                    First Name
                  </label>
                  <Input
                    style={{ width: "100%" }}
                    name="firstName"
                    type="text"
                    className="login-input"
                    placeholder="Your first name"
                    required
                  />
                  {errors.firstName && touched.firstName && (
                    <div className="error-message">{errors.firstName}</div>
                  )}
                </div>
                <div className="login-input-box d-flex">
                  <label htmlFor="lastName" className="login-input-box-label">
                    Last Name
                  </label>
                  <Input
                    style={{ width: "100%" }}
                    name="lastName"
                    type="text"
                    className="login-input"
                    placeholder="Your last name"
                    required
                  />
                  {errors.lastName && touched.lastName && (
                    <div className="error-message">{errors.lastName}</div>
                  )}
                </div>
                <div className="login-input-box d-flex">
                  <label htmlFor="password" className="login-input-box-label">
                    Password
                  </label>
                  <Input
                    style={{ width: "100%" }}
                    name="password"
                    type="password"
                    className="login-input"
                    placeholder="Your password"
                    required
                  />
                  {errors.password && touched.password ? (
                    <div className="error-message">{errors.password}</div>
                  ) : (
                    <div className="password-requirements" style={{ fontSize: "0.8rem", color: "#555", marginTop: "4px" }}>
                      Password must contain at least 8 characters, including one uppercase letter, 
                      one lowercase letter, one number, and one special character (@$!%*?&#).
                    </div>
                  )}
                </div>
                <div className="login-input-box d-flex">
                  <label htmlFor="confirmPassword" className="login-input-box-label">
                    Confirm Password
                  </label>
                  <Input
                    style={{ width: "100%" }}
                    name="confirmPassword"
                    className="login-input"
                    placeholder="Confirm your password"
                    type="password"
                    required
                  />
                  {errors.confirmPassword && touched.confirmPassword && (
                    <div className="error-message">{errors.confirmPassword}</div>
                  )}
                </div>
                
                {errorMessage && (
                  <div className="error-alert" style={{ color: "red" }}>
                    {errorMessage}
                  </div>
                )}

                <div className="login-input-btns d-flex">
                  <button 
                    type="submit" 
                    className="btn-login" 
                    disabled={isSubmitting || isLoading}
                  >
                    {isLoading ? "Signing Up..." : "Sign Up"}
                  </button>
                  <p className="question-text">
                    Already have an account?{" "}
                    <Link to="/login" className="account-creation-btn">
                      Log In
                    </Link>
                  </p>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </section>
  );
};

export default SignUp;