// styles: ['color:red;font:12px;',...]
function customStyleFn(styles, block) {
  const cssObj = {};
  let keyValue;
  styles.forEach(styleName => {
    const charCode = styleName.charCodeAt(0);
    // 小写字母
    if (charCode >= 91 && charCode <= 122) {
      styleName.split(';').forEach(name => {
        if (name) {
          keyValue = name.split(':');
          cssObj[keyValue[0]] = keyValue[1];
        }
      });
    }
  });
  return cssObj;
}

export {customStyleFn};
