 //控制层 
app.controller('goodsController' ,function($scope,$controller,$location ,goodsService,uploadService, itemCatService,typeTemplateService){
	
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
	//保存 
	$scope.save=function(){	
		$scope.entity.goodsDesc.introduction=editor.html();
		
		var serviceObject;//服务层对象  				
		if($scope.entity.goods.id!=null){//如果有ID
			serviceObject=goodsService.update( $scope.entity ); //修改  
		}else{
			serviceObject=goodsService.add( $scope.entity  );//增加 
		}				
		serviceObject.success(
			function(response){
				if(response.success){
					alert("保存成功");
					location.href='goods.html';
					
				}else{
					alert(response.message);
				}
			}		
		);				
	}
	
	
	 
	//批量删除 
	$scope.dele=function(){
		if($scope.selectIds.length == 0){
			alert("您尚未选择!")
		}else{
			if(confirm("您确定您要执行删除操作么?")){
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
		}
			
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

//	$scope.status=['未审核','已审核','审核未通过','关闭'];//商品状态
	
	
	
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
			if($location.search()['id'] == null){
				$scope.entity.goodsDesc.customAttributeItems = 
					JSON.parse($scope.typeTemplate.customAttributeItems);
				//$scope.typeTemplate.specIds = JSON.parse($scope.typeTemplate.specIds);
			}
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

	//创建SKU列表
	$scope.createItemList=function(){
		
		//创建商品列表   
		$scope.entity.itemList = [{spec:{},price:0,num:99999,status:'0',isDefault:'0'}];
		//获取模板类别表中 (获取到的是一个规格选项集合)
		var items = $scope.entity.goodsDesc.specificationItems;

		//规格的种类决定外层循环  (4G,3G)
		for(var i = 0 ; i < items.length ; i++){
			
			$scope.entity.itemList = 
				addColumn($scope.entity.itemList ,  items[i].attributeName , items[i].attributeValue);
			
		}
	}

		//注意attributeValue是一个规格选项的集合
		addColumn = function(itemList , attributeName , attributeValue){
			
			var newList = [];    //重新创建一个集合
			
			for(var i = 0 ; i < itemList.length ; i++){
				var oldRow = itemList[i];
				for(var j = 0 ;  j < attributeValue.length ; j++){   //循环的是规格选项的集合（3G,4G），控制行数
					//对原来的SKU进行深度克隆
					var newRow = JSON.parse(JSON.stringify(oldRow));      
					//在克隆后的SKU上面继续进行扩展  spec属性 
					/*
						第一次循环的是网络这个规格，规格选项中选择了2个规格属性
						网络：34,4G   所以第一次生成了两个SKU列表，规格选项决定行数
						此处需要扩展两次(循环两次，因为网络里面有3G,4G两个规格选项)
					 */
					newRow.spec[attributeName] = attributeValue[j];     
					newList.push(newRow);  
				
				}
				/* 
					循环两次结束之后，产生了一个新的集合，集合的长度为2，
					即产生两个SKU列表，扩展了原始的集合4G，3G
					[{spec:{attrbuteName:网络,attributeValue:4G},price:0,num:99999,status:'0',isDefault:'0'}]
					[{spec:{attrbuteName:网络,attributeValue:3G},price:0,num:99999,status:'0',isDefault:'0'}]
				*/
			}
			/*
				将原来的$scope.entity.itemList集合重新赋值，再对新改变后的集合进行遍历操作
			*/
			return newList;    
		}
		
		
		$scope.status=['未审核','已审核','审核未通过','已关闭'];
		
		//商品分类列表
		//查询商品的分类列表
		$scope.itemCatList = [];
		$scope.findItemCatList = function(){
			
			//查询所有的分类  ，不使用关联查询
			itemCatService.findAll().success(function(response){
				for(var i = 0 ; i < response.length ; i++){
					//将查询到的商品分类的id作为下标，对应其值，在页面进行获取的时候直接通过Index就可以获取到的对应的值
					$scope.itemCatList[response[i].id] = response[i].name;
				}
				
			})
			
			
		}
		
    
});	