
app.controller("loginController",function($scope,loginService){
		$scope.showLoginName=function(){
			loginService.getUsername().success(function(response){
				$scope.userName = response;    //此处的response就是一个字符串类型的登录名
			})
		}
	}
)