import React, { Component } from 'react'
import { Form, Input, Tree } from 'antd'
import PropTypes from 'prop-types'

import menuList from './../../config/menuconfig'

const TreeNode = Tree.TreeNode
export default class Auth extends Component {

  static propTypes = {
    role: PropTypes.object
  }

  state = {
    checkedKeys:[]   //已勾选treeNode的数组
  }

  // 将checkedKeys传给role组件
  getMenus = () =>{
    return this.state.checkedKeys
  }

  getTreeNodes =(menuList)=>{
    return menuList.map(item =>{
      return(
        <TreeNode title={item.title} key={item.key}>
          {item.children ? this.getTreeNodes(item.children) : null}
        </TreeNode>
      )
    }) 
  }

  // 每改变勾选状态时自动调用，自动改变this.state.checkedKeys中的勾选数据
  // 参数---checkedKeys---改变时自动传入参数
  handleCheck = (checkedKeys)=>{
    this.setState({
      checkedKeys
    })
  }

  // 第一次render前调用, 后面再打开显示时不会再调用
  componentWillMount(){
    const { menus } = this.props.role
    this.setState({
      checkedKeys: menus
    })
  }

  // 组件将要接收到新的props
  componentWillReceiveProps(nextProps) {
    // 读取最新传入的role, 更新checkedKeys状态
    const { munes } = nextProps.role
    this.setState({
      checkedKeys: munes
    })
  }

  render() {
    const { name } = this.props.role
    const { checkedKeys } = this.state
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 8 }
    }

    return (
      <div>
        <Form.Item label='角色名称' {...formItemLayout}>
          <Input disabled value={name} ></Input>
        </Form.Item>
        <Tree
          checkable
          defaultExpandAll
          onCheck={this.handleCheck}
          checkedKeys={checkedKeys}
        >
          <TreeNode title="平台权限" key="0-0">
            {
              this.getTreeNodes(menuList)
            }
            {/* <TreeNode title="parent 1-0" key="0-0-0" >
              <TreeNode title="leaf" key="0-0-0-0" />
              <TreeNode title="leaf" key="0-0-0-1" />
            </TreeNode>
            <TreeNode title="parent 1-1" key="0-0-1">
              <TreeNode title={<span style={{ color: '#1890ff' }}>sss</span>} key="0-0-1-0" />
            </TreeNode> */}
          </TreeNode>
        </Tree>
      </div>

    )
  }
}
