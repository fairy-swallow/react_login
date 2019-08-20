// 一个根据老的state和指定的action计算处理后返回一个新的state的函数模块

import { combineReducers } from "redux";

import { getUser } from './../utils/storageUtil'
import {
  SET_HEADER_TITLE,
  RECEIVE_USER,
  SHOW_MSG,
  RESET_LOGIN
} from "./action-types";

// 管理头部标题的reducer函数
const initTitle = '首页'
function headerTitle(state = initTitle, action) {
  switch (action.type) {
    case SET_HEADER_TITLE:
      return action.data
    default:
      return state;
  }
}

// 管理user数据的reducer函数
const inituser = getUser()    //获取用户数据保存到store中
function user(state = inituser, action) {
  switch (action.type) {
    case RECEIVE_USER:
      return action.data
    case SHOW_MSG:
      return {...state, msg: action.data}
      case RESET_LOGIN:
      return {msg:'请重新登陆'}
    default:
      return state
  }
}

export default combineReducers({
  headerTitle,
  user
})