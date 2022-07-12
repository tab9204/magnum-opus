class Enemy {
  constructor(x,y,health,color){
    //enemy position on the screen
    this.location = new p5.Vector(x,y);
    //rate of change of location
    this.velocity = new p5.Vector(0,0);
    //rate of change of velocity
    this.acceleration = new p5.Vector(0,0);
    //maximum velocity
    this.maxSpeed = 2;
    //the maximum force that can applied to acceleration
    this.maxForce = .5;
    //size of the enemy
    this.radius = 30;
    //flags if the enemy has been knocked back by a player attack
    this.knockBack = false;
    //how long the knock back should last
    this.knockBackTime;
    //clone of the knock back time that does not decrease
    this.timeToStop;
    //the force of the knockback
    this.knockBackForce;
    //the number of hits the enemy can take before dying
    this.health = health;
    //a count down to delay when the enemy is removed from the screen
    this.removal = 150;
    //flags that the enemy is ready to be removed from the screen
    this.isDead = false;
    //the color of the enemy
    //uses the p5 color object
    this.color = color;
  }
  //update loop
  update(){
    //display the enemy
    this.display();
    //check the screen bounds
    this.screenCollision();
    //move the enemy
    this.move();
    //have the enemy seek the player location
    this.seek(player.location);
    //check for knockback
    this.knockedBack();
    this.checkHealth();
  }
  //draws the enemy to the screen
  display(){
    if(this.health > 0){
      push();
      stroke("black");
      fill(color(this.color));
      translate(0,0);
      circle(this.location.x,this.location.y,this.radius);
      pop();
    }
    else{
      push();
      fill(color(0, 0,0,255));
      stroke(color(0, 0,0,255));
      translate(0,0);
      circle(this.location.x,this.location.y,this.radius);
      pop();
    }
  }
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
  applyForce(force){
    this.acceleration.add(force);
  }
  //calculates and applys a force towards a specified target location
  seek(target){
    //the velocity needed to reach the target from the current location
    var desired = p5.Vector.sub(target,this.location);
    //the force needed to chance the current velocity to the desired velocity
    var steer =  p5.Vector.sub(desired,this.velocity);
    //limit the steering force to the max force
    steer.limit(this.maxForce);
    //apply the steer force to mel
    this.applyForce(steer);
  }
  //checks if the enemy has been knocked back and if so applies a knock back force to it
  knockedBack(){
    //if the enemy is being knocked back
    if(this.knockBack){
      this.applyForce(this.knockBackForce);
      this.knockBackTime --;
      if(this.knockBackTime <= 0){
        this.maxSpeed -= .5;
        if(this.maxSpeed <= 2){
            this.knockBack = false;
        }
      }
    }
  }
  //checks how much health the enemy has and kills it if it is 0
  checkHealth(){
    //if health is 0 or below
    if(this.health <= 0){
      //stop the enemy from moving
      this.maxSpeed = 0;
      //start the removal count down
      this.removal--;
      if(this.removal <= 0 && !this.knockBack){
        this.isDead = true;
      }
    }
  }
  //checks for screen bountry collision
  screenCollision(){
    if((this.location.x - this.radius) <= 0){//left side
      this.location.x = 0 + this.radius;
    }
    if((this.location.x + this.radius) >= width){//right side
      this.location.x = width - this.radius;
    }
    if((this.location.y - this.radius) <= 0){//top side
      this.location.y = 0 + this.radius;
    }
    if((this.location.y + this.radius) >= height){//bottom side
      this.location.y = height - this.radius;
    }
  }
}
