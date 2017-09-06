(function () {

    angular.module('multipleSelect').controller('homeController', function ($scope) {
        $scope.apiPath = "web/resources/skills.json";

        $scope.skillsList = [
            {id: 1, name : "Pedro",     email: "foo@bar.com" },
            {id: 1, name : "Giuseppe",  email: "foo1@bar.com" },
            {id: 1, name : "Domenico",  email: "foo2@bar.com" },
            {id: 1, name : "Claudio",   email: "foo3@bar.com" },
            {id: 1, name : "Maria",     email: "foo4@bar.com" },
            {id: 1, name : "Lupita",    email: "foo5@bar.com" },
            {id: 1, name : "Simone",    email: "foo6@bar.com" }
        ];

        $scope.skillsList1 = [
            "Java",
            "C",
            "C++",
            "Core Java",
            "Javascript",
            "PHP",
            "MySql",
            "Hibernate",
            "Spring",
            "AngularJs",
            "BackboneJs",
            "Sencha Touch",
            "ExtJs"
        ];

        $scope.selectItemCallback = function(item){
            $scope.selectedItem = item;
        };

        $scope.removeItemCallback = function(item){
            $scope.removedItem = item;
        };

        $scope.autoChange = function (value) {
            console.log(value);
        };

        $scope.onSubmit = function () {
            console.log("submit");
            if($scope.multipleSelectForm.$invalid){
                if($scope.multipleSelectForm.$error.required != null){
                    $scope.multipleSelectForm.$error.required.forEach(function(element){
                        element.$setDirty();
                    });
                }
                return null;
            }
            alert("valid field");
        };
    });
})();