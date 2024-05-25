(async () => {
    if(await POSH.fileSystem.readFolder(`${window.currentLocation.replace(/^\//,"")}/${fixInput[1]}`)!=null||await POSH.fileSystem.readFile(`${window.currentLocation.replace(/^\//,"")}/${fixInput[1]}`)!=null){
        console.log(fixInput[1]);
        if(window.currentLocation.replace(/^\//,"")==''){
            POSH.fileSystem.delete(`${window.currentLocation.replace(/^\//,"")}${fixInput[1]}`);
        }else{
            POSH.fileSystem.delete(`${window.currentLocation.replace(/^\//,"")}/${fixInput[1]}`);
        }
        
    }else{
        POSH.text.forgroundColor = "red";
        await POSH.say("\nthat folder doesn't exist\n");
        POSH.text.forgroundColor = "white";
    }
})();