class App {

  gallery_root;
  tab_root;
  tab_elements;

  tab_name;
  tab_base = './doc/';
  tabs;

  init() {
    this.gallery_root = document.getElementById('gallery');
    this.tab_root = document.getElementById('tab');
    this.tabs = new Map();
    this.tab_elements = [];
    this.load_config(doc_config);
  }

  load_config(config) {
    const names = Object.getOwnPropertyNames(config);
    this.tab_name = names[0];
    names.forEach((name) => {
      this.tabs.set(name, config[name]);
      const t = document.createElement('div');
      t.className = 'tab-label tab-disabled';
      t.innerHTML = name;
      t.name = name;
      t.onclick = () => {
        this.load_tab(name);
      }
      this.tab_elements.push(t);
      this.tab_root.appendChild(t);
    });
  }

  launch() {
    this.init();
  }

  deactivate_tab() {
    this.tab_elements.forEach(tab => {
      tab.className = 'tab-label tab-disabled';
    });
  }

  active_tab(name) {
    this.tab_elements.forEach(tab => {
      if (tab.name === name) {
        tab.className = 'tab-label tab-enabled';
      }
    });
  }

  async load_tab(name) {
    this.tab_name = name;
    const response = await fetch(this.tab_base + this.tabs.get(name));
    const content = marked(await response.text());
    this.gallery_root.innerHTML = content;

    this.deactivate_tab();
    this.active_tab(name);
  }

}

function main() {

  const app = new App();

  app.launch();
  app.load_tab('Hello');

  window.app = app;
}

main();