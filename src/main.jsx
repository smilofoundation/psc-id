import "babel-polyfill"
import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
// setup fake backend
import {configureFakeBackend, store} from './_helpers';
import {App} from './App';

import {AppContainer} from 'react-hot-loader';
import ons from "onsenui";
import 'onsenui/css/onsenui.css';

configureFakeBackend();

const rootElement = document.getElementById('root');

ons.ready(() => render(
    <AppContainer>
        <Provider store={store}>
            <App/>
        </Provider>
    </AppContainer>,
    rootElement
));


if (module.hot) {
    module.hot.accept('./App', () => {
        const NextApp = require('./App');
        render(
            <AppContainer>
                <Provider store={store}>
                    <NextApp/>
                </Provider>
            </AppContainer>,
            rootElement
        );
    });
}