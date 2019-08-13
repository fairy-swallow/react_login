import React,{Component} from 'react'
import { Form, Icon, Input, Button } from 'antd';

import './login.less'
import logo from './images/logo.png'


 class Login extends Component {

    handleSubmit = e => {
        e.preventDefault();
        const value =  this.props.form.getFieldsValue()
        const user = this.props.form.getFieldValue('username')
        const password = this.props.form.getFieldValue('password')
        console.log(value,user,password)
        alert('点击发送登录的ajax请求')
      };

    render() {
        const Item = Form.Item
        const { getFieldDecorator } = this.props.form;
        return(
           <div className='login'>
               <header className='login-header'>
                   <img src={logo} alt="logo"/>
                   <h1>后台管理系统</h1>
               </header>
               <div className='login-content'>
                   <h1>用户登录</h1>
                   <Form onSubmit={this.handleSubmit} className="login-form">
                        <Item>
                            {
                                getFieldDecorator('username',{
                                    rules: [{ required: true, message: '请输入用户名!' }]
                                })(
                                    <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
                                )
                            }
                            
                        </Item>
                        <Item>
                            {
                                getFieldDecorator('password',{
                                    rules: [{ required: true, message: '请输入密码!' }]
                                })(
                                    <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
                                )
                            }
                        </Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button"> 登 录</Button>
                        </Form.Item>
                    </Form>
               </div>
           </div>
        )
    }
}

const WrappedLoginForm = Form.create()(Login);
export default WrappedLoginForm