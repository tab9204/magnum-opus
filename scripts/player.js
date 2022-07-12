class Player {
  constructor(){
    //location of the player
    this.location = new p5.Vector(400,300);
    //rate of change of location
    this.velocity = new p5.Vector(0,0);
    //rate of change of velocity
    this.acceleration = new p5.Vector(0,0);
    //maximum velocity
    this.maxSpeed = 2.5;
    //the maximum force that can applied to acceleration
    this.maxForce = 2;
    //the size of the player
    this.width = 30;
    this.height = 30;
    //the angle the player has been rotated
    this.direction = new p5.Vector(0,0);
    //player attack hitbox location
    this.hurtBox = new p5.Vector(0,0);
    //the radius of the attack hitbox
    this.hurtBoxRadius = 65;
    //flags if the player is currently attacking
    this.isAttacking = false;
    //which direction the attack is siwining in. If false the swing is to the left
    this.rightSwing = false;
    //how long the attack has been charged for
    this.chargeTime = 0;

  }
  //update loop
  update(){
    //display the player
    this.display();
    //move the player
    this.move();
    //check screen bountry collisions
    this.screenCollision();
  }
  //adds visual displays
  display(){
    //calculate the direction the player should be drawn at
    this.calculateDirection();
    //draw the player character
    push();
    //set the rect mode so drawing is at the center
    rectMode(CENTER);
    //move the origin to the player location so that the player is properly rotated
    translate(this.location.x, this.location.y);
    //rotate the player to face the calcualted direction
    rotate(this.direction.heading());
    //draw the player
    fill(color(this.chargeTime, this.chargeTime * 2, this.chargeTime / 2));
    rect(0,0,this.width,this.height);
    //draw the eyes on the player
    fill("white");
    rect(10,-10,5,5);
    rect(10,10,5,5);
    pop();
    //visual representation of the player hitbox
    /*
    push();
    translate(this.hurtBox.x, this.hurtBox.y);
    circle(0,0,this.hurtBoxRadius);
    pop();*/
    //draw the attack swing
    //if the player is attacking
    if(player.isAttacking){
      push();
      //translate to the hurt box location
      translate(this.hurtBox.x, this.hurtBox.y);
      //rotate this face the direction the player is facing
      rotate(player.direction.heading());
      //circle(0,0,55);
      //calculate which direction the swing is in
      var swingDirection = this.rightSwing ? 1.6 : -1.5;
      //adjust the position of the swing image
      var swingPosition = this.rightSwing ? new p5.Vector(-27,-27) : new p5.Vector(-27,-22);
      //rotate the swing to face the swing direction
      rotate(swingDirection);
      //add the swing image to the screen
      image(slashImg, swingPosition.x,swingPosition.y,this.hurtBoxRadius,this.hurtBoxRadius);
      pop();
    }
  }
  //moves location based on acceleration and velocity
  move() {
    //increase velocity based on acceleration
    this.velocity.add(this.acceleration);
    //limit velocity by max speed
    this.velocity.limit(this.maxSpeed);
    //update the location based on the velocty
    this.location.add(this.velocity);
    //clear out the acceleration so that it does not accumulate
    this.acceleration.mult(new p5.Vector(0,0));
  }
  //applys a simulated force to the acceleration
  //force => 3d vector representing a force to apply
  applyForce(force){
    this.acceleration.add(force);
  }
  //starts and ends a player attack
  attack(){
    //if the player is not currently attacking
    if(!player.isAttacking){
      //flag the player as attacking
      player.isAttacking = true;
      //determine if the attack is a right or left swing
      player.rightSwing = player.rightSwing ? false : true;
      //check if any enemies were hit
      player.hurtBoxCollision(enemies);
      //wait X number of seconds before allowing the player to attack again
      setTimeout(()=>{
        player.isAttacking = false;
      },100)
    }
  }
  //checks for enemy and player hurt box collision
  hurtBoxCollision(enemies){
    for (var enemy of enemies) {
      //check if the enemy has collided with the player hurtBox
      var hit = collideCircleCircleVector(this.hurtBox,this.hurtBoxRadius,enemy.location,enemy.radius);
      if(hit && this.isAttacking){
        //reduce the enemy health
        enemy.health--;
        var chargePower = map(this.chargeTime,0,100,1,3);
        //spawn some blood
        this.spawnBlood(enemy,Math.ceil(5 * chargePower));
        //calculate knockback
        enemy.knockBack = true;
        enemy.knockBackTime = 10 * chargePower * chargePower;
        enemy.timeToStop = 10 * chargePower * chargePower;
        enemy.knockBackForce = player.direction.normalize().mult(20);
        enemy.maxSpeed = 10;
      }
    }
  }
  //sets up key events for moving the player around the screen
  playerMovementKeys(){
    if (keyIsDown(65)) {
    //  player.maxSpeed = 4;
      player.applyForce(new p5.Vector(-1,0));
    }
    if (keyIsDown(68)) {
      //player.maxSpeed = 4;
      player.applyForce(new p5.Vector(1,0));
    }
    if (keyIsDown(87)) {
      //player.maxSpeed = 4;
      player.applyForce(new p5.Vector(0,-1));
    }
    if (keyIsDown(83)) {
      //player.maxSpeed = 4;
      player.applyForce(new p5.Vector(0,1));
    }
    //if none of the wasd keys are being held down
    if(!keyIsDown(65) && !keyIsDown(68) && !keyIsDown(87) && !keyIsDown(83)){
      player.velocity.setMag(0);
    }
  }
  //causes the player to dash in the direction they are moving
  dash(){
    this.maxSpeed = 10;
    setTimeout(()=>{
      this.maxSpeed = 4;
    },200);
  }
  //calculates the direction needed to point towards the mouse position
  calculateDirection(){
    //create a vector from the current position of the mouseX
    var mouse = new p5.Vector(mouseX,mouseY);
    //update the players direction to be a vector that points from the player location to the mouse location
    this.direction = p5.Vector.sub(mouse,this.location);
    //get the x and y coordinates of a point 40 px in front of the player after the player is rotated by the direction
    var rotated_x = player.location.x + 50 * cos(this.direction.heading());
    var rotated_y = player.location.y + 50 * sin(this.direction.heading());
    //update the hurtbox location to the newly rotated coordinates
    this.hurtBox = new p5.Vector(rotated_x,rotated_y);
  }
  //checks for screen bountry collision
  screenCollision(){
    if((this.location.x - this.width / 2) <= 0){//left side
      this.location.x = 0 + this.width / 2;
    }
    if((this.location.x + this.width / 2) >= width){//right side
      this.location.x = width - this.width / 2;
    }
    if((this.location.y - this.height / 2) <= 0){//top side
      this.location.y = 0 + this.height / 2;
    }
    if((this.location.y + this.height / 2) >= height){//bottom side
      this.location.y = height - this.height / 2;
    }
  }
  //spaws blood at the enemy's position
  //enemy => the enemy to spawn the blood at
  //num => how many drops of blood to spawn
  spawnBlood(enemy,num){
    for(var i = 0; i <= num; i++){
      //how far the blood should go
      var maxDistance = map(num,5,15,100,200);
      var minDistance = 20;
      var distance = p5.Vector.normalize(this.direction).mult(Math.random() * (maxDistance - minDistance) + minDistance);
      //the amount of rotation the blood should have
      var minRotation = 1.17;
      var maxRotation = 1.57;
      var direction = this.rightSwing ? 1 : -1;
      var rotation = (Math.random() * (maxRotation - minRotation) + minRotation) * direction;
      //rotate the distance traveled by the calculated rotation
      distance.rotate(rotation);
      //create a new blood spot
      var blood = new Blood(enemy.location.x,enemy.location.y,distance,enemy.color);
      //add the blood to the spots array
      bloodSpots.push(blood);
    }
  }

}
