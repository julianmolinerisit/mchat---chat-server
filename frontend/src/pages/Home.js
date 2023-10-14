import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "./Home.css";
import { useSelector } from "react-redux";
import astronauta from "../assets/astronauta.png"

function Home() {
    const user = useSelector((state) => state.user);

    // Check if the user is authenticated and redirect to chat
    if (user) {
        window.location.replace("/chat");
    }

    return (
        <Row>
            <Col md={6} className="d-flex flex-direction-column align-items-center justify-content-center">
                <div className="title-container">
                    <div className="space-home"></div>
                    <h1>Share the world with your friends</h1>
                    <p>Chat App lets you connect with the world and the space...</p>
                    <LinkContainer to="/signup">
                        <Button className="btn-home">
                            Get Started <i className="fas fa-comments home-message-icon"></i>
                        </Button>
                    </LinkContainer>
                </div>
            </Col>
            <Col md={6} className="home__bg"> <img src={astronauta} alt="astronauta" className="home__bg" /> </Col>
        </Row>
    );
}

export default Home;
