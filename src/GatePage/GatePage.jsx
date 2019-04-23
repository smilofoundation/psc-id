import React from 'react';
import {connect} from 'react-redux';

import {gateActions} from '../_actions';

import Webcam from "react-webcam";
import {FaceVector} from "../_helpers/psc_faceVector";

class GatePage extends React.Component {

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
        const {dispatch} = this.props;
        const gate = this.props.match.params.gate || "node1";

        const imageSrc = this.webcam.getScreenshot();

        const facevectors = await this.faceapi.detectSingleFace(imageSrc);

        if (facevectors && facevectors.confidence > 0.95) {
            console.log("Got a good vector ", facevectors);
            dispatch(gateActions.auth(`${gate}.klm.smilo.network:444`,facevectors.vectors));
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

        return (
            <div>
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

const connectedBookPage = connect(mapStateToProps)(GatePage);
export {connectedBookPage as GatePage};