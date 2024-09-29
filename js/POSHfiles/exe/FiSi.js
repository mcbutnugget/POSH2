
function formatByteSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }


(async()=>{
    const location = window.currentLocation;
    var newLocation = fixInput[1];
    //console.log(newLocation)
    newLocation = `${location}/${newLocation}`;
    //console.log(newLocation)
    newLocation = newLocation.replace(/^(.*)\/\//,"");
    //console.log(newLocation)
    var locations = newLocation.replace(/^\//,"").split("/");
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
    newLocation = locations.join("/").replace(/\/$/,"");
    console.log(newLocation);
    if(await POSH.fileSystem.readFile(newLocation)!=null){
        await POSH.say(`\n\nfile:${newLocation}     size:${formatByteSize(new Blob([await POSH.fileSystem.readFile(newLocation)]).size)}\n\n`)
    }else{
        POSH.text.forgroundColor = "red";
        await POSH.say("\nthat file doesn't exist!\n");
        POSH.text.forgroundColor = "white";
    }
})();