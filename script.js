// Deploy Preview test
const config = {
    type: Phaser.AUTO,
    width: 1152,
    height: 648,
    parent: 'game',
    backgroundColor: '#c0c0c0',

    pixelArt: true,

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },

    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function create() {
// レイヤー管理
this.layers = {
floor: [],
wallCollision: [],
wallVisual: [],
decorationCollision: [],
decorationVisual: []
};
this.mapOffsetY = 4;
const tileSize = 64;
// カメラが移動できる範囲（54×30マス）
this.cameras.main.setBounds(
0,
0,
72 * tileSize,
30 * tileSize + (this.scale.height - 10 * tileSize)
);
this.inventory = this.inventory || {};

this.interactionHandlers = {
// アイテムを拾う
pickup: (obj) => {
if (obj.pickedUp) return;

obj.pickedUp = true;  
    obj.interactable = false;  
    obj.collidable = false;  
    obj.sprite.setVisible(false);  
    obj.visible = false;  

    const itemId = obj.itemId || obj.image;  

    this.inventory[itemId] =  
        (this.inventory[itemId] || 0) + 1;  
},  
// 自分を消して、別のオブジェクトを出現させる  
reveal: (obj) => {  
    if (obj.isInteracting) return;  

    obj.isInteracting = true;  
    obj.interactable = false;  

    this.interactionText.setText(  
        obj.image + ' にインタラクトしました'  
    );  

    this.tweens.add({  
        targets: obj.sprite,  
        alpha: 0,  
        duration: 600,  

        onComplete: () => {  
            obj.collidable = false;  
            obj.sprite.setVisible(false);  
            obj.visible = false;  

            const nextObject = this.objects.find(  
                item => item.image === obj.revealImage  
            );  

            if (nextObject && nextObject.sprite) {  
                nextObject.sprite.setAlpha(1);  
                nextObject.sprite.setVisible(true);  
                nextObject.visible = true;  
                nextObject.interactable = true;  
            }  
        }  
    });  
}

};
// オブジェクトの配置
this.objects = [
{
tileX: 50,tileY: 12,image: '200',
hitboxWidth: 31,hitboxHeight: 30,
interactable: true,
interactionType: 'reveal',
revealImage: '201'
},
{
tileX: 50,tileY: 12,image: '201',
hitboxWidth: 31,hitboxHeight: 30,
interactable: false,
interactionType: 'pickup',
visible: false
}
];
    
setupMapData(this);
    
drawMapLayers(this, tileSize);
// ================================
// 6. オブジェクトの表示
// ================================

this.objects.forEach((obj) => {

    const objectImage = this.add.image(
        obj.tileX * tileSize + tileSize / 2,
        obj.tileY * tileSize + tileSize / 2 + this.mapOffsetY,
        obj.image
    );

    objectImage.setDepth(
        obj.tileY * tileSize + tileSize / 2 + this.mapOffsetY
    );

    // 最初から非表示のオブジェクトは隠す
    if (obj.visible === false) {
        objectImage.setVisible(false);
    }

    // オブジェクトと画像を紐づける
    obj.sprite = objectImage;
});
    
// プレイヤーの初期位置（タイル座標）
const playerStartTileX = 27;
const playerStartTileY = 3;

// タイル座標を画面座標に変換
const playerStartX =
    playerStartTileX * tileSize + tileSize / 2;

const playerStartY =
    playerStartTileY * tileSize +
    tileSize / 2 +
    this.mapOffsetY;

// プレイヤーの画像
const player = this.add.image(
    playerStartX,
    playerStartY,
    'front_cube'
);

this.player = player;

// 当たり判定用の座標
this.playerBody = {
    x: playerStartX,
    y: playerStartY
};

this.currentRoomX = 0;
this.currentRoomY = 0;

setupJoystick(this);

// ================================
// 画面の左右で操作を分ける
// ================================

this.input.on('pointerdown', (pointer) => {

    // 左半分：ジョイスティック操作
    if (handleJoystickPointerDown(this, pointer)) {
        return;
    }

    // 右半分：インタラクト
    handleInteraction(this);
});
    
// ================================
// インタラクト結果の表示欄
// ================================

this.interactionText = this.add.text(
    10,
    45,
    '右半分をタップしてインタラクト',
    {
        fontSize: '20px',
        color: '#ffffff',
        backgroundColor: '#333333',
        padding: {
            x: 8,
            y: 6
        }
    }
);

// カメラが動いても画面上の同じ位置に表示
this.interactionText.setScrollFactor(0);

// 最前面に表示
this.interactionText.setDepth(10002);

setupStartScreen(this);
}

function update(time, delta) {
    updatePlayer.call(this, time, delta);
}
