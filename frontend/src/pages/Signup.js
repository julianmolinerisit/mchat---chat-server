import React, { useState, useEffect } from "react";
import { Col, Container, Form, Row, Button } from "react-bootstrap";
import { useSignupUserMutation } from "../services/appApi";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";
import botImg from "../assets/user-pic.png";
import imagesignup from "../assets/imagen-signup.png";
import Swal from 'sweetalert2/dist/sweetalert2.js';
import intlTelInput from "intl-tel-input";
import "intl-tel-input/build/css/intlTelInput.css";
import axios from 'axios';

function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [signupUser, { isLoading }] = useSignupUserMutation();
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [upladingImg, setUploadingImg] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [phoneInput, setPhoneInput] = useState(null);
    const [confirmationCode, setConfirmationCode] = useState("");
    const [showConfirmationCode, setShowConfirmationCode] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [verificationCode, setVerificationCode] = useState('');
    const [verificationStatus, setVerificationStatus] = useState('');
    const [verificationMessage, setVerificationMessage] = useState(null);
    const [isEmailTaken, setIsEmailTaken] = useState(false);
    const [isPhoneNumberTaken, setIsPhoneNumberTaken] = useState(false);


    const handleSendVerification = async () => {
        if (!phoneNumber) {
            return;
        }

        const code = phoneInput.getNumber();
        setShowConfirmationCode(true);
        try {
            const response = await axios.post(`http://localhost:5001/verify/${phoneNumber}`);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCheckVerification = async () => {
        try {
            const response = await axios.post(`http://localhost:5001/check/${phoneNumber}/${confirmationCode}`);
            setVerificationStatus(response.data.status);

            if (response.data.status === "approved") {
                setVerificationMessage("Código de verificación correcto");
            } else {
                setVerificationMessage("Código de verificación incorrecto");
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const input = document.querySelector("#phone");
        const intlPhoneInput = intlTelInput(input, {
            initialCountry: "ar",
            geoIpLookup: getIp,
        });
        setPhoneInput(intlPhoneInput);
    }, []);

    function getIp(callback) {
        const input = document.querySelector("#phone");
        const intlPhoneInput = intlTelInput(input);
        const selectedCountry = intlPhoneInput.getSelectedCountryData();
        callback(selectedCountry.dialCode);
    }


    function validateImg(e) {
        const file = e.target.files[0];
        if (file.size >= 1048576) {
            return Swal.fire({
                icon: "error",
                title: "Image Size Error",
                text: "Max file size is 1MB.",
            });
        } else {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    }

    const isPhoneNumberValid = (phoneNumber) => {
        const phoneRegex = /^\+[1-9]\d{1,14}$/; // Expresión regular para formato de número de teléfono
        return phoneRegex.test(phoneNumber);
    };

    const isEmailValid = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Expresión regular para formato de correo electrónico
        return emailRegex.test(email);
    };


    async function uploadImage() {
        const data = new FormData();
        data.append("file", image);
        data.append('upload_preset', 'qprmkwt8');
        try {
            setUploadingImg(true);
            let res = await fetch("https://api.cloudinary.com/v1_1/dtsneudy9/image/upload", {
                method: "post",
                body: data,
            });
            const urlData = await res.json();
            setUploadingImg(false);
            return urlData.url;
        } catch (error) {
            setUploadingImg(false);
            console.log(error);
            throw new Error("Error uploading image");
        }
    }

    async function handleSignup(e) {
        e.preventDefault();
        if (!name || !email || !password || !image || !phoneNumber || !showConfirmationCode) {
            return Swal.fire({
                icon: "error",
                title: "Form Incomplete",
                text: "Please complete all fields and complete phone verification before submitting the form.",
            });
        }
        try {
            const url = await uploadImage();
            signupUser({ name, email, password, picture: url, phoneNumber }).then(({ data }) => {
                if (data) {
                    Swal.fire({
                        icon: "success",
                        title: "Signup Successful",
                        text: "You have successfully registered.",
                    });
                    navigate("/chat");
                }
            }).catch((error) => {
                if (error.response?.data?.message === "Email or username already exists") {
                    Swal.fire({
                        icon: "error",
                        title: "Signup Error",
                        text: "This email or username is already in use.",
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Signup Error",
                        text: "An error occurred during signup.",
                    });
                }
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Signup Error",
                text: "An error occurred during signup.",
            });
        }
    }

    const handleEmailBlur = async () => {
        if (email) {
            try {
                const response = await axios.get(`http://localhost:5001/check-email/${email}`);
                setIsEmailTaken(response.data.isTaken);
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handlePhoneNumberBlur = async () => {
        if (phoneNumber) {
            try {
                const response = await axios.get(`http://localhost:5001/check-phone/${phoneNumber}`);
                setIsPhoneNumberTaken(response.data.isTaken);
            } catch (error) {
                console.error(error);
            }
        }
    };


    return (
        <Container>
            <Row>
                <Col md={7} className="d-flex align-items-center justify-content-center flex-direction-column">
                    <Form style={{ width: "80%", maxWidth: 500 }} onSubmit={handleSignup}>
                        <h1 className="text-center" style={{ margin: '0 0 20px 0' }}>Create account</h1>
                        <div className="signup-profile-pic__container">
                            <img src={imagePreview || botImg} className="signup-profile-pic" alt="Profile" />
                            <label htmlFor="image-upload" className="image-upload-label">
                                <i className="fas fa-plus-circle add-picture-icon"></i>
                            </label>
                            <input type="file" id="image-upload" hidden accept="image/png, image/jpeg" onChange={validateImg} />
                        </div>
                        <Form.Group className="mb-3" controlId="formBasicName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Your name" onChange={(e) => setName(e.target.value)} value={name} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onBlur={handleEmailBlur}
                            />
                            {email && !isEmailValid(email) && <p>Invalid email format</p>}
                            {isEmailTaken && <p>Email is already taken</p>}
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPhoneNumber">
                            <Form.Label>Phone Number</Form.Label>
                            <div style={{ display: "flex" }}>
                                <input
                                    type="text"
                                    id="phone"
                                    className="form-control"
                                    placeholder="Enter a phone number"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    onBlur={handlePhoneNumberBlur}
                                />
                                <Button className="btn-signup" style={{ marginLeft: "10px" }}
                                    variant="primary" onClick={handleSendVerification} disabled={!isPhoneNumberValid(phoneNumber)}>
                                    Verify!
                                </Button>
                            </div>
                            {phoneNumber && !isPhoneNumberValid(phoneNumber) && <p>Invalid phone number format</p>}
                            {isPhoneNumberTaken && <p>Phone number is already taken</p>}
                        </Form.Group>

                        {showConfirmationCode && (
                            <Form.Group className="mb-3" controlId="formBasicConfirmationCode">
                                <Form.Label>Confirmation Code</Form.Label>
                                <div style={{ display: "flex" }}>
                                    <input
                                        type="text"
                                        id="confirmation-code"
                                        className="form-control"
                                        placeholder="Enter confirmation code"
                                        value={confirmationCode}
                                        onChange={(e) => setConfirmationCode(e.target.value)}
                                    />
                                    <Button className="btn-signup" style={{ marginLeft: "10px" }}
                                        variant="primary" onClick={handleCheckVerification} disabled={!phoneNumber}>
                                        Confirm!
                                    </Button>
                                </div>
                                {verificationMessage && (
                                    <p style={{ marginTop: "10px", color: verificationStatus === "approved" ? "green" : "red" }}>
                                        {verificationMessage}
                                    </p>
                                )}
                            </Form.Group>
                        )}

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} value={password} />
                        </Form.Group>
                        <Button className="btn-signup" type="submit" disabled={!showConfirmationCode}>
                            {upladingImg || isLoading ? "Signing you up..." : "Signup"}
                        </Button>

                        <div className="py-4">
                            <p className="text-center">
                                Already have an account ? <Link to="/login" className="txt-signup">Login</Link>
                            </p>
                        </div>
                    </Form>
                </Col>
                <Col md={5}>
                    <img src={imagesignup} alt="celular" className="signup__bg desktop-only" />
                </Col>
            </Row>
        </Container>
    );
}

export default Signup;
