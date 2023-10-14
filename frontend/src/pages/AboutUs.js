import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import astronauta from "../assets/astronauta1.png";
import "./AboutUs.css";

function AboutUs() {
    return (
        <Row className="home-container">
            <Col md={6} className="home-content">
                <div className="title-container1">
                    <div className="space-home"></div>
                    <h1>Connect and Chat</h1>
                    <p>Join our diverse chat rooms to discuss various topics. Have private conversations or dive into our AI-assisted rooms for more interactive discussions. We're bringing you the future of communication.</p>
                    <LinkContainer to="/chat">
                        <Button className="btn-home">
                            Get Started <i className="fas fa-comments home-message-icon"></i>
                        </Button>
                    </LinkContainer>
                </div>
            </Col>
            <Col md={6} className="home__bg1">
                <img src={astronauta} alt="astronauta" className="home__bg-img" />
            </Col>
        </Row>
    );
}

export default AboutUs;
