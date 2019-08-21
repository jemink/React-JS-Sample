import {Redirect, Route, Switch} from "react-router-dom";
import React, {Component} from 'react'
import Dashboard from "./dashboard";
import Login from './login.jsx';
import Auth from '../auth.js';
import Loader from './components/Loader.jsx';
import SwmsList from "./swms/SwmsList";
import UsersList from "./users/users.jsx";
import SwmsShow from "./swms/SwmsShow";
import UsersAdd from "./users/add.jsx";
import ClientList from "./clients/list.jsx";
import ClientAdd from "./clients/add.jsx";
import JobTemplateList from "./jobTemplate/JobTemplateList";
import JobTemplateShow from "./jobTemplate/JobTemplateShow";
import RiskMatrix from "./RiskMatrix";

const auth = new Auth();

const handleAuthentication = (nextState, replace) => {
    if (/access_token|id_token|error/.test(nextState.location.hash)) {
        auth.handleAuthentication();
    }
};

class SWMSRouter extends Component {
    render() {
        const Private = ({component: Component, permission, ...rest}) => (
            <Route {...rest} render={(routeProps) => {
                return (
                    auth.isAuthenticated() && auth.userHasPermission(permission)
                        ? <Component {...routeProps} />
                        : <Redirect to='/'/>
                )
            }}/>
        );
        const Public = ({component: Component, permission, ...rest}) => (
            <Route {...rest} render={(routeProps) => {
                return (
                    !(auth.isAuthenticated() && auth.userHasPermission(permission))
                        ? <Component {...routeProps} />
                        : <Redirect to='/'/>
                )
            }}/>
        );
        return (
            <Switch>
                <Private permission='view:Dashboard' exact path='/dashboard' component={Dashboard}/>
                <Private permission='view:SWMS' exact path='/swms'
                         component={() => <SwmsList value={this.props.value}/>}/>
                <Private permission='view:SWMS' exact path='/swms/:id'
                         component={(props) => <SwmsShow {...props}/>}/>
                <Private permission='view:SWMS' exact path='/job/templates'
                         component={() => <JobTemplateList value={this.props.value}/>}/>
                <Private permission='view:SWMS' exact path='/job/templates/:id'
                         component={(props) => <JobTemplateShow {...props}/>}/>
                <Private permission='view:User' exact path='/users' component={() => <UsersList value={this.props.value}/>}/>
                <Private permission='add:User' exact path='/users/add' component={() => <UsersAdd />}/>
                <Private permission='update:User' exact path='/users/edit/:id' component={(props) => <UsersAdd {...props}/>}/>
                <Private permission='add:Client' exact path='/clients/add' component={() => <ClientAdd />}/>
                <Private permission='view:Client' exact path='/clients' component={() => <ClientList value={this.props.value}/>}/>
                <Private permission='update:Client' exact path='/clients/edit/:id' component={(props) => <ClientAdd {...props}/>}/>
                <Private permission='view:User' exact path='/riskMatrix' component={() => <RiskMatrix/>}/>
                <Public exact path='/callback' component={(props) => {
                    handleAuthentication(props);
                    return <Loader {...props} />
                }}/>
                <Private exact path='/logout' component={Login}/>
                <Public exact path='/login' component={() => <Login auth={auth}/>}/>
                <Route exact path='/' render={(routeProps) => {
                    return (
                        auth.userHasPermission() && auth.isAuthenticated()
                            ? <Redirect to='/dashboard'/>
                            : <Redirect to='/login'/>
                    )
                }}/>
            </Switch>
        )
    }
}

export default SWMSRouter