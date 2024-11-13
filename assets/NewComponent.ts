import {
  _decorator,
  Component,
  EventKeyboard,
  KeyCode,
  Vec3,
  Input,
  game,
} from "cc";
const { ccclass, property } = _decorator;

const keyPressingMap = {};

@ccclass("NewComponent")
export class NewComponent extends Component {
  inputIns = new Input();
  moveDirection = new Vec3(0, 0, 0); // 移动方向

  // 在节点加载时绑定键盘事件
  onLoad() {
    // 监听键盘按下事件
    this.inputIns.on(Input.EventType.KEY_DOWN, this.onKeyPressing, this);
    this.inputIns.on(Input.EventType.KEY_PRESSING, this.onKeyPressing, this);
    this.inputIns.on(Input.EventType.KEY_UP, this.onKeyUp, this);
  }

  // 键盘按下事件处理
  private onKeyPressing(event: EventKeyboard) {
    const { keyCode } = event;
    keyPressingMap[keyCode] = true;
    switch (keyCode) {
      case KeyCode.ARROW_LEFT:
        this.moveDirection.x = -1;
        break;
      case KeyCode.ARROW_RIGHT:
        this.moveDirection.x = 1;
        break;
      case KeyCode.ARROW_UP:
        this.moveDirection.y = 1;
        break;
      case KeyCode.ARROW_DOWN:
        this.moveDirection.y = -1;
        break;
    }
  }

  // 键盘抬起事件处理
  private onKeyUp(event: EventKeyboard) {
    const { keyCode } = event;
    keyPressingMap[keyCode] = false;
    console.log("=======> keyPressingMap:", keyPressingMap);
    switch (keyCode) {
      case KeyCode.ARROW_LEFT:
        keyPressingMap[KeyCode.ARROW_RIGHT] === true
          ? (this.moveDirection.x = 1)
          : (this.moveDirection.x = 0);
        break;
      case KeyCode.ARROW_RIGHT:
        keyPressingMap[KeyCode.ARROW_LEFT] === true
          ? (this.moveDirection.x = -1)
          : (this.moveDirection.x = 0);
        break;
      case KeyCode.ARROW_UP:
        keyPressingMap[KeyCode.ARROW_DOWN] === true
          ? (this.moveDirection.y = -1)
          : (this.moveDirection.y = 0);
        break;
      case KeyCode.ARROW_DOWN:
        keyPressingMap[KeyCode.ARROW_UP] === true
          ? (this.moveDirection.y = 1)
          : (this.moveDirection.y = 0);
        break;
    }
  }

  onDestroy() {
    // 清理事件监听
    this.inputIns.off(Input.EventType.KEY_DOWN, this.onKeyPressing, this);
    this.inputIns.off(Input.EventType.KEY_PRESSING, this.onKeyPressing, this);
    this.inputIns.off(Input.EventType.KEY_UP, this.onKeyUp, this);
  }

  update() {
    this.node.setPosition(
      this.node.position
        .clone()
        .add(this.moveDirection.clone().multiplyScalar(6))
    );
  }
}
