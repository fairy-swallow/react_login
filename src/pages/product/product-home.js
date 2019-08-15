import React, { Component } from 'react'
import { Select, Input, Button, Icon, Card, Table, message } from "antd";

import ButtonLink from "./../../components/button-link/buttonLink";
import { reqGetProduct } from './../../api'
import { PAGE_SIZE } from "./../../utils/constants";

export default class ProductHome extends Component {

  state = {
    products: [], // 当前页的product数组
    total: 0,     // product的页数量
  }

  // 初始化商品分页列表
  initcolumns =()=>{
    this.columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
      },
      {
        width: 100,
        title: '价格',
        dataIndex: 'price',
        render: (price)=> `￥${price}`
      },
      {
        width: 100,
        title: '状态',
        dataIndex: 'status',
        render: (status) => {
          if (status === 1) {
            return (
              <div>
                <Button type = 'primary' size='small'> 下架 </Button>
                <span style={{display:'inline-block'}}> 在售 </span>
              </div>
            )
          }else if (status === 0) {
            return (
              <div>
                <Button type = 'primary'> 上架 </Button>
                <span> 已下架 </span>
              </div>
            )
          }
        }
      },
      {
        width: 100,
        title: '操作',
        render: () => {
          return (
            <div>
              <ButtonLink>详情</ButtonLink>
              <ButtonLink>修改</ButtonLink>
            </div>
          )
        }
      },
    ];
  }

  // 异步发送请求获取商品数据
  getProductData =async(pageNum)=>{
    // 发送请求
    const result = await reqGetProduct(pageNum, PAGE_SIZE)
    if (result.status === 0) {
      const products = result.data.list
      const {total} = result.data
      this.setState({
        products,
        total
      })
    }else{
      message.error('获取数据失败'+ result.msg)
    }
  }


  componentWillMount(){
    this.initcolumns()
  }

  componentDidMount(){
    this.getProductData(1)
  }

  render() {
    // 获取状态中的总页数
    const { total,products } = this.state

    // 定义card的header左侧
    const title = (
      <span>
        <Select value = '2' style={{ width:200 }} >
          <option value = "1" > 按名称搜素 </option> 
          <option value = "2" > 按描述搜素 </option> 
          </Select> 
          <Input type = 'text' placeholder = '关键字' style={{ width:200, margin:'0 10px' }} />
          <Button type='primary'>搜索</Button>
      </span>
    )
    // 定义card的header右侧
    const extra = (
      <Button type='primary'>
        <Icon type='plus' />
        添加商品
      </Button>
    )

    return (
        <Card title={title} extra={extra}>
          <Table 
            columns={ this.columns }
            dataSource={products}
            rowKey="_id"
            bordered
            pagination={{
              pageSize: PAGE_SIZE,
              total,
              /* onChange: (page) => {this.getProductData(page)} */
              onChange: this.getProductData
            }}
          />
        </Card>
    )
  }
}
