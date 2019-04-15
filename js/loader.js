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
    const ctime_sort = function(a, b) {
      return config[a].ctime - config[b].ctime;
    }
    names.sort(ctime_sort);
    this.tab_name = names[0];
    for(let i = 0; i < names.length; ++i) {
      const name = names[i];
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
    }
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
    const tab_info = this.tabs.get(name);
    const response = await fetch(this.tab_base + tab_info.file);
    const content = marked(await response.text());
    const date = new Date(tab_info.ctime);
    this.gallery_root.innerHTML = content + `<p class="date">${date.toDateString()}</p>`;

    this.deactivate_tab();
    this.active_tab(name);

    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightBlock(block);
    });
  }

}

function main() {

  const app = new App();

  app.launch();
  app.load_tab('Hello');

  window.app = app;
}

main();