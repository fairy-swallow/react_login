import React,{Component} from 'react'
import { Form, Icon, Input, Button,message } from 'antd';
import { Redirect } from 'react-router-dom'

import { saveUser } from "./../../utils/storageUtil";
import { reqLogin } from './../../api'

import './login.less'
import logo from './images/logo.png'
import memoryUtil from "../../utils/memoryUtil";


 class Login extends Component {

    handleSubmit = e => {
        e.preventDefault();
        // const value =  this.props.form.getFieldsValue()
        // const user = this.props.form.getFieldValue('username')
        // const password = this.props.form.getFieldValue('password')
        // console.log(value,user,password)
        this.props.form.validateFields(async(err, values) => {
            if (!err) {
                //   alert('点击发送登录的ajax请求')
                // console.log(values)
                const result = await reqLogin(values)
                // console.log(result)
                if(result.status === 0){     //登陆请求成功
                    // 获取用户user
                    const user = result.data
                    // 将用户数据保存在local中
                    // localStorage.setItem('user_key',JSON.stringify(user))
                    saveUser(user)
                    // 将用户数据保存在内存中
                    memoryUtil.user = user
                    // 跳转到admin  location/match/history
                    this.props.history.replace('/')
                }else{
                    message.error(result.msg)
                }
            }
          });
    
      };

      validatorPas = (rule, value, callback)=>{
        value = value.trim()
        if( !value ){
            callback('请输入密码')
        }else if( value.length < 4 ){
            callback('不可少于4位')
        }else if( value.length > 12 ){
            callback('不可超过12位')
        }else if( !/^[a-zA-Z0-9_]+$/.test(value) ){
            callback('仅允许数字字母下划线')
        }else{
            callback()
        }
      }


    render() {
        if(memoryUtil.user._id){
            return <Redirect to='/' />
        }
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
                                    initialValue: '',
                                    rules: [
                                        { required: true,whitespace: true, message: '请输入用户名!' },
                                        { min: 4, message: '不可少于4位'},
                                        { max: 12, message: '不可超过12位'},
                                        { pattern: /^[a-zA-Z0-9_]+$/,message: '仅允许数字字母下划线'}
                                    ]
                                })(
                                    <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
                                )
                            }
                            
                        </Item>
                        <Item>
                            {
                                getFieldDecorator('password',{
                                    initialValue: '',
                                    rules: [
                                        { validator: this.validatorPas}
                                    ]
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