import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

        //this.load.image('background', '/assets/bg.png');
        this.load.image('background', 'https://raw.githubusercontent.com/eugenioclrc/stackr-quest/main/frontend/static/tileset.png');
        this.load.image('t72', 'https://raw.githubusercontent.com/eugenioclrc/stackr-quest/main/frontend/static/0x72_DungeonTilesetII_v1.7/atlas_floor-16x16.png');
        this.load.spritesheet('hero', 'https://raw.githubusercontent.com/Gamegur-us/roguelike-js/master/src/assets/images/hero.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('orc', 'https://raw.githubusercontent.com/Gamegur-us/roguelike-js/master/src/assets/images/orc.png', { frameWidth: 16, frameHeight: 16 });
        
        
        // this.load.image('t72_wall', '/0x72_DungeonTilesetII_v1.7/atlas_walls_low-16x16.png');
    }

    create ()
    {
        this.scene.start('Preloader');
    }
}