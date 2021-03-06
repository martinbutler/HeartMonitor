'use strict';

angular.module('barsApp')
  .controller('QuizCtrl', function ($scope, Auth, $http, quizFactory, $window) {
    $scope.currentUser = Auth.getCurrentUser();
    $scope.quiz = [];
    $scope.percentReq = quizFactory.barPercentRequest;
    $scope.currentUser.$promise.then(function(user) {

      $http.get('/api/quizs/num/' + user.quizNumber).success(function(data, status, headers, config) {
        data.questions.forEach(function(question) {
          $scope.quiz.push([question, '']);
        });
      }).error(function(data, status, headers, config) {
      });
      if (user.profilePic) {
        $scope.profilePicUrl = user.profilePic;
      }
      else {
        $scope.profilePicUrl = "http://bandarito.ph/assets/uploads/profile_image/default.jpg";
      }
    })

    $scope.save = function() {
      $http.post('api/historys/', {user: $scope.currentUser._id, points: 30, type: 'nwQuiz', historyObj: $scope.quiz }).
        success(function(data, status, headers, config) {
          $scope.percentReq(30, data._id, 'nwQuiz', 1)
          $scope.uniqueUrl = '/response/'+ data._id;
          //stop sending emails for the time being
          // $http.post('api/emails/sendQuizRequest/', {
          //                                             email: $scope.currentUser.partner.email,
          //                                             reqFrom: $scope.currentUser._id,
          //                                             reqFromName:$scope.currentUser.name,
          //                                             url: $scope.uniqueUrl,
          //                                             profilePic: $scope.currentUser.profilePic
          //                                            }).success(function(data, status, headers, config) {
          //   $scope.message = "QUIZ has been saved and email has been sent!"
          // })
          $window.location.href = '/home';

        });

    }

});
