import React, { Component } from 'react'
import { Modal } from 'antd';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import { reqWeather } from "./../../api/index";
import { formateDate } from "./../../utils/dateUtil";
// import memoryUtil from "./../../utils/memoryUtil";
// import { removeUser } from "./../../utils/storageUtil";
import ButtonLink from "./../button-link/buttonLink";
import './header.less'
import { resetLogin } from "./../../redux/actions";

const { confirm } = Modal;

class Header extends Component {

    state = {
        currentTime: formateDate(Date.now()),
        dayPictureUrl: '',
        weather: ''
    }

    // 退出登录
    logout = () => {
        confirm({
            title: '确认退出吗？',
            onOk: () => {    //注意使用箭头函数
                /*
                // 设置local中的数据为空，（删除）
                // saveUser({})
                removeUser()
                memoryUtil.user = {}
                this.props.history.replace('/login')
                */
                this.props.resetLogin()
            },
            onCancel: () => {   //注意使用箭头函数
                console.log('Cancel');
            },
        });
    }

    // 获取content页面的title
    /*
    getTitle = () => {
        let title = ''
        const path = this.props.location.pathname
        menuList.forEach(item => {
            if (item.key === path) {
                title = item.title
            } else if (item.children) {
                const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
                if (cItem) {
                    title = cItem.title
                }
            }
        })
        return title
    }
    */

    // 更新时间
    updateTime=()=>{
        this.timer = setInterval(() => {
            const currentTime = formateDate(Date.now())
            this.setState({
                currentTime
            })
        }, 1000);
    }

    // 获取天气信息
    getWeather =async()=>{
        const { dayPictureUrl, weather } = await reqWeather('北京')
        this.setState({
            dayPictureUrl, 
            weather 
        })
    }

    componentWillMount(){
        clearInterval(this.timer)
    }

    componentDidMount(){
        this.updateTime()
        this.getWeather()
    }

    render() {
        const { currentTime, dayPictureUrl, weather } = this.state
        // let title = this.getTitle()
        // 通过redux获取title
        const title = this.props.headerTitle

        // const user = memoryUtil.user
        const user = this.props.user
        return (
            <div className='header'>
                <div className='header-top'>
                    <span>欢迎, {user.username}</span>
                    {/* <button>退出</button> */}
                    <ButtonLink onClick={this.logout}>退出</ButtonLink>
                </div>
                <div className='header-bottom'>
                    <div className='header-bottom-left'>{title}</div>
                    <div className='header-bottom-right'>
                        <span>{currentTime}</span>
                        {dayPictureUrl ? <img src={dayPictureUrl} alt="weather" /> : null}
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

// export default withRouter(Header)
export default connect(
    state =>({
        headerTitle: state.headerTitle,
        user:state.user
    }),
    { resetLogin }
)(withRouter(Header))
