let tabs = document.querySelectorAll(".tab"); // Use querySelectorAll to get all elements with the class "tab"

tabs.forEach(async tab => {
  tab.addEventListener("click", () => {
    // 1. Remove "enabled" class from all tabs
    tabs.forEach(otherTab => {
      otherTab.id.remove("enabled");
    });

    // 2. Add "enabled" class to the clicked tab
    tab.id.add("enabled");
  });
  await reload();
});

async function reload(){
    const currentTab = document.getElementById("enabled").innerHTML;
    let page = document.getElementById("content");

    if(currentTab=="home"){
        page.innerHTML = await readDisk("https://www.paperproductions.org/html/home.html");
    }

}


