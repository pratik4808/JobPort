import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { CREATE_USER } from "./graphqlQueries";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");

  const [createUser] = useMutation(CREATE_USER);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await createUser({
        variables: {
          userInput: {
            firstName,
            lastName,
            email,
            password,
            birthDate,
            accountType: "Standard", // You may want to change this value based on user selection
          },
        },
      });
      console.log("User created:", data.createUser);
      navigate("/login");
      // Optionally, you can handle successful registration here (e.g., show a success message)
    } catch (error) {
      console.error("Error creating user:", error);
      // Optionally, you can handle errors here (e.g., show an error message)
    }
  };

  return (
    <Container className="mt-5 p-4" style={{ backgroundColor: "#f0f0f0" }}>
      <Row>
        <Col md={6} className="left-section">
          <img src="images/login.jpg" alt="Login" className="img-fluid" />
        </Col>
        <Col md={6} className="right-section d-flex align-items-center">
          <Form onSubmit={handleSubmit} className="w-100">
            <Form.Group controlId="formFirstName">
              <Form.Label>First Name:</Form.Label>
              <Form.Control
                type="text"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                placeholder="Enter your first name"
              />
            </Form.Group>
            <Form.Group controlId="formLastName">
              <Form.Label>Last Name:</Form.Label>
              <Form.Control
                type="text"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                placeholder="Enter your last name"
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email:</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
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
            <Form.Group controlId="formBirthDate">
              <Form.Label>Birth Date:</Form.Label>
              <Form.Control
                type="date"
                value={birthDate}
                onChange={(event) => setBirthDate(event.target.value)}
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className="w-100 mt-3"
              style={{ backgroundColor: "#3a41c6" }}
            >
              Register
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterForm;
