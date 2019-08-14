/*
请求ajax接口模块
 */
import ajax from './ajax'
import jsonp from "jsonp";
import { message } from 'antd'
import { reject } from 'q';

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

// 获取天气信息(jsonp)
export const reqWeather = (city) =>{
    const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
    return new Promise((resolve, reject) => {    // 执行器函数
        jsonp(url,{},(err,data)=>{
            if (!err && data.error === 0) {
                const {dayPictureUrl, weather} = data.results[0].weather_data[0]
                resolve({dayPictureUrl, weather})
            }else {
                message.error('获取天气信息失败!')
            }
        })
    })
}