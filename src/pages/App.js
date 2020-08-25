import React from 'react';
import Main from 'layouts/main'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import MediaQuery from 'react-responsive'
import { Row, Col, Container } from 'react-bootstrap'
//import { render } from '@testing-library/react';

const Header = React.lazy(() => import('layouts/header'))
function App() {
  return (
    <Router>
      <Container>
        <Row>
          <Col sm="1" xl="2" className="d-flex flex-column align-items-end p-0 sticky-top h-100">
            <MediaQuery minWidth={576} minHeight={500}>
              <Header></Header>
            </MediaQuery>
          </Col>
          <Col sm="11" xl="10">
            <Switch>
              <Route path='/' >
                <Main />
              </Route>
            </Switch>
          </Col>
        </Row>
      </Container>
    </Router>
  );
}

export default App;