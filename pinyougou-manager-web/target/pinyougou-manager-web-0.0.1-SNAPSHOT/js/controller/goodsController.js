 //控制层 
app.controller('goodsController' ,function($scope,$controller,$location,goodsService,itemCatService){	
	
	$controller('baseController',{$scope:$scope});//继承
	
    //读取列表数据绑定到表单中  
	$scope.findAll=function(){
		goodsService.findAll().success(
			function(response){
				$scope.list=response;
			}			
		);
	}    
	
	//分页
	$scope.findPage=function(page,rows){			
		goodsService.findPage(page,rows).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}
	
	//查询实体 
	$scope.findOne=function(id){	
		var id = $location.search()['id'];
		alert(id);
		
		//当id为空的时候咱们就不需要去查询，当接受到id之后那么就查询
		if(id == null){
			return ;
		}
		goodsService.findOne(id).success(
			function(response){
				$scope.entity= response;		
				//向富文本编辑器添加商品介绍
				editor.html($scope.entity.goodsDesc.introduction);
				
				//显示图片的；列表
				$scope.entity.goodsDesc.itemImages = JSON.parse($scope.entity.goodsDesc.itemImages);
				
				//显示商品的扩展信息
				$scope.entity.goodsDesc.customAttributeItems = JSON.parse($scope.entity.goodsDesc.customAttributeItems );
				//回显规格
				
				$scope.entity.goodsDesc.specificationItems = JSON.parse($scope.entity.goodsDesc.specificationItems);
				
				//SKU列表规格列表
				for(var  i = 0 ; i < $scope.entity.itemList.length ; i++){
					$scope.entity.itemList[i].spec =
						JSON.parse( $scope.entity.itemList[i].spec);
				}
			}
		);			
	}
	
	//判断被遍历到的复选框是否被勾选    从页面传递过来的是    (opjo.text  选项规格的名称 ， option.optionName 此时的选项)
	$scope.checkAttrbuteValue = function(specName,value){
		//获取上面findOne方法中根据id查询到的规格选项
		var items= $scope.entity.goodsDesc.specificationItems;
		var object= $scope.searchObjectByKey(items,'attributeName',specName);
		//去判断当前传递过来的此选项与选项规格有没有在查询到的specificationItems集合中	
		//alert(JSON.stringify(object.attributeValue));
		if(object == null){
			return false;
		}else{
			
			/*for(var i = 0 ; i < items.length ; i++){
				if(items[i].attributeValue == value){
					
					for(var j = 0 ; j < items[i].length ; j++){
						if()
					}
					
					alert(11);
					return true;
				}else{
					alert(22 + "--" + items[i].attributeValue + "," + value);
					return false;
				}
			}
			*/
			if(object.attributeValue.indexOf(value)>=0){
					
				return true;
			}else{
				return false;
			}
		}
		
	}
	
	//保存 
	$scope.save=function(){				
		var serviceObject;//服务层对象  				
		if($scope.entity.id!=null){//如果有ID
			serviceObject=goodsService.update( $scope.entity ); //修改  
		}else{
			serviceObject=goodsService.add( $scope.entity  );//增加 
		}				
		serviceObject.success(
			function(response){
				if(response.success){
					//重新查询 
		        	$scope.reloadList();//重新加载
				}else{
					alert(response.message);
				}
			}		
		);				
	}
	
	 
	//批量删除 
	$scope.dele=function(){			
		//获取选中的复选框			
		goodsService.dele( $scope.selectIds ).success(
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
		goodsService.search(page,rows,$scope.searchEntity).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}
    
	
	$scope.status=['未审核','已审核','审核未通过','已关闭'];
	
	$scope.itemCatList=[];//商品分类列表
	//查询商品分类列表
	$scope.findItemCatList=function(){
		itemCatService.findAll().success(
			function(response){
				for(var i=0;i<response.length;i++){
					$scope.itemCatList[response[i].id]=response[i].name;
				}
			}
		);
		
	}
	
	//更新状态
	$scope.updateStatus=function(status){
		goodsService.updateStatus( $scope.selectIds ,status).success(
			function(response){
				if(response.success){
					$scope.reloadList();//刷新页面
					$scope.selectIds=[];
				}else{
					alert(response.message);
				}				
			}
		);		
	}
	
});	
