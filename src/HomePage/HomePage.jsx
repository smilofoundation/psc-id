import React from 'react';
import {connect} from 'react-redux';
import compose from 'recompose/compose';
import {withStyles} from '@material-ui/core/styles';

import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import HelpIcon from '@material-ui/icons/Help';
import ShoppingBasket from '@material-ui/icons/ShoppingBasket';
import Typography from '@material-ui/core/Typography';

import {userActions} from '../_actions';


function TabContainer(props) {
    return (
        <Typography component="div" style={{padding: 8 * 3}}>
            {props.children}
        </Typography>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
};

const styles = theme => ({
    root: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
});

class HomePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: 0,
        }

        this.handleBooking = this.handleBooking.bind(this);
        this.handleGate = this.handleGate.bind(this);
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

    handleGate(e) {
        e.preventDefault();

        const id = e.currentTarget.id || "1"
        console.log("handleGate", id);

        this.setState({
            value: parseInt(id)
        })

        this.props.history.push('/gate?gate=node' + e.currentTarget.id);


    }

    render() {
        const {user, users} = this.props;

        const {classes} = this.props;
        const {value} = this.state;

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
                        <Tab label="Book a flight" onClick={this.handleBooking} icon={<ShoppingBasket/>}/>
                        <Tab id="1" label="Go to Gate 1" onClick={this.handleGate} icon={<PersonPinIcon/>}/>
                        <Tab id="2" label="Go to Gate 2" onClick={this.handleGate} icon={<PersonPinIcon/>}/>
                        <Tab id="3" label="Go to Gate 3" onClick={this.handleGate} icon={<PersonPinIcon/>}/>
                        <Tab id="4" label="Go to Gate 4" onClick={this.handleGate} icon={<PersonPinIcon/>}/>
                        <Tab label="Delete" onClick={this.handleDeleteUser(0)} icon={<HelpIcon/>}/>
                    </Tabs>
                </AppBar>


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

HomePage.propTypes = {
    classes: PropTypes.object.isRequired,
};


const connectedHomePage = compose(
    withStyles(styles, {
        name: 'AppFrame',
        withTheme: true
    }),
    connect(mapStateToProps),
)(HomePage);

// const connectedHomePage = connect(mapStateToProps)(HomePage);
export {connectedHomePage as HomePage};