class PhaserRenderStateSceneUpdater {
    // TODO: connect to scene by scene-key?!
    constructor(game) {
        this.game = game;
        this.objects = new Map();
        this.dtosToRender = new Map();
        this.polling = false;
    }

    startPollingForActiveScene = () => {
        if (this.polling) {
            return;
        }
        this.polling = true;
        setTimeout(this.pollActiveScene, 250);
    }

    pollActiveScene = () => {
        this.polling = false;
        this.renderStateObjects([]);
    }

    getActiveScene = () => {
        const scene = game.scene.scenes[0];
        return (scene && scene.scene.isActive() === true) ? scene : null;
    }

    renderStateObjects = (renderDTOs) => {
        const activeScene = this.getActiveScene();
        if (!activeScene || this.polling) {
            renderDTOs.forEach(dto => this.dtosToRender.set(dto.id, dto));
            this.startPollingForActiveScene();
            return;
        }
        if (this.dtosToRender.size > 0) {
            renderDTOs.forEach(dto => this.dtosToRender.set(dto.id, dto));
            renderDTOs = [...this.dtosToRender.values()];
            this.dtosToRender.clear();
        }
        renderDTOs.forEach(dto => {
            let object = this.objects.get(dto.id);
            if (dto.a === 'D' && object) {
                object.destroy();
                this.objects.delete(dto.id);
                return;
            } else if (dto.a !== 'D' && !object) { // handle the case if we missed an add
                object = activeScene.add.image(dto.x, dto.y, dto.skin);
                this.objects.set(dto.id, object);
            } else if (object) {
                object.x = dto.x;
                object.y = dto.y;
            } else {
                console.error('Invalid DTO (missing among objects or invalid action): ' + JSON.stringify(dto));
                return;
            }
            this.setTintAngleScale(object, dto);
        });
    }

    setTintAngleScale = (obj, {tint, scale, angle }) => {
        if (scale && typeof scale === 'number') {
            obj.setScale(scale);
        } else if (scale) {
            obj.setScale(scale.x, scale.y);
        }
        if (tint) {
            obj.setTint(tint);
        }
        if (angle) {
            obj.angle = angle;
        }
    }
}
