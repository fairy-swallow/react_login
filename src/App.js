import React, { Component } from 'react'
import {HashRouter,BrowserRouter,Switch,Route} from 'react-router-dom'

import Login from './pages/login/login'
import Admin from './pages/admin/admin'

export default class App extends Component {
    render() {
        return (
            <HashRouter>
                <Switch>
                    <Route path='/admin' component={Admin} />
                    <Route path='/' component={Login} />
                </Switch>
            </HashRouter>
            
        )
    }
}
