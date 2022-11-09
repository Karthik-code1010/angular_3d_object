import { Component, OnInit, AfterViewInit, Input, ViewChild, ElementRef } from '@angular/core';
import * as THREE from "three";
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import gsap from "gsap";

@Component({
  selector: 'app-parking',
  templateUrl: './parking.component.html'
})

export class ParkingComponent implements OnInit, AfterViewInit {


  ///New Start


  myCars: any = [
    {
      "name": "Car_jeep1",
      "isParking": true
    },
    {
      "name": "Car_jeep",
      "isParking": false
    }
  ];

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

  carsList: any = [];

  ///New End

  @ViewChild('scene_id') private canvasRef: ElementRef;

  //* Stage Properties

  @Input() public fieldOfView: number = 10;//50//1

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

  mixer: any;
  private createScene(path: any) {
    var _this = this;
    //* Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xd4d4d8)

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/libs/draco/'); // use a full url path
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    gltfLoader.load(path, (gltf) => {

      this.model = gltf.scene;//fact
      // this.model = gltf.scene.children[0];//emd_gp7_western_pacific_713
      var box = new THREE.Box3().setFromObject(this.model);
      box.getCenter(this.model.position); // this re-sets the mesh position
      this.model.position.multiplyScalar(-1);
      this.scene.add(this.model);



      this.materialFun();


      //https://discourse.threejs.org/t/how-to-create-sketchfab-like-annotations-and-click-zoom-with-three-js/30608/3
      //動畫調用 animation
      this.mixer = new THREE.AnimationMixer(this.model);

      gltf.animations.forEach((clip) => {
        this.mixer.clipAction(clip).play();
      });

      var raycaster = new THREE.Raycaster();
      var mouse = new THREE.Vector2();
      var intersects: any = [0];

      // renderer.domElement.addEventListener("click", onClick, false);
      // document.addEventListener("mousedown", onClick, false);

      // function onClick(event: any) {
      //   console.log("kkkk")
      //   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      //   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      //   raycaster.setFromCamera(mouse, _this.camera);
      //   intersects = raycaster.intersectObject(_this.model, true);
      //   if (intersects.length > 0) {
      //     console.log("Intersection:", intersects[0]);

      //     gsap.to(_this.camera.position, {
      //       duration: 3,
      //       x: 0,
      //       y: 15,
      //       z: 20,
      //       onUpdate: function () {
      //         _this.controls.update();
      //       },
      //     });
      //   }
      // }


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
    this.light1 = new THREE.PointLight(0x1c224b, 10);
    this.light1.position.set(0, 200, 400);
    this.scene.add(this.light1);
    // this.light2 = new THREE.PointLight(0x4b371c, 10);
    // this.light2.position.set(500, 100, 0);
    // this.scene.add(this.light2);
    // this.light3 = new THREE.PointLight(0x4b371c, 10);
    // this.light3.position.set(0, 100, -500);
    // this.scene.add(this.light3);
    // this.light4 = new THREE.PointLight(0x4b371c, 10);
    // this.light4.position.set(-500, 300, 500);
    // this.scene.add(this.light4);
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
    let component: ParkingComponent = this;
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
      this.createScene('assets/autumn_house/scene.gltf');
    } else {
      this.changeFlag = true;
      this.createScene('assets/inside_of_sans_and_papyrus_house._wip/scene.gltf');
    }
    this.createControls();

    this.configCamera();
    this.configRenderer();
    this.animate();

  }

  ngAfterViewInit() {

    this.init();//mouse click move


    this.createScene('assets/parking_lot_uf/scene.gltf');//
    // this.startRenderingLoop(); // rotate loop
    this.createControls();

    // this.createLight(); Already availble in createScene()
    // this.createMesh();



    // this.configScene();//background
    this.configCamera();
    this.configRenderer();
    // this.configControls();//OrbitControls


    this.animate();

  }
  noCar() {
    this.carsList.forEach((element: any, index: any) => {
      element["visible"] = false;
    });
  }
  car() {
    this.carsList.forEach((element: any, index: any) => {
      element["visible"] = true;
    });
  }
  car1() {
    this.carsList[0]["visible"] = true;
  }
  car2() {
    this.carsList[1]["visible"] = true;
  }


  materialFun() {

    var _this = this;
    // this.teeth = gltf.scene.children[0].children[0].children[0].children;

    // this.model.children[0].children[0].children.forEach((element: any) => {

    // console.log("Object3D >>> ",valobj.type == "Object3D")
    // console.log("Mesh >>> ",valobj.type == "Mesh")
    // console.log("CSS2DObject >>> ",valobj.type == "CSS2DObject")

    console.log(_this.model)
    _this.meshArray(_this.model);

    //     if(_this.model.type == "Mesh"){
    //       _this.teeth.push(_this.model);
    //       _this.backupdata.push(_this.model.clone());

    //     }else{
    //       if(_this.model.parent.name == "Cars"){
    //         _this.carsList.push(_this.model)
    //       }

    //   _this.model.children.forEach((l1: any) => {
    //     if (l1.type == "Mesh") {
    //       _this.teeth.push(l1);
    //       _this.backupdata.push(l1.clone());
    //     }else if(l1.parent.name == "Cars"){
    //       _this.carsList.push(l1)
    //     }
    //     l1.children.forEach((l2: any) => {
    //       if (l2.type == "Mesh") {
    //         _this.teeth.push(l2);
    //         _this.backupdata.push(l2.clone());
    //       }else if(l2.parent.name == "Cars"){
    //         _this.carsList.push(l2)
    //       }
    //       l2.children.forEach((l3: any) => {
    //         if (l3.type == "Mesh") {
    //           _this.teeth.push(l3);
    //           _this.backupdata.push(l3.clone());
    //         }else if(l3.parent.name == "Cars"){
    //           _this.carsList.push(l3)
    //         }
    //         l3.children.forEach((l4: any) => {
    //           if (l4.type == "Mesh") {
    //             _this.teeth.push(l4);
    //             _this.backupdata.push(l4.clone());
    //           }else if(l4.parent.name == "Cars"){
    //             _this.carsList.push(l4)
    //           }
    //           l4.children.forEach((l5: any) => {
    //             if (l5.type == "Mesh") {
    //               _this.teeth.push(l5);
    //               _this.backupdata.push(l5.clone());
    //             }else if(l5.parent.name == "Cars"){
    //               _this.carsList.push(l5)
    //             }
    //             l5.children.forEach((l6: any) => {
    //               if (l6.type == "Mesh") {
    //                 _this.teeth.push(l6);
    //                 _this.backupdata.push(l6.clone());
    //               }else if(l6.parent.name == "Cars"){
    //                 _this.carsList.push(l6)
    //               }
    //             })
    //           })
    //         });
    //       });
    //     });
    //     console.log(_this.carsList)
    //   });
    // }
    console.log(_this.teeth)

    this.toothMaterial = this.teeth[0].material;
    this.highlightedToothMaterial = this.teeth[0].material.clone();
    this.highlightedToothMaterial.emissive.setHex(0xff00ff);//ping

    this.selectedToothMaterial = this.teeth[0].material.clone();
    this.selectedToothMaterial.emissive.setHex(0x0066ff);//blue



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
      // nameSpan.textContent = tooth.name.replace(/_/g, " ").replace(index, "");
      nameSpan.textContent = tooth.name;
      labelDiv.append(nameSpan);
      const label = new CSS2DObject(labelDiv);
      label.position.set(0, 0, 0);
      label.visible = false;
      tooth.add(label);




      // 3d text

      // var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
      // camera.position.z = 75;
      // var renderer = new THREE.WebGLRenderer({ antialias: true });
      // renderer.setSize(window.innerWidth, window.innerHeight);
      // document.body.appendChild(renderer.domElement);

      //   var loader = new THREE.FontLoader();
      //   loader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_bold.typeface.json', function (font) {

      //     var geometry = new THREE.TextGeometry('Text', {
      //       font: font,
      //       size: 50,
      // height: 10,
      // curveSegments: 12,

      // bevelThickness: 1,
      // bevelSize: 1,
      // bevelEnabled: true
      //     });
      //     // geometry.center();

      //     var material = new THREE.MeshBasicMaterial({
      //       color: 0x00ff00
      //     });

      //     var txt = new THREE.Mesh(geometry, material);
      //     tooth.add(txt);
      //     function animate() {
      //       requestAnimationFrame(animate);
      //       // renderer.render(tooth, camera);
      //       txt.rotation.x += 0.01;
      //       txt.rotation.y += 0.01;
      //     }
      //     // animate();

      //   });


    });





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

  // animate();

  // // Renders the scene and updates the render as needed.
  //  animate() {


  //   renderer.render( scene, camera );
  //   controls.update();

  //   requestAnimationFrame( animate );
  // }

  meshArray(model: any) {
    var _this = this;
    if (model.type == "Mesh") {
      _this.teeth.push(model);
      _this.backupdata.push(model.clone());


      //2d text
      if (model.parent.name == "Cars") {

      }

    } else if (model.parent.name == "Cars") {


      var myData = _this.myCars.find((data: any) => {
        return data.isParking && data.name == model.name;
      });
      if (!myData) {
        model["visible"] = false;
      }
      // this.addLabel("My text", model, 1 + 4, 2, 0);
      // https://i.imgur.com/Y2iD43A_d.jpg
      const map = new THREE.TextureLoader().load('assets/images/animated-click-here.gif');
      const material = new THREE.SpriteMaterial({ map: map, color: 0xffffff });

      const sprite = new THREE.Sprite(material);
      sprite.position.set(10, 350, -250);
      sprite.scale.set(250, 250, 1);
      model.add(sprite);

      console.log(model)

      var raycaster = new THREE.Raycaster();
      var mouse = new THREE.Vector2();
      var intersects: any = [0];
      document.addEventListener("mousedown", onClick, false);

      function onClick(event: any) {
        console.log("okkkkkkkkk")
          mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, _this.camera);
        intersects = raycaster.intersectObject(_this.model, true);
        if (intersects.length > 0) {
          console.log("Intersection:", intersects[0]);

          console.log(_this.camera.position)
          var point = intersects[0]["point"]
          gsap.to(_this.camera.position, {
            duration: 3,
            x: point.x,
            y: point.y,
            z: intersects[0]["distance"],
            onUpdate: function () {
              _this.controls.update();
            },
          });
        }
      }

      _this.carsList.push(model)
      
    }
    if (model.name == "Cars") {
      // var newCar = model.children[0].clone();
      // newCar["parent"] = model.children[0]["parent"].clone();
      // model.children.push(newCar);

      // var newCar = model.children[1].clone();
      // newCar["parent"] = model.children[0].clone();
      // model.children.push(newCar);

      // var newCar = model.children[0].clone();
      // newCar["parent"] = model.children[0].clone();
      // model.children.push(newCar);

      // var newCar = model.children[1].clone();
      // newCar["parent"] = model.clone();
      // model.children.push(newCar);

      // var newCar = model.children[0].clone();
      // newCar["parent"] = model.clone();
      // model.children.push(newCar);
    }
    model.children.forEach((l2: any) => {

      _this.meshArray(l2);
    })
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
      this.selectedTooth &&
        (this.selectedTooth.material = this.selectedToothMaterial);
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
}
