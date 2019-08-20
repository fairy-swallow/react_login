/* 
包含n个用于创建action的工厂函数(action creator)
同步action: 是一个对象, {type: xxx, data: 数据}
异步action: 是一个函数, dispatch => {1. 发异步ajax请求, 2. 根据结果分发同步action}
*/

import {
  SET_HEADER_TITLE,
  RECEIVE_USER,
  SHOW_MSG,
  RESET_LOGIN
} from "./action-types";

import { reqLogin } from './../api'
import { saveUser, removeUser } from "./../utils/storageUtil";

// 设置头部标题的同步action
export const setHeaderTitle = (headerTitle) => ({type: SET_HEADER_TITLE,data: headerTitle})

// 登陆成功的同步action(收集数据)
const receiveUser = (user) => ({type: RECEIVE_USER,data:user})

// 登录失败的同步action(展示错误)
const showMsg = (msg) =>({type: SHOW_MSG,data: msg})

// 登陆的异步action
export function login(username,password) {
  return async dispatch =>{
    const result = await reqLogin(username,password)
    if (result.status === 0) {
      const user = result.data
      saveUser(user)
      dispatch(receiveUser(user))
    }else{
      const msg = result.msg
      dispatch(showMsg(msg))
    }
  }
}

// 退出登陆的同步action
export const resetLogin = ()=>{
  // 删除local中的user数据
  removeUser()
  return (
    { type: RESET_LOGIN }
  )
}