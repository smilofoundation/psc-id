import React from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';

import {userActions} from '../_actions';

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.handleBooking = this.handleBooking.bind(this);
        this.handleGate1 = this.handleGate1.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(userActions.getAll());
    }

    handleDeleteUser(id) {
        return (e) => this.props.dispatch(userActions.delete(id));
    }

    handleBooking(e) {
        e.preventDefault();

        this.props.history.push('/book');


    }

    handleGate1(e) {
        e.preventDefault();

        this.props.history.push('/gate1');


    }

    render() {
        const {user, users} = this.props;
        return (
            <div className="col-md-6 col-md-offset-3">
                <h1>Hi {user.name}!</h1>
                <p>Lets book a flight ?
                    <button onClick={this.handleBooking} className="btn btn-primary">Book now</button>

                </p>

                <p>Already booked and Checked in ?
                    <button onClick={this.handleGate1} className="btn btn-primary">Go to Gate 1</button>
                </p>


                {users.loading && <em>Loading users...</em>}
                {users.error && <span className="text-danger">ERROR: {users.error}</span>}
                {users.items &&
                <ul>
                    {users.items.map((user, index) =>
                        <li key={0}>
                            {user.name}
                            {
                                user.deleting ? <em> - Deleting...</em>
                                    : user.deleteError ?
                                    <span className="text-danger"> - ERROR: {user.deleteError}</span>
                                    : <span> - <a onClick={this.handleDeleteUser(0)}>Delete</a></span>
                            }
                        </li>
                    )}
                </ul>
                }
                <p>
                    <Link to="/login">Logout</Link>

                </p>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const {users, authentication} = state;
    const {user} = authentication;
    return {
        user,
        users
    };
}

const connectedHomePage = connect(mapStateToProps)(HomePage);
export {connectedHomePage as HomePage};