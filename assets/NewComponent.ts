import { _decorator, Component } from 'cc';
import { MovementController } from './controller';

const { ccclass } = _decorator;

@ccclass('NewComponent')
export class NewComponent extends Component {
  movementCon = new MovementController({
    initStep: { x: 1, y: 1.5 },
    node: this,
  });

  onLoad() {
    this.movementCon.loadEvent();
  }

  onDestroy() {
    this.movementCon.destroyEvent();
  }

  update() {
    this.node.setPosition(
      this.node.position
        .clone()
        .add(this.movementCon.moveDirection.clone().multiplyScalar(6)),
    );
  }
}
