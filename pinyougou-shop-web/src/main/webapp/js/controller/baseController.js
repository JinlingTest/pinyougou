 //品牌控制层 
app.controller('baseController' ,function($scope){	
	
    //重新加载列表 数据
    $scope.reloadList=function(){
    	//切换页码  
    	$scope.search( $scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage);	   	
    }
    
	//分页控件配置 
	$scope.paginationConf = {
         currentPage: 1,
         totalItems: 10,
         itemsPerPage: 10,
         perPageOptions: [10, 20, 30, 40, 50],
         onChange: function(){
        	 $scope.reloadList();//重新加载
     	 }
	}; 
	
	$scope.selectIds=[];//选中的ID集合 

	//更新复选
	$scope.updateSelection = function($event, id) {		
		if($event.target.checked){//如果是被选中,则增加到数组
			$scope.selectIds.push( id);			
		}else{
			var idx = $scope.selectIds.indexOf(id);
            $scope.selectIds.splice(idx, 1);//删除 
		}
	}
	
	
	$scope.jsonToString=function(jsonString,key){
		
		var json= JSON.parse(jsonString);
		var value="";
		
		for(var i=0;i<json.length;i++){
			if(i>0){
				value+=",";
			}			
			value +=json[i][key];			
		}
				
		return value;
	}
	
	/*
	 	[	
	 		{"attributeName":"网络","attributeValue":["移动3G","移动4G"]},
	  		{"attributeName":"机身内存","attributeValue":["16G","32G"]}
		]
	 */
	//根据key的值去集合中查询   此处的key就是“attributeName”  keyValue就是相当于页面传递过来的值(网络)
	$scope.searchObjectByKey = function(list , key , keyValue){
		//对集合进行遍历
		for(var i = 0 ; i < list.length ; i++){

			//list[1][attributeName]  -->上面集合中的第一个对象中的第一个attributeName属性值
			if(list[i][key] == keyValue){    
				//相当于{"attributeName":"网络","attributeValue":["移动3G","移动4G"]}
				return list[i];      
			}
		}
		return null;      //当没有的时候代表的就是此对象中没有包含这个属性则返回一个空的对象
	}
});	