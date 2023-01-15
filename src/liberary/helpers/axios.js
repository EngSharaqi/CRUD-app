import axios from 'axios'

export const URL = 'https://api-ecommerce.snapysell.com'

const instance = axios.create({
    baseURL: `${URL}/api`,
    headers: localStorage.getItem("token")?{
        "content-type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`
    }: {}
})

export default instance