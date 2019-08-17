import React, { Component } from 'react'
import { Card, List, Icon } from "antd";

import { IMG_BASE_URL } from "./../../utils/constants";
import memoryUtil from './../../utils/memoryUtil'
import { reqProductInfo, reqCategoryNameById } from "./../../api";
import ButtonLink from './../../components/button-link/buttonLink'
import "./product-detail.less";



const Item = List.Item

export default class ProductDetail extends Component {

  state = {
    product:{},
    categoryName:''
  }

  getCategoryName = async(categoryId) => {
    const result = await reqCategoryNameById(categoryId)
    if (result.status === 0) {
      this.setState({
        categoryName:result.data.name
      })
    }
  }

  componentWillMount() {
    const product = memoryUtil.product
    if (product._id) {
      this.setState({
        product
      })
    }
  }

  async componentDidMount() {
    let {product} = this.state
    const productId = this.props.match.params.id
    if (!product._id) {
      const result = await reqProductInfo(productId)
      if (result.status === 0) {
        product = result.data
        this.setState({
          product
        })
        this.getCategoryName(product.categoryId)
      }
    }else{
      this.getCategoryName(product.categoryId)
    }
  }

  render() {

    const { product, categoryName } = this.state

    const title = (
      <div>
        <ButtonLink onClick={()=> this.props.history.goBack()}><Icon type='arrow-left' /></ButtonLink>
        <span>商品详情</span>
      </div>
    )

    return (
      <Card title={title} className='product-datail'>
        <List>
          <Item>
            <span className='product-datail-left'>商品名称：</span>
            <span>{ product.name }</span>
          </Item>
          <Item>
            <span className='product-datail-left'>商品描述：</span>
            <span>{ product.desc }</span>
          </Item>
          <Item>
            <span className='product-datail-left'>商品价格：</span>
            <span>{ product.price }</span>
          </Item>
          <Item>
            <span className='product-datail-left'>所属分类：</span>
            <span>{ categoryName }</span>
          </Item>
          <Item>
            <span className='product-datail-left'>商品图片：</span>
            <span>
              {
                //product.imgs防止报错，不满足则不会走到后面的map方法上，因为product.imgs有可能得不到是product.imgsundefined
                product.imgs && product.imgs.map(img => (
                  <img className="product-detail-img" key={img} src={IMG_BASE_URL + img} alt="img"/>
                ))
              }
            </span>
          </Item>
          <Item>
            <span className='product-datail-left'>商品详情：</span>
            <span dangerouslySetInnerHTML={{ __html: product.detail }}  >
              {/* dangerouslySetInnerHTML可以实时转换 <textarea>(标签) 里的内容(与原生中的innerHTML一样，react提供的方法)，
                  里面必须是个有__html属性的对象 */}
              {/* memoryUtil.product.detail---表示要显示的标签内容，__html---必须写的 */}
            </span>
          </Item>
        </List>
      </Card>
    )
  }
}
