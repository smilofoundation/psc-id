import React from 'react';
import PropTypes from 'prop-types';
import {Route, Router} from 'react-router-dom';
import {connect} from 'react-redux';
import compose from 'recompose/compose';
import {withStyles} from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Drawer from '@material-ui/core/Drawer';
import classNames from 'classnames';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ShoppingBasket from '@material-ui/icons/ShoppingBasket';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import HelpIcon from '@material-ui/icons/Help';

import {history} from '../_helpers';
import {alertActions, userActions} from '../_actions';
import {PrivateRoute} from '../_components';
import {HomePage} from '../HomePage';
import {LoginPage} from '../LoginPage';
import {RegisterPage} from '../RegisterPage';
import {BookOKPage, BookPage, CheckinOKPage, CheckinPage} from '../Book';
import {GatePage} from '../GatePage'


const drawerWidth = 240;

const styles = theme => ({
    root: {
        display: 'flex',
    },
    grow: {
        flexGrow: 1,
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 20,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing.unit * 3,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
});


class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            auth: true,
            anchorEl: null,
            open: false,
        };

        const {dispatch} = this.props;
        history.listen((location, action) => {
            // clear alert on location change
            dispatch(alertActions.clear());
        });

        this.handleChange = this.handleChange.bind(this);
        this.handleMenu = this.handleMenu.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
        this.handleDrawerClose = this.handleDrawerClose.bind(this);

        this.handleDeleteUser = this.handleDeleteUser.bind(this);
        this.handleBooking = this.handleBooking.bind(this);

        this.handleGate = this.handleGate.bind(this);

    }

    handleDrawerOpen() {
        this.setState({open: true});
    };

    handleDrawerClose() {
        this.setState({open: false});
    };

    handleChange(event) {
        this.setState({auth: event.target.checked});
    };

    handleMenu(event) {
        this.setState({anchorEl: event.currentTarget});
    };

    handleClose() {
        this.setState({anchorEl: null});
    };

    handleDeleteUser(id) {
        return (e) => this.props.dispatch(userActions.delete(id));
    }


    handleGate(e) {
        e.preventDefault();

        const id = e.currentTarget.id || "1"
        console.log("handleGate", id);

        history.push('/gate?gate=node' + e.currentTarget.id);

    }

    handleBooking(e) {
        e.preventDefault();

        history.push('/book');


    }

    render() {

        const {classes, theme} = this.props;
        const {auth, anchorEl} = this.state;

        const openMenu = Boolean(anchorEl);

        const {open} = this.state;

        const {alert} = this.props;
        return (
            <div className={classes.root}>
                <CssBaseline/>
                <AppBar
                    position="fixed"
                    className={classNames(classes.appBar, {
                        [classes.appBarShift]: open,
                    })}>
                    <Toolbar disableGutters={!open}>
                        <IconButton
                            color="inherit"
                            aria-label="Open drawer"
                            onClick={this.handleDrawerOpen}
                            className={classNames(classes.menuButton, open && classes.hide)}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant="h6" color="inherit" noWrap>
                            Private Smart Contract Identity DEMO
                        </Typography>
                        {window.password && (
                            <div>
                                <IconButton
                                    aria-owns={openMenu ? 'menu-appbar' : undefined}
                                    aria-haspopup="true"
                                    onClick={this.handleMenu}
                                    color="inherit"
                                >
                                    <AccountCircle/>
                                </IconButton>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={openMenu}
                                    onClose={this.handleClose}
                                >
                                    <MenuItem onClick={this.handleDeleteUser(0)}>Delete my account</MenuItem>
                                </Menu>
                            </div>
                        )}
                    </Toolbar>
                </AppBar>

                <Drawer
                    className={classes.drawer}
                    variant="persistent"
                    anchor="left"
                    open={open}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <div className={classes.drawerHeader}>
                        <IconButton onClick={this.handleDrawerClose}>
                            {theme.direction === 'ltr' ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
                        </IconButton>
                    </div>
                    {window.password && (
                        <>
                        <Divider/>
                        <List>

                            <ListItem onClick={this.handleBooking} button key={"Book a flight"}>
                                <ListItemIcon><ShoppingBasket/></ListItemIcon>
                                <ListItemText primary={"Book a flight"}/>
                            </ListItem>

                        </List>
                        <Divider/>
                        <List>
                            <ListItem id="1" onClick={this.handleGate} button key={"Go to Gate 1"}>
                                <ListItemIcon><PersonPinIcon/></ListItemIcon>
                                <ListItemText primary={"Go to Gate 1"}/>
                            </ListItem>
                            <ListItem id="1" onClick={this.handleGate} button key={"Go to Gate 2"}>
                                <ListItemIcon><PersonPinIcon/></ListItemIcon>
                                <ListItemText primary={"Go to Gate 2"}/>
                            </ListItem>
                            <ListItem id="1" onClick={this.handleGate} button key={"Go to Gate 3"}>
                                <ListItemIcon><PersonPinIcon/></ListItemIcon>
                                <ListItemText primary={"Go to Gate 3"}/>
                            </ListItem>
                            <ListItem id="1" onClick={this.handleGate} button key={"Go to Gate 4"}>
                                <ListItemIcon><PersonPinIcon/></ListItemIcon>
                                <ListItemText primary={"Go to Gate 4"}/>
                            </ListItem>
                            <ListItem button key={"Delete my info"}>
                                <ListItemIcon><HelpIcon/></ListItemIcon>
                                <ListItemText primary={"Delete my info"}/>
                            </ListItem>
                        </List>
                        </>
                    )}
                </Drawer>
                <main
                    className={classNames(classes.content, {
                        [classes.contentShift]: open,
                    })}
                >
                    <div className={classes.drawerHeader}/>
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

                                <PrivateRoute path="/gate" component={GatePage}/>


                            </div>
                        </Router>
                    </div>
                </main>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const {alert, uiTheme} = state;
    return {
        uiTheme,
        alert
    };
}


App.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

const connectedApp = compose(
    withStyles(styles, {
        name: 'AppFrame',
        withTheme: true
    }),
    connect(mapStateToProps),
)(App);





export {connectedApp as App};


