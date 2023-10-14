import React, { useState } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import "./ResetPassword.css";
import { useSelector } from "react-redux";

function ForgotPassword() {
    const user = useSelector((state) => state.user);

    const [email, setEmail] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí puedes implementar el manejo del restablecimiento de contraseña
        console.log("Password reset requested for:", email);
    };

    return (
        <Row className="forgot-password-container1">
            <Col md={6} className="forgot-password-content1">
                <div className="title-container1">
                    <h1>Forgot Your Password?</h1>
                    <p>Enter your email address to reset your password.</p>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button className="btn-forgot-password1" type="submit">
                            Reset Password
                        </Button>
                    </Form>
                </div>
            </Col>
            <Col md={6} className="forgot-password__bg1">
                {/* Aquí puedes agregar una imagen relacionada con la página de olvidé mi contraseña */}
            </Col>
        </Row>
    );
}

export default ForgotPassword;
