import React from 'react';
import Main from '../layouts/main'
import './App.css';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import MediaQuery from 'react-responsive'
//import { render } from '@testing-library/react';

const Header = React.lazy(() => import('../layouts/header'))
function App() {
  return (
    <Router>
      <div className="App">
        {/* (min-width: 576px) and (mix-height: 500px) */}
        <MediaQuery minWidth={576} minHeight={500}>
          <Header></Header>
        </MediaQuery>
        <Switch>
          <Route path='/' >
            <Main />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;