app.service("loginService",function($http){
	
	//读取登录人名称
	this.getUsername=function(){
		return $http.get("../login/getUsername.do");
	}
})