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

// 获取分类列表(ajax)--get
// export const reqCategoryList = () => ajax.get('/manage/category/list')    //法一
/* export const reqCategoryList = () => ajax({   //法二
    url: '/manage/category/list',
    method: 'GET'
}) */
export const reqCategoryList = () => ajax('/manage/category/list')    //法三

// 添加分类(ajax)---post
export const reqAddCategory = (categoryName) => ajax.post('/manage/category/add',{categoryName})

// 修改分类(ajax)---post
export const reqUpdateCategory = (categoryId,categoryName) => ajax.post('/manage/category/update',{categoryId,categoryName})

// 获取商品分页列表(ajax)---get
export const reqGetProduct = (pageNum, pageSize) => ajax('/manage/product/list',{
    params:{
       pageNum,
       pageSize
    }
})