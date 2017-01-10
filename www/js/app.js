var app = angular.module('ionic-todo', ['ionic', 'LocalStorageModule']);

app.run(function ($ionicPlatform) {
  $ionicPlatform.ready(function () {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

// Local storage setup
app.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
  .setPrefix('ionic-todo')
});

// Main controller
app.controller('main', function ($scope, $ionicModal, localStorageService, $timeout) {

  /*********************************/
  //    Current level variables    //
  /*********************************/

  // Level specific
  $scope.difficulty = 0; // 0 - easy, 1 - medium, 2 - hard
  $scope.countdownTime = 0;
  $scope.numberOfColourChoices = 0;

  // Other
  $scope.playerScore = 0;
  $scope.currentColour = "";
  $scope.colourSelection = [];
  $scope.textText = "";

  // Settings
  $scope.playStyle = 0; // 0 - normal, 1 - chaos
  $scope.musicOption = 1; // 0 - Off, 1 - On
  $scope.soundOption = 1; // 0 - Off, 1 - On

  /************************/
  //     Level setup      //
  /************************/

  // EASY
  $scope.startEasyGame = function () {

    // Initialize
    $scope.playerScore = 0;

    // Views
    $scope.startGameModal = true;
    $scope.gameText = false;
    $scope.endGameText = false;
    $scope.easyGameModal.show();

    // Level specific
    $scope.numberOfColourChoices = 3;
    $scope.difficulty = 0;
    $scope.countdownTime = 6; //6
  };

  // MEDIUM
  $scope.startMediumGame = function () {

    // Initialize
    $scope.playerScore = 0;

    // Views
    $scope.startGameModal = true;
    $scope.gameText = false;
    $scope.endGameText = false;
    $scope.mediumGameModal.show();

    // Level specific
    $scope.numberOfColourChoices = 6;
    $scope.difficulty = 1;
    $scope.countdownTime = 5; //5
  };

  // HARD
  $scope.startHardGame = function () {

    // Initialize
    $scope.playerScore = 0;

    // Views
    $scope.startGameModal = true;
    $scope.gameText = false;
    $scope.endGameText = false;
    $scope.hardGameModal.show();

    // Level specific
    $scope.numberOfColourChoices = 9;
    $scope.difficulty = 2;
    $scope.countdownTime = 4; //4
  };

  /************************/
  //         GAME         //
  /************************/

  // Starts the game - reveals game text and colours
  $scope.startGame = function(){

    $scope.startGameModal = false;
    $scope.gameText = true;

    $scope.gamePlayStyleSetting();

  };

  $scope.gamePlayStyleSetting = function(){
    switch ($scope.playStyle) {
      // Normal
      case 0:
      $scope.staticColours();
        break;
      // Chaos
      case 1:
      $scope.colourAndText();
        break;
    }
  };

  $scope.staticColours = function(){

    $scope.stopTimer();
    $scope.colourSelection = [];
    text = ["Red","Dark Blue","Green","Yellow","Purple","Orange","Brown","Black","Light Blue"];
    $scope.textText = text[$scope.getRandom(0,text.length)];

    // Gathers correct number of colours for the level
    for(i=0;i<$scope.numberOfColourChoices;i++){
      $scope.colourSelection.push($scope.image[i]);
    }
    $scope.currentColour = $scope.colourSelection[$scope.getRandom(0,$scope.numberOfColourChoices)].colour

    document.getElementById("mainText").style.color = $scope.currentColour;

    $scope.startTimer();
  };

  // Checks selected colour against the colour of the text
  $scope.selectedColour= function(colour){
    $scope.stopTimer();
    console.log($scope.currentColour,colour);
    // If correct - stop countdown and reset text and colour
    if (colour == $scope.currentColour){
      $scope.playerScore++;
      $scope.gamePlayStyleSetting();
      // If incorrect - show modal and log score
    }else{
      $scope.updateScore();
      $scope.colourSelection = [];
      $scope.colourSelection.length = 0;
      $scope.gameText = false;
      $scope.endGameText = true;
    }
  };

  // Attaches colour attribute to pictures
  $scope.image = [
    {colour : '#CF2A28', src: 'img/redSquare.png'},
    {colour : '#1008F1', src: 'img/darkBlueSquare.png'},
    {colour : '#009F0B', src: 'img/greenSquare.png'},
    {colour : '#FFFF01', src: 'img/yellowSquare.png'},
    {colour : '#9A00FF', src: 'img/purpleSquare.png'},
    {colour : '#FE9900', src: 'img/orangeSquare.png'},
    {colour : '#AE6427', src: 'img/brownSquare.png'},
    {colour : '#010102', src: 'img/blackSquare.png'},
    {colour : '#01FFFF', src: 'img/lightBlueSquare.png'}
  ];

  // Creates the game text and colour
  $scope.colourAndText = function(){
    $scope.stopTimer();
    $scope.colourSelection = [];
    text = ["Red","Dark Blue","Green","Yellow","Purple","Orange","Brown","Black","Light Blue"];
    $scope.textText = text[$scope.getRandom(0,text.length)];
    $scope.image = $scope.shuffle($scope.image);

    // Gathers correct number of colours for the level
    for(i=0;i<$scope.numberOfColourChoices;i++){
      $scope.colourSelection.push($scope.image[i]);
    }
    // Sets colour of text to the first chosen colour
    $scope.currentColour = $scope.colourSelection[0].colour;

    // Shuffles the selected colours so the first picture is not always the correct colour
    $scope.colourSelection = $scope.shuffle($scope.colourSelection);

    // Sets text colour
    document.getElementById("mainText").style.color = $scope.currentColour;

    $scope.startTimer();
  };

  /************************/
  //        SCORES        //
  /************************/

  // Initialize
  var scoreData = "score";
  $scope.scores = [];
  $scope.score = [];

  $scope.initializeScores = function(){
    for(i=0;i<3;i++){
      $scope.score = 0;
      $scope.scores.push($scope.score);
      localStorageService.set(scoreData, $scope.scores);
      $scope.score = {};
    }
  };

  $scope.getScores = function(){
    if(localStorageService.get(scoreData)){
      $scope.scores = localStorageService.get(scoreData);
      if($scope.scores.length ==0){
        $scope.initializeScores();
        $scope.scores = localStorageService.get(scoreData);
      }
    }else{
      $scope.initializeScores();
    }
  };

  $scope.updateScore = function(){
    if($scope.playerScore>$scope.scores[$scope.difficulty]){
      $scope.scores[$scope.difficulty] = $scope.playerScore;
      localStorageService.set(scoreData, $scope.scores);
    }
  };

  /************************/
  //       COUNTDOWN      //
  /************************/
  $scope.counter = $scope.countdownTime;

  var mytimeout = null; // the current timeoutID

  // Timer method - counts down every 250ms until it runs out
  $scope.onTimeout = function() {
    if($scope.counter ===  0) {
      $scope.$broadcast('timer-stopped', 0);
      $timeout.cancel(mytimeout);
      return;
    }
    $scope.counter--;
    mytimeout = $timeout($scope.onTimeout, 250);
  };

  // Starts timer
  $scope.startTimer = function() {
    $scope.counter = $scope.countdownTime;
    mytimeout = $timeout($scope.onTimeout, 250);
  };

  // Stops timer
  $scope.stopTimer = function() {
    $timeout.cancel(mytimeout);
  };

  // Called when the timer runs out - Shows end of game menu and logs score
  $scope.$on('timer-stopped', function(event, remaining) {
    if(remaining === 0) {
      $scope.updateScore();
      $scope.colourSelection = [];
      $scope.colourSelection.length = 0;
      $scope.gameText = false;
      $scope.endGameText = true;

    }
  });

  /************************/
  //       SETTINGS       //
  /************************/
  $scope.chaosStatus = "OFF";
  $scope.musicStatus = "ON";
  $scope.soundStatus = "ON";

  $scope.toggleMusic = function(){
    switch ($scope.musicOption) {
      case 0:
      $scope.musicOption = 1;
      $scope.musicStatus = "ON";
        break;
      case 1:
      $scope.musicOption = 0;
      $scope.musicStatus = "OFF";
        break;
    }

  };

  $scope.toggleSound = function(){
    switch ($scope.soundOption) {
      case 0:
      $scope.soundOption = 1;
      $scope.soundStatus = "ON";
        break;
      case 1:
      $scope.soundOption = 0;
      $scope.soundStatus = "OFF";
        break;
    }

  };

  $scope.toggleChaos = function(){
    switch ($scope.playStyle) {
      case 0:
      $scope.playStyle = 1;
      $scope.chaosStatus = "ON";
        break;
      case 1:
      $scope.playStyle = 0;
      $scope.chaosStatus = "OFF";
        break;
    }
  };

  /************************/
  //        MODALS        //
  /************************/

  $ionicModal.fromTemplateUrl('gameChoices.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.choicesModal = modal;
  });

  $ionicModal.fromTemplateUrl('easyGame.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.easyGameModal = modal;
  });

  $ionicModal.fromTemplateUrl('mediumGame.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.mediumGameModal = modal;
  });

  $ionicModal.fromTemplateUrl('hardGame.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.hardGameModal = modal;
  });

  $ionicModal.fromTemplateUrl('high-score.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.highScoreModal = modal;
  });

  $ionicModal.fromTemplateUrl('tutorial.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.tutorialModal = modal;
  });

  $ionicModal.fromTemplateUrl('settings.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.settingsModal = modal;
  });

  $scope.openChoices = function(){
    $scope.choicesModal.show();
  };

  $scope.openTutorial = function(){
    $scope.tutorialModal.show();
  };

  $scope.openHighscores = function(){
    $scope.highScoreModal.show();
  };

  $scope.openSettings = function(){
    $scope.settingsModal.show();
  };

  // Closes all modals and returns to home screen
  $scope.openHomeModal = function(){
    $scope.choicesModal.hide();
    $scope.easyGameModal.hide();
    $scope.mediumGameModal.hide();
    $scope.hardGameModal.hide();
    $scope.tutorialModal.hide();
    $scope.highScoreModal.hide();
    $scope.settingsModal.hide();
  };


  /************************/
  //       UTILITY        //
  /************************/

  // Gets a random integer between two numbers (min is inclusive and max is exclusive)
  $scope.getRandom = function(min,max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  };

  //  Fisher - Yates shuffle
  $scope.shuffle = function(array)
  {
    var i = 0
    , j = 0
    , temp = null

    for (i = array.length - 1; i > 0; i -= 1) {
      j = Math.floor(Math.random() * (i + 1))
      temp = array[i]
      array[i] = array[j]
      array[j] = temp
    }
    return array;
  };

});
