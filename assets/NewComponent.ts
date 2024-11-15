import { RigidBody2D, _decorator, Component, BoxCollider2D } from 'cc';
import { MovementController } from './controller';

const { ccclass, property } = _decorator;

@ccclass('RoleA')
export class NewComponent extends Component {
  @property(MovementController)
  movementCon = null!;

  @property(RigidBody2D)
  rigidBody: RigidBody2D = null!;

  onLoad() {
    this.rigidBody = this.getComponent(RigidBody2D);
    this.addComponent(BoxCollider2D);
    this.movementCon = this.addComponent(MovementController);
    this.movementCon.init({
      initStep: { x: 1, y: 0 },
    });
  }

  onDestroy() {}

  update() {
    this.node.setPosition(
      this.node.position.clone().add(this.movementCon.getMoveDirection()),
    );
  }
}
