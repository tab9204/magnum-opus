//the player character
var player = new Player();
//array containing all the enemies
var enemies = [];
//array containing the spots of blood shown on screen
var bloodSpots = [];
//the player attack slash image
var slashImg;
//the image used as the background of the play area
var backgroundImg;
//list of colors the enemies can use
var enemyColors = [
  [255, 0, 0, 255],//red
  [199, 21, 133, 255],//MediumVioletRed
  [255, 69, 0, 255],//OrangeRed
  [255, 215, 0, 255],//gold
  [255, 0, 255, 255],//Magenta
  [128, 0, 128, 255],//purple
  [0, 0, 255, 255],//blue
  [0, 255, 0, 255],//green
  [0, 128, 128, 255]//teal

]

var preload = ()=>{
  slashImg = loadImage('assets/slash.png');
}

//p5 setup function, runs once
var setup = ()=>{
  //create the canvas area
 createCanvas(800, 600);
  //create the background image
  backgroundImg = new p5.Image(800, 600);

 //create some enemies
 setInterval(()=>{
   if(enemies.length <= 5){
    spawnEnemies(1);
   }
 },3000)

}

//p5 draw function, runs repeatedly
var draw = ()=>{
  //create the background
  background(255);

  //start spawning enemies at a fixed interval

  //filter out any dead blood from the bloodspots array
  bloodSpots = bloodSpots.filter((spot)=>{
    return !spot.dead;
  })

  //add and update the blood
  for (var spot of bloodSpots) {
    spot.update();
  }

  //add the background image to the screen
  image(backgroundImg, 0, 0);

  //filter out any dead enemies
  enemies = enemies.filter((enemy)=>{
    return !enemy.isDead;
  })

  //add and update the enemies
  for (var enemy of enemies) {
    enemy.update();
  }

  //add and update the player
  player.update();
  //attach the player movement events
  player.playerMovementKeys();

  if(mouseIsPressed ){
    player.chargeTime = player.chargeTime < 100 ? player.chargeTime += 1 : 100;
  }



}

//mouse click event handler
var mouseClicked = () =>{
  player.attack();
  //reset the players attack charge
  player.chargeTime = 0;
}

var keyPressed = () =>{
 if(keyCode == 32){
    player.dash();
  }
}

//draws a circle on the background image
//x,y => circle midpoint coordinates
//r => the radius of the circle
//c => the color of the circle
var drawToBackground = (x,y,r,c)=>{
  //a narrowed down set of coordinates to use the circle midpoint formula on
  //without this we would need to check every coordinate on the screen
  //instead we simply check the coordinates immediately surrounding where we will draw the circle
  var coordinates = [];
  //the x and y points to add to the narrowed down array
  var point_x = x - (r + 5);
  var point_y = y - (r + 5);
  //add all the coordinates we want to check to the array
  var filled = false;
  while(!filled){
    coordinates.push({x:point_x,y:point_y});
    point_x++;
    if(point_x > x + (r + 5)){
      point_x = x - (r + 5);
      point_y++
    }
    if(point_y > y + (r + 5)){
      filled = true;
    }
  }
  //coordinates that make up the circle
  var circle = [];
  //loop through all the coordinates
  for (var point of coordinates) {
    //determine if the point falls on the edge of the circle
    //if the left side and right side is equal then the point is on the edge of the circle
    var leftSide = Math.pow(x - point.x,2) + Math.pow(y - point.y,2);
    var rightSide = Math.pow(r,2);
    //if the point is not on the edge then we need to determine if the point is inside or outside of the circle
    if(leftSide !== rightSide){
      //get the distance of the point from the center of the circle
      var d = Math.sqrt(Math.pow(x - point.x,2) + Math.pow(y - point.y,2));
      //if the distance is less then the radius
      if(d < r){
        //add the point to the array of coordinates
        circle.push(point);
      }
    }
    else{
      circle.push(point);
    }
  }
  backgroundImg.loadPixels();
  //loop through the circle points and add them to the background image
  for (var point of circle) {
    backgroundImg.set(point.x, point.y, color(c));
  }
  //update the pixel in the background image
  backgroundImg.updatePixels();
}

//spawns enemies on to the screen
//num => how many enemies to create
var spawnEnemies = (num) =>{
  var x = [0,width];
  var y = [0,height]
  for(var i = 0; i < num; i++){
    var color = pickColor();
    var enemy_x = x[Math.floor(Math.random() * (2 - 0) + 0)];
    var enemy_y = y[Math.floor(Math.random() * (2 - 0) + 0)];
    var enemy = new Enemy(enemy_x,enemy_y,3,color);
    //var enemy = new Enemy(900,700,3,color);
    enemies.push(enemy);
  }
}

//picks a random color from the enemy colors array
var pickColor = () =>{
  var index = Math.floor(Math.random() * (enemyColors.length - 0) + 0);
  var color = enemyColors[index];
  return color;
}
