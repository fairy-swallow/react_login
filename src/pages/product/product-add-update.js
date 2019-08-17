import React, { Component } from 'react'
import { Card, Icon, Form, Input, Select, Button } from "antd";

import ButtonLink from './../../components/button-link/buttonLink'
import { reqProductInfo, reqCategoryList } from "./../../api";
import memoryUtil from './../../utils/memoryUtil'
import PicturesWall from './picture-wall'


const Item = Form.Item
const Option = Select.Option

class ProductAddUpdate extends Component {

  state = {
    product: {},
    categorysArr: []
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
    this.props.form.validateFields((error, values)=>{
      if (!error) {
        const {name,desc,price,categoryName} = values
        console.log(name, desc, price, categoryName)
      }
    })

    // 得到所有上传图片文件名的数组
    const imgs = this.refs.getPicNames()   //getPicNames是pictureWall上的方法，通过refs获取
    console.log('imgs',imgs)
  }

  componentWillMount(){
    const product = memoryUtil.product
    // this.productId = product._id
    this.setState({
      product
    })
  }

  async componentDidMount(){
    const result = await reqCategoryList()
    if (result.status === 0) {
      this.setState({
        categorysArr: result.data
      })
    }
  }

  render() {

    const {getFieldDecorator} = this.props.form
    const { product, categorysArr } =this.state

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
              getFieldDecorator('categoryName', {
                initialValue: '',
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
            <PicturesWall ref='getPicNames' imgs={product.imgs} />
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