import React from 'react';
import {connect} from 'react-redux';

import {alertActions, gateActions} from '../_actions';

import Webcam from "react-webcam";
import {FaceVector} from "../_helpers/psc_faceVector";
import queryString from 'query-string';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PersonPinIcon from '@material-ui/icons/PersonPin';

class GatePage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            submitted: false,
            value: 0,

        };

        this.handleChange = this.handleChange.bind(this);

        this.setRef = this.setRef.bind(this);
        this.capture = this.capture.bind(this);

        this.handleGate = this.handleGate.bind(this);

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

        this.setState({
            registering: true
        });

        let params = queryString.parse(this.props.location.search);
        const gate = params.gate || "node1";

        const imageSrc = this.webcam.getScreenshot();

        const facevectors = await this.faceapi.detectSingleFace(imageSrc);

        if (facevectors && facevectors.confidence > 0.95) {
            console.log("Got a good vector ", facevectors);
            dispatch(gateActions.auth(`${gate}.klm.smilo.network:444`, facevectors.vectors));
        } else {
            console.log("ERROR: Failed to get good vector! ", facevectors);
            dispatch(alertActions.error("Failed to get a good picture, please try again. "));
        }

        this.setState({
            registering: false
        });
    };


    handleGate(e) {
        e.preventDefault();

        const id = e.currentTarget.id || "1"
        console.log("handleGate", id);

        this.setState({
            value: parseInt(id) - 1
        })

        this.props.history.push('/gate?gate=node' + e.currentTarget.id);
    }

    render() {

        const {registering} = this.state;

        let params = queryString.parse(this.props.location.search);
        const gate = params.gate || "node1";
        const {value} = this.state;


        console.log("Going to start ... ", gate)

        const videoConstraints = {
            width: 1280,
            height: 720,
            facingMode: "user"
        };


        return (
            <div className="col-md-10">
                <AppBar position="static" color="default">
                    <Tabs
                        value={value}
                        variant="scrollable"
                        scrollButtons="on"
                        indicatorColor="primary"
                        textColor="primary"
                    >
                        <Tab id="1" label="Go to Gate 1" onClick={this.handleGate} icon={<PersonPinIcon/>}/>
                        <Tab id="2" label="Go to Gate 2" onClick={this.handleGate} icon={<PersonPinIcon/>}/>
                        <Tab id="3" label="Go to Gate 3" onClick={this.handleGate} icon={<PersonPinIcon/>}/>
                        <Tab id="4" label="Go to Gate 4" onClick={this.handleGate} icon={<PersonPinIcon/>}/>
                    </Tabs>
                </AppBar>

                <div className="main-info">
                    <br/>
                    <button className="btn btn-primary" onClick={this.capture}>Check-In My Biometrics</button>
                    {registering &&
                    <img
                        src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="/>
                    }
                    <Webcam
                        audio={false}
                        height={350}
                        ref={this.setRef}
                        screenshotFormat="image/jpeg"
                        width={350}
                        videoConstraints={videoConstraints}
                    />
                </div>

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