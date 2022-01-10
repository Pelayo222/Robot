/**
** Robot de la Practica 3. Pelayo Torres Alonso
**/

var scene, camera, renderer, controles, grupo, grupoCabeza, grupoBrazoI, grupoBrazoD, grupoRuedas, luzLente, brazoI, brazoD,  targetLente;
var keyCode;
var bloqueo=false;
//Direccion, velocidad del robot, grados de giro
var controls={};
var vel=1;

//Variables de la camara
var dx=0;
var dy=0;
var dz=0;

//Partes del robot
var cabeza, cuello, cuerpo, eje, ruedaI, ruedaD, cam, lente;


function init() {
   
    // default setup
     scene = new THREE.Scene();
     camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
     renderer = new THREE.WebGLRenderer();

    renderer.setClearColor(new THREE.Color(0x505050));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    // create the ground plane
    var planeGeometry = new THREE.PlaneGeometry(700, 700, 1, 1);
    
    var planeMaterial = new THREE.MeshToonMaterial({color : 0xffffff});
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;

    // rotate and position the plane
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;

    // add the plane to the scene
    scene.add(plane);

    //Cuerpo del robot
    var geometry = new THREE.CylinderGeometry( 4, 4, 5, 32 );
    var material = new THREE.MeshPhongMaterial( {map : THREE.ImageUtils.loadTexture("Texturas/tornillos.jpg")} );
    cuerpo = new THREE.Mesh( geometry, material );
    cuerpo.castShadow=true;
    cuerpo.position.set(0, 5, 0);

    //Cuello del robot
    var geometry = new THREE.CylinderGeometry( 1, 1, 1, 32 );
    var material = new THREE.MeshPhongMaterial( {map : THREE.ImageUtils.loadTexture("Texturas/cables.jpg")} );
    cuello = new THREE.Mesh( geometry, material );
    cuello.castShadow=true;
    cuello.position.set(0, 8, 0);

    //Cabeza del robot
    var geometry = new THREE.BoxGeometry( 4, 4, 4 );
    var material = new THREE.MeshPhongMaterial( {map : THREE.ImageUtils.loadTexture("Texturas/tornillos.jpg")} );
    cabeza = new THREE.Mesh( geometry, material );
    cabeza.castShadow=true;
    cabeza.position.set(0, 10, 0);

    //Camara del robot
    var geometry = new THREE.CylinderGeometry( 0.5, 1, 0.5, 32 );
    var material = new THREE.MeshPhongMaterial( {map : THREE.ImageUtils.loadTexture("Texturas/camara.jpg")} );
    cam = new THREE.Mesh( geometry, material );
    cam.castShadow=true;
    cam.position.set(-2.3, 10, 0);
    cam.rotation.z=Math.PI/2;

    //Lente del robot
    var geometry = new THREE.SphereGeometry( 0.4, 32, 0.5 );
    var material = new THREE.MeshPhongMaterial( {map : THREE.ImageUtils.loadTexture("Texturas/lente.jpg")} );
    lente = new THREE.Mesh( geometry, material );
    lente.castShadow=true;
    lente.position.set(-2.4, 9.99, 0);
    lente.rotation.z=Math.PI/2;

    //Ruedas del robot
    //EJE
    var geometry = new THREE.CylinderGeometry( 0.5, 0.5, 11, 32 );
    var material = new THREE.MeshPhongMaterial( {map : THREE.ImageUtils.loadTexture("Texturas/metal.jpg")} );
    eje = new THREE.Mesh( geometry, material );
    eje.castShadow=true;
    eje.position.set(0, 3, 0);
    eje.rotation.x=Math.PI/2;

    //Rueda izq
    var geometry = new THREE.CylinderGeometry( 2, 2, 1, 32 );
    var material = new THREE.MeshLambertMaterial( {map : THREE.ImageUtils.loadTexture("Texturas/rueda.jpg")} );
    ruedaI = new THREE.Mesh( geometry, material );
    ruedaI.castShadow=true;
    ruedaI.position.set(0, 3, -4.9);
    ruedaI.rotation.x=Math.PI/2;

    //Rueda dcha
    var geometry = new THREE.CylinderGeometry( 2, 2, 1, 32 );
    var material = new THREE.MeshLambertMaterial( {map : THREE.ImageUtils.loadTexture("Texturas/rueda.jpg")} );
    ruedaD = new THREE.Mesh( geometry, material );
    ruedaD.castShadow=true;
    ruedaD.position.set(0, 3, 4.9);
    ruedaD.rotation.x=Math.PI/2;

    //Brazo izq
    var geometry = new THREE.BoxGeometry( 0.5, 4,  0.5);
    var material = new THREE.MeshPhongMaterial( { map : THREE.ImageUtils.loadTexture("Texturas/metal.jpg")} );
    brazoI = new THREE.Mesh( geometry, material );
    brazoI.castShadow=true;
    brazoI.position.set(-4, 6.5, 4);
    brazoI.rotation.x=Math.PI/2;
    brazoI.rotation.z=Math.PI/4;
    
    //Brazo dcha
    var geometry = new THREE.BoxGeometry( 0.5, 4,  0.5);
    var material = new THREE.MeshPhongMaterial( { map : THREE.ImageUtils.loadTexture("Texturas/metal.jpg") } );
    brazoD = new THREE.Mesh( geometry, material );
    brazoD.castShadow=true;
    brazoD.position.set(-4, 6.5, -4);
    brazoD.rotation.x=Math.PI/2;
    brazoD.rotation.z=-Math.PI/4;

    //Mano
    var geometry = new THREE.ConeGeometry( 1, 4, 16);
    var material = new THREE.MeshPhongMaterial( { map : THREE.ImageUtils.loadTexture("Texturas/taladro1.jpg")} );
    mano = new THREE.Mesh( geometry, material );
    mano.castShadow=true;
    mano.position.set(-6.5, 6.5, -6.5);
    mano.rotation.x=-Math.PI/2;
    mano.rotation.z=Math.PI/4;

    //Linterna

    var geometry = new THREE.CylinderGeometry( 1, 1.5, 2, 8, 1, false, 0, 2*Math.PI);
    var material = new THREE.MeshPhongMaterial( {map : THREE.ImageUtils.loadTexture("Texturas/camara.jpg")} );
    linterna = new THREE.Mesh( geometry, material );
    linterna.castShadow=true;
    linterna.position.set(-6, 6.5, 6);
    linterna.rotation.x=-Math.PI/2;
    linterna.rotation.z=-Math.PI/4;


    //Objetivo de la lente
    targetLente= new THREE.Object3D();
    targetLente.position.set(-30, 0, 30);
    scene.add(targetLente);

    //Agrupamos las partes del robot

    grupoCabeza = new THREE.Group();
    grupoCabeza.add(cabeza);
    grupoCabeza.add(cuello);
    grupoCabeza.add(cam);
    grupoCabeza.add(lente);
    grupoCabeza.add(targetLente);

    grupoBrazoI = new THREE.Group();
    grupoBrazoI.add(brazoI);
    grupoBrazoI.add(linterna);
    grupoBrazoI.add(targetLente);

    grupoBrazoD = new THREE.Group();
    grupoBrazoD.add(brazoD);
    grupoBrazoD.add(mano);

    grupoRuedas = new THREE.Group();
    grupoRuedas.add(ruedaD);
    grupoRuedas.add(ruedaI);
    grupoRuedas.add(eje);

    grupo = new THREE.Group();
    grupo.add(cuerpo);
    grupo.add(grupoCabeza);
    grupo.add(grupoRuedas);
    grupo.add(grupoBrazoI);
    grupo.add(grupoBrazoD);

    grupo.position.y=-1;
    grupo.rotation.y=Math.PI/2;
    grupo.castShadow=true;

    scene.add(grupo);


    // position and point the camera to the center of the scene
    camera.position.set(0, lente.position.y, lente.position.z-30);
    camera.lookAt(new THREE.Vector3(grupo.position.x, grupo.position.y+11, grupo.position.z));

    controles = new THREE.OrbitControls(camera, renderer.domElement);

    //Ajustamos los controles
    controles.target = new THREE.Vector3(grupo.position.x, grupo.position.y+11, grupo.position.z);
    controles.enablePan=false;
    controles.maxDistance=50;
    controles.minDistance=10;
    controles.maxPolarAngle=100*Math.PI/180;

    controles.update();


    // add subtle ambient lighting
    
    var ambienLight = new THREE.AmbientLight(0x858585);
    scene.add(ambienLight);
    
    // Focos de luz
    var spotLightW = new THREE.SpotLight(0xffffff);
    spotLightW.position.set(0, 50, 0);
    spotLightW.castShadow = true;
    spotLightW.penumbra = 0.2;

    const targetObject1= new THREE.Object3D();
    targetObject1.position.set(0, 0, 0);
    scene.add(targetObject1);
    spotLightW.target=targetObject1;
    scene.add(spotLightW);

    var spotLightB = new THREE.SpotLight(0x0000ff);
    spotLightB.position.set(200, 50, 0);
    spotLightB.castShadow = true;
    spotLightB.penumbra = 0.2;

    const targetObject2= new THREE.Object3D();
    targetObject2.position.set(200, 0, 0);
    scene.add(targetObject2);
    spotLightB.target=targetObject2;
    scene.add(spotLightB);

    var spotLightG = new THREE.SpotLight(0x00ff00);
    spotLightG.position.set(-200, 50, 0);
    spotLightG.castShadow = true;
    spotLightG.penumbra = 0.2;

    const targetObject3= new THREE.Object3D();
    targetObject3.position.set(-200, 0, 0);
    scene.add(targetObject3);
    spotLightG.target=targetObject3;
    scene.add(spotLightG);

    var spotLightP = new THREE.SpotLight(0xff00ff);
    spotLightP.position.set(0, 50, 200);
    spotLightP.castShadow = true;
    spotLightP.penumbra = 0.2;

    const targetObject4= new THREE.Object3D();
    targetObject4.position.set(0, 0, 200);
    scene.add(targetObject4);
    spotLightP.target=targetObject4;
    scene.add(spotLightP);

    var spotLightA = new THREE.SpotLight(0xffee00);
    spotLightA.position.set(0, 50, -200);
    spotLightA.castShadow = true;
    spotLightA.penumbra = 0.2;

    const targetObject5= new THREE.Object3D();
    targetObject5.position.set(0, 0, -200);
    scene.add(targetObject5);
    spotLightA.target=targetObject5;
    scene.add(spotLightA);

    
    luzLente = new THREE.SpotLight(0xff0000);
    luzLente.position.set(-7, 6.5, 7);
    luzLente.distance=50;
    luzLente.castShadow = true;
    luzLente.penumbra = 0.2;

    luzLente.target=targetLente;
    scene.add(luzLente);

    grupoBrazoI.add(luzLente);

    // add the output of the renderer to the html element
    document.getElementById("contenedor").appendChild(renderer.domElement);

    // call the render function
    //var step = 0;
    step = 0;
    renderScene();
}

function renderScene() {
    // render using requestAnimationFrame
    requestAnimationFrame(renderScene);
    controles.update();
    control();

    renderer.render(scene, camera);
}


document.addEventListener("keydown", ({ keyCode }) => { 
        if(keyCode==67){
            if(bloqueo){
                bloqueo=!bloqueo;
                controles.enablePan=false;
                controles.maxDistance=50;
                controles.minDistance=10;
                controles.maxPolarAngle=100*Math.PI/180;
            }
            else{
                bloqueo=!bloqueo;
                controles.enablePan=true;
                controles.maxDistance=Infinity;
                controles.minDistance=0;
                controles.maxPolarAngle=Math.PI;
            }
            
        }
        else{
            if(!bloqueo){
                controls[keyCode] = true
            }
        }
    });
document.addEventListener('keyup', ({ keyCode }) => { controls[keyCode] = false });

function control() {
    // Controls:Engine 
    if(controls[87]){ // w
        grupo.position.x -= Math.cos(grupo.rotation.y) * vel;
        grupo.position.z -= -Math.sin(grupo.rotation.y) * vel;
        ruedaI.rotation.y+=Math.PI/90;
        ruedaD.rotation.y+=Math.PI/90;

        controles.target = new THREE.Vector3(grupo.position.x, grupo.position.y+11, grupo.position.z) ;
    }
    if(controls[83]){ // s
        grupo.position.x += Math.cos(grupo.rotation.y) * vel;
        grupo.position.z += -Math.sin(grupo.rotation.y) * vel;
        ruedaI.rotation.y-=Math.PI/90;
        ruedaD.rotation.y-=Math.PI/90;

        controles.target = new THREE.Vector3(grupo.position.x-5, grupo.position.y+11, grupo.position.z) ;
    }
    if(controls[65]){ // a
        grupo.rotation.y += Math.PI/90;
        ruedaI.rotation.y+=Math.PI/90;
        ruedaD.rotation.y-=Math.PI/90;
    }
    if(controls[68]){ // d
        grupo.rotation.y -= Math.PI/90;
        ruedaD.rotation.y+=Math.PI/90;
        ruedaI.rotation.y-=Math.PI/90;
    }

    //Movimiento cabeza
    if(controls[81]){ // q
        grupoCabeza.rotation.y += Math.PI/90;
    }

    if(controls[69]){ // e
        grupoCabeza.rotation.y -= Math.PI/90;
    }

    //Movimiento brazo Izquierdo
    if(controls[84]){ // t
        grupoBrazoI.rotation.y += Math.PI/90;
    }

    if(controls[89]){ // y
        grupoBrazoI.rotation.y -= Math.PI/90;
    }

    //Movimiento brazo Derecho
    if(controls[71]){ // g
        grupoBrazoD.rotation.y += Math.PI/90;
    }

    if(controls[72]){ // h
        grupoBrazoD.rotation.y -= Math.PI/90;
    }



}
