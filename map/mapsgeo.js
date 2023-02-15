let map;
let marker;
let mArray=[];
let markers_json=[];//required json file
const display=document.querySelector("#display");
const button=document.querySelector("#input button");
  // Create the initial InfoWindow.


const assignmap = (lat , lng) => {
    var op={
        zoom:100,
        center:{lat:lat,lng:lng},
        //center:{lat:lat,long:long},
        mapTypeId: 'satellite'
    }


    const svgMarker = {
        path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
        fillColor: "blue",
        fillOpacity: 0.6,
        strokeWeight: 0,
        rotation: 0,
        scale: 2,
        anchor: new google.maps.Point(15, 30),
        };


    map=new google.maps.Map(document.getElementById('map'),op);
    const mar=new google.maps.Marker({
        position:{lat:lat,lng:lng},
        icon: svgMarker,
    });
    mar.setMap(map);
   


    
    //onclick listener
    map.addListener('click', function(e) {
        console.log(e);
        addMarker(e.latLng);
      });
}

//------------------------------------------------------------------------------------------------
  // define function to add marker at given lat & lng
  function addMarker(latLng) {
    marker = new google.maps.Marker({
        map: map,
        position: latLng,
        draggable: true
    });
 
    //store the marker object drawn on map in global array
    mArray.push(marker);
    document.getElementById("remove_mark").style.display = "block";
    document.getElementById("wrap").style.display = "block";
    document.getElementById("lat").value=marker.position.lat();
    document.getElementById("lng").value=marker.position.lng();

    
    
  }


function validateForm() {
    var entry={
        "lat":document.forms["myForm"]["lat"].value,
        "lng":document.forms["myForm"]["lng"].value,
        "name":document.forms["myForm"]["place"].value,
        "index":document.forms["myForm"]["order"].value
        
    };

    //push the object to your array
    markers_json.push( entry );
    
    console.log(markers_json);
    document.getElementById("lng").value=null;
    document.getElementById("lat").value=null;
    document.getElementById("place").value=null;
    document.getElementById("order").value=null;



  }

  function save(){
    

    var final={
        "name":document.forms["myForm"]["name"].value,
        "description":document.forms["myForm"]["desc"].value,
        "waypoints":JSON.stringify(markers_json)

    }
    console.log(final);
    axios.post('http://localhost:3000/mission/create',final)
    .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  
    
    
    
    
}

 
button.addEventListener("click",async()=>{
    const input=document.querySelector("#input input");

    let a=await input.value;
    axios.get('https://maps.googleapis.com/maps/api/geocode/json',{
        params:{
            address:a,
            key:'AIzaSyDXmZlMirmrvz32y0iCAn9kU55Hip3yMjA'
        }
    })
    .then(function(respose){
        var laat=respose.data.results[0].geometry.location.lat;
        var lang=respose.data.results[0].geometry.location.lng;
        assignmap(laat , lang)
    })
    .catch(function(error){
        alert("Improper Place");
    });

    //
    
})

remove_mark.addEventListener('click',()=>{
    mArray[mArray.length-1].setMap(null);mArray.pop();
    markers_json.pop();
    
    if(mArray.length==0){
        console.log("zero reached")
        document.getElementById("remove_mark").style.display = "none";
    }
})











