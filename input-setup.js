function setupInput(scene) {
    scene.input.on('pointerdown', (pointer) => {
        if (handleJoystickPointerDown(scene, pointer)) return;
        handleInteraction(scene);
    });
}
