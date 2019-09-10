class SyncableScene extends Phaser.Scene {
    objects = [];
    isLoaded = false;

    renderObjects = (newObjects) => {
        // dumb update. Can be improved by enforcing id.. 
        this.objects.forEach(el => el.destroy() );
        // TODO: Handle text
        this.objects = newObjects.map(({x, y, scale, tint, skin, angle}) => {
            let newObj = this.add.image(x, y, skin);
            if (scale && typeof scale === 'number') {
                newObj.setScale(scale);
            } else if (scale) {
                newObj.setScale(scale.x, scale.y);
            }
            if (tint) {
                newObj.setTint(tint);
            }
            if (angle) {
                newObj.angle = angle;
            }
            return newObj;
        });
    };

    create() {
        this.isLoaded = true;
    }
}

class PhaserRenderStateSceneUpdater {
    constructor(game) {
        this.game = game;
        this.objects = new Map();
        this.dtosToRender = new Map();
    }

    renderStateObjects(renderDTOs) {
        const activeScene = game.scene.scenes[0];
        if (activeScene.isLoaded === false) {
            renderDTOs.forEach(dto => this.dtosToRender.set(dto.id, dto));
            return;
        }
        if (this.dtosToRender.length > 0) {
            renderDTOs.forEach(dto => this.dtosToRender.set(dto.id, dto));
            renderDTOs = this.dtosToRender.values();
            this.dtosToRender = [];
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

    setTintAngleScale(obj, {tint, scale, angle }) {
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