angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("multiple-autocomplete-tpl.html","<div class=\"ng-ms form-item-container\">\n\n    <div class=\"selected-items\">\n        <ul class=\"list-inline\">\n\n            <li ng-repeat=\"item in modelArr\">\n                <span ng-if=\"objectProperty == undefined || objectProperty == \'\'\">\n                    {{item}} <span class=\"remove\" ng-click=\"removeAddedValues(item)\">\n                    <i class=\"glyphicon glyphicon-remove\"></i></span>&nbsp;\n                </span>\n                <span ng-if=\"objectProperty != undefined && objectProperty != \'\'\">\n                    {{item[objectProperty]}}<i ng-if=\"secondaryObjectProperty\"> <small>({{item[secondaryObjectProperty]}})</small></i> <span class=\"remove\" ng-click=\"removeAddedValues(item)\">\n                    <i class=\"glyphicon glyphicon-remove\"></i></span>&nbsp;\n                </span>\n            </li>\n\n\n            <li>\n                <input name=\"{{name}}\" ng-model=\"input.value\" ng-keydown=\"keyParser($event)\"\n                       ng-if=\"modelArr.length < maxSelection\"\n                       err-msg-required=\"{{errMsgRequired}}\"\n                       focus-me=\"focusMe.flag\"\n                       placeholder=\"{{placeholder}}\"\n                       ng-focus=\"onFocus()\" ng-blur=\"onBlur()\" ng-required=\"!modelArr.length && isRequired\"\n                       ng-change=\"onChange()\" />\n            </li>\n\n        </ul>\n    </div>\n\n\n    <div class=\"autocomplete-list\" ng-show=\"resultsToShow\" ng-mouseenter=\"onMouseEnter()\" ng-mouseleave=\"onMouseLeave()\">\n\n    <ul ng-if=\"objectProperty == undefined || objectProperty == \'\'\">\n        <li ng-class=\"{\'autocomplete-active\' : selectedItemIndex == $index}\"\n            ng-repeat=\"suggestion in (results.filter = (suggestionsArr | filter : input.value | filter : alreadyAddedValues | limitTo: 5))\"\n            ng-click=\"onSuggestedItemsClick(suggestion)\" ng-mouseenter=\"mouseEnterOnItem($index)\">\n            {{suggestion}}\n        </li>\n    </ul>\n\n    <ul ng-if=\"objectProperty != undefined && objectProperty != \'\'\">\n        <li ng-class=\"{\'autocomplete-active\' : selectedItemIndex == $index}\"\n            ng-repeat=\"suggestion in (results.filter = (suggestionsArr | filter : input.value | filter : alreadyAddedValues | limitTo: 5))\"\n            ng-click=\"onSuggestedItemsClick(suggestion)\" ng-mouseenter=\"mouseEnterOnItem($index)\">\n            {{suggestion[objectProperty]}}<span ng-if=\"secondaryObjectProperty\"> <small>({{suggestion[secondaryObjectProperty]}})</small></span>\n        </li>\n    </ul>\n\n</div>\n\n</div>");}]);
(function () {
    //declare all modules and their dependencies.
    angular.module('multipleSelect', [
        'templates'
    ]).config(function () {

    });
}
)();
(function () {

    angular.module('multipleSelect').directive('focusMe', function($timeout, $parse) {
        return {
            link: function(scope, element, attrs) {
                var model = $parse(attrs.focusMe);
                scope.$watch(model, function(value) {
                    if(value === true) {
                        $timeout(function() {
                            element[0].focus();
                        });
                    }
                });
                element.bind('blur', function() {
                    scope.$apply(model.assign(scope, false));
                })
            }
        };
    });

    angular.module('multipleSelect').directive('multipleAutocomplete', [
        '$filter',
        '$http',
        '$timeout',
        function ($filter, $http, $timeout) {
            return {
                restrict: 'EA',
                scope : {
                    suggestionsArr : '=?',
                    modelArr : '=ngModel',
                    apiUrl : '@',
                    afterChange : '=?',
                    beforeSelectItem : '=?',
                    afterSelectItem : '=?',
                    beforeRemoveItem : '=?',
                    afterRemoveItem : '=?',
                    maxSelection : '@',
                    secondaryObjectProperty : '@',
                    placeholder: '@'
                },
                templateUrl: 'multiple-autocomplete-tpl.html',
                link : function(scope, element, attr) {

                    scope.focusMe = { flag: true };

                    scope.objectProperty = attr.objectProperty;
                    scope.secondaryObjectProperty = attr.secondaryObjectProperty || '';
                    scope.placeholder = attr.placeholder || '';
                    scope.selectedItemIndex = 0;
                    scope.name = attr.name;
                    scope.isRequired = attr.required;
                    scope.errMsgRequired = attr.errMsgRequired;
                    scope.isHover = false;
                    scope.isFocused = false;
                    scope.resultsToShow = false;
                    scope.results = {filter: []};
                    scope.input = { value: '' };
                    scope.maxSelection = attr.maxSelection || 9999;


                    var getSuggestionsList = function (c) {
                        var url = scope.apiUrl.replace(':value', scope.input.value);
                        $http({
                            method: 'GET',
                            url: url
                        }).then(function (response) {
                            scope.suggestionsArr = response.data;
                            if(typeof c === 'function')
                                c();
                        }, function (response) {
                            scope.suggestionsArr = [];
                            if(typeof c === 'function')
                                c();
                            console.log("*****Angular-multiple-select **** ----- Unable to fetch list");
                        });
                    };

                    if(scope.suggestionsArr == null || scope.suggestionsArr == "") {
                        if(scope.apiUrl != null && scope.apiUrl != "")
                            getSuggestionsList();
                        else{
                            console.log("*****Angular-multiple-select **** ----- Please provide suggestion array list or url");
                        }
                    }

                    if(scope.modelArr == null || scope.modelArr == "") {
                        scope.modelArr = [];
                    }

                    scope.onFocus = function () {
                        scope.isFocused = true;
                        if(scope.input.value.length >= 1)
                            scope.resultsToShow = true;
                    };

                    scope.onMouseEnter = function () {
                        scope.isHover = true
                    };

                    scope.onMouseLeave = function () {
                        scope.isHover = false;
                    };

                    scope.onBlur = function () {
                        scope.isFocused = false;
                        if(!scope.isHover)
                            scope.resultsToShow = false;
                    };

                    var bounceTimer;

                    scope.onChange = function () {

                        scope.selectedItemIndex = 0;


                        if(scope.afterChange && typeof(scope.afterChange) === 'function')
                            scope.afterChange(scope.input.value);

                        if(scope.apiUrl !== null && scope.apiUrl !== "") {
                            if (bounceTimer)
                                $timeout.cancel(bounceTimer);
                            bounceTimer = $timeout(function () {
                                getSuggestionsList(updateResults);
                            }, 300);
                        } else {
                            $timeout(updateResults, 300);
                        }
                    };

                    var updateResults = function () {
                        scope.resultsToShow = scope.results.filter.length !== 0;
                    };

                    scope.keyParser = function ($event) {
                        var keys = {
                            38: 'up',
                            40: 'down',
                            8 : 'backspace',
                            13: 'enter',
                            9 : 'tab',
                            27: 'esc'
                        };
                        var key = keys[$event.keyCode];
                        if(key == 'backspace' && scope.input.value == ""){
                            if(scope.modelArr.length != 0){
                                scope.removeAddedValues(scope.modelArr[scope.modelArr.length-1]);
                                //scope.modelArr.pop();
                            }
                        }
                        else if(key == 'down'){
                            var filteredSuggestionArr = $filter('filter')(scope.suggestionsArr, scope.input.value);
                            filteredSuggestionArr = $filter('filter')(filteredSuggestionArr, scope.alreadyAddedValues);
                            if(scope.selectedItemIndex < filteredSuggestionArr.length -1)
                                scope.selectedItemIndex++;
                        }
                        else if(key == 'up' && scope.selectedItemIndex > 0){
                            scope.selectedItemIndex--;
                        }
                        else if(key == 'esc'){
                            scope.isHover = false;
                            scope.isFocused=false;
                        }
                        else if(key == 'enter'){
                            var filteredSuggestionArr = $filter('filter')(scope.suggestionsArr, scope.input.value);
                            filteredSuggestionArr = $filter('filter')(filteredSuggestionArr, scope.alreadyAddedValues);
                            if(scope.selectedItemIndex < filteredSuggestionArr.length)
                                scope.onSuggestedItemsClick(filteredSuggestionArr[scope.selectedItemIndex]);
                        }
                    };

                    scope.onSuggestedItemsClick = function (selectedValue) {
                        if(scope.beforeSelectItem && typeof(scope.beforeSelectItem) == 'function')
                            scope.beforeSelectItem(selectedValue);

                        scope.modelArr.push(selectedValue);

                        if(scope.afterSelectItem && typeof(scope.afterSelectItem) == 'function')
                            scope.afterSelectItem(selectedValue);

                        scope.input.value = "";
                        scope.resultsToShow = false;
                        scope.focusMe.flag = true;

                    };

                    var isDuplicate = function (arr, item) {
                        var duplicate = false;
                        if(arr == null || arr == "")
                            return duplicate;

                        for(var i=0;i<arr.length;i++){
                            duplicate = angular.equals(arr[i], item);
                            if(duplicate)
                                break;
                        }
                        return duplicate;
                    };

                    scope.alreadyAddedValues = function (item) {
                        var isAdded = true;
                        isAdded = !isDuplicate(scope.modelArr, item);
                        //if(scope.modelArr != null && scope.modelArr != ""){
                        //    isAdded = scope.modelArr.indexOf(item) == -1;
                        //    console.log("****************************");
                        //    console.log(item);
                        //    console.log(scope.modelArr);
                        //    console.log(isAdded);
                        //}
                        return isAdded;
                    };

                    scope.removeAddedValues = function (item) {
                        if(scope.modelArr != null && scope.modelArr != "") {
                            var itemIndex = scope.modelArr.indexOf(item);
                            if (itemIndex != -1) {
                                if(scope.beforeRemoveItem && typeof(scope.beforeRemoveItem) == 'function')
                                    scope.beforeRemoveItem(item);

                                scope.modelArr.splice(itemIndex, 1);

                                if(scope.afterRemoveItem && typeof(scope.afterRemoveItem) == 'function')
                                    scope.afterRemoveItem(item);
                            }
                        }
                    };

                    scope.mouseEnterOnItem = function (index) {
                        scope.selectedItemIndex = index;
                    };
                }
            };
        }
    ]);


})();