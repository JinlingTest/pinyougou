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
	
	$scope.entity = {goodsDesc:{itemImages:[],specificationItems:[]}};
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
	
	//模板ID
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
			
		});
		//当模板的ID变化之后，查询此模板下面的额规格选项
		typeTemplateService.findSpecList(newValue).success(function(response){
			$scope.specList = response;
		});
		
	})
	
	
	/*
	 	[	
	 		{"attributeName":"网络","attributeValue":["移动3G","移动4G"]},
	  		{"attributeName":"机身内存","attributeValue":["16G","32G"]}
		]
	 */
	
	//定义规格集合
	//$scope.entity = {goodsDesc:{itemImages:[],specificationItems:[]}};
	//name表示的是页面传递过来的 网络,机身内存这种值，value指的是 移动3G,4G这种值
	$scope.updateSpecAttribute = function($event,name,value){

		//调用baseController中的方法，判断集合是否为空
		var object = $scope.searchObjectByKey($scope.entity.goodsDesc.specificationItems,
					'attributeName',name);
		if(object != null){
			
			if($event.target.checked){   //点击勾选上
				//往匹配上的对象中添加值  attributeValue
				object.attributeValue.push(value);
			}else{    //点击取消勾选
				object.attributeValue.splice( object.attributeValue.indexOf(value) , 1 );   //移除
				if(object.attributeValue == 0){   //如果全部移除
					$scope.entity.goodsDesc.specificationItems.splice(
							$scope.entity.goodsDesc.specificationItems.indexOf(object , 1));   //从组合实体类中的specificationItems集合中移除此空集合
				}
			}
		}else{     //当对象为空的时候    ,直接push到集合中一个空的对象，然后再向里面添加页面传递过来的name与value
			$scope.entity.goodsDesc.specificationItems.push({"attributeName":name,"attributeValue":[value]});
		}
	}
	
/*	//创建SKU列表
	$scope.createItemList=function(){
		//列表的初始化,spec中存放的就是表头    {"网络":"移动3G","机身内存":"16G"}页面展示的时候分别填入
		$scope.entity.itemList=[{spec:{},price:0,num:99999,status:'0',isDefault:'0'} ];	
		//获取到选项的集合
		var items = $scope.entity.goodsDesc.specificationItems;
		//对选项的集合进行遍历
		for(var i = 0 ; i < items.length ; i++){
			
			//添加列
			$scope.entity.itemList = function(items[i]){
				//获取新的列的名称，也就是属性名称
				var attributeName = items[i].attributeName;
				//获取属性对应下面的集合
				var attributeValues = items[i].attributeValues;
				var itemList = $scope.entity.itemList;
				var newList = [];
				for(var j = 0; j < itemList.length ; j++){
					var oldRow = itemList[j];
					//对所有的属性进行遍历
					for(var j = 0 ; j < attributeValues.length ; j++){
						var newRow = JSON.parse(JSON.stringify(oldRow));   //深度克隆
						newRow.spec[attributeName] = attributeValues[j];
						alert(newRow);
						newList.push(newRow);
					}
				}
				return newList;
				
			}
			
		}
		
	}*/


	//创建SKU列表
	$scope.createItemList=function(){
		
		$scope.entity.itemList=[{spec:{},price:0,num:99999,status:'0',isDefault:'0'} ];//列表初始化
		
		var items= $scope.entity.goodsDesc.specificationItems;
		
		for(var i=0;i<items.length;i++){
			$scope.entity.itemList= addColumn( $scope.entity.itemList, items[i].attributeName,items[i].attributeValue );			
		}	
		
	}
	
	//list代表的是一行    columnName表示的是当前遍历对象中的属性名称   
	//columnValues表示的是当前遍历对象中的属性对应的值
	addColumn=function(list,columnName,columnValues){
		
		var newList=[];		
		for(var i=0;i< list.length;i++){
			var oldRow =  list[i];			
			//对所有的属性进行遍历   （4G,5G,3G）
			for(var j = 0;j < columnValues.length ; j++){
				var newRow =  JSON.parse( JSON.stringify(oldRow)  );//深克隆
				newRow.spec[columnName]=columnValues[j];   //在将克隆后的基础对象中的spec值加上去
				newList.push(newRow);
			}			
		}		
		return newList;
	}



});	
