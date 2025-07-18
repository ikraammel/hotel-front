import React from 'react'
import { Container,Row,Col } from 'react-bootstrap'

const Footer = () => {
    let today = new Date()
  return (
    <footer className='bg-dark text-light py-3 footer mt-lg-5'>
      <Container>
        <Row>
            <Col xs={12} md={12} className='text-center'>
            <p>&copy; {today.getFullYear()} Ikram's Hotel</p>
            </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
