import React from 'react';
import Main from 'layouts/main'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import MediaQuery from 'react-responsive'
import { Row, Col, Container } from 'react-bootstrap'
import Nav from 'layouts/header/bottom-nav'
import Header from 'layouts/header'

//import { render } from '@testing-library/react';

function App() {
  return (
    <Router>
      <Container className="mb-5 mb-sm-1">
        <Row>
          <MediaQuery minWidth={576} minHeight={500}>
            <Col sm="1" xl="2" className="d-flex flex-column align-items-end p-0 sticky-top h-100">
              <Header></Header>
            </Col>
          </MediaQuery>
          <Col sm="11" xl="10">
            <Switch>
              <Route path='/' >
                <Main />
              </Route>
            </Switch>
          </Col>
        </Row>
        <MediaQuery minHeight={500} maxWidth={576}>
          <Nav />
        </MediaQuery>
      </Container>
    </Router>
  );
}

export default App;