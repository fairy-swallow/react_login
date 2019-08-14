/*
ajax请求模块
*/

import axios from 'axios'
// 将post请求的data对象数据转换为urlencode格式的字符串数据
import qs from 'qs'
import {message} from 'antd'

// 使用请求拦截器
axios.interceptors.request.use(config => {
    if(config.method.toUpperCase() === 'POST' && config.data instanceof Object){
        // 将post请求的data对象数据转换为urlencode格式的字符串数据
        config.data = qs.stringify(config.data)
    }
    return config
  });

// 使用响应拦截器
axios.interceptors.response.use(
    response =>{
        return response.data
    },
    error =>{
        // alert(' 请求失败',error)
        message.error('请求失败'+error.message)
        // 返回一个初始化promise对象，终止promise链
        return new Promise(()=>{})
    }    
)

export default axios