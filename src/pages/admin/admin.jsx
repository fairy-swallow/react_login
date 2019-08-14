import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'
import memoryUtil from "../../utils/memoryUtil";

export default class Admin extends Component {
    render() {
        if (!memoryUtil.user._id) {
            return <Redirect to='/login' />
        }
        return (
            <div>hello { memoryUtil.user.username }</div>
        )
    }
}
