import type { Component, EventKeyboard } from 'cc';
import { Input, KeyCode, Vec3 } from 'cc';
import { includesInArray } from '../utils';

type TypeMovementControllerProps = {
  /** 初始化移速步长 */
  initStep: { x?: number; y?: number; z?: number };
  /** 绑定节点 */
  node: Component;
};

/** 移动控制器 */
export class MovementController {
  node: TypeMovementControllerProps['node'];
  initStep: TypeMovementControllerProps['initStep'];
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
      symbol: '-',
      prop: 'x',
      reverseKeyCode: KeyCode.ARROW_RIGHT,
    },
    [KeyCode.ARROW_RIGHT]: {
      symbol: '+',
      prop: 'x',
      reverseKeyCode: KeyCode.ARROW_LEFT,
    },
    [KeyCode.ARROW_UP]: {
      symbol: '+',
      prop: 'y',
      reverseKeyCode: KeyCode.ARROW_DOWN,
    },
    [KeyCode.ARROW_DOWN]: {
      symbol: '-',
      prop: 'y',
      reverseKeyCode: KeyCode.ARROW_UP,
    },
    [KeyCode.KEY_A]: {
      symbol: '-',
      prop: 'x',
      reverseKeyCode: KeyCode.KEY_D,
    },
    [KeyCode.KEY_D]: {
      symbol: '+',
      prop: 'x',
      reverseKeyCode: KeyCode.KEY_A,
    },
    [KeyCode.KEY_W]: {
      symbol: '+',
      prop: 'y',
      reverseKeyCode: KeyCode.KEY_S,
    },
    [KeyCode.KEY_S]: {
      symbol: '-',
      prop: 'y',
      reverseKeyCode: KeyCode.KEY_W,
    },
  } as const;

  constructor(props: TypeMovementControllerProps) {
    const {
      initStep: { x = 0, y = 0, z = 0 },
      node,
    } = props;

    this.initStep = { x, y, z };
    this.node = node;
  }

  inputEvent = (e: EventKeyboard) => {
    // console.log('e--->', e);
    const operate = this.keyOperateMap[e.keyCode];

    if (!operate) {
      return;
    }
    const { symbol, prop, reverseKeyCode } = operate;
    const isEnter = includesInArray(
      [Input.EventType.KEY_DOWN, Input.EventType.KEY_PRESSING],
      e.type,
    );
    const isLeave = includesInArray([Input.EventType.KEY_UP], e.type);
    const res = Number(`${symbol}${this.initStep[prop]}`);

    if (isEnter) {
      this.keyPressingMap[e.keyCode] = true;
      this.moveDirection[prop] = res;
    }

    if (isLeave) {
      this.keyPressingMap[e.keyCode] = false;
      this.moveDirection[prop] = this.keyPressingMap[reverseKeyCode] ? -res : 0;
    }
  };

  loadEvent() {
    const removeListener = batchInputListener({
      inputIns: this.inputIns,
      typeArr: [
        Input.EventType.KEY_DOWN,
        Input.EventType.KEY_UP,
        Input.EventType.KEY_PRESSING,
      ],
      callback: this.inputEvent,
      node: this.node,
    });

    this.destroyFnList.push(removeListener);
  }

  destroyEvent() {
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
  node?: Component;
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
