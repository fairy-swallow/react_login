import React, { Component } from 'react'
import { Card, Button, Table, Modal, message } from "antd";

import { reqgetRole, reqAddRole, reqUpdateRole } from "./../../api";
import { formateDate } from './../../utils/dateUtil'
import ButtonLink from './../../components/button-link/buttonLink'
import RoleForm from "./role-form";
import Auth from './auth'
import memoryUtils from './../../utils/memoryUtil'

export default class Role extends Component {
  // state = {
  //   roles: [],
  //   isShowAdd: false,
  //   isShowUpdate: false
  // }
  state = {
    roles: [],
    isShowAdd: false,
    isShowAuth: false,
  }

  initColumns = () =>{
    this.columns = [
      {
        title:'角色名称',
        dataIndex: 'name'
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        // render: (create_time) => formateDate(create_time)
        render: formateDate
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        // render: (auth_time) => formateDate(auth_time)
        render: formateDate
      },
      {
        title: '授权人',
        dataIndex: 'auth_name'
      },
      {
        title: '操作',
        render: (role)=> <ButtonLink onClick={()=>this.authRole(role)}>设置权限</ButtonLink>
      },
    ]
  }

  authRole = (role)=>{
    this.role = role
    this.setState({
      isShowAuth:true
    })
  }

  // 获取角色列表---发送请求
  getRole = async() =>{
    const result = await reqgetRole()
    if (result.status === 0) {
      const roles = result.data
      // console.log(roles)
      this.setState({
        roles
      })
    }
  }

  // 将RoleForm组件中的form传过来
  getForm = (form) =>{
    this.form = form
  }

  // 添加角色--点击OK时
  addRole = ()=>{
    this.form.validateFields(async(error,values)=>{
      if (!error) {
        this.form.resetFields()
        this.setState({
          isShowAdd: false
        })
        const { roleName } = values
        const result = await reqAddRole(roleName)
        if (result.status === 0) {
          message.success('添加角色成功')
          this.getRole()
        }else{
          message.error('添加角色失败')
        }
      }
    })
  }

  // 更新角色权限---点击OK时
  updateRole = async()=>{
    this.setState({
      isShowAuth: false
    })
    const role = this.role
    role.menus = this.refs.authRef.getMenus()
    role.auth_time = Date.now()
    role.auth_name = memoryUtils.user.username
    const result = await reqUpdateRole(role)
    if (result.status === 0) {
      message.success('授权成功')
      this.getRole()
    }else{
      message.error('授权失败')
    }
  }

  componentWillMount(){
    this.initColumns()
  }

  componentDidMount(){
    this.getRole()
  }

  render() {
    const { roles, isShowAdd, isShowAuth } = this.state
    const title = <Button type='primary' onClick={()=>this.setState({isShowAdd:true})}>创建角色</Button>
    
    return (
      <Card title={title}>
        <Table 
          bordered
          rowKey='_id'
          columns={this.columns}
          dataSource={roles}
          pagination={{ defaultPageSize: 2, showQuickJumper: true}}
        />
        <Modal
          title='添加角色'
          visible={isShowAdd}
          onOk={this.addRole}
          onCancel={()=> {
            this.form.resetFields()
            this.setState({ isShowAdd: false })
          }}
        >
          <RoleForm getForm={this.getForm} ></RoleForm>
        </Modal>

        <Modal
          title='设置角色权限'
          visible={isShowAuth}
          onOk={this.updateRole}
          onCancel={() => {
            this.setState({ isShowAuth: false })
          }}
        >
          <Auth role={this.role || {}} ref='authRef' ></Auth>
        </Modal>
      </Card> 
    )
  }
}
