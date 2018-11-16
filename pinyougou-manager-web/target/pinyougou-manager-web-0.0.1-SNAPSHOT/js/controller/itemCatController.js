 //控制层 
app.controller('itemCatController' ,function($scope,$controller   ,itemCatService,typeTemplateService){	
	
	$controller('baseController',{$scope:$scope});//继承
	
    //读取列表数据绑定到表单中  
	$scope.findAll=function(){
		itemCatService.findAll().success(
			function(response){
				$scope.list=response;
			}			
		);
	}    
	
	//分页
	$scope.findPage=function(page,rows){			
		itemCatService.findPage(page,rows).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}
	
	//查询实体 
	$scope.findOne=function(id){				
		itemCatService.findOne(id).success(
			function(response){
				$scope.entity= response;					
			}
		);				
	}
	
	//保存 
	$scope.save=function(){		
		var serviceObject;//服务层对象  				
		if($scope.entity.id!=null){//如果有ID
			serviceObject=itemCatService.update( $scope.entity ); //修改  
		}else{
			
			//根据查询所在的级别进行增加
			$scope.entity.parentId = $scope.parentId;    //赋予上级的ID
			
			serviceObject=itemCatService.add( $scope.entity  );//增加 
		}				
		serviceObject.success(
			function(response){
				if(response.success){
					//重新查询 
		        	//$scope.reloadList();//重新加载
		        	$scope.findByParentId($scope.parentId);    //添加之后回到添加的所在级别，让用户看到是否添加成功
				}else{
					
					alert(response.message);
				}
			}		
		);				
	}
	
	 
	//批量删除 
	$scope.dele=function(){			
		//获取选中的复选框			
		itemCatService.dele( $scope.selectIds ).success(
			function(response){
				if(response.success){
					$scope.reloadList();//刷新列表
					$scope.selectIds=[];
				}						
			}		
		);				
	}
	
	$scope.searchEntity={};//定义搜索对象 
	
	//搜索
	$scope.search=function(page,rows){			
		itemCatService.search(page,rows,$scope.searchEntity).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}
	//根据父ID查询下级
    $scope.findByParentId=function(parentId){
    	itemCatService.findByParentId(parentId).success(function(response){
    		$scope.parentId = parentId;    //每次查询都会记录上一级的Id
    		$scope.list = response;
    	})
    }
    //设置默认级别为1
    $scope.grande = 1;
    //设置级别  ，每次点击查询下级的时候，调用设置级别的方法，然后在对级别进行判断，显示级别名称
    $scope.setGrade=function(value){
    	$scope.grade = value;
    }
    //读取级别列表
    $scope.selectList = function(p_entity){
    	if($scope.grade == 1){  //级别为1的时候
    		$scope.entity_1 = null;
    		$scope.entity_2 = null;
    	}   
    	if($scope.grade == 2){
    		$scope.entity_1 = p_entity;
    		$scope.entity_2 = null;
    	}
    	if($scope.grade == 3){
    		$scope.entity_2 = p_entity;
    	}
    	$scope.findByParentId(p_entity.id);   //查询此级的下级	
    }
    
	$scope.typeList = {data:[]};
    //类型模板下拉列表
    $scope.selectOptionList = function(){
    	typeTemplateService.selectOptionList().success(function(response){
    		//alert(JSON.parse(response));
    		$scope.typeList = {data:response};
    	}) 
    }
    
});	
