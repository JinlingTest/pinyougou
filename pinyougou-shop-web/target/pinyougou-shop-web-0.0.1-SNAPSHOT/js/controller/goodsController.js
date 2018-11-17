 //控制层 
app.controller('goodsController' ,function($scope,$controller   ,goodsService,uploadService, itemCatService,typeTemplateService){	
	
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
		goodsService.findOne(id).success(
			function(response){
				$scope.entity= response;					
			}
		);				
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
	
	//商品添加
	$scope.add = function(){
		//获取富文本编辑器中的内容
		$scope.entity.goodsDesc.introduction = editor.html();
		
		goodsService.add($scope.entity ).success(function(response){
			if(response.success){
				alert("保存成功");
				$scope.entity={};
				editor.html('');    //清空富文本框
			}else{
				alert(respinse.message);
			}
		})
		
	};
	//点击上传按钮  将图片上传到服务器上面
	$scope.uploadFile=function(){
		uploadService.uploadFile().success(function(response){
			if(response.success){
				$scope.image_entity.url = response.message;
			}else{
				alert(response.message);
			}
		})
	};
	
	$scope.entity={goods:{},goodsDesc:{itemImages:[]}};   //定义页面实体结构
	//添加图片列表
	$scope.add_image_entity = function(){
		$scope.entity.goodsDesc.itemImages.push($scope.image_entity);
	}
	//删除图片的列表
	$scope.remove_image_entity=function(index){
		$scope.entity.goodsDesc.itemImages.splice(index,1);
	}
	
	//显示一级下拉列表
	$scope.selectItemCat1List=function(){
		//参数为0，一级下拉列表
		itemCatService.findByParentId(0).success(function(response){
			$scope.itemCat1List = response;
		})
	}
	
	//显示二级下拉列表，分类展示
	$scope.$watch('entity.goods.category1Id',function(newValue,oldValue){
		//根据改变的新的值（id）去查询
		itemCatService.findByParentId(newValue).success(function(response){
			$scope.itemCat2List = response;
		})
	})
	
	//显示三级下拉列表，分类展示
	$scope.$watch('entity.goods.category2Id',function(newValue,oldValue){
		//根据改变的新的值（id）去查询
		itemCatService.findByParentId(newValue).success(function(response){
			$scope.itemCat3List = response;
		})
	})
	
	//显示三级下拉列表，分类展示
	$scope.$watch('entity.goods.category3Id',function(newValue,oldValue){
		//根据改变的新的值（id）去查询
		itemCatService.findOne(newValue).success(function(response){
			$scope.entity.goods.typeTemplateId = response.typeId;
		})
	})
	
	//当模板的ID更新之后就改变品牌的列表
	$scope.$watch('entity.goods.typeTemplateId',function(newValue,oldValues){
		//当模板id更新之后，根据模板的Id去类型模板表中去查询（模板表包含类别与品牌，衣蛾类别对多品牌）
		typeTemplateService.findOne(newValue).success(function(response){
			$scope.typeTemplate = response;   //获取类型模板
			$scope.typeTemplate.brandIds = JSON.parse($scope.typeTemplate.brandIds);
			//获取扩展属性   goodesc是属于entity下面的组合实体类中一个实体
			$scope.entity.goodsDesc.customAttributeItems = 
				JSON.parse($scope.typeTemplate.customAttributeItems);
		})
		
	})

});	
