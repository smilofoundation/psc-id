import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const psc_storage = require("../_helpers/psc_storage");
const storage = new psc_storage.StorageProvider();

export const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        storage.read("users")
            ? <Component {...props} />
            : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
    )} />
)