export class Square {
  private color = "red";
  private z = 40;
  private background;
  private mole;
  private mole2;
  private mole3;
  private road;
  private house;
  private fps = 60;
  private loop;

  constructor(private ctx: CanvasRenderingContext2D) {}


  init(ctx, roadPlace, direction) {
    this.background = new Image();
    this.mole = new Image();
    this.road = new Image();
    this.house = new Image();
    this.background = document.getElementById("grass");
    this.mole = document.getElementById("mole");
    this.mole2 = document.getElementById("mole_v2");
    this.mole3 = document.getElementById("mole_v3");
    this.house = document.getElementById("house");
    this.road = document.getElementById("road");
    ctx.drawImage(this.background, 40, 40, 40, 40);

    for (var i = 0; i < 10; i++) {
      for (var j = 0; j < 10; j++) {
        ctx.drawImage(this.background, j * 40, i * 40, 40, 40);
      }
    }

    this.background = document.getElementById("grass") as HTMLImageElement;
    this.house = document.getElementById("house") as HTMLImageElement;
    this.road = document.getElementById("road") as HTMLImageElement;
    ctx.drawImage(this.background, 40, 40, 40, 40);
      
    for (var i = 0; i < 11; i++) {
      for (var j = 0; j < 11; j++) {
          ctx.drawImage(this.background, j * 40, i * 40, 40, 40);
      }
    }

    for (var i = 0; i < 11; i++) {
      for (var j = 0; j < 11; j++) {
        if(direction){
          if(i == roadPlace){
            ctx.drawImage(this.road, j * 40, i * 40, 40, 40);
          }else{
            ctx.drawImage(this.background, j * 40, i * 40, 40, 40);
          }
        }else{
          if(j == roadPlace){
            ctx.drawImage(this.road, j * 40, i * 40, 40, 40);
          }else{
            ctx.drawImage(this.background, j * 40, i * 40, 40, 40);
          }
        }
      }
    }
    if(!direction){
      ctx.drawImage(this.house, roadPlace*40, 0, 40, 40);
      ctx.drawImage(this.house, roadPlace*40, 10*40, 40, 40);
    }else{
      ctx.drawImage(this.house, 0, roadPlace*40, 40, 40);
      ctx.drawImage(this.house, 10*40, roadPlace*40, 40, 40);
    }
  }

  draw(x:number, y:number, roadPlace:number, direction:number) {
      var context = this.ctx;
      var outerZ = this.z;

      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      this.init(context, roadPlace, direction);
      this.mole.src="../assets/mole_trp_smol.png";

      //(0,0)---(360,360) közötti koordináták az átló
      (outerZ*x) > 360 ? x = 0 : '';
      (outerZ*y) > 360 ? y = 0 : '';

      context.drawImage(this.mole, x * 40, y * 40, 36, 36);
    }

  drawMultiple(count:number, coordinateArray: Array<any>[], roadPlace:number, direction: number){
    var context = this.ctx;
    var outerZ = this.z;

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    this.init(context, roadPlace, direction);
    this.mole.src="../assets/mole_trp_smol.png";
    this.mole2.src="../assets/mole_trp_smol_v2.png";
    this.mole3.src="../assets/mole_trp_smol_v3.png";
    //(0,0)---(360,360) közötti koordináták az átló
    for(let i = 0 ; i < coordinateArray.length ; i++){
      (outerZ*coordinateArray[i]['x']) > 360 ? coordinateArray[i]['x'] = 0 : '';
      (outerZ*coordinateArray[i]['y']) > 360 ? coordinateArray[i]['y'] = 0 : '';
      if(i === 0){
        context.drawImage(this.mole, coordinateArray[i]['x'] * 40, coordinateArray[i]['y'] * 40, 36, 36);
      }else if(i === 1){
        context.drawImage(this.mole2, coordinateArray[i]['x'] * 40, coordinateArray[i]['y'] * 40, 36, 36);
      }else{
        context.drawImage(this.mole3, coordinateArray[i]['x'] * 40, coordinateArray[i]['y'] * 40, 36, 36);
      }
    }
  }

}