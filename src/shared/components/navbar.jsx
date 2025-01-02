import React from "react";
import { Navbar, Container } from "react-bootstrap";

const AppNavbar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="#">News Aggregator</Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
