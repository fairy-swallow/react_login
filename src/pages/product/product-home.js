import React, { Component } from 'react'
import { Select, Input, Button, Icon, Card, Table, message } from "antd";

import ButtonLink from "./../../components/button-link/buttonLink";
import { reqGetProduct,reqUpDownShelf, reqSearchProduct } from './../../api'
import { PAGE_SIZE } from "./../../utils/constants";
import memoryUtil from './../../utils/memoryUtil'

export default class ProductHome extends Component {

  state = {
    products: [], // 当前页的product数组
    total: 0,     // product的页数量
    searchType: 'productName',  // 搜索方式默认按名称搜索
    searchContent: ''      // 搜索关键字
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
        // dataIndex: 'status',
        render: (product) => {
          let btnText = '下架'
          let spanText = '在售'
          if (product.status === 2) {
            btnText = '上架'
            spanText = '已下架'
          }
          return (
              <div>
                <Button type = 'primary' size='small' onClick={() => this.updateShelfState(product)}> {btnText} </Button>
                <span style={{display:'inline-block'}}> {spanText} </span>
              </div>
          )
        }
      },
      {
        width: 100,
        title: '操作',
        render: (product) => {
          return (
            <div>
              <ButtonLink onClick={()=>        //此回调函数不可传参，传参它实际上是event对象
                {
                  memoryUtil.product = product
                  // console.log(memoryUtil.product)
                  this.props.history.push(`/product/detail/${product._id}`)
                }
              }>详情</ButtonLink>
              <ButtonLink onClick={()=>
                {
                  memoryUtil.product = product
                  this.props.history.push('/product/addupdate')
                }
              }>修改</ButtonLink>
            </div>
          )
        }
      }
    ];
  }

  // 更新上下架信息
  updateShelfState = async (product) => {
    const productId = product._id
    const status = product.status === 1 ? 2 : 1
    const result = await reqUpDownShelf(productId, status)
    if (result.status === 0) {
      message.success('更新商品状态成功')
      this.getProductData(this.pageNum)
    }
  }

  // 异步发送请求获取商品数据
  getProductData = async(pageNum)=>{
    // 保存当前页码
    this.pageNum = pageNum
    const { searchType, searchContent } = this.state
    
    let result
      if (!searchContent) {
        // 发送请求--获取商品数据
        result = await reqGetProduct(pageNum, PAGE_SIZE)
      }else{
        // 发送请求--搜索商品获取商品数据显示页面
        result = await reqSearchProduct({ pageNum,pageSize:PAGE_SIZE,searchType,searchContent })
      } 
      if (result.status === 0) {
        this.setState({
          products: result.data.list,
          total: result.data.total
        })
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
    const { total, products, searchType, searchContent } = this.state

    // 定义card的header左侧
    const title = (
      <span>
        <Select value ={searchType} style={{ width:200 }} onChange={value=> this.setState({searchType:value})} >
          < option value = "productName" > 按名称搜素 </option> 
          < option value = "productDesc" > 按描述搜素 </option> 
          </Select> 
          <Input 
            // value={searchContent}   //写不写都行
            type = 'text'
            placeholder = '关键字' 
            style={{ width:200, margin:'0 10px' }} 
            onChange={(event)=> this.setState({ searchContent: event.target.value })}
          />
          <Button type='primary' onClick={()=> this.getProductData(1)} >搜索</Button>
      </span>
    )
    // 定义card的header右侧
    const extra = (
      <Button type='primary' onClick={()=>{
        memoryUtil.product = {}
        this.props.history.push('/product/addupdate')
      }}>
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
              showQuickJumper: true,
              /* onChange: (page) => {this.getProductData(page)} */
              onChange: this.getProductData
            }}
          />
        </Card>
    )
  }
}
