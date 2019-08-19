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

// 更新商品(ajax)---post
// _id, //商品ID       ----更新商品有，添加没有，其他都一样
// categoryId, //分类ID
// name, //商品名称
// desc, //商品描述
// price, //商品价格
// detail, //商品详情
// imgs //商品图片名数组
// export const reqUpdateProduct = ( product ) => ajax.post('/manage/product/update',{product})
// 添加商品(ajax)---post
// export const reqAddProduct = (product) => ajax.post('/manage/product/add', {product})
// 添加或更新商品请求---合为一个请求
export const reqAddUpdateProduct = (product) => ajax.post(
    '/manage/product/' + (product._id ? 'update' : 'add'), 
    product
)

/* 
上传图片(在pictureWall中请求) -- - 
参数： image 图片文件 (name = 'image')
url地址  (action = "/manage/img/upload")
*/

// 删除图片(ajax)---post --- name 图片文件名
export const reqDelPicture = (name) => ajax.post('/manage/img/delete',{name})

// 获取角色列表(ajax)---get
export const reqgetRole = () => ajax.get('/manage/role/list')

// 添加角色(ajax)---post
export const reqAddRole = (roleName) => ajax.post('/manage/role/add',{roleName})

// 更新角色(ajax)---post---参数role是个含(_id,menus,auth_name,auth_time)的对象
export const reqUpdateRole = (role) => ajax.post('/manage/role/update',role)

// 获取所有用户列表(ajax)---get
export const reqAllUsers = () => ajax('/manage/user/list')

// 添加或更新用户(ajax)---post---参数user是个对象
export const reqAddOrUpdateUser = (user) => ajax.post('/manage/user/' + (user._id ? 'update' : 'add'), user)

// 删除用户(ajax)---post---参数userId表示用户id
export const reqRemoveUser = (userId) => ajax.post('/manage/user/delete',{userId})