import { Component, OnInit, AfterViewInit, Input, ViewChild, ElementRef } from '@angular/core';
import * as THREE from "three";
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
//import { OrbitControlsGizmo } from 'three/examples/jsm/';
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

import {FlatTreeControl} from '@angular/cdk/tree';


import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { OrbitControlsGizmo } from './OrbitControlsGizmo';
//import { OrbitControls } from './OrbitControls';
//import { OrbitControlsGizmo } from './OrbitControlsGizmo';
//import { GUI } from "https://unpkg.com/dat.gui@0.7.7/build/dat.gui.module.js";
/** Flat node with expandable and level information */

// CommonJS:
//import { GUI } from 'dat.gui'
var dat = require('dat.gui');
//var OrientationGizmo:any = require('OrientationGizmo');
//var  OrbitControlsGizmo  = require('OrbitControlsGizmo')
//declare let OrbitControlsGizmo: any;
//var v = require("./OrbitControlsGizmo");
// ES6:
//import * as dat from 'dat.gui';

interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-new-car',
  templateUrl: './new-car.component.html',
  styleUrls: ['./new-car.component.scss']
})
export class NewCarComponent implements OnInit, AfterViewInit {

  myControl = new FormControl('');
  myForm!: FormGroup;

  x: any = 70;
  y: any = 30;
  minSize:any = 10;


  x1: any = 80;
  y1: any = 20;
  minSize1:any = 10;

  private _transformer = (node: any, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      id:node.id,
      type:node.type,
      isHighlight:false
    };
  };

  treeControl:any = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
    
  );

  treeFlattener:any = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );


  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

 
  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
  activeNode:any

  @ViewChild('tree') tree: any;



 






  ///New Start

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

  @ViewChild('canvas') private canvasRef: ElementRef;

  //* Stage Properties

  @Input() public fieldOfView: number = 30;
 //@Input() public fieldOfView: number = 50;
  @Input('nearClipping') public nearClippingPane: number = 1;
 //@Input('nearClipping') public nearClippingPane: number = 1;
  @Input('farClipping') public farClippingPane: number = 1000;
 //@Input('farClipping') public farClippingPane: number = 1000;
  //? Scene properties
  private camera: THREE.PerspectiveCamera;  //new THREE.PerspectiveCamera(70, 2, 1, 1000);

  private controls: OrbitControls;

private  controlsGizmo: any;
  private ambientLight: THREE.AmbientLight;

  private light1: THREE.PointLight;

  private light2: THREE.PointLight;

  private light3: THREE.PointLight;

  private light4: THREE.PointLight;

  private model: any;

  private directionalLight: THREE.DirectionalLight;
  currentToothObj :any;
  currentObjDetail: any;
  elementDiv: any;
  //copyOfData: any = [];
  filteredData:any = [];
  emissiveData: any;

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
    renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0px';

    //const element:any = document.getElementById("jeepObjectId");
    this.elementDiv  = document.querySelector('#jeepObjectId');
    this.elementDiv.appendChild(renderer.domElement);
   
    this.controls = new OrbitControls(this.camera, renderer.domElement);
    console.log('this.controls ==2>',this.controls)
    // const helper = new THREE.CameraHelper( this.camera );
    // this.scene.add( helper );
   
   
    this.controlsGizmo = new OrbitControlsGizmo( this.controls , { size: 100, padding: 8 });
    console.log('this.controlsGizmo',this.controlsGizmo)
     this.elementDiv.appendChild(this.controlsGizmo.domElement);
    // // document.body.appendChild(controlsGizmo.domElement);

//     var orientationGizmo = new OrientationGizmo(this.camera, { size: 100, padding: 8 });
// //document.body.appendChild(orientationGizmo);
//      this.elementDiv.appendChild(orientationGizmo);

     
    // // this.controls.autoRotate = true;

    this.controls.enableZoom = true;
    this.controls.enableDamping = false;
   // this.controls.enableRotate = false;
    this.controls.enabled = false

     this.controls.enablePan = true;
  //   this.controls.mouseButtons = {
  //      LEFT: THREE.MOUSE.ROTATE,
  //     MIDDLE: THREE.MOUSE.DOLLY,
  //      RIGHT: THREE.MOUSE.PAN
  // }
 
  
    this.controls.update();

    // this.controls.minPolarAngle = Math.PI * 0.5;
    // this.controls.maxPolarAngle = Math.PI * 0.5;


     // GUI
  //const gui = new GUI();
 // const gui = new dat.GUI();
 // gui.add(this.controls, 'enabled').name("Enable Orbit Controls");
 //  gui.add(this.controlsGizmo, 'lock').name("Lock Gizmo");
   //gui.add(this.controlsGizmo, 'lockX').name("Lock Gizmo's X Axis");
   //gui.add(this.controlsGizmo, 'lockY').name("Lock Gizmo's Y Axis");




  };

  cursonTrueFalse:boolean = false;

  enableMouseControl(){
  
    if(this.cursonTrueFalse ==  false){
    
      console.log('disable work');
      this.cursonTrueFalse = true
  
     // this.controls.enabled = false;
      // this.controls.enableRotate = false;
      // this.controls.update();
  
    }else{
     
  
      console.log('enable work');
      this.cursonTrueFalse = false;
     // this.controls.enabled = true;
      // this.controls.enableRotate = true;
      // this.controls.update();
    }
   
  
     
  
  
  }

  /**
   * Create the scene
   *
   * @private
   * @memberof CubeComponent
   */
  private createScene() {
    //* Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xd4d4d8)
    this.loaderGLTF.load('assets/newcar/scene.gltf', (gltf: GLTF) => {
console.log('gltf',gltf)
      // this.model = gltf.scene.children[0];
      this.model = gltf.scene;
      console.log(this.model);
      this.dataSource.data  = [gltf.scene]
      var box = new THREE.Box3().setFromObject(this.model);
      box.getCenter(this.model.position); // this re-sets the mesh position
      this.model.position.multiplyScalar(-1);
      this.scene.add(this.model);
      //this.scene.add( new THREE.AxesHelper( 20 ) );
     //this.scene.add(new THREE.GridHelper(10, 10, "#666666", "#222222"));
    //  const dir = new THREE.Vector3( 1, 2, 0 );
    // const helper = new THREE.CameraHelper( this.camera );
    //  this.scene.add( helper );

    //  //normalize the direction vector (convert to vector of length 1)
    //  dir.normalize();
     
    //  const origin = new THREE.Vector3( 0, 0, 0 );
    //  const length = 1;
    //  const hex = 0xffff00;
     
    //  const arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
    //  this.scene.add( arrowHelper );

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
    let component: NewCarComponent = this;
    (function render() {
      component.renderer.render(component.scene, component.camera);
      component.animateModel();
      requestAnimationFrame(render);
    }());
  }

  constructor() { }

  ngOnInit(): void {
    this.myForm = new FormGroup({
      myControl:new FormControl('')
   
  });

  // this.myForm.controls['myControl'].valueChanges.subscribe(value => {
  //   console.log(value);
  //  // var temp:any = this.orgData
  //   if(value.length > 0){
  //     this.valuechange(value) 
  //   }else{
    
  //   }
   

//console.log(result);
  //});
  

  }

  
  searchName = '';
  ngAfterViewInit() {

    this.init();//mouse click move


    this.createScene();
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
  

  

  fitCameraTo(boundingBox: THREE.Box3) {
    const camera:any = this.camera;
    const objPosition = boundingBox.getCenter(new THREE.Vector3());
    const objSize = boundingBox.getSize(new THREE.Vector3());
    boundingBox.min.y = 0;
    boundingBox.max.y = 0;
    const boundingSphere = boundingBox.getBoundingSphere(new THREE.Sphere());

    let dim = boundingSphere.radius * 2;
    if (dim < camera.near) {
        dim = camera.near;
    }

    const direction = THREE.Object3D.DefaultUp.clone(); // view direction

    // object angular size
    const fov:any = THREE.MathUtils.degToRad(camera.fov);

    let distance = dim / (2.0 * Math.tan(fov / 2.0));

    if (camera.aspect <= 1) {
        distance = distance / camera.aspect;            
    }

    if (distance < camera.near) {
        distance = objSize.y;
    }

    if (distance < camera.near) {
        distance = camera.near;
    }

    camera.position.copy(objPosition.clone().add(direction.multiplyScalar(distance)));

    if (this.controls) {
      this.controls.target.copy(objPosition); 
     // this.controls.rotateLeft(Math.PI);                        
    } else {
        camera.lookAt(objPosition);
    }

    camera.updateProjectionMatrix();
}
  valuechange(ev:any){
    console.log('ev',ev)
    console.log(this.searchName)
    console.log(this.teeth)

    if(this.searchName && this.searchName.length > 0){
      
    console.log(this.teeth);
   

   




    
    //var found = this.teeth.find((element:any) => element.name == this.searchName);

  var findIndex =   this.teeth.findIndex((element:any) => element.name == this.searchName)

  if(findIndex != -1){


    console.log(findIndex)
    //this.teeth[findIndex] = 
  //  console.log(found);
  //  console.log(found.xLength, found.yLength, found.zLength)
   //found =this.teeth[0].material.clone();
  
   var box = new THREE.BoxHelper(  this.teeth[findIndex] );
   //var  currentTeeth =this.teeth[findIndex]
   //found.material.emissive.setHex(0x00ff00);

 
  
   //.emissive.setHex(0xff0000);
  this.currentObjDetail = this.teeth[findIndex] 
  //this.camera.lookAt(this.teeth[findIndex].position)
  this.controls.target = this.teeth[findIndex].position.clone();
  
  
  // var fitcamera =new THREE.Box3().setFromObject(this.teeth[findIndex] ) 
  // this.fitCameraTo(fitcamera)
    this.scene.add( box );
  
    console.log('current obj',this.teeth[findIndex])
    console.log('this.camera',this.camera);
    console.log(this.scene)
  
    //console.log('this.myControl.value',this.myControl)
    // this.treeControl.dataNodes.forEach((element:any)=>{
    //   console.log('element.id ',element.id )
    //   if(element.id == this.myControl.value){
    //     element.isHighlight = true;
  
    //   }else{
    //     element.isHighlight = false;
    //   }
    // })
    this.highlightedTooth  = this.teeth[findIndex] 
   // this.highlightedTooth.material.emissive.setHex(0x0ff00);
    this.onDocumentMouseDown();
    
    // var centerX = this.teeth[findIndex].geometry.boundingSphere.center.x;
    // var centerY = this.teeth[findIndex].geometry.boundingSphere.center.y;
    // var centerZ = this.teeth[findIndex].geometry.boundingSphere.center.z;
    
    // //var position = { x: centerX, y: centerY, z: centerZ };
    // this.camera.position.set(centerX, centerY, centerZ);

    
var centerX = this.teeth[findIndex].geometry.boundingBox.min.x;
var centerY = this.teeth[findIndex].geometry.boundingBox.min.y;
var centerZ = this.teeth[findIndex].geometry.boundingBox.min.z;

this.camera.position.set(centerX, centerY, centerZ);
  
  
  }else{



    this.teeth.forEach((objdata:any,index:any) => {
      objdata.material = this.backupdata[index].material;
      
    });



    this.filteredData = this.teeth.filter((item:any) => item.name.indexOf(this.searchName) !== -1);

    this.tree.treeControl.expandAll();

  //  console.log('filter data',filteredData)
     this.treeControl.dataNodes.forEach((element:any)=>{
     // console.log('element.id ',element.id )

      this.filteredData.forEach((filter:any)=>{
      //  console.log('fiter',filter)
        if(element.id == filter.id){
        //  console.log(element.id,'======',filter.id)
          element.isHighlight = true;
    
        }

      })
      
    })

   // console.log('copyOfData',this.copyOfData);
   // this.teeth = this.copyOfData
    this.scene.children.forEach((sobj:any)=>{
      if(sobj.type == 'BoxHelper'){

        sobj.visible = false
      }
    })
  

      this.filteredData.forEach((element:any) => {
        var boxTy = new THREE.BoxHelper(element);
       // element.material = this.selectedToothMaterial
        element.material.emissive.setHex(0x0ff00);
        this.scene.add( boxTy );
      // this.onDocumentMouseDown();
        
      });











  }








    }
  



  }

  materialFun() {

    // this.teeth = gltf.scene.children[0].children[0].children[0].children;



    // this.model.children[0].children[0].children.forEach((element: any) => {

    //   if (element.children.length == 28) {
    //     element.children.forEach((valobj: any) => {
    //       valobj.children.forEach((tooth: any) => {
    //         // if(tooth.userData.name == "pCube33_blinn3_0"){
    //         this.teeth.push(tooth);
    //         this.backupdata.push(tooth.clone());
    //         // console.log(this.teeth)
    //         // console.log(this.backupdata)
    //         // this.toothMaterial = tooth.material;
    //         // this.highlightedToothMaterial = tooth.material.clone();
    //         // this.highlightedToothMaterial.emissive.setHex(0xff00ff);//ping

    //         // this.selectedToothMaterial = tooth.material.clone();
    //         // this.selectedToothMaterial.emissive.setHex(0x0066ff);//blue

    //         // }
    //       });
    //     })
    //   } else {
    //     element.children.forEach((tooth: any) => {
    //       if (tooth.userData.name != "pCylinder18_blinn18_0") {
    //         // this.teeth.push(tooth)
    //       }
    //     });
    //   }
    // });

    var _this = this;
    _this.meshArray(_this.model);

 
    
    // var found = this.teeth.find((element:any) => element.name == 'polySurface848_jeep_wrangler_aiStandardSurface4_0');
    // _this.teeth =  []
    // _this.backupdata =  []
    // _this.teeth.push(found)
    // _this.backupdata.push(found.clone())
    // console.log(' _this.teeth', _this.teeth);
    // console.log('  _this.backupdata',  _this.backupdata);
    // this.emissiveData = _this.backupdata[0].material.emissive.getHex();


    console.log(' this.emissiveData =====>', this.emissiveData )


    _this.teeth =  _this.teeth.filter((word:any) => word.name != 'pCylinder18_blinn18_0');
    _this.backupdata =  _this.backupdata.filter((word:any) => word.name != 'pCylinder18_blinn18_0');
    
    this.toothMaterial = this.teeth[0].material;
    this.highlightedToothMaterial = this.teeth[0].material.clone();
     this.highlightedToothMaterial.emissive.setHex(0xff00ff);//ping
    // this.highlightedToothMaterial.color.setHex(0xff00ff );
 
     this.selectedToothMaterial = this.teeth[0].material.clone();
     this.selectedToothMaterial.emissive.setHex(0x0066ff);//blue
    // this.selectedToothMaterial.color.setHex(0x0066ff );


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

    console.log(this.teeth);
    console.log(this.scene);
   // this.options = this.teeth
  }


  meshArray(model: any) {
    var _this = this;
    if (model.type == "Mesh") {
      model.material = model.material.clone()
      _this.teeth.push(model);
      _this.backupdata.push(model.clone());
     
    } 
    model.children.forEach((l2: any) => {
      
      _this.meshArray(l2);
    })
  }

  init() {

  // const element:any = document.getElementById("canvas");
    const element:any  = document.querySelector('#jeepObjectId');
    element.addEventListener(
     "mousemove",
     (e:any) => this.onDocumentMouseMove(e),
     false
   );
   element.addEventListener(
     "click",
     (e:any) => this.onDocumentMouseDown(),
     false
   );


    // document.addEventListener(
    //   "mousemove",
    //   e => this.onDocumentMouseMove(e),
    //   false
    // );
    // document.addEventListener(
    //   "mousedown",
    //   e => this.onDocumentMouseDown(e),
    //   false
    // );
  }

  onDocumentMouseMove(event: any) {
    event.preventDefault();

    if(this.cursonTrueFalse == false){
      var elementhover:any = document.getElementById("jeepObjectId");
      this.mouse.x = (event.clientX / elementhover.clientWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / elementhover.clientHeight) * 2 + 1;
    }
    if(this.cursonTrueFalse == true){
     // var elementhover:any = document.getElementById("jeepObjectId");
      // this.mouse.x = (event.clientX / elementhover.clientWidth) * 2 - 1;
      // this.mouse.y = -(event.clientY / elementhover.clientHeight) * 2 + 1;
    }

  }

  onDocumentMouseDown() {
    if(this.cursonTrueFalse == false){

      
    this.filteredData.forEach((element:any) => {
     
      // element.material = this.selectedToothMaterial
       element.material.emissive.setHex(0);
 
     })
 
     this.teeth.forEach((objdata:any,index:any) => {
       objdata.material = this.backupdata[index].material;
       
     });
 
     if (this.selectedTooth !== this.highlightedTooth) {
       // this.selectedTooth && (this.selectedTooth.material = this.toothMaterial);
       if (this.selectedTooth) {
         var myData = this.backupdata.filter((data: any) => {
           return data.name == this.selectedTooth.name;
         });
 
         console.log('mouse click backup mydata',myData[0])
         //this.selectedTooth.material = myData[0].material;
        // myData[0].material.emissive.getHex()
        this.selectedTooth.material.emissive.setHex(0); 
          
    
       }
 
       
       this.selectedTooth = this.highlightedTooth;
       this.selectedTooth &&
         (this.selectedTooth.material.emissive.setHex(0x66a3ff))  //; = this.selectedToothMaterial);
 
 
         this.currentToothObj =  this.selectedTooth
         this.currentObjDetail = this.selectedTooth
         // currentTooth.material.color.set( Math.random() * 0xffffff );
          console.log('currentTooth->',this.currentToothObj);
          this.scene.children.forEach((sobj:any)=>{
            if(sobj.type == 'BoxHelper'){
      
              sobj.visible = false
            }
          });
    
          
          var box = new THREE.BoxHelper( this.currentToothObj );
          this.scene.add( box );
          this.tree.treeControl.expandAll();
    
          console.log( this.currentToothObj.id)
          console.log('this.treeControl',this.treeControl)
    
          this.treeControl.dataNodes.forEach((element:any)=>{
            if(element.id == this.currentToothObj.id){
              element.isHighlight = true;
    
            }else{
              element.isHighlight = false;
            }
          })
    
          console.log('this.treeFlattener',this.treeFlattener)
    
          console.log('data sourse',this.dataSource)
    
 
 
 
     } else {
       this.selectedTooth &&
         (this.selectedTooth.material.emissive.setHex(0x00ff00));
         // this.selectedTooth &&
         // (this.selectedTooth.material = this.highlightedToothMaterial);
       this.selectedTooth = null;
     }
 
      
    
    }
    if(this.cursonTrueFalse == true){

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
   // this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
   // //this.canvas.clientWidth, this.canvas.clientHeight
   this.labelRenderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.labelRenderer.domElement.style.position = "absolute";
    this.labelRenderer.domElement.style.top = 0;
    //document.body.appendChild(this.labelRenderer.domElement);
    this.elementDiv.appendChild(this.labelRenderer.domElement);
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
    this.controlsGizmo.update();
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
          console.log('this.backupdata ====>',this.backupdata)
          console.log('myData[0] ====>',myData[0])
          console.log('this.highlightedTooth=>',this.highlightedTooth)
          // if(myData.length>0){
          // var meshStandardMaterial = myData[0].materials[0] as THREE.MeshStandardMaterial;
          // this.highlightedTooth.material = meshStandardMaterial
          // }
       // this.highlightedTooth.material = myData[0].material;
          //this.highlightedTooth.material.emissive.setHex(myData[0].material.emissive.getHex()); //.material.color.getHex()
           this.highlightedTooth.material.emissive.setHex(0);
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
          //

          //

         // this.highlightedTooth.material = this.highlightedToothMaterial;

          this.highlightedTooth.material.emissive.setHex(0xff99cc);
        }
        if (this.highlightedTooth.children.length > 0) {
          this.highlightedTooth.children[0].visible = true;
        }
      }
    }
  }

  focusObject(clickObj:any){
    console.log(clickObj);
    this.activeNode = clickObj

    this.teeth.forEach((objdata:any,index:any) => {
      objdata.material = this.backupdata[index].material;
      
    });

    console.log(this.teeth);

    this.scene.children.forEach((sobj:any)=>{
      if(sobj.type == 'BoxHelper'){

        sobj.visible = false
      }
    })

    var found = this.teeth.find((element:any) => element.id == clickObj.id);

  var findIndex =   this.teeth.findIndex((element:any) => element.id == clickObj.id)
  console.log(findIndex)
  //this.teeth[findIndex] = 
//  console.log(found);
//  console.log(found.xLength, found.yLength, found.zLength)
 //found =this.teeth[0].material.clone();

 var box = new THREE.BoxHelper(  this.teeth[findIndex] );
 //var  currentTeeth =this.teeth[findIndex]
 //this.teeth[findIndex].material.emissive.setHex(0xff99c2);
 //this.teeth[findIndex].material.color.setHex( 0xff99c2 )
 //this.teeth[findIndex].material.color.setRGB (1, 0, 0);
 //this.teeth[findIndex].material.color.set(0xff99c2);

//  var tempmesh = this.teeth[findIndex].material.clone();
//  tempmesh.emissive.setHex(0xff99c2);

//  this.teeth[findIndex].material = tempmesh;
 //this.teeth[findIndex].material.wireframe = true;
//boundingBox
//this.fitCameraTo(this.teeth[findIndex].geometry.boundingBox)
 //this.camera.position.set(-4, -4, -5);

// var centerX = this.teeth[findIndex].geometry.boundingBox.max.x;
// var centerY = this.teeth[findIndex].geometry.boundingBox.max.y;
// var centerZ = this.teeth[findIndex].geometry.boundingBox.max.z;

//  var centerX = this.teeth[findIndex].geometry.boundingSphere.center.x;
//  var centerY = this.teeth[findIndex].geometry.boundingSphere.center.y;
// var centerZ = this.teeth[findIndex].geometry.boundingSphere.center.z;
var centerX = this.teeth[findIndex].geometry.boundingBox.min.x;
var centerY = this.teeth[findIndex].geometry.boundingBox.min.y;
var centerZ = this.teeth[findIndex].geometry.boundingBox.min.z;

this.camera.position.set(centerX, centerY, centerZ);
//var position = { x: centerX, y: centerY, z: centerZ };
// centerX--;
// centerY--;
// centerZ--;
// centerX--;
// centerY--;
// centerZ--;
// centerX--;
// centerY--;
// centerZ--;
// centerX--;
// centerY--;
// centerZ--;



 //.emissive.setHex(0xff0000);
this.currentObjDetail = this.teeth[findIndex] 

	this.scene.add( box );

  console.log('current obj',this.teeth[findIndex])
  console.log(this.scene)

  this.treeControl.dataNodes.forEach((element:any)=>{
    if(element.id == clickObj.id){
      element.isHighlight = true;

    }else{
      element.isHighlight = false;
    }
  })
  this.highlightedTooth  = this.teeth[findIndex] 
 // this.highlightedTooth.material.emissive.setHex(0x0ff00);
  this.onDocumentMouseDown();

  //this.teeth[findIndex].visible = false

  	//box.applyMatrix4( found.matrix );
		//this.scene.add( this.teeth[findIndex] );
// found.emissive.setHex(0x00ff00);
// found = new THREE.BoxGeometry(1,1,1)

// found.geometry = new THREE.BoxGeometry( 1, 1, 1 );
// found.material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// 					const cube = new THREE.Mesh( found.geometry, found.material  );
// 					cube.visible = false;
// 					const box = new THREE.BoxHelper( cube );
				//	this.scene.add( box );
				//	box.applyMatrix4( found.matrix );
				//	this.scene.add( cube );

  }
}
