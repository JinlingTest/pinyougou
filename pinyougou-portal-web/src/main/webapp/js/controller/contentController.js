app.controller("contentController",function($scope,contentService){
	
	//定义一个广告的集合
	$scope.contentList = []; 
	$scope.findByCategoryId = function(categoryId){
		
		contentService.findByCategoryId(categoryId).success(function(response){
			
			//将查询的广告种类作为数组的下标
			$scope.contentList[categoryId] = response;
		})
		
	}
	
})