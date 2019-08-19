import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select, } from 'antd'

const Item = Form.Item
const Option = Select.Option
// 用于添加修改用户的组件
class UserForm extends Component {

  static propTypes = {
    setForm: PropTypes.func.isRequired,
    user: PropTypes.object,
    roles: PropTypes.array
  }

  componentWillMount(){
    this.props.setForm(this.props.form)
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 }
    }
    const { user, roles } = this.props
    return (
      <Form {...formItemLayout}>
        <Item label="用户名">
          {
            getFieldDecorator('username', {
              initialValue: user.username || '',
              rules:[
                { required: true, message: '必须指定用户名'}
              ]
            })(
              <Input type="text" placeholder="请输入用户名" />
            )
          }
        </Item>
        {
          !user._id ?
            (
              <Item label="密码">
                {
                  getFieldDecorator('password', {
                    initialValue: '',
                    rules: [
                      { required: true, message: '必须指定密码' }
                    ]
                  })(
                    <Input type="password" placeholder="请输入密码" />
                  )
                }
              </Item>
            ) : null
        }
        <Item label='手机号'>
          {
            getFieldDecorator('phone', {
              initialValue: user.phone || '',
              rules: [
                { required: true, message: '必须指定手机号' }
              ]
            })(
              <Input type="text" placeholder="请输入手机号" />
            )
          }
        </Item>
        <Item label='邮箱'>
          {
            getFieldDecorator('email', {
              initialValue: user.email || '',
              rules: [
                { required: true, message: '必须指定邮箱' }
              ]
            })(
              <Input type="text" placeholder="请输入邮箱" />
            )
          }
        </Item>
        <Item label="角色">
          {
            getFieldDecorator('role_id', {
              initialValue: user.role_id || '',
              rules: [
                { required: true, message: '必须指定角色' }
              ]
            })(
              <Select style={{ width: 200 }} placeholder='请选择角色'>
                {
                  roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)
                }
              </Select>
            )
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(UserForm)