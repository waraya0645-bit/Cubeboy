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

setupInteractionHandlers(this);
setupObjectsData(this);
setupMapData(this);
    
drawMapLayers(this, tileSize);
drawObjects(this, tileSize);
    
setupPlayer(this, tileSize);

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
