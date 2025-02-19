// LoginForm.js

import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { gql, useLazyQuery } from "@apollo/client";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useLocation } from "react-router-dom";
import { setToken } from "../controllers/auth";

const LoginForm = () => {
  const { state } = useLocation();
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); 

  const navigate = useNavigate();
  
  const LOGIN_QUERY = gql`
  query login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      userId,
      userRole,
      token,
      tokenExpiration
    }
  }
`;

const [executeQuery, { data }] = useLazyQuery(LOGIN_QUERY, {
  variables: { email, password },
  onError: (error) => {
    console.error("Error:", error);
    setError("Invalid email or password");
  }
});

const handleSubmit = (event) => {
  event.preventDefault();
  if (email.trim().length === 0 || password.trim().length === 0) {
    setError("Please enter valid email and password");
    return;
  }
  executeQuery();
};

// Handle the response data
  React.useEffect(() => {
  
  if (data) {
    // Assuming the response data has a userId field
    if (data.login.userId) {
      localStorage.setItem("userEmail", data.login.userId);
      localStorage.setItem("userRole", data.login.userRole);
      setToken(data.login.token);
      setLoggedIn(true);
      navigate("/");
      window.location.reload();
    } else {
      setError("Invalid email or password");
    }
  }
  if (state) {
    if(state && state.registrationSuccess){
      setSuccessMessage(state.registrationSuccess);
      setShowSuccessMessage(true);
    }
  }  
}, [data, state]);
  
  return (
    <Container className="mt-5 p-5" style={{ backgroundColor: "#f0f0f0" }}>
      {loggedIn ? (
        navigate("/")
      ) : (
        <Row>
          <Col md={6} className="left-section">
            <img src="images/login.jpg" alt="Login" className="img-fluid" />
          </Col>
          <Col md={6} className="right-section d-flex align-items-center p-4">
              <Form onSubmit={handleSubmit} className="w-100">
              {error && (
              <span className="text-danger">
                {error}
              </span>
                )}
                {showSuccessMessage && (
                  <span className="text-success">
                    {successMessage}
                  </span>
                )}
              <Form.Group controlId="formemail">
                <Form.Label>Email:</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(event) => setemail(event.target.value)}
                  placeholder="Enter your email"
                />
              </Form.Group>
              <Form.Group controlId="formPassword">
                <Form.Label>Password:</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                />
                </Form.Group>
                <Row>
                  <Col md={6}>
                    <Button
                      variant="primary"
                      type="submit"
                      className="w-100 mt-3 jp-bg-primary"
                      // style={{ backgroundColor: "#6A00C9" }}
                    >
                    Login
                    </Button>
                  </Col>
                  <Col md={6}>
                  <a href="/register" className="btn w-100 mt-3 jp-bg-primary text-white">Sign Up</a>
                  </Col>
                </Row>
                <Form.Text className="text-muted m-5">
                  <a href="/forgot-password">Forgot Password?</a>
                </Form.Text>
            </Form>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default LoginForm;