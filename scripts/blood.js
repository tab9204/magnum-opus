class Blood {
  constructor(x,y,path,color){
    //enemy position on the screen
    this.location = new p5.Vector(x,y);
    //rate of change of location
    this.velocity = new p5.Vector(0,0);
    //rate of change of velocity
    this.acceleration = new p5.Vector(0,0);
    //maximum velocity
    this.maxSpeed = 30;
    //the maximum force that can applied to acceleration
    this.maxForce = 20;
    //size of the blood spot
    this.radius = 15;
    //the path the blood spot should travel in
    this.path = path;
    //how far the blood has traveled
    this.distance = 0;
    //the position the blood should stop at
    this.stop = p5.Vector.add(this.location,this.path);
    //amount of time the blood should live once it has stopped moving
    this.timeToLive = 30;
    //flags that the particle is dead and can be removed
    this.dead = false;
    //the color of the blood
    this.color = color;
  }
  //update loop
  update(){
    this.display();
    this.applyForce(this.path);
    //check if the distance between the current location and the stop location is less then the max speed
    //if so that means the blood will overshoot the stop location next time it moves
    if(p5.Vector.sub(this.location,this.stop).mag() <= this.maxSpeed){
      //set the location to the stop location
      this.location = this.stop;
      //prevent the blood from moving anymore
      this.maxSpeed = 0;

      //start counting down the bloods time to live
      this.timeToLive --;
      if(this.timeToLive <= 0){
        //add the blood to the background image
        drawToBackground(this.location.x,this.location.y,7.5,this.color);
      }
      this.dead = this.timeToLive <= 0 ? true : false;
    }
    //move the blood
    this.move();
  }
  //displays the blood particle
  display(){
    push();
    noStroke();
    fill(color(this.color));
    translate(0,0);
    circle(this.location.x,this.location.y,this.radius);
    /*beginShape();
    vertex(this.location.x, this.location.y);
    vertex(this.landing.x, this.landing.y);
    vertex(this.landing.x + 50, this.landing.y - 50);
    endShape();*/
    pop();
  }
  move() {
    //increase velocity based on acceleration
    this.velocity.add(this.acceleration);
    //limit velocity by max speed
    this.velocity.limit(this.maxSpeed);
    this.velocity.rotate(.02);
    //update the location based on the velocty
    this.location.add(this.velocity);
    //clear out the acceleration so that it does not accumulate
    this.acceleration.mult(new p5.Vector(0,0));
    //update the distance based on velociy magnitude
    this.distance += this.velocity.mag();

  }
  applyForce(force){
    this.acceleration.add(force);
  }
}
