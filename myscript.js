function renderTabMenu() {
  const tabMenu = document.getElementById("tab-menu");
  while (tabMenu.firstChild) {
    tabMenu.removeChild(tabMenu.firstChild);
  }

  openTabs.forEach((tab) => {
    tab.tabContainer.classList.remove("active");
  });

  activeTab.tabContainer.classList.add("active");

  openTabs.forEach((tab) => {
    tabMenu.insertBefore(tab.tabContainer, null);
  });
}


function renderActiveTab() {
  const rightSection = document.getElementById("right-section");
  while (rightSection.firstChild) {
    rightSection.removeChild(rightSection.firstChild);
  }

  rightSection.insertBefore(activeTab.tabPanel, null);
}


class Tab {
  constructor(tab_id, tab_name, tab_content) {
    this.tab_id = tab_id;
    this.tab_name = tab_name;
    this.tab_content = tab_content;

    this.tabContainer = document.createElement("div");
    this.tabContainer.classList.add("tab");

    this.tabNameEntry = document.createElement("div");
    this.tabNameEntry.classList.add("tab-name");
    this.tabNameEntry.textContent = this.tab_name;
    this.tabContainer.insertBefore(this.tabNameEntry, null);

    this.tabPanel = document.createElement("div");
    this.tabPanel.classList.add("tab-panel");
    this.tabPanel.innerHTML = this.tab_content;

    this.tabNameEntry.addEventListener('click', () => {this.makeActive()});
  }

  makeActive() {
    activeTab = this;
    renderTabMenu();
    renderActiveTab();
  }

  open() {
    openTabs.push(this);
    this.makeActive();
  }
}

class ClosableTab extends Tab {
  constructor(tab_id, tab_name, tab_content) {
    super(tab_id, tab_name, tab_content);

    this.closeButton = document.createElement("button");
    this.closeButton.classList.add("close-button");
    this.closeButton.textContent = "×";
    this.closeButton.addEventListener('click', () => {this.close()});
    this.tabContainer.insertBefore(this.closeButton, null);
  }

  close() {
    let index = openTabs.indexOf(this);
    openTabs = openTabs.slice(0, index).concat(openTabs.slice(index + 1));

    if (this == activeTab) {
      let newActiveTab = undefined;
      if (index < openTabs.length) {
        newActiveTab = openTabs[index];
      }
      else {
        newActiveTab = openTabs[index - 1];
      }
      newActiveTab.makeActive();
    }
    else {
      renderTabMenu();
    }
  }
}

let openTabs = [];
let activeTab = undefined;
const mainTab = new Tab("main-tab", "Main Tab", "Hello, this is a main tab!");
mainTab.open()

let counter = 1;
newTabLink = document.getElementById("new-tab-link");
newTabLink.addEventListener('click', () => {
  counter += 1;
  newTab = new ClosableTab(`tab${counter}`, `Tab #${counter}`, `Hello, this is tab #${counter}!`);
  newTab.open();
});