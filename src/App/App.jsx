import React from 'react';
import {Route, Router} from 'react-router-dom';
import {connect} from 'react-redux';

import {history} from '../_helpers';
import {alertActions} from '../_actions';
import {PrivateRoute} from '../_components';
import {HomePage} from '../HomePage';
import {LoginPage} from '../LoginPage';
import {RegisterPage} from '../RegisterPage';
import {BookOKPage, BookPage, CheckinOKPage, CheckinPage} from '../Book';
import {Gate1Page, Gate2Page, Gate3Page, Gate4Page} from '../GatePage'

class App extends React.Component {
    constructor(props) {
        super(props);

        const {dispatch} = this.props;
        history.listen((location, action) => {
            // clear alert on location change
            dispatch(alertActions.clear());
        });
    }

    render() {
        const {alert} = this.props;
        return (
            <div className="jumbotron">
                <div className="container">
                    <div className="col-sm-8 col-sm-offset-2">
                        {alert.message &&
                        <div className={`alert ${alert.type}`}>{alert.message}</div>
                        }
                        <Router history={history}>
                            <div>
                                <PrivateRoute exact path="/" component={HomePage}/>
                                <Route path="/login" component={LoginPage}/>
                                <Route path="/register" component={RegisterPage}/>
                                <PrivateRoute path="/book" component={BookPage}/>
                                <PrivateRoute path="/book-ok" component={BookOKPage}/>
                                <PrivateRoute path="/checkin" component={CheckinPage}/>
                                <PrivateRoute path="/checkin-ok" component={CheckinOKPage}/>

                                <PrivateRoute path="/gate1" component={Gate1Page}/>
                                <PrivateRoute path="/gate2" component={Gate2Page}/>
                                <PrivateRoute path="/gate3" component={Gate3Page}/>
                                <PrivateRoute path="/gate4" component={Gate4Page}/>


                            </div>
                        </Router>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const {alert} = state;
    return {
        alert
    };
}

const connectedApp = connect(mapStateToProps)(App);
export {connectedApp as App};