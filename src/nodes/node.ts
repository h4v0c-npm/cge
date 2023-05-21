import { mat3, vec2 } from 'gl-matrix';
import { Base } from '../utils/base';
import { Renderer } from '../renderer';

export class Node extends Base {
    position: vec2 = vec2.create();
    rotation: number = 0.0;
    scale: vec2 = vec2.fromValues(1, 1);

    localMatrix: mat3 = mat3.create();
    worldMatrix: mat3 = mat3.create();

    parent: Node;
    children: Node[] = [];

    setParent(parent: Node) {
        if (this.parent) {
            const childIndex: number = this.parent.children.findIndex((child: Node) => (child.id === this.id));

            if (childIndex >= 0) {
                this.parent.children.splice(childIndex, 1);
            }

            this.parent = undefined;
        }

        if (parent) {
            this.parent = parent;
            this.parent.children.push(this);
        }
    }

    updateLocalMatrix() {
        mat3.translate(this.localMatrix, mat3.create(), this.position);
        mat3.rotate(this.localMatrix, this.localMatrix, this.rotation);
        mat3.scale(this.localMatrix, this.localMatrix, this.scale);
    }

    updateWorldMatrix() {
        this.updateLocalMatrix();

        if (this.parent) {
            mat3.multiply(this.worldMatrix, this.localMatrix, this.parent.worldMatrix);
        } else {
            mat3.copy(this.worldMatrix, this.localMatrix);
        }

        this.children.forEach((child: Node) => child.updateWorldMatrix());
    }

    update(time: number, deltaTime: number) {
        this.children.forEach((child: Node) => child.update(time, deltaTime));
    }

    render(renderer: Renderer) {
        this.children.forEach((child: Node) => child.render(renderer));
    }
}
