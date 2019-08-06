function suffix(str, splitter) {
  return str.split(splitter).pop();
}

async function readString(file) {
  return new Promise(function(resolve, _) {
    var reader = new FileReader();
    reader.onload = function(event) {
      resolve(event.target.result);
    }
    reader.readAsText(file);
  });
}