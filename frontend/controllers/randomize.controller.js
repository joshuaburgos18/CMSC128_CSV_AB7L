(function() {
  'use strict';

  angular
    .module('app')
    .controller('RandomCtrl', RandomCtrl);

  RandomCtrl.$inject = ["$rootScope", "$scope", "$location", "RandomService"];

  function RandomCtrl($rootScope, $scope, $location, RandomService) {
    var students = localStorage.getItem('students');
    $scope.students = JSON.parse(students);

    $scope.labdata = [];
    $scope.labSections = [];
    $scope.labLimits = [];
    $scope.countWhole = 0;
    var randdata = {};

    $scope.user_id = localStorage.getItem("user_id");
    $scope.course_code = localStorage.getItem("course_code");
    $scope.section_name = localStorage.getItem("section_name");
    $scope.course_id = localStorage.getItem("course_id");

     $scope.GetLabs = function() {
      RandomService.GetLabs($scope.section_name, $scope.course_id)
        .then(function(data) {
          for(var i = 0 ; i < data.length; i++){
            $scope.labdata.push(data[i]);
            $scope.labSections.push(data[i].code);

            if(i == data.length-1)
              $scope.GetLimits();
          }
       });

    }

    $scope.GetLimits = function() {
      for(var j = 0; j < $scope.labdata.length; j++ ){
          RandomService.GetLimits($scope.section_name, $scope.labSections[j], j)
          .then(function(data) {
            $scope.labdata[data.j].count = data.count;
            $scope.countWhole += data.count;
          });
      }
    }

    $scope.Randomize = function() {

       $scope.students = [];

      //randomize per lab section
      if($scope.counts.whole == 0){

         function randomizeStudents(count) {
            var varlab = $scope.labSections[count];

            if($scope.counts[varlab] < 0){
              Materialize.toast("Negative Numbers Are Not Allowed", 1000);
              return;
            }

            randdata = {
              "user_id":$scope.user_id,
              "course_code":$scope.course_code,
              "section_name":$scope.section_name,
              "section_code":varlab,
              "limit": $scope.counts[varlab]
            };
            RandomService.Randomize(randdata)
              .then(function(data) {
                for(var j = 0; j < data.length; j++)
                  $scope.students.push(data[j]);

              if(count == $scope.labSections.length - 1){
                localStorage.setItem('students', JSON.stringify($scope.students));
                $rootScope.redirect('/results_randomize');
              } else {
                randomizeStudents(count+1);
              }
            });
         }

         randomizeStudents(0);
      }

      //Whole section
      if($scope.counts.whole > 0){
          randdata = {
          "user_id":$scope.user_id,
          "course_code":$scope.course_code,
          "section_name":$scope.section_name,
          "limit":$scope.counts.whole
        };
          RandomService.Randomize(randdata)
          .then(function(data) {
            for(var i = 0; i < data.length; i++){
              $scope.students.push(data[i]);

              if(i == data.length-1){
                localStorage.setItem('students', JSON.stringify($scope.students));
                $rootScope.redirect('/results_randomize');
              }

            }
          });
      }

    }
  }
})();
