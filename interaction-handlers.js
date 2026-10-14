function setupInteractionHandlers(scene) {
    scene.interactionHandlers = {
        pickup: (obj) => {
            if (obj.pickedUp) return;

            obj.pickedUp = true;
            obj.interactable = false;
            obj.collidable = false;
            obj.sprite.setVisible(false);
            obj.visible = false;

            const itemId = obj.itemId || obj.image;
            scene.inventory[itemId] = (scene.inventory[itemId] || 0) + 1;
        },

        reveal: (obj) => {
            if (obj.isInteracting) return;

            obj.isInteracting = true;
            obj.interactable = false;
            scene.interactionText.setText(obj.image + ' にインタラクトしました');

            scene.tweens.add({
                targets: obj.sprite,
                alpha: 0,
                duration: 600,
                onComplete: () => {
                    obj.collidable = false;
                    obj.sprite.setVisible(false);
                    obj.visible = false;

                    const nextObject = scene.objects.find(
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
        },

talk: (event) => {
    console.log(event.parameters.message);
},

other: (event) => {
    console.log('イベント2:', event.parameters.value);
}
};
}
