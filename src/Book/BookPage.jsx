import React from 'react';
import {connect} from 'react-redux';

import {bookActions} from '../_actions';

const cities = [
    "Amsterdam",
    "Barcelona",
    "Manila",
    "Moscow",
    "Tokyo",
    "Dhaka",
    "Istanbul",
    "Karachi",
    "Beijing",
    "Shanghai",
    "Mumbai",
    "Tianjin",
    "Paris",
    "Berlin"
];

class BookPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            bookedFlight: this.generateRandomFlight(),
            submitted: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    generateRandomFlight() {
        const bookedFlight = {};

        bookedFlight.from = this.getRandomCity();
        let toRandomCity = this.getRandomCity();

        while (toRandomCity === bookedFlight.from) {
            toRandomCity = this.getRandomCity();
        }

        bookedFlight.to = toRandomCity;

        bookedFlight.date = new Date();
        let randomAddDays = Math.floor(Math.random() * 50) + 1;
        bookedFlight.date.setDate(bookedFlight.date.getDate() + randomAddDays);

        let randomNumber = Math.floor(Math.random() * 10) + 1;
        let adultText = randomNumber === 1 ? " Adult" : " Adults";
        bookedFlight.travellers = randomNumber + adultText;
        bookedFlight.flightId = "KL " + Math.floor(Math.random() * 9999) + 1;

        // ??
        bookedFlight.smartContractAddress = "0x28r1289hd921fh21fh21feh8wf8wehf8ef";

        return bookedFlight;
    }

    getRandomCity() {
        return cities[Math.floor(Math.random() * cities.length)];
    }

    handleChange(event) {
        const {name, value} = event.target;
        const {user} = this.state;
        this.setState({
            user: {
                ...user,
                [name]: value
            }
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        this.setState({submitted: true});
        const {bookedFlight} = this.state;
        const {dispatch} = this.props;

        dispatch(bookActions.register(bookedFlight));
    }

    render() {
        const { registering  } = this.props;

        const {bookedFlight} = this.state;
        return (
            <div className="col-md-6 col-md-offset-3">
                <form name="form" onSubmit={this.handleSubmit}>
                    <div className="klm-header-container">
                        <h1 className="klm-header">Book a Flight</h1>
                    </div>
                    <div className="main-info">
                        <div className="left-side-info-container">
                            <p className="info-left">From: {bookedFlight.from}</p>
                            <p className="info-left">To: {bookedFlight.to}</p>
                            <p className="info-left">Date: {bookedFlight.date.toString()}</p>
                            <p className="info-left">Travellers: {bookedFlight.travellers}</p>
                        </div>
                    </div>

                    <div className="form-group">
                        <button className="btn btn-primary">Book now</button>
                         {registering &&
                            <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                        }
                    </div>
                </form>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const {registering} = state.registration;
    return {
        registering
    };
}

const connectedBookPage = connect(mapStateToProps)(BookPage);
export {connectedBookPage as BookPage};