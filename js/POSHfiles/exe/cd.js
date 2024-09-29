(async () => {
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
    if(await POSH.fileSystem.readFolder(newLocation)!=null){
       if(newLocation==""){
        window.currentLocation = newLocation;
        }else{
        window.currentLocation = "/"+newLocation;
        }
    }else{
        POSH.text.forgroundColor = "red";
        await POSH.say("\nthat folder doesn't exist!\n");
        POSH.text.forgroundColor = "white";
    }
})();