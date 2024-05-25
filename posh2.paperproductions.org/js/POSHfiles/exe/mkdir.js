(async () => {
    if(await POSH.fileSystem.readFolder(`${window.currentLocation.replace(/^\//,"")}/${fixInput[1]}`)==null){
        console.log(fixInput[1]);
        if(window.currentLocation.replace(/^\//,"")==''){
            POSH.fileSystem.createFolder(`${window.currentLocation.replace(/^\//,"")}${fixInput[1]}`);
        }else{
            POSH.fileSystem.createFolder(`${window.currentLocation.replace(/^\//,"")}/${fixInput[1]}`);
        }
        
    }else{
        POSH.text.forgroundColor = "red";
        await POSH.say("\nthat folder already exists\n");
        POSH.text.forgroundColor = "white";
    }
})();