(function(){
	angular.module("phone-mask")
		.directive("phoneMask", ['$log','$timeout', function($log, $timeout){
			return {
				restrict: 'A',
				require: 'ngModel',
				scope:{
					ngModel: '='
				},
				link : function($scope, $element, $attrs, ngModelCtrl){
					var maxlength = $element.attr('cell-mask') === "true"? 12 : 11;
					var currentCaret = 0;
					$scope.$watch('ngModel', function (v, o) {
						if(v){
							var caret = $element[0].selectionStart;
							var firstPart = (v+ "").substr(0, caret).replace(/\D/g,'');
							var secondPart = (v+ "").substr(caret, v.lenght).replace(/\D/g,'');
							var clean=(firstPart+secondPart);
							var old= (o+'').replace(/\D/g, '');
							if(clean.length > maxlength){
								clean = old;
							}
							var caretFromClean = firstPart.length;
							var processed = '';
							var length = clean.length;
							if(length < 8){
								caret = caretFromClean;
								if(caretFromClean > 3){
									caret++;
								}
								for(var i=0;i < length ; i++){
									if(i==3){
										processed+=" "+clean[i];
									}else{
										processed+=clean[i];
									}

								}
							}else if(length < 12){ // landline
								var offset = length > 9? length - 9 : 0;
								caret = caretFromClean+1;
								if(caretFromClean > 2+offset){
									caret+=2;
								}
								if(caretFromClean > 5+offset){
									caret++;
								}
								for(var i = 0; i < length ; i++){
									if(i == 0){
										processed+="("+clean[i];
									}else if(i == 2+offset){
										processed+=') '+clean[i];
									}else if( i == 5+offset){
										processed+=' ' +clean[i];
									}else{
										processed+=clean[i];
									}
								}
							}else if(length == 12){ // cell phone
								caret = caretFromClean+1;
								if(caretFromClean == 2){
									caret++;
								}if(caretFromClean == 5){
									caret++;
								}if(caretFromClean == 8){
									caret++;
								}
								for(var i=0; i< length; i++){
									if(i==0){
										processed+='+'+clean[i];
									}else if(i == 2 || i == 5 || i==8){
										processed+=' '+clean[i];
									}else{
										processed+=clean[i];
									}
								}
							}


							if (clean.length != old.length){
								currentCaret = caret;
							}

							
							ngModelCtrl.$viewValue = processed;
							$scope.ngModel = clean;
							ngModelCtrl.$render();
							$element[0].selectionStart = currentCaret;
							$element[0].selectionEnd = currentCaret;


						}
		            });

				}
			}
		}])
}())