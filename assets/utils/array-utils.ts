/** 实现自己的includes
 * @ Array自带的includes没有类型保护, 推导实现上不太好用
 */
export function includesInArray<T>(
  range: readonly T[],
  param: any,
): param is T {
  return range.includes(param);
}
