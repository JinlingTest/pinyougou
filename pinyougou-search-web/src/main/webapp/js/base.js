var app=angular.module('pinyougou',[]);

/* $sce写成服务 */
app.filter('trustHtml',['$sce',function($sce){
	return function(data){
		
		return $sce.trustAsHtml(data);
	}
	
}]);