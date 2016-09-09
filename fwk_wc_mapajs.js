var taxiData = [
  //new google.maps.LatLng(37.751266, -122.403355)
];
var map;
var wcmapa;
var posicionOrigen;
var posicionDestino;
var lat_origen;
var lon_origen;
var lat_destino;
var lon_destino;
var tipo;
var directionsDisplay; 
var directionsService = new google.maps.DirectionsService(); 
var ptTitle = 'TEST ';
var ptDescr = 'This is a testcase';
var infowindow; 
var markers = [];



var image_usuario="family.png";

                   
function initialize() {
    directionsDisplay = new google.maps.DirectionsRenderer();//ROTA
    var wes_joinville = new google.maps.LatLng(-26.2997267,-48.850378);
    var ultZoom = 13;
    var fl_dblclick = 0;

    var mapOptions = {
        zoom: ultZoom,
        center: wes_joinville,
        panControl:true,
        zoomControl:true,
        mapTypeControl:true,
        scaleControl:true,
        streetViewControl:true,
        overviewMapControl:true,
        rotateControl:true
      };
  
    map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions); 

        google.maps.event.addListener(map-canvas, 'dblclick', function(ev) {
        ultZoom = canvasmap.getZoom();
        fl_dblclick = 1;
        gICAPI.SetData(ev.latLng.toString());
        gICAPI.Action("dblclick");
      });
      
      google.maps.event.addListener(map-canvas, 'zoom_changed', function() {

        if ( fl_dblclick == 1 ) {
            fl_dblclick = 0;
            // if the zoom comes from double-click wait 1 second after
            // the zoom has changed, then go back to the previous value 
            window.setTimeout(function() {
            canvasmap.setZoom(ultZoom);
            }, 1000);
        }
        
      });
  

}


google.maps.event.addDomListener(window, 'load', initialize);



onICHostReady = function(version) {
   //console.log("onICHostReady");
   if ( version != 1.0 ) {
      alert('Versão inválida da API do JavaScript');
      return;
   }

   // Initialize the focus handler called by the Genero Client
   // Container when the DVM set/remove the focus to/from the component
   gICAPI.onFocus = function(polarity) {
      /* looks bad on IOS, we need to add a possibility to know the client
      if ( polarity ) {
         document.body.style.border = '1px solid blue';
      } else {
         document.body.style.border = '1px solid grey';
      }
      */
   }
   gICAPI.onData = function(coords) {
     //setCoords(coords);
   }

   
   gICAPI.onProperty = function(p) {
     var myObject = eval('(' + p + ')');
     setCoords(myObject.coords);
     //changeCoordsHeatMap();
     setOption(myObject.option);
   }

}


function setCoords(coords) {
  taxiData=[];
  var coord_arr=JSON.parse(coords);
  for (var j in coord_arr)
  {
    taxiData[j]=new google.maps.LatLng(coord_arr[j].lat,coord_arr[j].lon);
    if (coord_arr[j].estado=="A") 
    {
    lat_origen=coord_arr[j].lat;
    lon_origen=coord_arr[j].lon;
    posicionOrigen=new google.maps.LatLng(coord_arr[j].lat,coord_arr[j].lon);
    coord_arr[j].distancia=0;
    }else
    {
    coord_arr[j].distancia=google.maps.geometry.spherical.computeDistanceBetween(posicionOrigen,taxiData[j]);
    }

  }

    coord_arr.sort(function(a, b){
    var a1= a.distancia, b1= b.distancia;
    if(a1== b1) return 0;
    return a1> b1? 1: -1;
    });

    posicionDestino=coord_arr[1].distancia;  
    lat_destino=coord_arr[1].lat;
    lon_destino=coord_arr[1].lon;
    tipo=coord_arr[1].descri;

    var infowindow = new google.maps.InfoWindow({
                    map: map,
                    position: posicionOrigen,
                    content: 'Você se localiza aqui!'
                  });
                  
    var gmarker = new google.maps.Marker({
                    center:map.setCenter(posicionOrigen),
                    position: posicionOrigen,
                    map: map,
                    zoom: 24,
                    title: "Titular",
                    icon: image_usuario
                   }); 
                   attachSecretMessage(gmarker,"Você se localiza aqui!");      
                   /*markers.push(gmarker);*/
  deleteMarkers();

  pinta_puntos(map, coord_arr);
  ruta_caminando();

  directionsDisplay.setMap(map);

}


function pinta_puntos(map, locations) { 
var image_hospital="hospital.png";
var image_oficina="oficina.png";
var image_unidad="unidad.png";


  var shape = {
      coords: [1, 1, 1, 20, 18, 20, 18 , 1],
      type: 'poly'
  };
  for (var i = 0; i < locations.length; i++) 
  {
        var myLatLng = new google.maps.LatLng(locations[i].lat,locations[i].lon);
        
        switch(locations[i].descri) 
        {
                    case "UNIDAD-MEDICA":
                        var myicon = new google.maps.MarkerImage(image_unidad);
                        break;
                    case "HOSPITAL":
                        var myicon = new google.maps.MarkerImage(image_hospital);
                        break;
                    case "OFICINA":
                        var myicon = new google.maps.MarkerImage(image_oficina);
                        break;
                    default:
                        // CODIGO PARA DEFAULT
                        break;
        } 
        
        if ((locations[i].descri=="UNIDAD-MEDICA") || (locations[i].descri=="HOSPITAL") || (locations[i].descri=="OFICINA")) 
        {
            var marker = new google.maps.Marker(
            {
            position: myLatLng,
            map: map,
            icon: myicon,
            shape: shape,
            title: locations[i].comments
            });
            attachSecretMessage(marker,locations[i].comments);
            markers.push(marker);
        }

        
  }
 
}


function setAllMap(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

function clearMarkers() {
  setAllMap(null);
}

function deleteMarkers() {
  clearMarkers();
  markers = [];
}



function attachSecretMessage(marker, message) {
  var infowindow = new google.maps.InfoWindow({
    content: message
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.open(marker.get('map'), marker);
  });
}


function ruta_caminando() {
  var start = new google.maps.LatLng(lat_origen, lon_origen);  
  var end = new google.maps.LatLng(lat_destino, lon_destino);  
                 
  var request = {
      origin:start,
      destination:end,
      travelMode: google.maps.TravelMode.WALKING
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    }
    else
    {
    alert("Não encontrou uma rota definida para este meio de transporte");
    }
  });
       var contenido;
       if (tipo=='UNIDAD-MEDICA')
       {
            contenido='U.M. más Cercana'
       }
        if (tipo=='HOSPITAL')
       {
            contenido='Hospital más Cercano'
       }
       if (tipo=='OFICINA')
       {
            contenido='Oficina más Cercana'
       }

       var infowindow = new google.maps.InfoWindow({
                    map: map,
                    position: end,
                    content: contenido
                  }); 
}

function ruta_manejando() {
  var start = new google.maps.LatLng(lat_origen, lon_origen);  
  var end = new google.maps.LatLng(lat_destino, lon_destino);  
                 
  var request = {
      origin:start,
      destination:end,
      travelMode: google.maps.TravelMode.DRIVING
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    }
    else
    {
    alert("Não encontrou uma rota definida para este meio de transporte");
    }
  });
}

function ruta_bicicleta() {
  var start = new google.maps.LatLng(lat_origen, lon_origen);  
  var end   = new google.maps.LatLng(lat_destino, lon_destino); 

  var request = {
      origin:start,
      destination:end,
      travelMode: google.maps.TravelMode.BICYCLING
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    }
    else
    {
    alert("Não encontrou uma rota definida para este meio de transporte");
    }
  });
}



function echoString(str) {  
switch(str) {
    case "1":
        var origen = new google.maps.LatLng(lat_origen, lon_origen);
        map.setCenter(origen);

        infowindow = new google.maps.InfoWindow({
        content: "Origen"
        });
        
        var marker = new google.maps.Marker({
        position: origen,
        map: map,
        title: "Origen"
        });
        
        infowindow.open(map,marker);
        setInfoWindowContent(lat_origen, lon_origen,"Localização");
        break;

    case "2":
        var destino = new google.maps.LatLng(lat_destino, lon_destino); 
        map.setCenter(destino);
        break;

    case "3":
        ruta_caminando(); 
        directionsDisplay.setMap(map);
        break;

    case "4":
        ruta_manejando(); 
        directionsDisplay.setMap(map);
        break;

    case "5":
        ruta_bicicleta();
        directionsDisplay.setMap(map);
        break;

    default:
        //código por default   
        break;
} 
return str;
}

function setInfoWindowContent(lat,lon,tit) {
  ptDescr = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">'+tit+'</h1>'+
      '<div id="bodyContent">'+
      '<p> Você se localiza nas seguintes coordenadas! </p>'+
      '<p>Latitude: '+lat+'</p>'+
      '<p>Longitude: '+lon+'</p>'+
      //'<p>Descripci&#xF3;n: ac&#xE1; deber&#xED;a venir la descripci&#xF3;n detallada</p>'+
      '</div>'+
      '</div>';
      
  infowindow.setContent(ptDescr);
}