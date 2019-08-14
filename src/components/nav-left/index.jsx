import React, { Component } from 'react'
import { Menu, Icon } from 'antd';
import { Link,withRouter } from "react-router-dom";

import mnueList from "./../../config/menuconfig";
import logo from "./../../assets/images/logo.png";
import "./nav-left.less";

const { SubMenu, Item } = Menu

class NavLeft extends Component {

    // map方法遍历menuconfig文件中的menuList数组，根据数据实现标签组件化
    getMenuNodes = (mnueList) => {
        const path = this.props.location.pathname
        return mnueList.map(item => {
            if (!item.children) {
                return (
                    <Item key={item.key}>
                        <Link to={item.key}>
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
        })
    }

    // reduce方法遍历menuconfig文件中的menuList数组，根据数据实现标签组件化
    getMenuNodes2 = (mnueList) => {
        const path = this.props.location.pathname
        return mnueList.reduce((pre, item) => {
            if (!item.children) {
                pre.push(
                    <Item key={item.key}>
                        <Link to={item.key}>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </Link>
                    </Item>
                )
            } else {
                const cItem = item.children.find(cItem => cItem.key===path)
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
        }, [])
    }

    // 默认展开的SubMenu菜单项key数组
    

    componentWillMount() {
        // this.menuNodes = this.getMenuNodes(mnueList)      //map方法
        this.menuNodes = this.getMenuNodes2(mnueList)        //reduce方法
    }

    render() {
        const path = this.props.location.pathname
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
export default withRouter(NavLeft)
