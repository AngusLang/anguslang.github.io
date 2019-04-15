class App {

  gallery_element;
  tab_element;

  tab_name;
  tab_base = './doc/';
  tabs;

  init() {
    this.gallery_element = document.getElementById('gallery');
    this.tab_element = document.getElementById('tab');
    this.tabs = new Map();
    this.load_config(doc_config);
  }

  load_config(config) {
    const names = Object.getOwnPropertyNames(config);
    this.tab_name = names[0];
    names.forEach((name) => {
      this.tabs.set(name, config[name]);
      const t = document.createElement('div');
      t.className = 'tab-label';
      t.innerHTML = name;
      this.tab_element.appendChild(t);
    });
  }

  launch() {
    this.init();
  }

  async load_tab(name) {
    this.tab_name = name;
    const response = await fetch(this.tab_base + this.tabs.get(name));
    const content = marked(await response.text());
    this.gallery_element.innerHTML = content;
  }

}

function main() {

  const app = new App();

  app.launch();
  app.load_tab('Hello');

  window.app = app;
}

main();