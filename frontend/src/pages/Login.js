import React, { useContext, useState } from "react";
import { Col, Container, Form, Row, Button, Spinner } from "react-bootstrap";
import { useLoginUserMutation } from "../services/appApi";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { AppContext } from "../context/appContext";
import astronauta from "../assets/astronauta-login.jpg";
import Swal from "sweetalert2";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { socket } = useContext(AppContext);
    const [loginUser, { isLoading, error }] = useLoginUserMutation();

    function handleLogin(e) {
        e.preventDefault();
        // login logic
        loginUser({ email, password })
            .then(({ data }) => {
                if (data) {
                    // socket work
                    socket.emit("new-user");
                    // navigate to the chat
                    navigate("/chat");
                }
            })
            .catch((error) => {
                if (error.response && error.response.data) {
                    Swal.fire({
                        icon: "error",
                        title: "Login Error",
                        text: error.response.data,
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Login Error",
                        text: "An error occurred during login.",
                    });
                }
            });
    }

    return (
        <Container>
            <Row>
                <Col md={5}>
                    <img src={astronauta} alt="astronauta2" className="login__bg" />
                </Col>
                <Col md={7} className="d-flex align-items-center justify-content-center flex-direction-column">
                    <Form style={{ width: "80%", maxWidth: 500 }} onSubmit={handleLogin}>
                    <Form.Group className="mb-3" controlId="formBasicEmail" style={{ marginTop: '-20px' }}>
                            {error && <p className="alert alert-danger">Usuario o contraseña incorrecta</p>}
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} value={email} required />
                            <Form.Text className="text-muted">We'll never share your email with anyone else.</Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} value={password} required />
                        </Form.Group>
                        <Button className="btn-login" type="submit">
                            {isLoading ? <Spinner animation="grow" /> : "Login"}
                        </Button>
                        <div className="py-4">
                            <p className="">
                                Don't have an account? <Link to="/signup" className="txt-signup">Signup</Link>
                            </p>
                            <p className="">
                                Cannot init? <Link to="/resetpassword" className="txt-signup">Reset Password</Link>
                            </p>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default Login;
