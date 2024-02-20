import React, { useState } from 'react'

import { useAuth } from 'react-oidc-context'
import { NavLink } from 'react-router-dom'
import BootstrapNavbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Image from 'react-bootstrap/Image'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

import logo from '../assets/img/logo.png'
import { OIDC_CONFIDENTIAL_TOKEN_NS } from '../config/env'

const Navbar = () => {
  const auth = useAuth()

  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const handleLogout = () => {
    auth.removeUser()
    localStorage.removeItem(OIDC_CONFIDENTIAL_TOKEN_NS)
    setShowLogoutModal(false)
    window.location.href = '/' // This is done just to enhance UX, you could just logout using "auth.removeUser()"
  }

  return (
    <BootstrapNavbar expand='lg' bg='dark' variant='dark' sticky='top'>
      <BootstrapNavbar.Brand as={NavLink} to='/'>
        <Image src={logo} height='40vmin' className='d-inline-block align-top ms-3' alt='Home' />
      </BootstrapNavbar.Brand>
      <BootstrapNavbar.Toggle aria-controls='basic-navbar-nav' />
      <BootstrapNavbar.Collapse id='basic-navbar-nav' className='justify-content-end me-3'>
        {
          auth.isAuthenticated
            ? (
              <>
                <Nav className='me-auto'>
                  <Nav.Link as={NavLink} to='/ingest'>Data Ingestion</Nav.Link>
                  <NavDropdown title='Data Explorer'>
                    <NavDropdown.Item as={NavLink} to='/file-index'>Indexed files</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={NavLink} to='/histograms-1d'>Histograms 1D</NavDropdown.Item>
                    <NavDropdown.Item as={NavLink} to='/histograms-2d'>Histograms 2D</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={NavLink} to='/runs'>Runs</NavDropdown.Item>
                    <NavDropdown.Item as={NavLink} to='/lumisections'>Lumisections</NavDropdown.Item>
                  </NavDropdown>
                </Nav>
                <Nav>
                  <NavDropdown>{auth.user.profile.name}
                    <NavDropdown.Text>Signed in as {auth.user.profile.sub}</NavDropdown.Text>
                    <NavDropdown.Item as={NavLink} onClick={() => setShowLogoutModal(true)}>Logout</NavDropdown.Item>
                    <Modal show={showLogoutModal}>
                      <Modal.Header>
                        <Modal.Title>Logout</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>Are you sure you want to logout?</Modal.Body>
                      <Modal.Footer>
                        <Button variant='secondary' onClick={() => setShowLogoutModal(false)}>No</Button>
                        <Button variant='primary' onClick={handleLogout}>Yes</Button>
                      </Modal.Footer>
                    </Modal>
                  </NavDropdown>
                </Nav>
              </>
              )
            : (
              <Nav>
                <Nav.Link onClick={() => auth.signinRedirect()}>Sign in with CERN</Nav.Link>
              </Nav>
              )
        }
      </BootstrapNavbar.Collapse>
    </BootstrapNavbar>
  )
}

export default Navbar
