(async () =>{
    await POSH.clear();

    var fileDat = await POSH.fileSystem.readFolder("tmp");

    console.log(fileDat);
    for(var i = 0; i < fileDat.length; i++){
        await POSH.fileSystem.delete("tmp/"+fileDat[i]);
    }
    return Promise.reject();
})();
