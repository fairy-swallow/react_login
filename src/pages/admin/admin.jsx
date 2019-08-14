import React, { Component } from 'react'
import { Redirect,Switch,Route } from 'react-router-dom'
import { Layout } from 'antd';


import memoryUtil from "../../utils/memoryUtil";
import Header from "./../../components/header";
import NavLeft from "./../../components/nav-left";

import Home from "./../home/home";
import Category from "./../category/category";
import Product from "./../product/product";
import Role from "./../role/role";
import User from "./../user/user";
import Bar from "./../charts/chartbar";
import Line from "./../charts/chartline";
import Pie from "./../charts/chartpie";


const { Footer, Sider, Content } = Layout;

export default class Admin extends Component {
    render() {
        if (!memoryUtil.user._id) {
            return <Redirect to='/login' />
        }
        return (
                <Layout style={{height:'100%'}}>
                    <Sider>
                        <NavLeft/>
                    </Sider>
                    <Layout>
                        <Header></Header>
                        <Content style={{margin:20,backgroundColor:'white'}}>
                            <Switch>
                                {/* 模糊匹配匹配的是/xxx,如/home/hashfa,此时匹配Route的/home */}
                                <Route path='/home' component={Home} />
                                <Route path='/category' component={Category} />
                                <Route path='/product' component={Product} />
                                <Route path='/role' component={Role} />
                                <Route path='/user' component={User} />
                                <Route path='/charts/bar' component={Bar} />
                                <Route path='/charts/line' component={Line} />
                                <Route path='/charts/pie' component={Pie} />
                                <Redirect to='/home' />
                            </Switch>
                        </Content>
                        <Footer style={{textAlign:'center',color:'#aaa'}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
                    </Layout>
                </Layout>
        )
    }
}
