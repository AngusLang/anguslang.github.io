function App() {

  this.gallery_root = document.getElementById('gallery');
  this.tab_root = document.getElementById('tab');
  this.tab_elements = [];

  this.tab_name = '';
  this.tab_base = './doc/';
  this.tabs = new Map();

  var scope = this;

  this.load_config = function(config) {
    const names = Object.getOwnPropertyNames(config);
    const ctime_sort = function(a, b) {
      return config[a].ctime - config[b].ctime;
    }
    names.sort(ctime_sort);
    scope.tab_name = names[0];
    for(let i = 0; i < names.length; ++i) {
      const name = names[i];
      scope.tabs.set(name, config[name]);
      const t = document.createElement('div');
      t.className = 'tab-label tab-disabled';
      t.innerHTML = name;
      t.name = name;
      t.onclick = () => {
        scope.load_tab(name);
      }
      scope.tab_elements.push(t);
      scope.tab_root.appendChild(t);
    }
  }

  this.launch = function() {
    scope.load_config(doc_config);
    scope.load_tab(scope.tab_name);
  }

  scope.deactivate_tab = function() {
    scope.tab_elements.forEach(tab => {
      tab.className = 'tab-label tab-disabled';
    });
  }

  scope.active_tab = function(name) {
    scope.tab_elements.forEach(tab => {
      if (tab.name === name) {
        tab.className = 'tab-label tab-enabled';
      }
    });
  }

  this.load_tab = async function(name) {
    scope.tab_name = name;
    const tab_info = scope.tabs.get(name);
    const response = await fetch(scope.tab_base + tab_info.file);
    const content = marked(await response.text());
    const date = new Date(tab_info.ctime);
    scope.gallery_root.innerHTML = content + `<p class="date">${date.toDateString()}</p>`;

    scope.deactivate_tab();
    scope.active_tab(name);

    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightBlock(block);
    });
  }
}

function main() {
  const app = new App();
  app.launch();
  window.app = app;
}

main();