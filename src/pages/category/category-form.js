import React, { Component } from 'react'
import { Form, Input } from 'antd';
import PropTypes from "prop-types";

const Item = Form.Item

class CategoryForm extends Component {

  static propTypes = {
    categoryName: PropTypes.string,
    setForm: PropTypes.func.isRequired
  }

  componentWillMount(){
    this.props.setForm(this.props.form)   // 将form交给父组件(Category)
  }

  render() {
    const {getFieldDecorator} = this.props.form
    const { categoryName } = this.props
    // console.log(categoryName)

    return (
      <Form>
        <Item> 
          {
            getFieldDecorator('categoryName', {
              initialValue: categoryName || '',
              rules: [ { required: true,message: '分类名称是必须' } ],
            })( 
                < Input type='text' placeholder = "分类名称" />
            )
          } 
        </Item>
     </Form>
    )
  }
}

export default Form.create()(CategoryForm)