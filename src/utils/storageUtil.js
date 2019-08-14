/*
数据保存与获取方法工具函数模块
*/

import store from "store";

const USER_KEY = 'user_key'

// 保存用户数据到local中
// export const saveUser = (user) => localStorage.setItem(USER_KEY, JSON.stringify(user))
export const saveUser = (user) => store.set(USER_KEY, user)

// 获取用户数据
// export const getUser = () =>JSON.parse(localStorage.getItem('user_key') || '{}')
export const getUser = () =>store.get(USER_KEY) || {}

// 删除local中的用户数据
export const removeUser = () => store.remove(USER_KEY)
