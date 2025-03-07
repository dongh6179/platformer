// define variables
var game;
var player;
var platforms;
var badges;
var items;
var cursors;
var jumpButton;
var text;
var winningMessage;
var won = false, lose = false;
var currentScore = 0;
var winningScore = 10;
var array = [];
var array2 = [];
var cookie = 0;

for(var i = 0; i < 9; i++){
  array.push(Math.random()*500+100);
  array2.push(Math.random()*450+100);
}

// add collectable items to the game
function addItems() {
  items = game.add.physicsGroup();
  var count = 0;
  for(var i = 0; i < 9; i++){
    createItem(array[i]+75, array2[i]-50, "coin");
    if(count < 6){
      createItem(array[count]+Math.random()*50+3, array2[count]-Math.random()*50+3, "poison");
      count+=2;
    }
  }
  createItem(50, 50, "star");
}

// add platforms to the game
function addPlatforms() {
  platforms = game.add.physicsGroup();
  for(var i = 0; i < 9; i++){
    platforms.create(array[i], array2[i], "platform"+Math.round(Math.random()));
  }
  platforms.setAll("body.immovable", true);
}

// create a single animated item and add to screen
function createItem(left, top, image) {
  var item = items.create(left, top, image);
  item.animations.add("spin");
  item.animations.play("spin", 10, true);
}

// create the winning badge and add to screen
function createBadge() {
  badges = game.add.physicsGroup();
  var badge = badges.create(750, 400, "badge");
  badge.animations.add("spin");
  badge.animations.play("spin", 10, true);
}

// when the player collects an item on the screen
function itemHandler(player, item) {
  item.kill();
  if(item.key == "star"){
    currentScore = currentScore + 25;
  }
  else if(item.key == "coin"){
    currentScore = currentScore + 10;
  }
  else{
    currentScore = currentScore - 10;
  }
  if (currentScore >= winningScore && cookie == 0 && lose != true) {
    cookie = 1;
    createBadge();
  }
  if(currentScore < 0){
    lose = true;
  }
}

// when the player collects the badge at the end of the game
function badgeHandler(player, badge) {
  badge.kill();
  won = true;
}

// setup game when the web page loads
window.onload = function () {
  game = new Phaser.Game(800, 600, Phaser.AUTO, "", {
    preload: preload,
    create: create,
    update: update,
    render: render,
  });

  // before the game begins
  function preload() {
    game.stage.backgroundColor = "#5db1ad";

    //Load images
    game.load.image("platform0", "assets/platform_1.png");
    game.load.image("platform1", "assets/platform_2.png");
    

    //Load spritesheets
    game.load.spritesheet("player", "assets/chalkers.png", 48, 62);
    game.load.spritesheet("coin", "assets/coin.png", 36, 44);
    game.load.spritesheet("badge", "assets/badge.png", 42, 54);
    game.load.spritesheet("poison", "assets/poison.png", 32, 32);
    game.load.spritesheet("star", "assets/star.png", 32, 32);
  }

  // initial game set up
  function create() {
    player = game.add.sprite(50, 600, "player");
    player.animations.add("walk");
    player.anchor.setTo(0.5, 1);
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    player.body.gravity.y = 500;

    //for(var i = 0; i < 9; i++){
      
      addItems();
      addPlatforms();
    //}
    

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    text = game.add.text(16, 16, "SCORE: " + currentScore, {
      font: "bold 24px Arial",
      fill: "white",
    });
    winningMessage = game.add.text(game.world.centerX, 275, "", {
      font: "bold 48px Arial",
      fill: "white",
    });
    winningMessage.anchor.setTo(0.5, 1);
  }

  // while the game is running
  function update() {
    text.text = "SCORE: " + currentScore;
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.overlap(player, items, itemHandler);
    game.physics.arcade.overlap(player, badges, badgeHandler);
    player.body.velocity.x = 0;

    // is the left cursor key presssed?
    if (cursors.left.isDown) {
      player.animations.play("walk", 10, true);
      player.body.velocity.x = -300;
      player.scale.x = -1;
    }
    // is the right cursor key pressed?
    else if (cursors.right.isDown) {
      player.animations.play("walk", 10, true);
      player.body.velocity.x = 300;
      player.scale.x = 1;
    }
    // player doesn't move
    else {
      player.animations.stop();
    }

    if (
      jumpButton.isDown
    ) {
      player.body.velocity.y = -400;
    }
    // when the player winw the game
    if (won) {
      winningMessage.text = "YOU WIN!!!";
    }
    if(lose){
      winningMessage.text = "GAME OVER";
    }
  }

  function render() {}
};
