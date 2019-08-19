import React, { Component } from 'react'
import { Form, Input } from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item
class RoleForm extends Component {
  static propTypes = {
    getForm: PropTypes.func.isRequired
  }

  // 将form传给role组件
  componentWillMount(){
    this.props.getForm(this.props.form)
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 16 }
    }
    return (
      <Form {...formItemLayout}>
        <Item label='角色名称'>
          {
            getFieldDecorator('roleName',{
              initialValue: '',
              rules:[
                { required:true, message: '必须输入角色名称' }
              ]
            })(
              <Input type='text' placeholder='请输入角色名称'></Input>
            )
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(RoleForm)
