import type { Node, EventKeyboard } from 'cc';
import { Component, Input, KeyCode, RigidBody2D, Vec2, Vec3 } from 'cc';

import { includesInArray } from '../utils';

type TypeMovementControllerProps = {
  /** 初始化移速步长 */
  initStep: { x?: number; y?: number; z?: number };
};

/** 移动控制器 */
export class MovementController extends Component {
  initStep: TypeMovementControllerProps['initStep'];
  /** 当前方向, 默认是右 */
  sign: '-' | '+' = '+';
  /** 移动方向 */
  moveDirection = new Vec3(0, 0, 0);
  /** 操作输入 */
  inputIns = new Input();
  /**  待销毁队列 */
  destroyFnList: (() => void)[] = [];
  /** 记录按键持续按压 */
  keyPressingMap: Partial<Record<KeyCode, boolean>> = {};
  /** 按键操作映射 */
  keyOperateMap = {
    [KeyCode.ARROW_LEFT]: {
      sign: '-',
      prop: 'x',
      reverseKeyCode: KeyCode.ARROW_RIGHT,
    },
    [KeyCode.ARROW_RIGHT]: {
      sign: '+',
      prop: 'x',
      reverseKeyCode: KeyCode.ARROW_LEFT,
    },
    [KeyCode.ARROW_UP]: {
      sign: '+',
      prop: 'y',
      reverseKeyCode: KeyCode.ARROW_DOWN,
    },
    [KeyCode.ARROW_DOWN]: {
      sign: '-',
      prop: 'y',
      reverseKeyCode: KeyCode.ARROW_UP,
    },
    [KeyCode.KEY_A]: {
      sign: '-',
      prop: 'x',
      reverseKeyCode: KeyCode.KEY_D,
    },
    [KeyCode.KEY_D]: {
      sign: '+',
      prop: 'x',
      reverseKeyCode: KeyCode.KEY_A,
    },
    [KeyCode.KEY_W]: {
      sign: '+',
      prop: 'y',
      reverseKeyCode: KeyCode.KEY_S,
    },
    [KeyCode.KEY_S]: {
      sign: '-',
      prop: 'y',
      reverseKeyCode: KeyCode.KEY_W,
    },
  } as const;

  init(props: TypeMovementControllerProps) {
    const {
      initStep: { x = 0, y = 0, z = 0 },
    } = props;

    this.initStep = { x, y, z };
  }

  /** 获取有符号移动结果 */
  getSignMove(sign: '-' | '+', prop: keyof typeof this.initStep) {
    return Number(`${sign}${this.initStep[prop]}`);
  }

  jumpEvent = (e: EventKeyboard) => {
    if (e.keyCode === KeyCode.SPACE && e.type === Input.EventType.KEY_DOWN) {
      this.node
        .getComponent(RigidBody2D)
        .applyForceToCenter(
          new Vec2(this.getSignMove(this.sign, 'x'), 0.5),
          true,
        );
    }
  };

  moveEvent = (e: EventKeyboard) => {
    // console.log('e--->', e);
    const operate = this.keyOperateMap[e.keyCode];

    if (!operate) {
      return;
    }
    const { sign, prop, reverseKeyCode } = operate;
    const isEnter = includesInArray(
      [Input.EventType.KEY_DOWN, Input.EventType.KEY_PRESSING],
      e.type,
    );
    const isLeave = includesInArray([Input.EventType.KEY_UP], e.type);
    const res = this.getSignMove(sign, prop);

    if (e.type === Input.EventType.KEY_DOWN) {
      /** 记录当前方向 */
      this.sign = sign;
    }

    if (isEnter) {
      this.keyPressingMap[e.keyCode] = true;
      this.moveDirection[prop] = res;
    }

    if (isLeave) {
      this.keyPressingMap[e.keyCode] = false;
      this.moveDirection[prop] = this.keyPressingMap[reverseKeyCode] ? -res : 0;
    }
  };

  onLoad() {
    const removeListener = batchInputListener({
      inputIns: this.inputIns,
      typeArr: [
        Input.EventType.KEY_DOWN,
        Input.EventType.KEY_UP,
        Input.EventType.KEY_PRESSING,
      ],
      callback: (e) => {
        this.moveEvent(e);
        this.jumpEvent(e);
      },
      node: this.node,
    });

    this.destroyFnList.push(removeListener);
  }

  update() {
    const { linearVelocity } = this.node.getComponent(RigidBody2D);
  }

  onDestroy() {
    this.destroyFnList.forEach((fn) => fn());
  }

  getMoveDirection() {
    return this.moveDirection.clone();
  }
}

/** 批量Input监听 */
function batchInputListener(params: {
  inputIns: Input;
  typeArr: Input.EventType[];
  callback: (e: EventKeyboard) => void;
  node?: Node;
}) {
  const { inputIns, typeArr, callback, node } = params;

  typeArr.forEach((type) => {
    /** 不知道为什么 Input.EventType.MOUSE_LEAVE 和 Input.EventType.MOUSE_ENTER 未添加类型,怀疑是官方bug, 实际可以监听 */
    inputIns.on(type as any, callback, node);
  });

  return function removeListener() {
    typeArr.forEach((type) => {
      inputIns.off(type as any, callback, node);
    });
  };
}
