import React, { Component } from 'react'
import { Card, Icon, Form, Input, Select, Button, message } from "antd";

import ButtonLink from './../../components/button-link/buttonLink'
import { reqAddUpdateProduct, reqCategoryList, reqCategoryNameById } from "./../../api";
import memoryUtil from './../../utils/memoryUtil'
import PicturesWall from './picture-wall'
import RichTextEditor from './rich-text-editor'


const Item = Form.Item
const Option = Select.Option

class ProductAddUpdate extends Component {

  state = {
    product: {},
    categorysArr: [],
    categoryType:''
  }

  // 获取表单列表(发送请求)
  getCategoryList = async () =>{
    const result = await reqCategoryList()
    if (result.status === 0) {
      this.setState({
        categorysArr: result.data
      })
    }
  }
  
  // 根据分类id获取分类
  getCategoryType = async () =>{
    // console.log(this.state.product.categoryId)
    if (this.state.product._id) {
      const result = await reqCategoryNameById(this.state.product.categoryId)
      if (result.status === 0) {
        this.setState({
          categoryType: result.data.name
        })
        // console.log(result.data.name)
      }
    }

  }

  // 自定义校验价格表单
  validatePrice = (rule, value, callback) => {
    if (value < 0) {
      callback('价格不能小于0')
    }else{
      callback()
    }
  }

  // 提交表单数据响应回调
  handleSubmit = (event) => {
    event.preventDefault()
    this.props.form.validateFields(async (error, values) => {
      if (!error) {
        const {name,desc,price,categoryId} = values
        // console.log(name, desc, price, categoryId)
        // 得到所有上传图片文件名的数组
        const imgs = this.refs.refPic.getPicNames() //getPicNames是PicturesWall上的方法，通过refs获取
        // console.log('imgs',imgs)
        // 得到所有富文本内容
        const detail = this.refs.refText.getDetail() //getDetail是RichTextEditor上的方法，通过refs获取
        // console.log('detail', detail)
        // 发送添加商品/修改商品请求
        const product = { name, desc, price, categoryId, imgs, detail }
        if (this.state.product._id) {
          product._id = this.state.product._id
        }
        const result = await reqAddUpdateProduct(product)
        if (result.status === 0) {
          // console.log(product)
          message.success('数据操作成功')
          this.props.history.replace('/product')
        } else {
          // console.log(product)
          message.error('数据操作失败')
        }
      }
    })
  }

  componentWillMount(){
    const product = memoryUtil.product
    // this.productId = product._id
    this.setState({
      product
    })
  }

  async componentDidMount(){
    
    this.getCategoryList()
    this.getCategoryType()
  }

  render() {

    const {getFieldDecorator} = this.props.form
    const { product, categorysArr, categoryType } =this.state

    // console.log(product, categorysArr)
    const title = (
      <div>
        <ButtonLink onClick={()=> this.props.history.goBack()}><Icon type='arrow-left' /></ButtonLink>
        <span>
          {
            product._id ? '修改商品' : '添加商品'
          }
        </span>
      </div>
    )

    const formItemLayout = {
      labelCol : {span: 2},
      wrapperCol : {span: 8}
    }

    return (
      <Card title={title}>
        <Form {...formItemLayout} onSubmit={this.handleSubmit} >
          <Item label = "商品名称" >
            {
              getFieldDecorator('name', {
                initialValue: product.name || '',
                rules:[
                  {required: true, message: '商品名称必须输入'}
                ]
              })(
                <Input type='text' placeholder='商品名称' />
              )
            }
          </Item>
          <Item label = "商品描述" >
            {
              getFieldDecorator('desc', {
                initialValue: product.desc || '',
                rules:[
                  {required: true, message: '商品描述必须输入'}
                ]
              })(
                <Input type='text' placeholder='商品描述' />
              )
            }
          </Item>
          <Item label = "商品价格" >
            {
              getFieldDecorator('price', {
                initialValue: product.price || '',
                rules:[
                  {required: true, message: '商品价格必须输入'},
                  {validator: this.validatePrice}    //自定义校验
                ]
              })(
                <Input addonAfter='元' type='number' placeholder='商品价格' />
              )
            }
          </Item>
          <Item label = "商品分类" >
            {
              getFieldDecorator('categoryId', {
                initialValue: categoryType || '',
                rules:[
                  {required: true, message: '商品分类必须输入'}
                ]
              })(
                <Select>
                  <Option value="">未选择</Option>
                  {
                    categorysArr.map( category => 
                      <Option value={category._id} key={category._id}>{category.name}</Option>
                    )
                  }
                </Select>
              )
            }
          </Item>
          <Item label="商品图片" wrapperCol={{ span: 15}}>
            <PicturesWall ref='refPic' imgs={product.imgs} />
          </Item>
          <Item label="商品详情" wrapperCol={{ span: 20}}>
            <RichTextEditor ref='refText' detail={product.detail} ></RichTextEditor>
          </Item>
          <Item>
            <Button type="primary" htmlType="submit" >提交</Button>
          </Item>
        </Form>
      </Card>
    )
  }
}

export default Form.create()(ProductAddUpdate)