/**
 * 打印带有样式的日志标注
 * @param tag 日志标记
 * @param content 日志内容
 * @param style 日志样式
 */
export function printStyleLog(
  tag: string,
  content: any,
  style?: { [k: string]: string }
) {
  if (Object.is(tag, undefined)) {
    tag = "=>";
  }
  style = Object.assign(
    {
      color: "#0f0",
      "font-size": "18px",
    },
    style
  );
  const styleStr = cssObj2CssStr(style);
  console.log(`%c ${tag}`, styleStr, content);
}

/**
 * css对象转字符串形式
 * @param cssObj
 */
export function cssObj2CssStr(cssObj: { [k: string]: string }) {
  if (!cssObj) {
    return "";
  }
  let str = "";
  for (let key in cssObj) {
    str += `${key}:${cssObj[key]};`;
  }
  return str;
}
