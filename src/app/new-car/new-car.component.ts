import { Component, OnInit, AfterViewInit, Input, ViewChild, ElementRef } from '@angular/core';
import * as THREE from "three";
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
//import { OrbitControlsGizmo } from 'three/examples/jsm/';
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

import {FlatTreeControl} from '@angular/cdk/tree';

import Stats from 'three/examples/jsm/libs/stats.module'
//import { TWEEN } from 'three/examples/jsm/libs/tween.module.min'
const TWEEN = require('@tweenjs/tween.js')
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { OrbitControlsGizmo } from './OrbitControlsGizmo';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { FontLoader, TextGeometry, TextureLoader } from 'three';
import { CSS3DObject } from 'three-css3d';
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
interface Annotation {
  title: string
  description: string
  position: THREE.Vector3
  lookAt: THREE.Vector3
  descriptionDomElement?: HTMLElement
}
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

  @Input() public fieldOfView: number = 1;
  //new car
 // @Input() public fieldOfView: number = 30;

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
  outlinePass: OutlinePass;
  selectedObjects:any = [];
  compose: EffectComposer;
  renderPass: RenderPass;
  rootDiv: HTMLDivElement;
  label2: CSS2DObject;
  position: THREE.Vector3;
  labelTooth: any;
  meshHtml: any = [];
  iconclickfound: any;
  annotationDetail: any;
  objname: HTMLParagraphElement;
  objid: HTMLParagraphElement;



  //? Helper Properties (Private Properties);

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  private loaderGLTF = new GLTFLoader();

  private renderer: THREE.WebGLRenderer;

  private scene: THREE.Scene;
  //tempV = new THREE.Vector3();

stats = Stats();

annotations: any = [
  {
    "title": "jeep tier",
    "description": "<p>MRF tier is very strong</p>",
    "camPos": {
      x: -1.5326006412506104, y: 1.9576284885406494, z: -1.481367588043213
      
    },
    "lookAt": {
      x: -2.9965999126434326, y: 0.9942384772002697, z: 0.4439733028411865
    }
  },
  {
    "title": "aiCarPaint1_0",
    "camPos": {
      x: 1.8106138706207275, y: 4.020437240600586, z: 4.163206100463867 
      ​​​
    
    },
    "lookAt": {
      x:-1.1920928955078125e-7, y: 2.651298761367798, z: 0.1529315710067749
    }
  },
  {
    "title": "blinn5_0",
    "description": "Keeps you warm in winter.",
    "camPos": {
      x: 2.243914842605591, y: 4.089898109436035, z: 4.79563045501709
​​​
     
    },
    "lookAt": {
      x: 0, y: 2.587713360786438, z: 0.23995208740234375
    }
  },
  {
    "title": "iStandardSurface",
    "camPos": {
      x: -1.5703625679016113, y: 1.9565846920013428, z: 3.9728970527648926
      ​​​
    
    },
    "lookAt": {
      x: -2.027032971382141, y: 0.9929567081853747, z: 3.0092692375183105
    }
  }
]
 pos = new THREE.Vector3(2, 0.5, 0);
 normal = new THREE.Vector3(1, 0, 0);

 cNormal = new THREE.Vector3();
 cPos = new THREE.Vector3();
 m4 = new THREE.Matrix4();
 
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

   
 
    const renderer:any = new CSS2DRenderer();
    renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0px';

    
    

    const renderTarget = new THREE.WebGLRenderTarget(
      1000,
      600,
      {
          minFilter: THREE.LinearFilter,
          magFilter: THREE.LinearFilter,
          format: THREE.RGBAFormat,
          encoding: THREE.sRGBEncoding
      }
  )
       this.compose = new EffectComposer(renderer ,renderTarget);
       this.compose.setPixelRatio(Math.min(window.devicePixelRatio, 2))
       this.compose.setSize(this.canvas.clientWidth, this.canvas.clientHeight)

       
      this.renderPass = new RenderPass(this.scene, this.camera);
      this.outlinePass = new OutlinePass( new THREE.Vector2(this.canvas.clientWidth, this.canvas.clientHeight ), this.scene, this.camera );
			//	composer.addPass( this.outlinePass );
   
      this.outlinePass.renderToScreen = true;
        this.outlinePass.edgeStrength =  3;
        this.outlinePass.edgeGlow = Number( 0.5 );
        this.outlinePass.edgeThickness = Number( 8 );
        this.outlinePass.pulsePeriod = Number( 1 );
       // this.outlinePass.usePatternTexture = true;
       this.outlinePass.visibleEdgeColor.set(0xff0000);
         this.outlinePass.hiddenEdgeColor.set(0x190a05);
      //  this.outlinePass.visibleEdgeColor.set( new THREE.Color(0xff0000));
      //  this.outlinePass.hiddenEdgeColor.set( new THREE.Color(0x190a05));

      //console.log(' this.outlinePass', this.outlinePass);
      this.compose.addPass(this.renderPass);
      this.compose.addPass(this.outlinePass);
    //const element:any = document.getElementById("jeepObjectId");
    this.elementDiv  = document.querySelector('#jeepObjectId');
    this.elementDiv.appendChild(renderer.domElement);
  //  this.elementDiv.appendChild(this.stats.dom);
    this.controls = new OrbitControls(this.camera, renderer.domElement);
    //console.log('this.controls ==2>',this.controls)
    // const helper = new THREE.CameraHelper( this.camera );
    // this.scene.add( helper );
   
   
    this.controlsGizmo = new OrbitControlsGizmo( this.controls , { size: 100, padding: 8 });
   // console.log('this.controlsGizmo',this.controlsGizmo)
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
  addSelectedObject( object:any ) {

    this.selectedObjects = [];
    this.selectedObjects.push( object );

  }

  cursonTrueFalse:boolean = false;

  enableMouseControl(){
  
    if(this.cursonTrueFalse ==  false){
    
     // console.log('disable work');
      this.cursonTrueFalse = true
  
     // this.controls.enabled = false;
      // this.controls.enableRotate = false;
      // this.controls.update();
  
    }else{
     
  
     // console.log('enable work');
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
    this.loaderGLTF.load('assets/robot/scene.gltf', (gltf: GLTF) => {
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
   // this.camera.position.set(-4, 5, 5);

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
    //console.log('ev',ev)
    //console.log(this.searchName)
    //console.log(this.teeth)

    if(this.searchName && this.searchName.length > 0){
      
    //console.log(this.teeth);
   

   




    
    //var found = this.teeth.find((element:any) => element.name == this.searchName);

  var findIndex =   this.teeth.findIndex((element:any) => element.name == this.searchName)

  if(findIndex != -1){


    //console.log(findIndex)
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
  
    //console.log('current obj',this.teeth[findIndex])
    //console.log('this.camera',this.camera);
    //console.log(this.scene)
  
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
  gotoIconCLick(iconVal:any){

   // console.log('iconVal',iconVal);
  //   const annotationDiv = document.createElement('div')
  //   annotationDiv.className = 'annotationLabel'
  //   annotationDiv.innerHTML = '1';
  //   const annotationLabel = new CSS2DObject(annotationDiv)
  //   annotationLabel.position.set(tooth.geometry.boundingBox.min.x, tooth.geometry.boundingBox.min.y, tooth.geometry.boundingBox.min.z);
  //  // scene.add(annotationLabel)
  //   this.scene.add( annotationLabel );

  //   if (this.annotations[a].description) {
  //       const annotationDescriptionDiv = document.createElement('div')
  //       annotationDescriptionDiv.className = 'annotationDescription'
  //       annotationDescriptionDiv.innerHTML = this.annotations[a].description
  //       annotationDiv.appendChild(annotationDescriptionDiv)
  //       this.annotations[a].descriptionDomElement = annotationDescriptionDiv
  //   }

  }

   tempV = new THREE.Vector3();
   cameraToPoint = new THREE.Vector3();
   cameraPosition = new THREE.Vector3();
   normalMatrix = new THREE.Matrix3();

   settings = {
    minArea: 20,
    maxVisibleDot: -0.2,
  };

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


   // console.log(' this.emissiveData =====>', this.emissiveData )

    const circleTexture = new THREE.TextureLoader().load('../../assets/circle.png')
    _this.teeth =  _this.teeth.filter((word:any) => word.name != 'pCylinder18_blinn18_0');
    _this.backupdata =  _this.backupdata.filter((word:any) => word.name != 'pCylinder18_blinn18_0');
    
    this.toothMaterial = this.teeth[0].material;
    this.highlightedToothMaterial = this.teeth[0].material.clone();
     this.highlightedToothMaterial.emissive.setHex(0xff00ff);//ping
    // this.highlightedToothMaterial.color.setHex(0xff00ff );
 
     this.selectedToothMaterial = this.teeth[0].material.clone();
     this.selectedToothMaterial.emissive.setHex(0x0066ff);//blue
    // this.selectedToothMaterial.color.setHex(0x0066ff );
    const labelContainerElem:any = document.querySelector('#annotationsPanel');

    this.teeth.forEach((tooth: any, index: any) => {

      // tooth.material.transparent = true
      // tooth.material.opacity = 0.2
      // tooth.material.depthWrite = false

      //console.log('tooth',tooth)

      // const addCircle = document.createElement("div");
      // addCircle.classList.add("addCircle");
      // addCircle.textContent = ''


      //annotationsPanel


      var img = document.createElement('img');
      img.src = "../../assets/lipid.png";
      img.setAttribute("height", "16");
      img.setAttribute("width", "16");
   
      img.addEventListener('click',  ()=> {
        this.gotoIconCLick(tooth)
    })
    
    this.rootDiv = document.createElement("div");
    this.rootDiv.classList.add("request-loader");
    this.rootDiv.append(img);

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
     // labelDiv.append(addCircle);
      const label = new CSS2DObject(labelDiv);
      label.position.set(2, 2, 0);
      label.visible = false;
      tooth.add(label);
  if(tooth.name == 'polySurface848_jeep_wrangler_aiStandardSurface4_0' || tooth.name ==  'polySurface819_jeep_wrangler_aiStandardSurface4_0'|| tooth.name == 'pSphere3_aiStandardSurface6_0' || tooth.name == 'polySurface852_jeep_wrangler_aiStandardSurface4_0')

  {
    //labelContainerElem
    var img = document.createElement('img');
    img.src = "../../assets/lipid.png";
    img.setAttribute("height", "16");
    img.setAttribute("width", "16");
 
  //   img.addEventListener('click',  ()=> {
  //   // console.log('icon click')
  // })

    const elem = document.createElement('div');
   // elem.textContent = name;
    elem.appendChild(img);

    this.annotationDetail = document.querySelector('#annotationDetail');
    this.objname = document.createElement("p");
    this.objid = document.createElement("p");

    elem.addEventListener('click',  (event)=> {
      console.log('icon click',tooth.id)
      console.log('event',event);

       this.iconclickfound = this.teeth.find((element:any) => element.id == tooth.id);
       console.log(this.iconclickfound)
      // alert(tooth.name)
    //annotationDetail
    

    this.annotationDetail.classList.add("annotation");
    this.annotationDetail.style.top = event.clientY+"px";
    this.annotationDetail.style.left = event.clientX+"px";

  
    this.objid.textContent = ""
    this.objid.textContent =tooth.id
    this.annotationDetail.append(this.objid);
   
    this.objname.textContent =""
    this.objname.textContent =tooth.name
    this.annotationDetail.append(this.objname);




   })
    elem.classList.add("request-loader");
    labelContainerElem.appendChild(elem);

    this.meshHtml.push({tooth,elem});
   

    // this.labelTooth = tooth

    // const lonFudge = Math.PI * 1.5;
    // const latFudge = Math.PI;
    // // these helpers will make it easy to position the boxes
    // // We can rotate the lon helper on its Y axis to the longitude
    // const lonHelper = new THREE.Object3D();
    // // We rotate the latHelper on its X axis to the latitude
    // const latHelper = new THREE.Object3D();
    // lonHelper.add(latHelper);
    // // The position helper moves the object to the edge of the sphere
    // const positionHelper = new THREE.Object3D();
    // positionHelper.position.z = 1;
    // latHelper.add(positionHelper);


    //      // get the position of the lat/lon
    //      positionHelper.updateWorldMatrix(true, false);
    //      this.position = new THREE.Vector3();
    //      positionHelper.getWorldPosition(this.position);


    //tooth.updateWorldMatrix(true, false);
   // tooth.getWorldPosition(this.tempV);

    // get the normalized screen coordinate of that position
    // x and y will be in the -1 to +1 range with x = -1 being
    // on the left and y = -1 being on the bottom
   // this.tempV.project(this.camera);
   
    
   // this.label2 = new CSS2DObject(this.rootDiv);  
   //this.label2  = new CSS3DObject( this.rootDiv );
   // this.label2.position.set(tooth.geometry.boundingSphere.center.x, tooth.geometry.boundingSphere.center.y, tooth.geometry.boundingSphere.center.z);
    
    //radius
   // label2.position.set(tooth.geometry.boundingSphere.center.x, -2 * tooth.geometry.boundingSphere.radius, tooth.geometry.boundingSphere.center.z);
    
    //this.label2.visible = true;
   // label2.rotation.set(tooth.geometry.boundingSphere.center.x, tooth.geometry.boundingSphere.center.y, tooth.geometry.boundingSphere.center.z);
   
    //tooth.material.map = label2;
    //tooth.material.map.needsUpdate = true
    //tooth.add(this.label2);
    //  tooth.material.side = THREE.DoubleSide,
    //  tooth.material.transparent = true,
    //  tooth.material.opacity= 0.2,
    //  tooth.material.depthFunc= THREE.LessDepth
    //tooth.geometry.groups.push(label2)
    //tooth.material.emissiveMap = label2
   // label2.layers.set(0);
    //this.label2.rotation.y = Math.PI * 0.5;
    //this.label2.scale.set(0.025, 0.025, 1);
    //label2.rotation.set(tooth.geometry.boundingBox.min.x, tooth.geometry.boundingBox.min.y, tooth.geometry.boundingBox.min.z);
    
      //this.camera.position.set(tooth.geometry.boundingBox.min.x, tooth.geometry.boundingBox.min.y, tooth.geometry.boundingBox.min.z);
    

    //console.log('label2',this.label2);
    //console.log('tooth label2',tooth)

//     const textureLoader = new TextureLoader();

// // load a texture
// const texture = textureLoader.load(
// '../../assets/lipid.png',
// );
// tooth.material.map = texture;

 }
     
    });

  //  const annotationMarkers: THREE.Sprite[] = []
//    console.log(this.teeth);
  //  console.log(this.scene);
   // this.options = this.teeth

  
//   //  const annotationsDownload = new XMLHttpRequest()
//   //  annotationsDownload.open('GET', '/annotations.json')
//   //  annotationsDownload.onreadystatechange = function () {
//   //      if (annotationsDownload.readyState === 4) {
//           // this.annotations = JSON.parse(annotationsDownload.responseText)

//            const annotationsPanel = document.getElementById(
//                'annotationsPanel'
//            ) as HTMLDivElement
//            const ul = document.createElement('ul') as HTMLUListElement
//            const ulElem = annotationsPanel.appendChild(ul)
//            Object.keys(this.annotations).forEach((a) => {

//             console.log('a=>',a)
//             console.log('this.annotations',this.annotations)
//                const li = document.createElement('li') as HTMLLIElement
//                const liElem = ulElem.appendChild(li)
//                const button = document.createElement('button') as HTMLButtonElement
//                button.innerHTML = a + ' : ' + this.annotations[a].title
//                button.className = 'annotationButton'
//                button.addEventListener('click',  ()=> {
//                    this.gotoAnnotation(this.annotations[a])
//                })
//                liElem.appendChild(button)

//                const annotationSpriteMaterial = new THREE.SpriteMaterial({
//                    map: circleTexture,
//                    depthTest: false,
//                    depthWrite: false,
//                    sizeAttenuation: false,
//                })

//                console.log('annotationSpriteMaterial',annotationSpriteMaterial)
//                const annotationSprite = new THREE.Sprite(annotationSpriteMaterial)



//                annotationSprite.scale.set(0.0015, 0.0015, 0.0015)
//                annotationSprite.position.copy(this.annotations[a].lookAt)
//                annotationSprite.userData.id = a
//                this.scene.add(annotationSprite)
//                annotationMarkers.push(annotationSprite)
//                console.log('annotationSprite',annotationSprite)

//                const annotationDiv = document.createElement('div')
//                annotationDiv.className = 'annotationLabel'
//                annotationDiv.innerHTML = a
//                const annotationLabel = new CSS2DObject(annotationDiv)
//                annotationLabel.position.copy(this.annotations[a].lookAt)
//               // scene.add(annotationLabel)
//                this.scene.add( annotationLabel );

//                if (this.annotations[a].description) {
//                    const annotationDescriptionDiv = document.createElement('div')
//                    annotationDescriptionDiv.className = 'annotationDescription'
//                    annotationDescriptionDiv.innerHTML = this.annotations[a].description
//                    annotationDiv.appendChild(annotationDescriptionDiv)
//                    this.annotations[a].descriptionDomElement = annotationDescriptionDiv
//                }
//            })
//           // progressBar.style.display = 'none'
//        //}
//  //  }
//   // annotationsDownload.send()

   
  }



 updateLabels() {
    // if (!countryInfos) {
    //   return;
    // }
    const area = this.canvas.clientWidth * this.canvas.clientHeight
    const large = this.settings.minArea * this.settings.minArea;
    // get a matrix that represents a relative orientation of the camera
    this.normalMatrix.getNormalMatrix(this.camera.matrixWorldInverse);
    // get the camera's position
    this.camera.getWorldPosition(this.cameraPosition);
    // for (const countryInfo of countryInfos) {
    //   const {position, elem, area} = countryInfo;
      // large enough?
      if (area < large) {
        // elem.style.display = 'none';
        // continue;

       // this.label2.visible = false
      }else{
        //this.label2.visible = true
      }

      // Orient the position based on the camera's orientation.
      // Since the sphere is at the origin and the sphere is a unit sphere
      // this gives us a camera relative direction vector for the position.
      this.tempV.copy(this.position);
      this.tempV.applyMatrix3(this.normalMatrix);

      // compute the direction to this position from the camera
      this.cameraToPoint.copy(this.position);
      this.cameraToPoint.applyMatrix4(this.camera.matrixWorldInverse).normalize();

      // get the dot product of camera relative direction to this position
      // on the globe with the direction from the camera to that point.
      // -1 = facing directly towards the camera
      // 0 = exactly on tangent of the sphere from the camera
      // > 0 = facing away
      const dot = this.tempV.dot(this.cameraToPoint);

      // if the orientation is not facing us hide it.
      if (dot > this.settings.maxVisibleDot) {
        // elem.style.display = 'none';
        // continue;
       // this.label2.visible = false
      }else{
        //this.label2.visible = true
      }

      // restore the element to its default display style
      //elem.style.display = '';

      // get the normalized screen coordinate of that position
      // x and y will be in the -1 to +1 range with x = -1 being
      // on the left and y = -1 being on the bottom
      this.tempV.copy(this.position);
      this.tempV.project(this.camera);

      // convert the normalized position to CSS coordinates
      const x = (this.tempV.x *  .5 + .5) * this.canvas.clientWidth;
      const y = (this.tempV.y * -.5 + .5) * this.canvas.clientHeight;

      // move the elem to that position
      // this.label2.element.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;

      // // set the zIndex for sorting
      // var str = (-this.tempV.z * .5 + .5) * 100000 | 0 
      // this.label2.element.style.zIndex = str.toString();
    //}
  }







gotoAnnotation(a: any): any {
    new TWEEN.Tween(this.camera.position)
        .to(
            {
                x: a.camPos.x,
                y: a.camPos.y,
                z: a.camPos.z,
            },
            500
        )
        .easing(TWEEN.Easing.Cubic.Out)
        .start()

    new TWEEN.Tween(this.controls.target)
        .to(
            {
                x: a.lookAt.x,
                y: a.lookAt.y,
                z: a.lookAt.z,
            },
            500
        )
        .easing(TWEEN.Easing.Cubic.Out)
        .start()

    Object.keys(this.annotations).forEach((annotation) => {
        if (this.annotations[annotation].descriptionDomElement) {
            ;(this.annotations[annotation].descriptionDomElement as HTMLElement).style.display = 'none'
        }
    })
    if (a.descriptionDomElement) {
        a.descriptionDomElement.style.display = 'block'
    }
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
 
         //console.log('mouse click backup mydata',myData[0])
         //this.selectedTooth.material = myData[0].material;
        // myData[0].material.emissive.getHex()
        this.selectedTooth.material.emissive.setHex(0); 
          
    
       }
 
       
       this.selectedTooth = this.highlightedTooth;
       this.selectedTooth &&
         (this.selectedTooth.material.emissive.setHex(0x66a3ff))  //; = this.selectedToothMaterial);
       //  this.selectedTooth.material.emissiveIntensity = 0.5;
 
         this.currentToothObj =  this.selectedTooth
         this.currentObjDetail = this.selectedTooth
         // currentTooth.material.color.set( Math.random() * 0xffffff );
          //console.log('currentTooth->',this.currentToothObj);
          this.scene.children.forEach((sobj:any)=>{
            if(sobj.type == 'BoxHelper'){
      
              sobj.visible = false
            }
          });
    
          
          var box = new THREE.BoxHelper( this.currentToothObj );
          this.scene.add( box );
          this.tree.treeControl.expandAll();
    
        //  console.log( this.currentToothObj.id)
         // console.log('this.treeControl',this.treeControl)
    
          this.treeControl.dataNodes.forEach((element:any)=>{
            if(element.id == this.currentToothObj.id){
              element.isHighlight = true;
    
            }else{
              element.isHighlight = false;
            }
          })
    
          //console.log('this.treeFlattener',this.treeFlattener)
    
          //console.log('data sourse',this.dataSource)
    
 
 
 
     } else {
       this.selectedTooth &&
         (this.selectedTooth.material.emissive.setHex(0x66a3ff));
        // this.selectedTooth.material.emissiveIntensity = 0.5;
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
  // this.compose.render();
  //this.updateLabels()
  
  
  //this.stats.update()

  TWEEN.update()





 





  }

  update() {

    

    this.raycaster.setFromCamera(this.mouse, this.camera);
   // this.raycaster.setFromCamera(this.tempV, this.camera);

    const intersects = this.raycaster.intersectObjects(this.teeth);

    // const inter = this.raycaster.intersectObjects(this.labelTooth);

    // if ( inter.length > 0) {
    //   // hide the label
    //  // elem.style.display = 'none';
    //  this.label2.visible = false;  //false
    // }
    // else {
    //   this.label2.visible = true;  //false
    // }






    this.meshHtml.forEach((cubeInfo:any, ndx:any) => {
     // console.log(cubeInfo, ndx)
    const {tooth, elem} = cubeInfo;
    // const speed = 1 + ndx * .1;
    // const rot = time * speed;
    // cube.rotation.x = rot;
    // cube.rotation.y = rot;
    
    //console.log('cube',cube)
  
    //console.log('elem',elem)
  
    // get the position of the center of the cube
    tooth.updateWorldMatrix(true, false);
    tooth.getWorldPosition(this.tempV);
  
    // get the normalized screen coordinate of that position
    // x and y will be in the -1 to +1 range with x = -1 being
    // on the left and y = -1 being on the bottom
    this.tempV.project(this.camera);
  
     //console.log('tempV',this.tempV)
  
    // ask the raycaster for all the objects that intersect
    // from the eye toward this object's position
   
     this.raycaster.setFromCamera(this.tempV, this.camera);
   
   
   // console.log('tooth',tooth);
    //console.log('this.teeth',this.teeth);
   // const intersectedObjects = this.raycaster.intersectObjects(this.scene.children);
   const intersectedObjects = this.raycaster.intersectObjects(this.teeth);

    //console.log('intersectedObjects',intersectedObjects)
    // We're visible if the first intersection is this object.
    const show = intersectedObjects.length && tooth === intersectedObjects[0].object;
    //console.log(show)
  
    

 
   // console.log(this.tempV)
    //console.log('Math.abs(tempV.z) ',Math.abs(this.tempV.z) )
     //!show || 
    if (!show || Math.abs(this.tempV.z) > 1) {
      // hide the label
      elem.style.display = 'none';
      console.log('show',show)
    } else {
      // unhide the label
      elem.style.display = '';
  
      // convert the normalized position to CSS coordinates
      const x = (this.tempV.x *  .5 + .5) * this.canvas.clientWidth;
      const y = (this.tempV.y * -.5 + .5) * this.canvas.clientHeight;
  
      // move the elem to that position
      elem.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;
    }
  
    
  });






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
          //console.log('this.backupdata ====>',this.backupdata)
          //console.log('myData[0] ====>',myData[0])
          //console.log('this.highlightedTooth=>',this.highlightedTooth)
          // if(myData.length>0){
          // var meshStandardMaterial = myData[0].materials[0] as THREE.MeshStandardMaterial;
          // this.highlightedTooth.material = meshStandardMaterial
          // }
       // this.highlightedTooth.material = myData[0].material;
          //this.highlightedTooth.material.emissive.setHex(myData[0].material.emissive.getHex()); //.material.color.getHex()
           this.highlightedTooth.material.emissive.setHex(0);
          // this.highlightedTooth.material = this.toothMaterial;

          this.annotationDetail.classList.remove("annotation");
          this.objid.textContent = ""
          this.objname.textContent =""
        }
        if (this.highlightedTooth.children.length > 0) {

       

          this.highlightedTooth.children[0]["visible"] = false;
         // this.outlinePass.selectedObjects = [];
         //this.label2.visible = false;  
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
         // this.highlightedTooth.material.emissiveIntensity = 0.5;

          this.addSelectedObject( this.highlightedTooth );
					this.outlinePass.selectedObjects = this.selectedObjects 
        // this.outlinePass.selectedObjects.push( this.highlightedTooth)
         //this.outlinePass.selectedObjects =[this.highlightedTooth];
           // console.log(this.selectedObjects)
           // console.log('this.outlinePass',this.outlinePass)


        }
        if (this.highlightedTooth.children.length > 0) {
          this.highlightedTooth.children[0].visible = true;
          

          // const p = intersects[0].point

          // new TWEEN.Tween(this.controls.target)
          //     .to(
          //         {
          //             x: p.x,
          //             y: p.y,
          //             z: p.z,
          //         },
          //         500
          //     )
          //     .easing(TWEEN.Easing.Cubic.Out)
           //   .start()
        }
      }
    }
  }

  focusObject(clickObj:any){
   // console.log(clickObj);
    this.activeNode = clickObj

    this.teeth.forEach((objdata:any,index:any) => {
      objdata.material = this.backupdata[index].material;
      
    });

    //console.log(this.teeth);

    this.scene.children.forEach((sobj:any)=>{
      if(sobj.type == 'BoxHelper'){

        sobj.visible = false
      }
    })

    var found = this.teeth.find((element:any) => element.id == clickObj.id);

  var findIndex =   this.teeth.findIndex((element:any) => element.id == clickObj.id)
 // console.log(findIndex)
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
//  var boxe:any = new THREE.Box3().setFromObject(this.teeth[findIndex]);
// boxe.center(this.teeth[findIndex].position);
// this.teeth[findIndex].localToWorld(boxe);
// this.teeth[findIndex].position.multiplyScalar(-1);

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

  //console.log('current obj',this.teeth[findIndex])
  //console.log(this.scene)

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
