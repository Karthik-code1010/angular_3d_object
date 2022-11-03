import { Component, OnInit, AfterViewInit, Input, ViewChild, ElementRef } from '@angular/core';
import * as THREE from "three";
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

import {FlatTreeControl} from '@angular/cdk/tree';


import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';

interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}


@Component({
  selector: 'app-machine-model',
  templateUrl: './machine-model.component.html',
  styleUrls: ['./machine-model.component.scss']
})
export class MachineModelComponent implements OnInit, AfterViewInit  {


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

  //@Input() public fieldOfView: number = 1;
 @Input() public fieldOfView: number = 50;
 // @Input('nearClipping') public nearClippingPane: number = 1;
 @Input('nearClipping') public nearClippingPane: number = 1;
 // @Input('farClipping') public farClippingPane: number = 1000;
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
    // this.controls.autoRotate = true;
    this.controls.enableZoom = true;
    // this.controls.enablePan = false;
    this.controls.update();

    // this.controls.minPolarAngle = Math.PI * 0.5;
    // this.controls.maxPolarAngle = Math.PI * 0.5;
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
    this.loaderGLTF.load('assets/robot/FactoryMachine.gltf', (gltf: GLTF) => {
console.log('gltf',gltf)
      // this.model = gltf.scene.children[0];
      this.model = gltf.scene;
      console.log(this.model);
      this.dataSource.data  = [gltf.scene]
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
    let component: MachineModelComponent = this;
    (function render() {
      component.renderer.render(component.scene, component.camera);
      component.animateModel();
      requestAnimationFrame(render);
    }());
  }

  constructor() { }

  ngOnInit(): void {

  }

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
     (e:any) => this.onDocumentMouseDown(e),
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

  onDocumentMouseDown(event: any) {
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
 //this.teeth[findIndex].material.emissive.setHex(0x00ff00);
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
