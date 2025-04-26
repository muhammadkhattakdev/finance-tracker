import React, { useState } from 'react';
import { Form, Formik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import Input from './input';
import Button from './button';
import Request from '../utils/request';

// Validation schema
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required'),
});

const LoginSection = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values, { setSubmitting, resetForm }) => {
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      // Call the login method from our Request utility
      await Request.login(values.email, values.password);
      
      // Reset the form after successful login
      resetForm();
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      // Display error message
      setErrorMessage(error.message || 'Login failed. Please check your credentials.');
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
              Sign in to{' '}
              <span className="blue-text">
                finance tracker
              </span>
            </h2>
            <p className="login-info-text">
              Manage your finances seamlessly with our powerful tracking tools.
            </p>
          </div>
          
          <Formik
            initialValues={{
              email: '',
              password: '',
            }}
            validationSchema={LoginSchema}
            onSubmit={handleLogin}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="login-form d-flex">
                <div className="login-input-box d-flex">
                  <label
                    htmlFor="email"
                    className="login-input-box-label"
                  >
                    Account
                  </label>
                  <Input
                    style={{ width: '100%' }}
                    name="email"
                    className="login-input"
                    placeholder="Email or user name"
                  />
                  {errors.email && touched.email && (
                    <div className="error-message">{errors.email}</div>
                  )}
                </div>
                
                <div className="login-input-box d-flex">
                  <label
                    htmlFor="password"
                    className="login-input-box-label"
                  >
                    Password
                  </label>
                  <Input
                    style={{ width: '100%' }}
                    name="password"
                    type="password"
                    className="login-input"
                    placeholder="Your password"
                  />
                  {errors.password && touched.password && (
                    <div className="error-message">{errors.password}</div>
                  )}
                  <Link to="/forgot-password" className="forgot-password">
                    Forgot password?
                  </Link>
                </div>
                
                {errorMessage && (
                  <div className="error-alert" style={{ color: 'red' }}>
                    {errorMessage}
                  </div>
                )}
                
                <div className="login-input-btns d-flex">
                  <Button
                    text={isLoading ? "Logging in..." : "Log In"}
                    type="submit"
                    className="btn-login"
                    disabled={isSubmitting || isLoading}
                  />

                  <p className="question-text">
                    Don't have an account?{' '}
                    <Link
                      to="/sign-up"
                      className="account-creation-btn"
                    >
                      Register
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

export default LoginSection;