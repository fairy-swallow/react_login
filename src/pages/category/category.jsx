import React, { Component } from 'react'
import { Card, Button, Icon, Table, Modal, message } from 'antd';

import ButtonLink from './../../components/button-link/buttonLink'
import { reqCategoryList, reqAddCategory, reqUpdateCategory } from './../../api'
import CategoryForm from "./category-form";



export default class Category extends Component {

  state = {
    categorys:[],             // 请求数据--- colums要显示的数据
    loading: false,          // 请求数据时显示loading状态
    showState:0   //0:添加分类和修改分类都不显示  1：添加分类显示  2：修改分类显示
  }

  // 初始化columns数据
  initColumns=()=>{
    this.columns = [
      {
        title: '分类名称',
        dataIndex: 'name',
        // render:(name) => name.toUpperCase()
      },
      {
        width: 300,
        title: '操作',
        render: (category) => (
          <ButtonLink onClick={() => this.showUpdate(category)}>修改分类</ButtonLink>
        )
      }
    ]
  }

  // 异步请求获取数据
  getCategorys = async()=>{
    this.setState({
      loading:true
    })
    const result = await reqCategoryList()
    this.setState({
      loading: false
    })
    if (result.status === 0) {
      const categorys = result.data
      this.setState({
        categorys
      })
    }else{
      message.error('获取数据失败'+result.msg)
    }
  }

  // 点击修改数据事件
  showUpdate = (category)=>{
    this.setState({
      showState:2
    })
    // 将点击的当前数据保存到this.category
    this.category = category
  }

  // 接收form并保存的函数
  setForm =(form)=>{    //父组件通过props传递给子组件setForm函数，子组件通过给此函数传参用来将input框中的值传递给父组件，后保存下来
    this.form = form
  }
  
  // 点击OK----添加分类
  addCategorys =()=>{
    // 0.进行表单验证
    this.form.validateFields(async(err,values)=>{
      if (!err) {
        // 修改状态，将添加分类框关掉
        this.setState({
          showState:0
        })
        // 输入数据清空--	重置一组输入控件的值（为 initialValue）与状态，如不传入参数，则重置所有组件
        this.form.resetFields()
        // 1.获取form数据
        const categoryName = values.categoryName
        // 2.发送请求
        const result = await reqAddCategory(categoryName)
        // 4.根据返回结果显示页面
        if (result.status === 0) {   
          message.success('添加分类成功')
          this.getCategorys()  //重新异步请求获取数据更新页面
        }else{
          message.error('添加分类失败'+result.msg)
          // console.log(result)
        }
      }
    })
  }

  // 点击OK----修改分类
  updateCategorys =()=>{          //与添加分类步骤大体相同
    this.form.validateFields(async(err,values)=>{
      if (!err) {
        // 隐藏对话框
        this.setState({
          showState:0
        })
        // 重置对话框数据为初始值
        this.form.resetFields()
        const categoryName = values.categoryName
        // this.category是在初始化columns数据的时候通过render传入的当前数据的一个对象{name，_id}
        const categoryId = this.category._id      //this.category是当前数据的id值，不可用values._id，此时变成新创建的_id值了
        const result =  await reqUpdateCategory(categoryId, categoryName)
        if (result.status === 0) {  //成功后后台自动将数据修改
          message.success('修改分类成功')
          this.getCategorys()  //重新异步请求获取数据更新页面
        }else{
          message.error('修改分类失败' + result.msg)
        }
      }
    })
  }

  // 点击取消----添加分类&&修改分类
  handleCancel =()=>{
    // 重置输入数据
    this.form.resetFields()
    // 隐藏对话框
    this.setState({
      showState:0
    })
  }

  componentWillMount(){
    this.initColumns()
  }

  componentDidMount(){
    this.getCategorys()
  }

  render() {
    const { categorys, loading, showState } = this.state
    // console.log(categorys)

    // 定义card的右侧的添加按钮
    const extra = (<Button type='primary' onClick={() => this.setState({ showState: 1 })} >
      <Icon type='plus' />
      添加</Button>)
    
    const category = this.category || {}    // 避免初始render时报错

    return (
      <Card extra={extra}>
        <Table columns={
          this.columns} 
          dataSource={categorys} 
          size="large" 
          bordered 
          loading={loading} 
          rowKey="_id"
          pagination={{ pageSize: 5, showQuickJumper:true}}
        />
        <Modal
          title="添加分类"
          visible={showState===1}
          onOk={this.addCategorys}
          onCancel={this.handleCancel}
          okText="OK"
          cancelText="Cancel"
        >
          <CategoryForm setForm={this.setForm} />
        </Modal>
        <Modal
          title="修改分类"
          visible={showState===2}
          onOk={this.updateCategorys}
          onCancel={this.handleCancel}
          okText="OK"
          cancelText="Cancel"
        >
          <CategoryForm categoryName={category.name} setForm={this.setForm} />
        </Modal>
      </Card>
    )
  }
}
