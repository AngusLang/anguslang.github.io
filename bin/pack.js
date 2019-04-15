const fs = require('fs');
const path = require('path');

function main() {
  const config = {};
  const dir = './doc/';
  const output = './js/config.js'

  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const name = path.basename(file, '.md');
    if (name) {
      const stat = fs.statSync(path.join(dir, file));
      config[name] = {file: file, ctime: stat.ctimeMs};
    }
  });

  const s_config = JSON.stringify(config);
  console.log(s_config);
  fs.writeFileSync(output, 'var doc_config = ' + s_config);
}

main();