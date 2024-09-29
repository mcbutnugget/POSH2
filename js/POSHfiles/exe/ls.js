(async () => {
    POSH.text.forgroundColor = "cyan";
    var insides = await POSH.fileSystem.readFolder(window.currentLocation);
    for(var i = 0; i<=insides.length-1; i++){
        await POSH.say("\n"+insides[i]+"\n");
    }
    POSH.text.forgroundColor = "white";
})();