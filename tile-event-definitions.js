function setupTileEventDefinitions(scene) {
    scene.tileEventDefinitions = {
        1: {
            interactionType: 'talk',
            once: true,
            trigger: 'interact',
            parameters: {
                message: 'こんにちは'
            }
        },

        2: {
            interactionType: 'other',
            once: false,
            trigger: 'step',
            parameters: {
                value: 123
            }
        },
        // イベント3：マップBへ移動
        3: {
            interactionType: 'mapTransition',
            trigger: 'step',
            once: false,
            parameters: {
                mapId: 'mapB',
                spawnX: 4,
                spawnY: 5
            }
        }
    };
}
