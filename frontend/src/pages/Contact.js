import React, { useState } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import "./Contact.css";

function Contact() {
    const user = useSelector((state) => state.user);

    const [message, setMessage] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [subject, setSubject] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí puedes implementar el manejo del envío del formulario
        console.log("Form submitted!");
    };

    return (
        <Row className="contact-container">
            <Col md={6} className="contact-content">
                <div className="title-container1">
                    <h1>Contact Us</h1>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formMessage">
                            <Form.Label>Message</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={5}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formPhoneNumber">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formSubject">
                            <Form.Label>Subject</Form.Label>
                            <Form.Control
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                            />
                        </Form.Group>
                        <Button className="btn-contact" type="submit">
                            Submit
                        </Button>
                    </Form>
                </div>
            </Col>
            <Col md={6} className="contact__bg">
                {/* Aquí puedes agregar una imagen relacionada con la página de contacto */}
            </Col>
        </Row>
    );
}

export default Contact;
