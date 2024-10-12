const Path = require('path');
const FS = require('fs');
const Glob = require('glob');

module.exports = class FileUtil {

  /**
   * @param {string} root 
   * @param {string} dir 
   * @returns {string[]}
   */
  static prepareDirectorySync(root, dir) {
    const parts = Path.normalize(dir).split(Path.sep);
    const created = [];
    while (parts.length) {
      const part = parts.shift();
      root = Path.join(root, part);
      if (!FS.existsSync(root)) {
        created.push(root);
        FS.mkdirSync(root);
      }
    }
    return created;
  }

  /**
   * @param {string} src 
   * @param {string} target 
   * @param {string} glob 
   * @param {Glob.GlobOptions} globOptions 
   * @returns {string[]}
   */
  static copyDeepSync(src, target, glob = '**/*.*', globOptions = {}) {
    globOptions.cwd = src;
    const files = Glob.sync(glob, globOptions);
    for (const file of files) {
      FileUtil.prepareDirectorySync(target, Path.dirname(file));
      FS.copyFileSync(Path.join(src, file), Path.join(target, file));
    }
    return files;
  }

}
