import React, { Component } from 'react'
import { Button, Card, Table, Modal, message } from "antd";

import ButtonLink from './../../components/button-link/buttonLink'
import { reqAllUsers, reqAddOrUpdateUser, reqRemoveUser } from "./../../api";
import { formateDate } from './../../utils/dateUtil'
import UserForm from "./user-form";

export default class User extends Component {

  state = {
    isShow: false, // 是否显示对话框
    users: [], // 所有用户的列表
    roles: [], // 所有角色的列表
  }

  initColumns = ()=>{
    this.columns = [
      {
        title:'用户名',
        dataIndex:'username'
      },
      {
        title: '邮箱',
        dataIndex: 'email'
      },
      {
        title: '电话',
        dataIndex: 'phone'
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        render: formateDate
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        render: role_id => this.rolesObj[role_id]
      },
      {
        title: '操作',
        render: (user)=>(
          <span>
            <ButtonLink onClick={() => this.setUser(user)}>修改</ButtonLink>
            &nbsp;&nbsp;
            <ButtonLink onClick={()=>this.removeUser(user)}>删除</ButtonLink>
          </span>
        )
      },
    ]
  }

  // 点击修改操作
  setUser = (user)=>{
    this.user = user
    this.setState({
      isShow: true
    })
  }

  // 点击删除操作
  removeUser = (user)=>{
    Modal.confirm({
      content: `确定删除${user.username}信息么?`,
      onOk: async()=> {
        const result = await reqRemoveUser(user._id)
        if (result.status === 0) {
          message.success('删除用户成功')
          this.getAllUsers()
        }else{
          message.error('删除用户失败')
        }
      }
    })
  }

  // 点击添加用户
  addUser = () =>{
    this.user = null
    this.setState({
      isShow: true
    })
  }

  // 异步获取所有用户列表
  getAllUsers = async () =>{
    const result = await reqAllUsers()
    if (result.status === 0) {
      const { users, roles } = result.data
      // console.log(result)
      this.initRolesObj(roles)
      this.setState({
        users,
        roles
      })
    }
  }

  // 根据角色的数组生成一个包含所有角色名的对象容器
  initRolesObj = (roles) =>{
    this.rolesObj = roles.reduce((pre,role)=>{
      pre[role._id] = role.name
      return pre
    },{})
  }

  // 点击添加或修改用户
  AddOrUpdateUser = ()=>{
    // 表单验证
    this.form.validateFields(async(error,values)=>{
      const user = values
      if (!error) {
        this.form.resetFields()
        this.setState({
          isShow: false
        })
        if (this.user) {
          user._id = this.user._id
        }
        const result = await reqAddOrUpdateUser(user)
        if (result.status === 0) {
          message.success('用户操作成功')
          this.getAllUsers()
        }else{
          message.error('用户操作失败')
        }
      }
    })
  }

  componentWillMount(){
    this.initColumns()
  }

  componentDidMount(){
    this.getAllUsers()
  }

  render() {
    const user = this.user || {}
    const { users, roles, isShow } = this.state
    const title = <Button type='primary' onClick={this.addUser}>创建用户</Button>
    return (
      <Card title={title}>
        <Table
        bordered
        rowKey='_id'
        columns={this.columns} 
        dataSource={users}
        pagination={{ defaultPageSize: 2, showQuickJumper: true }}
        />
        <Modal
          title={user._id ? '修改用户' : '添加用户'}
          visible={isShow}
          onCancel={() => {
            this.form.resetFields()
            this.setState({ isShow: false })
          }}
          onOk={this.AddOrUpdateUser}
        >
          <UserForm
            setForm={(form) => this.form = form}
            user={user}
            roles={roles}
          />
        </Modal>
      </Card>  
    )
  }
}
