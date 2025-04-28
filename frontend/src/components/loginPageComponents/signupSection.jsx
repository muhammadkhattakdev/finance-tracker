import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import Input from "./input";
import Request from "../utils/request";
import './style.css';

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
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">
            Join <span className="brand-highlight">finance tracker</span>
          </h1>
          <p className="auth-subtitle">
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
            <Form className="auth-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <Input
                  name="email"
                  type="email"
                  className="form-input"
                  placeholder="Your email address"
                  aria-label="Email"
                />
                {errors.email && touched.email && (
                  <div className="error-message">{errors.email}</div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="firstName" className="form-label">
                  First Name
                </label>
                <Input
                  name="firstName"
                  type="text"
                  className="form-input"
                  placeholder="Your first name"
                  aria-label="First Name"
                />
                {errors.firstName && touched.firstName && (
                  <div className="error-message">{errors.firstName}</div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName" className="form-label">
                  Last Name
                </label>
                <Input
                  name="lastName"
                  type="text"
                  className="form-input"
                  placeholder="Your last name"
                  aria-label="Last Name"
                />
                {errors.lastName && touched.lastName && (
                  <div className="error-message">{errors.lastName}</div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="password-field">
                  <Input
                    name="password"
                    type="password"
                    className="form-input"
                    placeholder="Create a password"
                    aria-label="Password"
                  />
                </div>
                {errors.password && touched.password ? (
                  <div className="error-message">{errors.password}</div>
                ) : (
                  <div className="password-requirements">
                    Password must contain at least 8 characters, including one uppercase letter, 
                    one lowercase letter, one number, and one special character.
                  </div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password
                </label>
                <div className="password-field">
                  <Input
                    name="confirmPassword"
                    className="form-input"
                    placeholder="Confirm your password"
                    type="password"
                    aria-label="Confirm Password"
                  />
                </div>
                {errors.confirmPassword && touched.confirmPassword && (
                  <div className="error-message">{errors.confirmPassword}</div>
                )}
              </div>
              
              {errorMessage && (
                <div className="error-alert">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit" 
                className="btn-auth"
                disabled={isSubmitting || isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading"></span>
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </Form>
          )}
        </Formik>

        <div className="auth-alternate">
          Already have an account?{" "}
          <Link to="/login" className="auth-alternate-link">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;