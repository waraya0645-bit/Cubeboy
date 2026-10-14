function setupTileEventDefinitions(scene) {
    scene.tileEventDefinitions = {
        1: {
            interactionType: 'talk',
            parameters: {
                message: 'こんにちは'
            }
        },

        2: {
            interactionType: 'other',
            parameters: {
                value: 123
            }
        }
    };
}
