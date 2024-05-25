(async () => {
    //formatting for the location of the file to edit
    await POSH.clear()
    const location = window.currentLocation;
    window.newLocat = fixInput[1];
    //console.log(window.newLocat)
    window.newLocat = `${location}/${window.newLocat}`;
    //console.log(window.newLocat)
    window.newLocat = window.newLocat.replace(/^(.*)\/\//,"");
    //console.log(window.newLocat)
    var locations = window.newLocat.replace(/^\//,"").split("/");
   // console.log(locations);
    for(var i = 0; i<=locations.length; i++){
       // console.log(locations[i]);
        //console.log(i);
        if(locations[i]==".."){
            locations.splice(i,1);
            locations.splice(i-1,1);
            i-=2;
        }
    }
    window.newLocat = locations.join("/").replace(/\/$/,"");
    console.log(window.newLocat);
    if(await POSH.fileSystem.readFile(window.newLocat)!=null){
        var fileData = await POSH.fileSystem.readFile(window.newLocat);
    }else{
        var fileData = "";
        await POSH.fileSystem.createFile(window.newLocat,"");
    }



    //start of stickynote
    await editMode(fileData);
    POSH.text.forgroundColor = "cyan";
    POSH.say("\n edit -> enter edit mode     save -> save the file     exit -> exit stickynote\n\n");
    await cmdMode();
   
})();

async function cmdMode(){
    POSH.text.forgroundColor = "white";
    POSH.say(">");
    var commandMode = await POSH.txtInput();
    if(commandMode == "edit"){
        await editMode(window.NewFileData);
        await cmdMode();
        POSH.text.forgroundColor = "cyan";
    POSH.say("\n edit -> enter edit mode     save -> save the file     exit -> exit stickynote\n\n");
    }else if(commandMode == "save"){
        await POSH.fileSystem.createFile(window.newLocat,window.NewFileData);
        await cmdMode();
    }else if(commandMode == "exit"){}
    else{
        POSH.text.forgroundColor = "red";
        POSH.say("\nthat isn't a command, try one of the ones above\n");
        POSH.text.forgroundColor = "white";
        cmdMode();
    }
}
async function editMode(fileData){
    POSH.clear();
    POSH.text.forgroundColor = "cyan";
    await POSH.say(`${window.newLocat.split("/").pop()}      ctrl + e -> exit edit mode\n\n`);
    POSH.text.forgroundColor = "rgb(0,255,0)";
    window.NewFileData =  await POSH.txtInput(fileData, true);
    POSH.say("\n".repeat(20));
}