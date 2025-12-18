import _classNames from 'classnames';

const PREFIX = 'ott';

/**
 * 自定义className合并函数，用于给带&的className添加前缀
 * @param names - 需要合并的className字符串
 * @returns 合并后的className字符串
 */
export const classNames = (...names: string[]) => {
  const result = _classNames(...names);
  if (result === '') {
    return '';
  }
  return result
    .split(' ')
    .map((name) => {
      if (name.startsWith('&')) {
        return `${PREFIX}-${name.slice(1)}`;
      }
      return name;
    })
    .join(' ');
};
