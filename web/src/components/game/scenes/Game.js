import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

import * as ROT from 'rot-js';

const HEIGHT = 100;
const WIDTH = 100;


export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    //map: Phaser.Tilemaps.Tilemap;
    create () {
      this.map = this.make.tilemap({ tileWidth: 16, tileHeight: 16, width: 16*100, height: 16*100 });
      //window.e = this.map;
      const tileset = this.map.addTilesetImage('background', 'background', 16, 16, 1, 2);
      const t72 = this.map.addTilesetImage('t72', 't72', 16, 16, 0, 0);
      //const t72_wall= this.map.addTilesetImage('t72_wall', 't72_wall', 16, 16, 0, 0);
        
      this.layer = this.map.createBlankLayer('Layer 1', tileset);
        this.cameras.main.setBackgroundColor(0x000000);
      // Fill with black tiles
      //this.layer.fill(20);
      //this.map.putTileAt(1, 0, 1);

      this.layer2 = this.map.createBlankLayer('Layer 2', t72);
      this.map.putTileAt(3, 2, 2, false, 'Layer 2');
         
      // window.m = m;
      let m = createTileMap(1, 1);
        
      //this.layer3 = this.map.createBlankLayer('Layer 3', t72_wall);
      const matrix = []

      for (let y = 0; y < HEIGHT; y++) {
          matrix[y] = [];

          for (let x = 0; x < WIDTH; x++) {
              let tile = m[`${x},${y}`];
              if(tile.walkable){
                  matrix[y][x] = 1;
                  let tiles = [
                      { index: 0, weight: 20 },
                      { index: 1, weight: 1 },
                      { index: 2, weight: 1 },
                      { index: 7, weight: 1 },
                      { index: 8, weight: 1 },
                      { index: 9, weight: 1 }
                  ]
                  this.map.weightedRandomize(tiles, x, y, 1, 1, 'Layer 2');
              } else {
                  matrix[y][x] = 0;
              }
          }
      }

      this.cameras.main.setZoom(4);
      let [playerX, playerY] = m.rooms[0].getCenter();
      this.cameras.main.centerOn(playerX * 16, playerY * 16);
      
        // Configurar la cámara para un renderizado pixel perfect
        this.cameras.main.setRoundPixels(true);

        // Asegurarse de que el juego se renderice sin suavizado de imágenes
        this.game.config.antialias = false;

	

      this.cameras.main.setBounds(0, 0, this.layer.width * this.layer.scaleX, this.layer.height * this.layer.scaleY);

      EventBus.addListener('center', ({x, y}) => {
          this.cameras.main.centerOn(x * 16, y * 16);
      })

      EventBus.addListener('updateState', (state) => {
        console.log("rerer")
        state.entities.forEach(element => {
            /*
                  const player = this.add.sprite(playerX * 16, playerY * 16, 'hero', 0);
      // Configurar la escala si es necesario (aquí asumo que el sprite original es de 32x32 y necesitas reducirlo a 16x16)
        player.setScale(0.5); // Escala a la mitad para obtener 16x16 si el sprite original es 32x32
        player.setOrigin(0.5, 0.5); // Asegúrate de que el sprite se centre correctamente
            */
            
        });
      });


      /*
        this.cameras.main.setBackgroundColor(0x00ff00);

        this.add.image(512, 384, 'background').setAlpha(0.5);

        this.add.text(512, 384, 'Make something fun!\nand share it with us:\nsupport@phaser.io', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        EventBus.emit('current-scene-ready', this);
        */

        /*
        let canHandleAction = true;
        let actionTimer;
        
        this.input.keyboard.on('keydown', (key) => {
            if(!canHandleAction) return;
            canHandleAction = false;
            clearTimeout(actionTimer);
            actionTimer = setTimeout(() => {
                canHandleAction = true;
            }, 100);
          if (key.key === 'ArrowUp' || key.key === 'w') {
              // this.cameras.main.scrollY -= 16;
              EventBus.emit('ArrowUp');
          } else if (key.key === 'ArrowDown' || key.key === 's') {
              //this.cameras.main.scrollY += 16;
              EventBus.emit('ArrowDown');
          } else if (key.key === 'ArrowLeft' || key.key === 'a') {
              //this.cameras.main.scrollX -= 16;
              EventBus.emit('ArrowLeft');
          } else if (key.key === 'ArrowRight' || key.key === 'd') {
              //this.cameras.main.scrollX += 16;
              EventBus.emit('ArrowRight');  
          }
        
        }, this);
        */
    }
    

    changeScene ()
    {
        //this.scene.start('GameOver');
    }
}




function createTileMap(seed, dungeonLevel) {
    let tileMap = [];
    const digger = new ROT.Map.Digger(WIDTH, HEIGHT, {
        roomWidth: [6, 10],
        roomHeight: [6, 10],
        corridorLength: [1, 3],
    });
    digger.create((x, y, contents) => {
        tileMap[`${x},${y}`] = {
            walkable: contents === 0,
            wall: contents === 1,
            explored: false,
        };
    }); 
    tileMap.dungeonLevel = dungeonLevel;
    tileMap.rooms = digger.getRooms();
    tileMap.corridors = digger.getCorridors();


    // Put the player in the first room
    //let [playerX, playerY] = tileMap.rooms[0].getCenter();
    //moveEntityTo(player, {x: playerX, y: playerY});

    // Put stairs in the last room
    //let [stairX, stairY] = tileMap.rooms[tileMap.rooms.length-1].getCenter();
    //createEntity('stairs', {x: stairX, y: stairY});

    // Put monster and items in all the rooms
    //for (let room of tileMap.rooms) {
    //    populateRoom(room, dungeonLevel);
    //}

    //updateTileMapFov(tileMap);
    return tileMap;
}