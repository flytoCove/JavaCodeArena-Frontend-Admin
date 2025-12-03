import service from '@/utils/request'

//127.0.0.1:19090/system/sysUser/login
export function loginService(form) {
  return service({
    url:"/sysUser/login",
    method: "post",
    data: form
  })
}

export function getUserInfoService() {
  return service({
    url: "/sysUser/info",
    method: "get",
  });
}


export function logoutService() {
  return service({
    url: "/sysUser/logout",
    method: "delete",
  });
}