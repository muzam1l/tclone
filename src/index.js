import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import Splash from './comps/splash'
import TryAgain from './comps/TryAgain'
import * as serviceWorker from './serviceWorkerReg';

import JavascriptTimeAgo from 'javascript-time-ago'
// The desired locales.
import en from 'javascript-time-ago/locale/en'
import { useEffect } from 'react';

import { Provider, useDispatch, useSelector } from 'react-redux'
import { login } from 'store/authSlice'
import store from 'store/'

import App from 'pages/App'
import Landing from 'pages/Landing'

import './styles/main.scss';
// Initialize the desired locales.
JavascriptTimeAgo.locale(en)

ReactDOM.render(
  <Provider store={store}>
    <Suspense fallback={<Splash />}>
      <Root />
    </Suspense>
  </Provider>,
  document.getElementById('root')
);
function Root() {
  const { status, isAuthenticated, user } = useSelector(state => state.auth)
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(login());
    // eslint-disable-next-line
  }, [])
  if (isAuthenticated && user)
    return <App />
  else if (status === "loading")
    return <Splash />
  else if (status === "error")
    return <TryAgain fn={() => { dispatch(login()) }} message='Something went wrong, check you connection and try again' />
  else if (!(isAuthenticated && user))
    return <Landing />
}


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
