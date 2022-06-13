class Game {
  constructor() {
    this.resetarTitulo = createElement("h2");
    this.botaoResetar = createButton("");

    this.placarTitulo = createElement("h2");

    this.lugar1 = createElement("h2");
    this.lugar2 = createElement("h2");

    this.movendo = false;


  }

  pegarEstado() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
      gameState = data.val();
    });
  }
  atualizar(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  start() {
    player = new Player();
    playerCount = player.pegarQuant();

    form = new Form();
    form.exibir();

    car1 = createSprite(width / 2 - 50, height - 100);
    car1.addImage("car1",carimg1);
    car1.scale = 0.07;

    car2 = createSprite(width / 2 + 100, height - 100);
    car2.addImage("car2", carimg2);
    car2.scale = 0.07;

    cars = [car1, car2];


    //criar grupos

    combustiveis = new Group();
    moedas = new Group();


    // Adicionar sprite de combustível no jogo
    

    // Adicionar sprite de moeda no jogo
    this.addSprites(moedas, 18, moedaImg, 0.09);

   
   
  }

  addSprites(spriteGroup, numberOfSprites, spriteImage, scale) {
    for (var i = 0; i < numberOfSprites; i++) {
      var x, y;

      x = random(width / 2 + 150, width / 2 - 150);
      y = random(-height * 4.5, height - 400);  

      var sprite = createSprite(x, y);
      sprite.addImage("sprite", spriteImage);
      sprite.scale = scale;
      spriteGroup.add(sprite);

    }
  }

  porElementos() {
    form.esconder();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");

    //C39
    this.resetarTitulo.html("Reiniciar");
    this.resetarTitulo.class("resetText");
    this.resetarTitulo.position(width / 2 + 200, 40);

    this.botaoResetar.class("resetButton");
    this.botaoResetar.position(width / 2 + 230, 100);

    this.placarTitulo.html("Placar");
    this.placarTitulo.class("resetText");
    this.placarTitulo.position(width / 3 - 60, 40);

    this.lugar1.class("leadersText");
    this.lugar1.position(width / 3 - 50, 80);

    this.lugar2.class("leadersText");
    this.lugar2.position(width / 3 - 50, 130);
  }

  play() {
    this.porElementos();
    this.resetar();
    Player.pegarInfo();
   
     

    if (allPlayers !== undefined) {
      image(estrada, 0, -height * 5, width, height * 6);

      this.mostrarPlacar();

      //chamar a função para mostrar o combustível

      var i = 0;
      for (var p in allPlayers) {
 
        //use os dados do banco de dados para exibir os carros nas direções x e y
        var x = allPlayers[p].positionX;
        var y = height - allPlayers[p].positionY;

        cars[i].position.x = x;
        cars[i].position.y = y;
        

        var linhaChegada = height*6 - 100;

        if(player.positionY > linhaChegada){
          gameState = 2;
          player.rank+=1;
          Player.atualizarCarrosFinal(player.rank);
          player.atualizar();
          this.mostrarRank();

  
        }
       //adicione 1 ao índice para cada loop
        i++;
        if (i === player.index) {
          
          //chamar a função que coleta moedas e combustíveis
          this.coletarMoeda(i);

          this.coletarComb(i);
          //alterar a posição da câmera na direção y
          camera.position.y = y;
        }
      }

      

      //manipulando eventos de teclado
      this.controlarJogador();

      drawSprites();
    }
  }

  resetar() {
    this.botaoResetar.mousePressed(() => {
      database.ref("/").set({
        playerCount: 0,
        gameState: 0,
        players: {},
        carsAtEnd: 0
      });
      window.location.reload();
    });
  }

  mostrarPlacar() {
    var lugar1, lugar2;
    var players = Object.values(allPlayers);
    if (
      (players[0].rank === 0 && players[1].rank === 0) ||
      players[0].rank === 1
    ) {
      // &emsp;    Essa etiqueta é usada para exibir quatro espaços.
      lugar1 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;

        lugar2 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;
    }

    if (players[1].rank === 1) {
      lugar1 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;

        lugar2 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;
    }

    this.lugar1.html(lugar1);
    this.lugar2.html(lugar2);
  }


  //função que detecta a colisão entre o carro e a moeda
  coletarMoeda(i){

    cars[i-1].overlap(moedas, function(coletor, coletado){
      coletado.remove();
      player.score +=30;
      player.atualizar()
    })

  }

  //função para detectar a colisão entre o carro e o combustível
  coletarComb(i){

    //código para detectar a colisão entre os carros e os combustíveis

    //código para verificar se estão se movendo e diminuir a quantidade de combustível
    
    //código para verificar se o combustível do player é menor que 0 para terminar o jogo


  }

  //mostrar barra de combustível

  mostrarCombustivel(){
    image(combustivelImg, width/2 - 130, height - player.positionY - 100, 20,20);
    fill("orange");
  
  }

  
  mostrarRank() {
    swal({
      title: `Incrível!${"\n"}Rank${"\n"}${player.rank}`,
      text: "Você alcançou a linha de chegada com sucesso!",
      imageUrl:
        "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "Ok"
    });
  }

  gameOver(){
    swal({
      title: `Fim de jogo!`,
      text: "Oopss você perdeu a corrida",
      imageUrl: "https://i.postimg.cc/V5ydXyqj/deslike.png",
      imageSize: "100x100",
      confirmButtonText:"Obrigado por Jogar"

    })
  }


  controlarJogador() {
   

      if (keyIsDown(UP_ARROW)) {

        player.positionY += 10;
        player.atualizar();
      }
  
      if (keyIsDown(LEFT_ARROW) && player.positionX > width / 3 - 50) {
        player.positionX -= 5;
        player.atualizar();
      }
  
      if (keyIsDown(RIGHT_ARROW) && player.positionX < width / 2 + 300) {
        player.positionX += 5;
        player.atualizar();
      }
    
  }
  



}
