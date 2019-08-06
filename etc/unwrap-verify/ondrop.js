function ondrop(element, callback) {

  element.addEventListener('dragover', function(event) {
    event.preventDefault();
  });

  element.addEventListener('drop', async function(event) {
    event.stopPropagation();
    event.preventDefault();

    const files = event.dataTransfer.files;
    callback(files);
  });

}