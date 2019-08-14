import { getUser } from "./storageUtil";

// const user = JSON.parse(localStorage.getItem('user_key') || '{}')
const user = getUser()
export default {
    // 从local读取user, 保存在内存中
    user
}