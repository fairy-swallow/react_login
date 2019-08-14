/*
数据保存与获取方法工具函数模块
*/

// 保存用户数据到local中
export const saveUser =(user)=> localStorage.setItem('user_key',JSON.stringify(user))

// 获取用户数据
export const getUser = () =>JSON.parse(localStorage.getItem('user_key') || '{}')