angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("multiple-autocomplete-tpl.html","<div class=\"ng-ms form-item-container\">\n\n    <div class=\"selected-items\">\n        <ul class=\"list-inline\">\n\n            <li ng-repeat=\"item in modelArr\">\n                <span ng-if=\"objectProperty == undefined || objectProperty == \'\'\">\n                    {{item}} <span class=\"remove\" ng-click=\"removeAddedValues(item)\">\n                    <i class=\"glyphicon glyphicon-remove\"></i></span>&nbsp;\n                </span>\n                <span ng-if=\"objectProperty != undefined && objectProperty != \'\'\">\n                    {{item[objectProperty]}}<i ng-if=\"secondaryObjectProperty\"> <small>({{item[secondaryObjectProperty]}})</small></i> <span class=\"remove\" ng-click=\"removeAddedValues(item)\">\n                    <i class=\"glyphicon glyphicon-remove\"></i></span>&nbsp;\n                </span>\n            </li>\n\n        </ul>\n    </div>\n\n\n    <input name=\"{{name}}\" ng-model=\"input.value\" placeholder=\"\" ng-keydown=\"keyParser($event)\"\n           ng-if=\"modelArr.length < maxSelection\"\n           err-msg-required=\"{{errMsgRequired}}\"\n           focus-me=\"focusMe.flag\"\n           ng-focus=\"onFocus()\" ng-blur=\"onBlur()\" ng-required=\"!modelArr.length && isRequired\"\n           ng-change=\"onChange()\" />\n\n\n    <div class=\"autocomplete-list\" ng-show=\"resultsToShow\" ng-mouseenter=\"onMouseEnter()\" ng-mouseleave=\"onMouseLeave()\">\n\n    <ul ng-if=\"objectProperty == undefined || objectProperty == \'\'\">\n        <li ng-class=\"{\'autocomplete-active\' : selectedItemIndex == $index}\"\n            ng-repeat=\"suggestion in (results.filter = (suggestionsArr | filter : input.value | filter : alreadyAddedValues | limitTo: 5))\"\n            ng-click=\"onSuggestedItemsClick(suggestion)\" ng-mouseenter=\"mouseEnterOnItem($index)\">\n            {{suggestion}}\n        </li>\n    </ul>\n\n    <ul ng-if=\"objectProperty != undefined && objectProperty != \'\'\">\n        <li ng-class=\"{\'autocomplete-active\' : selectedItemIndex == $index}\"\n            ng-repeat=\"suggestion in (results.filter = (suggestionsArr | filter : input.value | filter : alreadyAddedValues | limitTo: 5))\"\n            ng-click=\"onSuggestedItemsClick(suggestion)\" ng-mouseenter=\"mouseEnterOnItem($index)\">\n            {{suggestion[objectProperty]}}<span ng-if=\"secondaryObjectProperty\"> <small>({{suggestion[secondaryObjectProperty]}})</small></span>\n        </li>\n    </ul>\n\n</div>\n\n</div>");}]);