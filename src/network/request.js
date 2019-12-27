import axios from'axios'
export function request(config) {
  const instance = axios.create({
    baseURL: 'http://106.54.54.237:8000/api/w1',
    timeout: 5000
  })
  //请求拦截
  instance.interceptors.request.use(
    config => {
     // console.log(config)      //config是服务器发送过来的配置信息
     return config            //拦截过要返回不然请求不到
                               
    },err =>{}
  )
  //响应拦截
  instance.interceptors.response.use(
    res =>{
      return res.data
    },err =>{ }
  )

  return instance(
    config
  )
}
