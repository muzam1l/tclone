import React from 'react';
import Main from 'layouts/main'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import MediaQuery from 'react-responsive'
import { Row, Col, Container } from 'react-bootstrap'
import Nav from 'layouts/header/bottom-nav'
import Header from 'layouts/header'


import { useDispatch } from 'react-redux'
import { fetchNotifs } from 'features/notify/notifySlice'
import { useEffect } from 'react'
import { AlertsProvider } from 'features/alerts/alertsContext'

import { subscribeUserToPush } from '../subscription'

export default function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchNotifs())
  }, [dispatch])

  useEffect(() => {
    if (window.Notification?.permission === 'granted')
      subscribeUserToPush()
  }, [])
  return (
    <Router>
      <AlertsProvider>
        <Container className="mb-5 mb-sm-1">
          <Row>
            <MediaQuery minWidth={576}>
              <Col sm="1" xl="2" className="d-flex flex-column align-items-end p-0 sticky-top vh-100">
                <Header></Header>
              </Col>
            </MediaQuery>
            <Col sm="11" xl="10">
              <Switch>
                <Route path='/login'>
                  <Redirect to="/" />
                </Route>
                <Route path='/' >
                  <Main />
                </Route>
              </Switch>
            </Col>
          </Row>
          <MediaQuery maxWidth={576}>
            <Nav />
          </MediaQuery>
        </Container>
      </AlertsProvider>
    </Router>
  );
}