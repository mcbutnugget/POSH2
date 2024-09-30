(async ()=>{
        //formatting for the location of the file to edit
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
            POSH.text.forgroundColor = "red";
            await POSH.say("this file already exists, try a different name");
            POSH.text.forgroundColor = "white";
        }else{
            await POSH.fileSystem.createFile(window.newLocat,"");
        }
})();