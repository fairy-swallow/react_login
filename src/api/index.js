/*
请求ajax接口模块
 */
import ajax from './ajax'
import jsonp from "jsonp";
import { message } from 'antd'

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

// 对商品进行上架/下架处理(ajax)---post
export const reqUpDownShelf = (productId,status) => ajax.post('/manage/product/updateStatus',{productId,status})

// 根据Name/desc搜索产品分页列表
export const reqSearchProduct = ({pageNum, pageSize, searchType,searchContent }) => ajax.get('/manage/product/search',{
    params: {
        pageNum,
        pageSize,
        [searchType]: searchContent // 搜索的方式 'productDesc' 或者 'productName'
    }
})

// 根据商品ID获取商品(ajax)---get
export const reqProductInfo = (productId) => ajax.get('/manage/product/info',{
    params:{
        productId
    }
})

// 根据分类ID获取分类(ajax)---get
export const reqCategoryNameById = (categoryId) => ajax.get('/manage/category/info',{
    params:{
        categoryId
    }
})

// 添加商品(ajax)---post
export const reqAddProduct = ({
        categoryId,
        name,
        desc,
        price,
        detail,
        imgs
    }) => ajax.post('/manage/product/add', {
    categoryId,    //分类ID
    name,          //商品名称
    desc,          //商品描述
    price,         //商品价格
    detail,        //商品详情
    imgs           //商品图片名数组
})

// 更新商品(ajax)---post
export const reqUpdateProduct = ( {
    _id,
    categoryId,
    name,
    desc,
    price,
    detail,
    imgs
} ) => ajax.post('/manage/product/update',{
    _id,           //商品ID
    categoryId,    //分类ID
    name,          //商品名称
    desc,          //商品描述
    price,         //商品价格
    detail,        //商品详情
    imgs           //商品图片名数组
})

/* 
上传图片(在pictureWall中请求) -- - 
参数： image 图片文件 (name = 'image')
url地址  (action = "/manage/img/upload")
*/

// 删除图片(ajax)---post --- name 图片文件名
export const reqDelPicture = (name) => ajax.post('/manage/img/delete',{name})