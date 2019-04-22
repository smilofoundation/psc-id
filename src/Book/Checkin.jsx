import React from 'react';
import {connect} from 'react-redux';

import {bookActions} from '../_actions';

import Webcam from "react-webcam";
import {FaceVector} from "../_helpers/psc_faceVector";


class CheckinPage extends React.Component {
    componentDidMount() {
        this.props.dispatch(bookActions.getAll());
    }

    constructor(props) {
        super(props);

        this.state = {
            submitted: false
        };

        this.handleChange = this.handleChange.bind(this);

        this.setRef = this.setRef.bind(this);
        this.capture = this.capture.bind(this);

        this.faceapi = new FaceVector();

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




    setRef(webcam) {
        this.webcam = webcam;
    };

    async capture() {
        const {dispatch, bookings} = this.props;
        const bookingConfirmed = bookings && bookings.items && bookings.items[0] || {};


        const imageSrc = this.webcam.getScreenshot();

        const facevectors = await this.faceapi.detectSingleFace(imageSrc);

        if (facevectors && facevectors.confidence > 0.95) {
            console.log("Got a good vector ", facevectors);
            dispatch(bookActions.checkin(bookingConfirmed, facevectors));
        } else {
            console.log("ERROR: Failed to get good vector! ", facevectors);

        }

    };

    render() {
        const videoConstraints = {
            width: 1280,
            height: 720,
            facingMode: "user"
        };

        const {bookings} = this.props;


        const bookingConfirmed = bookings && bookings.items && bookings.items[0] || {};


        return (
            <div>
                <div className="main-info">
                    <div className="left-side-info-container">
                        <p className="info-left">From: {bookingConfirmed.from}</p>
                        <p className="info-left">To: {bookingConfirmed.to}</p>
                        <p className="info-left">Date: {bookingConfirmed.date && bookingConfirmed.date.toString()}</p>
                        <p className="info-left">Travellers: {bookingConfirmed.travellers}</p>
                    </div>
                </div>
                <Webcam
                    audio={false}
                    height={350}
                    ref={this.setRef}
                    screenshotFormat="image/jpeg"
                    width={350}
                    videoConstraints={videoConstraints}
                />
                <button onClick={this.capture}>Check-In My Biometrics</button>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const {bookings, registration} = state;

    const {registering} = registration;
    return {
        bookings,
        registering
    };
}

const connectedBookPage = connect(mapStateToProps)(CheckinPage);
export {connectedBookPage as CheckinPage};