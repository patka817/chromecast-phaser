class PhaserRenderStateManager {
    _onStateChanged;
    _spriteState = new Map(); // id -> spriteDTO

    onStateChanged(callback) {
        this._onStateChanged = callback;
        this.sendInitializeState();
    }

    spriteState() {
        return [...this._spriteState.values()];
    }

    sendInitializeState() {
        if (this._spriteState.size > 0) {
            this._onStateChanged(this.spriteState().map(dto => { return { a: 'A', ...dto }}));
        }
    }

    hasShownError = false;
    updateSpritesState = (sprites) => {
        let spriteDTOsToSync = sprites.reduce((result, el) => {
            if (!el.id) {
                if (!this.hasShownError) {
                    console.error('Missing id on sprite, this must be set to use the syncmanager');
                    this.hasShownError = true;
                }
                return result;
            }
            let state = this._spriteState.get(el.id);

            let action = state ? 'U' : 'A';
            let spriteDTO = this.makeSpriteDTO(el);

            if (state && this.isEqual(spriteDTO, state)) {
                return result;
            } else if (state && el.active !== state.active && el.active === false) {
                action = 'D';
                this._spriteState.delete(el.id);
            } else if (el.active === true) {
                this._spriteState.set(spriteDTO.id, spriteDTO);
            } else if (el.active === false) {
                return result;
            }
            return result.concat({ a: action, ...spriteDTO });
        }, []);
        
        if (this._onStateChanged && spriteDTOsToSync.length > 0) {
            this._onStateChanged(spriteDTOsToSync);
        }
    };

    makeSpriteDTO({id, x, y, scale, tint, angle, frame, active }) {
        return {id, x, y, scale, tint, angle, skin: frame.name, active};
    }

    // one-level equality check
    isEqual(obj, otherObj) {
        let props = Object.getOwnPropertyNames(obj);
        for (const propIndex in props) {
            const prop = props[propIndex];
            if (obj[prop] !== otherObj[prop]) {
                return false;
            }
        }
        return true;
    }
}