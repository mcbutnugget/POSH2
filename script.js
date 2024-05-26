let tabs = document.querySelectorAll(".tab"); // Use querySelectorAll to get all elements with the class "tab"

tabs.forEach(async tab => {
  tab.addEventListener("click", async () => {
    // 1. Remove "enabled" class from all tabs
    tabs.forEach(otherTab => {
      otherTab.id= "";
    });

    // 2. Add "enabled" class to the clicked tab
    tab.id = "enabled";
    await reload();
  });
});

async function reload(){
    var currentTab = document.getElementById("enabled").innerHTML;
    let page = document.getElementById("content");

    if(currentTab=="home"){
        page.innerHTML = await readDisk("/html/home.html");
        POSH.shellStyles.background  = "rgb(50,30,40)";
    }else if(currentTab=="our products"){
        page.innerHTML = await readDisk("/html/products.html");
        POSH.shellStyles.background  = "rgb(30,40,50)";
    }else if(currentTab=="about us"){
        page.innerHTML = await readDisk("/html/help.html");
        POSH.shellStyles.background  = "rgb(30,30,30)";
    }
    console.log(currentTab);
}
reload();

const product = {
  POSH:()=>{

  }
}





