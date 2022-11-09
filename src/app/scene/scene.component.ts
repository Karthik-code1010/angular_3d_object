import { Component, OnInit, AfterViewInit, Input, ViewChild, ElementRef } from '@angular/core';
import * as THREE from "three";
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { Sprite, SpriteMaterial, TextureLoader, Vector3 } from 'three';

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html'
})

export class SceneComponent implements OnInit, AfterViewInit {


  ///New Start
  // annotation:any = document.querySelector(".annotation");
  spriteBehindObject:any;

  //init
  
  mouse = new THREE.Vector2();

  highlightedTooth: any = null;
  selectedTooth: any = null;

  toothMaterial: any = null;
  highlightedToothMaterial: any = null;
  selectedToothMaterial: any = null;

  //configRenderer
  labelRenderer: any = null;


  //update
  raycaster = new THREE.Raycaster();


  teeth: any = []; //


  backupdata: any = [];

  ///New End

  @ViewChild('scene_id') private canvasRef: ElementRef;

  @ViewChild('annotation') private annotationRef: ElementRef;

  //* Stage Properties

  @Input() public fieldOfView: number = 100;//50//1

  @Input('nearClipping') public nearClippingPane: number = 1;

  @Input('farClipping') public farClippingPane: number = 1000;

  //? Scene properties
  private camera: THREE.PerspectiveCamera;

  private controls: OrbitControls;

  private ambientLight: THREE.AmbientLight;

  private light1: THREE.PointLight;

  private light2: THREE.PointLight;

  private light3: THREE.PointLight;

  private light4: THREE.PointLight;

  private model: any;

  private directionalLight: THREE.DirectionalLight;

  //? Helper Properties (Private Properties);

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  private get annotation(): HTMLDivElement {
    return this.annotationRef.nativeElement;
  }

  private loaderGLTF = new GLTFLoader();

  private renderer: THREE.WebGLRenderer;

  private scene: THREE.Scene;

  /**
   *Animate the model
   *
   * @private
   * @memberof ModelComponent
   */
  private animateModel() {
    if (this.model) {
      this.model.rotation.z += 0.005;
    }
  }

  /**
   *create controls
   *
   * @private
   * @memberof ModelComponent
   */
  private createControls = () => {
    const renderer = new CSS2DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0px';
    document.body.appendChild(renderer.domElement);
    this.controls = new OrbitControls(this.camera, renderer.domElement);
    // this.controls.autoRotate = true;
    this.controls.enableZoom = true;
    // this.controls.enablePan = false;
    this.controls.update();
  };

  /**
   * Create the scene
   *
   * @private
   * @memberof CubeComponent
   */

  private createScene(path: any) {
    //* Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xd4d4d8)
    this.loaderGLTF.load(path, (gltf: GLTF) => {

      this.model = gltf.scene;//fact
      // this.model = gltf.scene.children[0];//emd_gp7_western_pacific_713
      var box = new THREE.Box3().setFromObject(this.model);
      box.getCenter(this.model.position); // this re-sets the mesh position
      this.model.position.multiplyScalar(-1);
      this.scene.add(this.model);



      this.materialFun();


    });
    //*Camera
    let aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPane,
      this.farClippingPane
    )
    this.camera.position.x = 100;
    this.camera.position.y = 100;
    this.camera.position.z = 100;
    this.ambientLight = new THREE.AmbientLight(0x00000, 100);
    this.scene.add(this.ambientLight);
    this.directionalLight = new THREE.DirectionalLight(0xffdf04, 0.4);
    this.directionalLight.position.set(0, 1, 0);
    this.directionalLight.castShadow = true;
    this.scene.add(this.directionalLight);
    this.light1 = new THREE.PointLight(0x4b371c, 10);
    this.light1.position.set(0, 200, 400);
    this.scene.add(this.light1);
    this.light2 = new THREE.PointLight(0x4b371c, 10);
    this.light2.position.set(500, 100, 0);
    this.scene.add(this.light2);
    this.light3 = new THREE.PointLight(0x4b371c, 10);
    this.light3.position.set(0, 100, -500);
    this.scene.add(this.light3);
    this.light4 = new THREE.PointLight(0x4b371c, 10);
    this.light4.position.set(-500, 300, 500);
    this.scene.add(this.light4);
  }

  private getAspectRatio() {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  /**
 * Start the rendering loop
 *
 * @private
 * @memberof CubeComponent
 */
  private startRenderingLoop() {
    //* Renderer
    // Use canvas element in template
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    let component: SceneComponent = this;
    (function render() {
      component.renderer.render(component.scene, component.camera);
      component.animateModel();
      requestAnimationFrame(render);
    }());
  }

  constructor() { }

  ngOnInit(): void {

  }

  changeFlag = false;
  changeObject() {


    this.mouse = new THREE.Vector2();
    this.highlightedTooth = null;
    this.selectedTooth = null;
    this.toothMaterial = null;
    this.highlightedToothMaterial = null;
    this.selectedToothMaterial = null;
    this.labelRenderer = null;
    this.raycaster = new THREE.Raycaster();
    this.teeth = []; //
    this.backupdata = [];




    if (this.changeFlag) {
      this.changeFlag = false;
      this.createScene('assets/apartment_complex_building/scene.gltf');
    } else {
      this.changeFlag = true;
      this.createScene('assets/siwm-----villa_savoye-le_corbusier/scene.gltf');
    }
    this.createControls();

    this.configCamera();
    this.configRenderer();
    this.animate();

  }

  ngAfterViewInit() {

    this.init();//mouse click move


    // this.c1reateScene('assets/robot/scene.gltf');
    this.createScene('assets/apartment_complex_building/scene.gltf');
    // this.startRenderingLoop(); // rotate loop
    this.createControls();

    // this.createLight(); Already availble in c1reateScene()
    // this.createMesh();



    // this.configScene();//background
    this.configCamera();
    this.configRenderer();
    // this.configControls();//OrbitControls


    this.animate();


    // this.animate1();
  }

  // House_door_lambert16_0
  materialFun() {

    this.meshArray(this.model);
    // this.teeth = gltf.scene.children[0].children[0].children[0].children;

    // this.model.children[0].children[0].children.forEach((element: any) => {

    // console.log("Object3D >>> ",valobj.type == "Object3D")
    // console.log("Mesh >>> ",valobj.type == "Mesh")
    // console.log("CSS2DObject >>> ",valobj.type == "CSS2DObject")
    //     if(this.model.type == "Mesh"){
    //       this.teeth.push(this.model);
    //       this.backupdata.push(this.model.clone());
    //     }else{

    //   this.model.children.forEach((l1: any) => {
    //     if (l1.type == "Mesh") {
    //       this.teeth.push(l1);
    //       this.backupdata.push(l1.clone());
    //     }
    //     l1.children.forEach((l2: any) => {
    //       if (l2.type == "Mesh") {
    //         this.teeth.push(l2);
    //         this.backupdata.push(l2.clone());
    //       }
    //       l2.children.forEach((l3: any) => {
    //         if (l3.type == "Mesh") {
    //           this.teeth.push(l3);
    //           this.backupdata.push(l3.clone());
    //         }
    //         l3.children.forEach((l4: any) => {
    //           if (l4.type == "Mesh") {
    //             this.teeth.push(l4);
    //             this.backupdata.push(l4.clone());
    //           }
    //           l4.children.forEach((l5: any) => {
    //             if (l5.type == "Mesh") {
    //               this.teeth.push(l5);
    //               this.backupdata.push(l5.clone());
    //             }
    //             l5.children.forEach((l6: any) => {
    //               if (l6.type == "Mesh") {
    //                 this.teeth.push(l6);
    //                 this.backupdata.push(l6.clone());
    //               }
    //             })
    //           })
    //         });
    //       });
    //     });
    //   });
    // }

    console.log(this.teeth)



    this.teeth.forEach((tooth: any, index: any) => {
      const labelDiv = document.createElement("div");
      labelDiv.classList.add("tooth-label");
      const num = parseInt(tooth.name);

      // labelDiv.innerHTML = "A computer science portal for geeks.";

      const numSpan = document.createElement("span");
      numSpan.textContent = index.toString();
      // labelDiv.append(numSpan);
      labelDiv.style.color = "yellow";
      labelDiv.style.background = "black";
      const nameSpan = document.createElement("span");
      nameSpan.textContent = tooth.name.replace(/_/g, " ").replace(index, "");
      // nameSpan.textContent = "Mirror".replace(/_/g, " ");
      labelDiv.append(nameSpan);
      const label = new CSS2DObject(labelDiv);
      label.position.set(0, 0, 0);
      label.visible = false;
      tooth.add(label);
    });

    if (this.teeth.length > 0) {
      this.toothMaterial = this.teeth[0].material;
      this.highlightedToothMaterial = this.teeth[0].material.clone();
      this.highlightedToothMaterial.emissive.setHex(0xff00ff);//ping

      this.selectedToothMaterial = this.teeth[0].material.clone();
      this.selectedToothMaterial.emissive.setHex(0x0066ff);//blue
    }
  }

  meshArray(model: any) {
    var _this = this;
    if (model.type == "Mesh") {
      // if(model.name == "House_door_lambert16_0"){
      if (model.name == "Material2_7") {

        // var spritey = this.makeTextSprite("Door",
        //   { fontsize: 44, textColor: { r: 255, g: 255, b: 255, a: 1.0 } });
        // spritey.position.set(-5, 5, -5);
        // model.add(spritey);

        // model.visible = true;
        // console.log(model)
        _this.teeth.push(model);
        _this.backupdata.push(model.clone());

        const map = new THREE.TextureLoader().load( 'https://i.imgur.com/Y2iD43A_d.jpg' );
        const material = new THREE.SpriteMaterial( { map: map } );
        
        const sprite = new THREE.Sprite( material );
        model.add( sprite );

        //loadModel //https://discourse.threejs.org/t/how-to-create-sketchfab-like-annotations-with-three-js/12595/10

        // this.createMarker(model, model.position)
        // this.createMarker(model, new Vector3(4,15,1.7))
        // this.createMarker(model, new Vector3(-6,0,4))


        //texture load

        // var loader = new THREE.TextureLoader();
        // loader.crossOrigin = "anonymous";
        // loader.load("https://i.imgur.com/Y2iD43A_d.jpg", function (map) {
        //   var material:any = new THREE.MeshNormalMaterial();
        //   material = new THREE.MeshBasicMaterial({ map: map,
        //     // hacky time
        //     opacity: 0.3, transparent: true, depthTest: false
        //   });
          
        //   var geometry = new THREE.BoxGeometry( 0.5, 0.5, 0.5 );
        //   var mesh2 = new THREE.Mesh( geometry, material );
        //   mesh2.updateMatrixWorld = _this.updateMatrixWorld;
        //   mesh2.position.set (0.4, 0, 0);
        //   model.add( mesh2 );

        // })

      }
    }
    model.children.forEach((l2: any) => {
      _this.meshArray(l2);
    })
  }

  // more hacking, I suppose...
updateMatrixWorld (force:any) {
	
  THREE.Object3D.prototype.updateMatrixWorld.call (this, force);
}

  makeTextSprite(message: any, parameters: any) {
    if (parameters === undefined) parameters = {};
    var fontface = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Courier New";
    var fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 18;
    var borderThickness = parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 4;
    var borderColor = parameters.hasOwnProperty("borderColor") ? parameters["borderColor"] : { r: 0, g: 0, b: 0, a: 1.0 };
    var backgroundColor = parameters.hasOwnProperty("backgroundColor") ? parameters["backgroundColor"] : { r: 0, g: 0, b: 255, a: 1.0 };
    var textColor = parameters.hasOwnProperty("textColor") ? parameters["textColor"] : { r: 0, g: 0, b: 0, a: 1.0 };

    var canvas = document.createElement('canvas');
    var context: any = canvas.getContext('2d');
    context.font = "Bold " + fontsize + "px " + fontface;
    // var metrics = context.measureText( message );
    // var textWidth = metrics.width;

    context.fillStyle = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")";
    context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";
    context.fillStyle = "rgba(" + textColor.r + ", " + textColor.g + ", " + textColor.b + ", 1.0)";
    context.fillText(message, borderThickness, fontsize + borderThickness);

    var texture = new THREE.Texture(canvas)
    texture.needsUpdate = true;
    var spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    var sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(0.5 * fontsize, 0.25 * fontsize, 0.75 * fontsize);
    return sprite;
  }

  init() {
    document.addEventListener(
      "mousemove",
      e => this.onDocumentMouseMove(e),
      false
    );
    document.addEventListener(
      "mousedown",
      e => this.onDocumentMouseDown(e),
      false
    );
  }

  onDocumentMouseMove(event: any) {
    event.preventDefault();
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  onDocumentMouseDown(event: any) {
    if (this.selectedTooth !== this.highlightedTooth) {
      // this.selectedTooth && (this.selectedTooth.material = this.toothMaterial);
      if (this.selectedTooth) {
        var myData = this.backupdata.filter((data: any) => {
          return data.name == this.selectedTooth.name;
        });

        this.selectedTooth.material = myData[0].material;
      }
      this.selectedTooth = this.highlightedTooth;
      if (this.selectedTooth) {
        this.selectedTooth.material = this.selectedToothMaterial;
        console.log(this.selectedTooth)
        // this.selectedTooth.children[0].visible = false;
        // this.highlightedTooth.children[0]["visible"] = false;
        this.changeObject();
      }

    } else {
      this.selectedTooth &&
        (this.selectedTooth.material = this.highlightedToothMaterial);
      this.selectedTooth = null;
    }
  }


  configScene(): void {
    this.scene.background = new THREE.Color(0xdddddd);
  }

  private calculateAspectRatio(): number {
    const height = this.canvas.clientHeight;
    if (height === 0) {
      return 0;
    }
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  configCamera(): void {
    this.camera.aspect = this.calculateAspectRatio();
    this.camera.updateProjectionMatrix();
    this.camera.position.set(-15, 10, 15);
    this.camera.lookAt(this.scene.position);
  }

  resizeCanvasToDisplaySize(force: any): void {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    if (force || this.canvas.width !== width || this.canvas.height !== height) {
      this.renderer.setSize(width, height, false);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }
  }

  configRenderer(): void {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setPixelRatio(1);
    this.renderer.setClearColor(0x000000, 0);
    this.resizeCanvasToDisplaySize(true);

    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
    this.labelRenderer.domElement.style.position = "absolute";
    this.labelRenderer.domElement.style.top = 0;
    document.body.appendChild(this.labelRenderer.domElement);

    this.controls = new OrbitControls(
      this.camera,
      this.labelRenderer.domElement
    );
  }

  configControls(): void {
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.autoRotate = false;
    this.controls.enableZoom = true;
    this.controls.enablePan = true;
    this.controls.update();
  }


  createLight(): void {
    const directionalLight = new THREE.DirectionalLight(0x808080);
    directionalLight.intensity = 0.5;
    directionalLight.position.set(-10, 10, 10);
    this.scene.add(directionalLight);
    const ambientLight = new THREE.AmbientLight(0xffffff);
    ambientLight.intensity = 0.7;
    this.scene.add(ambientLight);
  }


  animate(): void {
    window.requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.update();
    this.renderer.render(this.scene, this.camera);
    this.labelRenderer.render(this.scene, this.camera);
  }

  update() {

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObjects(this.teeth);
    let currentTooth = null;
    if (intersects.length) {
      currentTooth = intersects[0].object as THREE.Mesh;
    }
    if (this.highlightedTooth !== currentTooth) {
      if (this.highlightedTooth) {
        if (this.selectedTooth !== this.highlightedTooth) {

          var myData = this.backupdata.filter((data: any) => {
            return data.name == this.highlightedTooth.name;
          });
          // if(myData.length>0){
          // var meshStandardMaterial = myData[0].materials[0] as THREE.MeshStandardMaterial;
          // this.highlightedTooth.material = meshStandardMaterial
          // }
          this.highlightedTooth.material = myData[0].material;
          // this.highlightedTooth.material.emissive.setHex(0x0066ff);
          // this.highlightedTooth.material = this.toothMaterial;
        }
        if (this.highlightedTooth.children.length > 0) {
          this.highlightedTooth.children[0]["visible"] = false;
        }
      }
      this.highlightedTooth = currentTooth;
      if (this.highlightedTooth) {
        if (this.selectedTooth !== this.highlightedTooth) {
          // var myData = this.backupdata.filter((data:any) => {
          //   return data.name == this.highlightedTooth.name;
          // });
          // if(myData.length>0){
          //   var meshStandardMaterial = myData[0].materials[0] as THREE.MeshStandardMaterial;
          //   this.highlightedTooth.material = meshStandardMaterial;
          // }
          // this.highlightedTooth.material = myData[0].material;

          this.highlightedTooth.material = this.highlightedToothMaterial;
        }
        if (this.highlightedTooth.children.length > 0) {
          this.highlightedTooth.children[0].visible = true;
        }
      }
    }
  }


  animate1(): void {
    window.requestAnimationFrame(() => this.animate1());
    this.controls.update();
    this.render();
}
render() {
  this.renderer.render(this.scene, this.camera);
  this.updateAnnotationOpacity();
  this.updateScreenPosition();
}
updateAnnotationOpacity() {
  // const meshDistance = this.camera.position.distanceTo(mesh.position);
  // const spriteDistance = this.camera.position.distanceTo(sprite.position);
  // this.spriteBehindObject = spriteDistance > meshDistance;
  // sprite.material.opacity = spriteBehindObject ? 0.25 : 1;

  // Do you want a number that changes size according to its position?
  // Comment out the following line and the `::before` pseudo-element.
  // sprite.material.opacity = 0;
}

updateScreenPosition() {
  var _this=this;
  const vector = new THREE.Vector3(250, 250, 250);
  const canvas = this.renderer.domElement;

  vector.project(this.camera);

  vector.x = Math.round((0.5 + vector.x / 2) * (canvas.width / window.devicePixelRatio));
  vector.y = Math.round((0.5 - vector.y / 2) * (canvas.height / window.devicePixelRatio));

  _this.annotation.style.top = `${vector.y}px`;
  _this.annotation.style.left = `${vector.x}px`;
  _this.annotation.style.opacity =  "1";
}





createMarker(model:any, position:any) {
  const loader = new TextureLoader();
  loader.crossOrigin = "";
  const map = loader.load("https://i.imgur.com/EZynrrA.png");
  // map.encoding = sRGBEncoding
  
  const spriteMaterialFront = new SpriteMaterial( { map } );
  
  const spriteFront = new Sprite( spriteMaterialFront );
  spriteFront.position.copy(position) 
  
  const spriteMaterialRear = new SpriteMaterial({ 
    map,
    opacity: 1.3, 
    transparent: true, 
    depthTest: false
  });
  
  const spriteRear = new Sprite( spriteMaterialRear );
  spriteRear.position.copy(position) 
  
  model.add(spriteFront, spriteRear)
}


}
