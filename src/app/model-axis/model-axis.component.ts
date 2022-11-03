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
//import { OrbitControls } from './OrbitControls';
import { ViewHelper } from './viewHelper'
//import { GUI } from "https://unpkg.com/dat.gui@0.7.7/build/dat.gui.module.js";
/** Flat node with expandable and level information */

// CommonJS:
//import { GUI } from 'dat.gui'
var dat = require('dat.gui');
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
  selector: 'app-model-axis',
  templateUrl: './model-axis.component.html',
  styleUrls: ['./model-axis.component.scss']
})
export class ModelAxisComponent  implements OnInit, AfterViewInit {

  myControl = new FormControl('');
  myForm!: FormGroup;

  x: any = 65;
  y: any = 35;
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
 //@Input() public fieldOfView: number = 50;
  @Input('nearClipping') public nearClippingPane: number = 1;
 //@Input('nearClipping') public nearClippingPane: number = 1;
  @Input('farClipping') public farClippingPane: number = 1000;
 //@Input('farClipping') public farClippingPane: number = 1000;
  //? Scene properties
  private camera: THREE.PerspectiveCamera;

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
   
    // const helper = new THREE.CameraHelper( this.camera );
    // this.scene.add( helper );
   
   
  //   this.controlsGizmo = new OrbitControlsGizmo( this.controls , { size: 100, padding: 8 });
   //this.controlsGizmo= new ViewHelper('','');
    // // document.body.appendChild(controlsGizmo.domElement);
    

   const viewhelp:any =    new ViewHelper( this.camera, renderer.domElement);

   console.log('viewhelp',viewhelp);
   viewhelp.position.set(0.081, 0.081, 0.081);
   viewhelp.scale.set(0.021, 0.021, 0.021);
   
    // var cornerPoint = new THREE.Vector3();

   
    // viewhelp.position.copy(cornerPoint)
    //     .add(new THREE.Vector3(1, 1, -1)); 
        this.scene.add(viewhelp);

    //viewhelp.render( this.renderer );
    // this.elementDiv.appendChild(this.controlsGizmo.domElement);

     
    // // this.controls.autoRotate = true;

    this.controls.enableZoom = true;
    // this.controls.enablePan = false;
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
     // this.scene.add( new THREE.AxesHelper( 20 ) );
     //this.scene.add(new THREE.GridHelper(10, 10, "#666666", "#222222"));

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
    let component: ModelAxisComponent = this;
    (function render() {
      component.renderer.render(component.scene, component.camera);
      component.animateModel();
      requestAnimationFrame(render);
    }());
  }

  constructor() {


    



   }

  ngOnInit(): void {
    this.myForm = new FormGroup({
      myControl:new FormControl('')
   
  });

  this.myForm.controls['myControl'].valueChanges.subscribe(value => {
    console.log(value);
   // var temp:any = this.orgData
    if(value){
      this.valuechange('') 
    }else{
    
    }
   

//console.log(result);
  });
  

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
  valuechange(ev:any){
    //console.log(ev)
    console.log(this.searchName)
    console.log(this.teeth)

  
    console.log(this.teeth);

    this.scene.children.forEach((sobj:any)=>{
      if(sobj.type == 'BoxHelper'){

        sobj.visible = false
      }
    })

    var found = this.teeth.find((element:any) => element.name == this.searchName);

  var findIndex =   this.teeth.findIndex((element:any) => element.name == this.searchName)
  console.log(findIndex)
  //this.teeth[findIndex] = 
 console.log(found);
 console.log(found.xLength, found.yLength, found.zLength)
 //found =this.teeth[0].material.clone();

 var box = new THREE.BoxHelper(  this.teeth[findIndex] );
 //var  currentTeeth =this.teeth[findIndex]
 //found.material.emissive.setHex(0x00ff00);

 //.emissive.setHex(0xff0000);
this.currentObjDetail = this.teeth[findIndex] 

	this.scene.add( box );

  console.log('current obj',this.teeth[findIndex])
  console.log(this.scene)

  this.treeControl.dataNodes.forEach((element:any)=>{
    if(element.id == this.myControl.value){
      element.isHighlight = true;

    }else{
      element.isHighlight = false;
    }
  })
  this.highlightedTooth  = this.teeth[findIndex] 
  this.onDocumentMouseDown();







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

 
    //console.log(' _this.teeth', _this.teeth);
    //console.log('  _this.backupdata',  _this.backupdata);
    _this.teeth =  _this.teeth.filter((word:any) => word.name != 'pCylinder18_blinn18_0');
    _this.backupdata =  _this.backupdata.filter((word:any) => word.name != 'pCylinder18_blinn18_0');
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
     "mousedown",
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

  var elementhover:any = document.getElementById("jeepObjectId");
      this.mouse.x = (event.clientX / elementhover.clientWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / elementhover.clientHeight) * 2 + 1;
   // this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    //this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    //this.canvas.clientWidth, this.canvas.clientHeight
  }

  onDocumentMouseDown() {
    // console.log(this.backupdata)
    // console.log(this.teeth)
    // this.raycaster.setFromCamera(this.mouse, this.camera);

    // const intersects:any = this.raycaster.intersectObjects(this.teeth);
    // this.currentTooth= null;
    // if (intersects.length) {
    //   this.currentTooth = intersects[0].object as THREE.Mesh;
    //  // currentTooth.material.color.set( Math.random() * 0xffffff );
    //   console.log('currentTooth->',this.currentTooth);
    //   this.scene.children.forEach((sobj:any)=>{
    //     if(sobj.type == 'BoxHelper'){
  
    //       sobj.visible = false
    //     }
    //   });

      
    //   var box = new THREE.BoxHelper( this.currentTooth );
    //   this.scene.add( box );
    //      this.tree.treeControl.expandAll();

    //      console.log( this.currentTooth.id)
    //   console.log('this.treeControl',this.treeControl)

    //   this.treeControl.dataNodes.forEach((element:any)=>{
    //     if(element.id == this.currentTooth.id){
    //       element.isHighlight = true;

    //     }else{
    //       element.isHighlight = false;
    //     }
    //   })

    //   console.log('this.treeFlattener',this.treeFlattener)

    //   console.log('data sourse',this.dataSource)

      



    // }


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

  focusObject(clickObj:any){
    console.log(clickObj);
    this.activeNode = clickObj

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
 console.log(found);
 console.log(found.xLength, found.yLength, found.zLength)
 //found =this.teeth[0].material.clone();

 var box = new THREE.BoxHelper(  this.teeth[findIndex] );
 //var  currentTeeth =this.teeth[findIndex]
 //found.material.emissive.setHex(0x00ff00);

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


export class OrbitControlsGizmo {
  lock: boolean;
  lockX: boolean;
  lockY: boolean;
  update: () => void;
  dispose: () => void;
  domElement: any;
  constructor(orbitControls: any, options: any) {

    options = Object.assign({
      size: 90,
      padding: 8,
      bubbleSizePrimary: 8,
      bubbleSizeSecondary: 6,
      lineWidth: 2,
      fontSize: "12px",
      fontFamily: "arial",
      fontWeight: "bold",
      fontColor: "#222222",
      className: "obit-controls-gizmo",
      colors: {
        x: ["#f73c3c", "#942424"],
        y: ["#6ccb26", "#417a17"],
        z: ["#178cf0", "#0e5490"],
      }
    }, options);

    this.lock = false;
    this.lockX = false;
    this.lockY = false;

    this.update = () => {
      if (this.lock)
        return;

      camera.updateMatrix();
      invRotMat.extractRotation(camera.matrix).invert();

      for (let i = 0, length = axes.length; i < length; i++)
        setAxisPosition(axes[i]);

      // Sort the layers where the +Z position is last so its drawn on top of anything below it
      axes.sort((a, b) => (a.position.z > b.position.z) ? 1 : -1);

      // Draw the layers
      drawLayers(true);

    };

    this.dispose = () => {
      orbit.removeEventListener("change", this.update);
      orbit.removeEventListener("start", () => this.domElement.classList.add("inactive"));
      orbit.removeEventListener("end", () => this.domElement.classList.remove("inactive"));

      this.domElement.removeEventListener('pointerdown', onPointerDown, false);
      this.domElement.removeEventListener('pointerenter', onPointerEnter, false);
      this.domElement.removeEventListener('pointermove', onPointerMove, false);
      this.domElement.removeEventListener('click', onMouseClick, false);
      window.removeEventListener('pointermove', onDrag, false);
      window.removeEventListener('pointerup', onPointerUp, false);
      this.domElement.remove();
    };

    // Internals
    const scoped = this;
    const orbit = orbitControls;
    const camera = orbitControls.object;
    const invRotMat:any = new THREE.Matrix4();
    const mouse = new THREE.Vector3();
    const rotateStart = new THREE.Vector2();
    const rotateEnd = new THREE.Vector2();
    const rotateDelta = new THREE.Vector2();
    const center = new THREE.Vector3(options.size / 2, options.size / 2, 0);
    const axes = createAxes();
    let selectedAxis: any = null;
    let isDragging = false;
    let context: any;
    let rect: any;
    let orbitState: any;

    orbit.addEventListener("change", this.update);
    orbit.addEventListener("start", () => this.domElement.classList.add("inactive"));
    orbit.addEventListener("end", () => this.domElement.classList.remove("inactive"));

    function createAxes() {
      // Generate list of axes
      const colors = options.colors;
      const line = options.lineWidth;
      const size = {
        primary: options.bubbleSizePrimary,
        secondary: options.bubbleSizeSecondary,
      };
      return [
        { axis: "x", direction: new THREE.Vector3(1, 0, 0), size: size.primary, color: colors.x, line, label: "X", position: new THREE.Vector3(0, 0, 0) },
        { axis: "y", direction: new THREE.Vector3(0, 1, 0), size: size.primary, color: colors.y, line, label: "Y", position: new THREE.Vector3(0, 0, 0) },
        { axis: "z", direction: new THREE.Vector3(0, 0, 1), size: size.primary, color: colors.z, line, label: "Z", position: new THREE.Vector3(0, 0, 0) },
        { axis: "-x", direction: new THREE.Vector3(-1, 0, 0), size: size.secondary, color: colors.x, position: new THREE.Vector3(0, 0, 0) },
        { axis: "-y", direction: new THREE.Vector3(0, -1, 0), size: size.secondary, color: colors.y, position: new THREE.Vector3(0, 0, 0) },
        { axis: "-z", direction: new THREE.Vector3(0, 0, -1), size: size.secondary, color: colors.z, position: new THREE.Vector3(0, 0, 0) },
      ];
    }

    function createCanvas() {
      const canvas = document.createElement('canvas');
      canvas.width = options.size;
      canvas.height = options.size;
      canvas.classList.add(options.className);

      canvas.addEventListener('pointerdown', onPointerDown, false);
      canvas.addEventListener('pointerenter', onPointerEnter, false);
      canvas.addEventListener('pointermove', onPointerMove, false);
      canvas.addEventListener('click', onMouseClick, false);

      context = canvas.getContext("2d");

      return canvas;
    }

    function onPointerDown(e:any) {
      rotateStart.set(e.clientX, e.clientY);
      orbitState = orbit.enabled;
      orbit.enabled = false;
      window.addEventListener('pointermove', onDrag, false);
      window.addEventListener('pointerup', onPointerUp, false);
    }

    function onPointerUp() {
      setTimeout(() => isDragging = false, 0);
      scoped.domElement.classList.remove("dragging");
      orbit.enabled = orbitState;
      window.removeEventListener('pointermove', onDrag, false);
      window.removeEventListener('pointerup', onPointerUp, false);
    }

    function onPointerEnter() {
      rect = scoped.domElement.getBoundingClientRect();
    }

    function onPointerMove(e:any) {
      if (isDragging || scoped.lock)
        return;

      const currentAxis = selectedAxis;

      selectedAxis = null;
      if (e)
        mouse.set(e.clientX - rect.left, e.clientY - rect.top, 0);

      // Loop through each layer
      for (let i = 0, length = axes.length; i < length; i++) {
        const distance = mouse.distanceTo(axes[i].position);

        if (distance < axes[i].size)
          selectedAxis = axes[i];
      }

      if (currentAxis !== selectedAxis)
        drawLayers('');
    }

    function onDrag(e: any) {
      if (scoped.lock)
        return;

      if (!isDragging)
        scoped.domElement.classList.add("dragging");

      isDragging = true;

      selectedAxis = null;

      rotateEnd.set(e.clientX, e.clientY);

      rotateDelta.subVectors(rotateEnd, rotateStart).multiplyScalar(0.5);

      if (!scoped.lockX)
        orbit.rotateLeft(2 * Math.PI * rotateDelta.x / scoped.domElement.height);

      if (!scoped.lockY)
        orbit.rotateUp(2 * Math.PI * rotateDelta.y / scoped.domElement.height);

      rotateStart.copy(rotateEnd);

      orbit.update();
    }

    function onMouseClick() {
      //FIXME Don't like the current animation
      if (isDragging || !selectedAxis)
        return;

      const vec = selectedAxis.direction.clone();
      const distance = camera.position.distanceTo(orbit.target);
      vec.multiplyScalar(distance);

      const duration = 400;
      const start = performance.now();
      const maxAlpha = 1;
      function loop(): any {
        const now = performance.now();
        const delta = now - start;
        const alpha = Math.min(delta / duration, maxAlpha);
        camera.position.lerp(vec, alpha);
        orbit.update();

        if (alpha !== maxAlpha)
          return requestAnimationFrame(loop);

        onPointerMove('');

      }

      loop();


      selectedAxis = null;
    }

    function drawCircle(p: any, radius = 10, color = "#FF0000") {
      context.beginPath();
      context.arc(p.x, p.y, radius, 0, 2 * Math.PI, false);
      context.fillStyle = color;
      context.fill();
      context.closePath();
    }

    function drawLine(p1: any, p2: any, width = 1, color = "#FF0000") {
      context.beginPath();
      context.moveTo(p1.x, p1.y);
      context.lineTo(p2.x, p2.y);
      context.lineWidth = width;
      context.strokeStyle = color;
      context.stroke();
      context.closePath();
    }

    function drawLayers(clear: any) {
      if (clear)
        context.clearRect(0, 0, scoped.domElement.width, scoped.domElement.height);

      // For each layer, draw the axis
      for (let i = 0, length = axes.length; i < length; i++) {
        const axis = axes[i];

        // Set the color
        const highlight = selectedAxis === axis;
        const color = (axis.position.z >= -0.01)
          ? axis.color[0]
          : axis.color[1];

        // Draw the line that connects it to the center if enabled
        if (axis.line)
          drawLine(center, axis.position, axis.line, color);

        // Draw the circle for the axis
        drawCircle(axis.position, axis.size, highlight ? "#FFFFFF" : color);

        // Write the axis label (X,Y,Z) if provided
        if (axis.label) {
          context.font = [options.fontWeight, options.fontSize, options.fontFamily].join(" ");
          context.fillStyle = options.fontColor;
          context.textBaseline = 'middle';
          context.textAlign = 'center';
          context.fillText(axis.label, axis.position.x, axis.position.y);
        }
      }
    }

    function setAxisPosition(axis: any) {
      const position = axis.direction.clone().applyMatrix4(invRotMat);
      const size = axis.size;
      axis.position.set(
        (position.x * (center.x - (size / 2) - options.padding)) + center.x,
        center.y - (position.y * (center.y - (size / 2) - options.padding)),
        position.z
      );
    }

    // Initialization
    this.domElement = createCanvas();
    this.update();
  }

}


