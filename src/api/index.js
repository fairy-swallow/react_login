/*
请求ajax接口模块
 */
import ajax from './ajax'

// const BASE = 'http://localhost:5000'
const BASE = ''
// 登陆请求
 export const reqLogin = ({username,password})=> ajax.post(BASE+'/login',{username,password})

// 添加用户请求
export const reqAddUser = (user)=> ajax({
    url: BASE+'/manage/user/add',
    data: user,
    method: 'POST'
})