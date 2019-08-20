import React, { Component } from 'react'
import { Menu, Icon } from 'antd';
import { Link,withRouter } from "react-router-dom";

import mnueList from "./../../config/menuconfig";
import logo from "./../../assets/images/logo.png";
// import memoryUtil from "./../../utils/memoryUtil";
import "./nav-left.less";
import { connect } from "react-redux";
import { setHeaderTitle } from "./../../redux/actions";

const { SubMenu, Item } = Menu

class NavLeft extends Component {

    hasAuth= (item)=>{
        // const user = memoryUtil.user
        const user = this.props.user
        const menus = user.role.menus
        // 1.判断用户是否为admin
        // 2.判断menuList中是否isPublic为true
        // 3.判断menus中是否有菜单项
        if (user.username === 'admin' || item.isPublic || menus.indexOf(item.key) !=-1) {
            return true
        }else if (item.children) {
            const cItem = item.children.find(cItem => menus.indexOf(cItem.key) !=-1)
            return !!cItem
        }
        return false
    }

    // map方法遍历menuconfig文件中的menuList数组，根据数据实现标签组件化
    getMenuNodes = (mnueList) => {
        const path = this.props.location.pathname
        return mnueList.map(item => {
            // 自定义一个方法hasAuth判断menu中是否含有菜单项，有则执行后续操作，显示权限显示菜单页面
            if (this.hasAuth(item)) {
                if (!item.children) {
                    // 如果请求的路径与当前item的key一致, 将当前item的title更新到redux的状态
                    if (path.indexOf(item.key) === 0) {
                        this.props.setHeaderTitle(item.title)
                    }
                    return (
                        <Item key={item.key}>
                            <Link to={item.key} onClick={() => this.props.setHeaderTitle(item.title)}>
                                <Icon type={item.icon} />
                                <span>{item.title}</span>
                            </Link>
                        </Item>
                    )
                } else {
                    const cItem = item.children.find(cItem => cItem.key === path)
                    if (cItem) {
                        this.openKey = item.key
                    }
                    return (
                        <SubMenu
                            key={item.key}
                            title={
                                <span>
                                    <Icon type={item.icon} />
                                    <span>{item.title}</span>
                                </span>
                            }
                        >
                            {this.getMenuNodes(item.children)}
                        </SubMenu>
                    )
                }
            }
        })
    }

    // reduce方法遍历menuconfig文件中的menuList数组，根据数据实现标签组件化
    getMenuNodes2 = (mnueList) => {
        const path = this.props.location.pathname
        return mnueList.reduce((pre, item) => {
            // 如果请求的路径与当前item的key一致, 将当前item的title更新到redux的状态
            if (path.indexOf(item.key) === 0) {
                this.props.setHeaderTitle(item.title)
            }
            // 自定义一个方法hasAuth判断menu中是否含有菜单项，有则执行后续操作，显示权限显示菜单页面
            if (this.hasAuth(item)) {
                if (!item.children) {
                    pre.push(
                        <Item key={item.key}>
                            <Link to={item.key} onClick={() => this.props.setHeaderTitle(item.title)}>
                                <Icon type={item.icon} />
                                <span>{item.title}</span>
                            </Link>
                        </Item>
                    )
                } else {
                    // 当前item的children中某个item的key与当前请求的path相同, 当前item的key就是openKey
                    const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
                    if (cItem) {
                        this.openKey = item.key
                    }
                    pre.push(
                        <SubMenu
                            key={item.key}
                            title={
                                <span>
                                    <Icon type={item.icon} />
                                    <span>{item.title}</span>
                                </span>
                            }
                        >
                            {this.getMenuNodes2(item.children)}
                        </SubMenu>
                    )
                }
                
                return pre
            }
        }, [])
    }

    // 默认展开的SubMenu菜单项key数组
    

    componentWillMount() {
        // this.menuNodes = this.getMenuNodes(mnueList)      //map方法
        this.menuNodes = this.getMenuNodes2(mnueList)        //reduce方法
    }

    render() {
        let path = this.props.location.pathname
        if (path.indexOf('/product/')===0) {
            path = '/product'
        }
        console.log('path' ,path)
        return (
            <div className='nav-left'>
                <Link to='/home' className='nav-left-header'>
                    <img src={logo} alt="logo" />
                    <h1>硅谷后台</h1>
                </Link>
                <Menu 
                    mode="inline" 
                    theme="dark"
                    // defaultSelectedKeys={['/home']}  //用这个初始化和点击好使，但一旦在网址上输入路径不会切换
                    selectedKeys={[path]}
                    defaultOpenKeys={[this.openKey]}
                >
                    
                    {
                        this.menuNodes
                    }
                </Menu>
            </div>
        )
    }
}

// withRouter: 高阶组件: 包装非路由组件返回一个包装后的新组件, 新组件会向被包装组件传递history/location/match属性
// export default withRouter(NavLeft)
export default connect(
    state =>({
        user: state.user
    }),
    { setHeaderTitle }
)(withRouter(NavLeft))