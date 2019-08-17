import React from 'react'

import { Upload, Icon, Modal, message } from 'antd';
import { reqDelPicture } from './../../../api'
import { IMG_BASE_URL } from './../../../utils/constants'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends React.Component {
  state = {
    previewVisible: false,    //是否显示大图预览
    previewImage: '',   //大图预览图片的url
    fileList: [],      //所有已上传图片的列表
  };

  // 向父组件传递img的name数组---通过ref得到标签组件上的方法
  getPicNames = ()=>{
    return this.state.fileList.map(img => img.name)
  }

  // 隐藏大图预览
  handleCancel = () => this.setState({ previewVisible: false });

  // 大图预览
  handlePreview = async file => {
    // base64转换
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    // 更新状态显示大图
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  // 当进行文件上传/删除时, 文件状态发生改变时调用
  handleChange = async({ file, fileList }) => {
    console.log('file', file, file.status, file === fileList[fileList.length - 1])
    if (file.status === 'done') {
      const {name,url} = file.response.data   //响应数据的name，url是数据的真正name，url,不是base64编译出的
      file = fileList[fileList.length - 1]    //改变file的name和url并不是真正改变了，需改变fileList的name和url
      file.name = name
      file.url = url
    }else if (file.status === 'removed') {   //删除
      const result = await reqDelPicture(file.name)
      if (result.status === 0) {
        message.success('删除图片成功')
      }
    }
    // 更新状态显示
    this.setState({fileList})
  };

  componentWillMount(){
    const imgs = this.props.imgs
    if (imgs && imgs.length > 0) {
      /* 
      {
        uid: '-5',
        name: 'image.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      },
      */
      const fileList = imgs.map((img,index) =>({
        uid: -index,
        name: img,
        status: 'done',
        url: IMG_BASE_URL + img
      }))
      this.setState({
        fileList
      })
    }
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action = "/manage/img/upload"
          listType="picture-card"
          fileList={fileList}
          // 修改请求参数为image，默认为file
          name='image'
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {/* 表示最多可上传几张图片 */}
          {fileList.length >= 4 ? null : uploadButton}    
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}