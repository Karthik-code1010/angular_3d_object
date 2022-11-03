import {
  Component,AfterViewInit,ViewChild,Input,ElementRef,HostListener,OnInit, Injectable
} from "@angular/core";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { CSS2DRenderer, CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { OrbitControls } from "@avatsaev/three-orbitcontrols-ts";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';

 		import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
			
 			import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';

       import { OutlineEffect } from 'three/examples/jsm/effects/OutlineEffect';



import {CollectionViewer, SelectionChange, DataSource} from '@angular/cdk/collections';
import {FlatTreeControl} from '@angular/cdk/tree';

import {BehaviorSubject, merge, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';





/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
 interface FoodNode {
  name: string;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Fruit',
    children: [{name: 'Apple'}, {name: 'Banana'}, {name: 'Fruit loops'}],
  },
  {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [{name: 'Broccoli'}, {name: 'Brussels sprouts'}],
      },
      {
        name: 'Orange',
        children: [{name: 'Pumpkins'}, {name: 'Carrots'}],
      },
    ],
  },
];

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}


@Component({
  selector: 'app-final-jeep',
  templateUrl: './final-jeep.component.html',
  styleUrls: ['./final-jeep.component.scss']
})
export class FinalJeepComponent implements OnInit {

  x: any = 65;
  y: any = 35;
  minSize:any = 10;
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





  @Input() name: string;
  @ViewChild("canvas") canvasRef: ElementRef;
  currentDetailObj: any;
  currentObjDetail: any;
  @HostListener("window:resize", ["$event"])
  onResize(event:any) {
    this.resizeCanvasToDisplaySize(true);
  }

  scene:any = null;
  camera:any = null;
  renderer:any = null;
  labelRenderer:any = null;
  controls:any = null;
  mesh:any = null;

  teeth:any = [];
  highlightedTooth:any = null;
  selectedTooth:any = null;

  toothMaterial:any = null;
  highlightedToothMaterial:any = null;
  selectedToothMaterial:any = null;

  mouse = new THREE.Vector2();
  raycaster = new THREE.Raycaster();
  private loaderGLTF = new GLTFLoader();
  //tooltip: THREE.Sprite;


  currentTooth:any= null;
  

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  constructor() {
   
  //  this.dataSource.data = TREE_DATA;



    
    this.scene = new THREE.Scene();
   // console.log('construct',this.scene)
    this.camera = new THREE.PerspectiveCamera(0.4, 0.1, 0.1, 7000);
   // console.log('construct',this.camera )
  }
  ngOnInit(): void {
   // throw new Error("Method not implemented.");
  }

  ngAfterViewInit(): void {
    //this.getMeshArray();
   // this.treeControl.expandAll();
 
    this.init();
    this.configScene();
    this.configCamera();
    this.configRenderer();
    this.configControls();

    this.createLight();
    this.createMesh();

    this.animate();

   // this.tree.treeControl.expandAll();
  }

  onDocumentMouseMove(event:any) {
    //console.log('mouse move');
    event.preventDefault();
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    //console.log(this.mouse)
  }

  onDocumentMouseOut(event:any) {
    //console.log('mouse out');
    event.preventDefault();
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    //console.log(this.mouse)
  }

  

  init() {

    const element:any = document.getElementById("jeepObjectId");
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
 

  configScene(): void {
    this.scene.background = new THREE.Color(0xdddddd);

    console.log('configScene this.scene',this.scene)

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
    this.camera.position.set(-10, 25, 10);
    this.camera.lookAt(this.scene.position);
  }

  resizeCanvasToDisplaySize(force:any): void {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    if (force || this.canvas.width !== width || this.canvas.height !== height) {
      this.renderer.setSize(width, height, false);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }
  }

  configRenderer(): void {

    console.log('configRenderer',this.renderer)
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setPixelRatio(1);
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.outputEncoding=THREE.sRGBEncoding;
    this.resizeCanvasToDisplaySize(true);
    console.log('this.labelRenderer',this.labelRenderer);

    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
    this.labelRenderer.domElement.style.position = "absolute";
    this.labelRenderer.domElement.style.top = 0;
    console.log('this.labelRenderer',this.labelRenderer);
    console.log('configRenderer',this.renderer)
    document.body.appendChild(this.labelRenderer.domElement);

    this.controls = new OrbitControls(
      this.camera,
      this.labelRenderer.domElement
    );
    console.log(' this.controls', this.controls)
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

  createMesh(): void {
    var loader = new FBXLoader();

    this.loaderGLTF.load('assets/robot/scene.gltf',
    (obj:any) => {
        console.log(obj);
       // console.log(obj.scene.children[0].children);
       this.dataSource.data  = [obj.scene]
        let example:any = new THREE.Object3D();
        obj.scene.children[0].children[0].children[0].children.forEach((element:any) => {

         // console.log(element.children)
          if(element.children.length  == 28){

            element.children.forEach((valobj:any)=>{
             // this.teeth = valobj.children
              valobj.children.forEach((tooth:any) => {

                
               // console.log(tooth);
               this.teeth.push(tooth)


                           });
   
           })

          }else{
            element.children.forEach((tooth:any) => {
              // console.log(tooth);
              if(tooth.userData.name != "pCylinder18_blinn18_0"){

                this.teeth.push(tooth)

              }
            //  this.teeth.push(tooth)
               
             });

          }

          
        });
      //  console.log('array mesh',this.teeth)
        //this.teeth[0].material.side = THREE.DoubleSide;
     //   this.teeth[0].material.color.set( Math.random() * 0xffffff );

        this.toothMaterial = this.teeth[0].material;
       // this.toothMaterial.emissive.setHex(0x000000);

      //  console.log('this.toothMaterial',this.toothMaterial)

        this.highlightedToothMaterial = this.teeth[0].material.clone();
      //  console.log('clone', this.highlightedToothMaterial )

        this.highlightedToothMaterial.emissive.setHex(0xff0000);
    // console.log('emissive', this.highlightedToothMaterial )

        this.selectedToothMaterial = this.teeth[0].material.clone();
        this.selectedToothMaterial.emissive.setHex(0x00ff00);

       // console.log('selectedToothMaterial',this.selectedToothMaterial)

       // console.log(' this.teeth[0]' ,this.teeth[0])

        this.teeth.forEach((tooth:any) => {
         // console.log('tooth',tooth);
          const labelDiv = document.createElement("div");
          labelDiv.classList.add("tooth-label");
          const num = parseInt(tooth.name);

        //  console.log('labelDiv==>',labelDiv);
          //console.log('num==>',num)

          // const numSpan = document.createElement("span");
          // numSpan.textContent = num.toString();
          // labelDiv.append(numSpan);

          // console.log("numSpan==>",numSpan)
          // console.log("labelDiv==>",labelDiv)

          const nameSpan = document.createElement("span");
          nameSpan.textContent = tooth.name;
          labelDiv.append(nameSpan);
          //console.log('nameSpan==>',nameSpan)
          //console.log('labelDiv==>',labelDiv)
          const label = new CSS2DObject(labelDiv);
          label.position.set(0, 0, 0);
          label.visible = false;
         // console.log('label',label);
          tooth.add(label);
          //console.log('tooth add = >',tooth);
        });

        example = obj.scene;
        this.scene.add(example);
      },
      xhr => {},
      error => console.log(error)
    );
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

    const intersects:any = this.raycaster.intersectObjects(this.teeth);

     // console.log('intersects ===>',intersects)
    //this.currentTooth= null;
    if (intersects.length) {
      this.currentTooth = intersects[0].object as THREE.Mesh;
     // currentTooth.material.color.set( Math.random() * 0xffffff );
     // console.log('currentTooth->',currentTooth);
    }
   // console.log('currentTooth',currentTooth)
   //console.log('this.scene',this.scene);
    if (this.highlightedTooth !== this.currentTooth) {
      //console.log(this.highlightedTooth);
      if (this.highlightedTooth) {
        if (this.selectedTooth !== this.highlightedTooth) {
        //  this.highlightedTooth.material = this.toothMaterial;
         // this.highlightedTooth.material = this.currentTooth.material;
        }
        this.highlightedTooth.children[0].visible = false;

     //   console.log('false')
     

      }
      this.highlightedTooth = this.currentTooth;
      if (this.highlightedTooth) {
        if (this.selectedTooth !== this.highlightedTooth) {
         // this.highlightedTooth.material = this.highlightedToothMaterial;
        
        }
       // console.log('true')
    
        
        this.highlightedTooth.children[0].visible = true;

      //  const composer = new EffectComposer( this.renderer );

			// 	const renderPass = new RenderPass( this.scene, this.camera );
			// 	composer.addPass( renderPass );

			// const	outlinePass = new OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), this.scene, this.camera );
			// 	composer.addPass( outlinePass );
        if(this.selectedTooth !== this.highlightedTooth)
        {
         // this.highlightedTooth.material= this.toothMaterial 
        }
      
        

        //console.log('true ',this.highlightedTooth)
      }
    }

  
  }

  onDocumentMouseDown(event:any) {
    console.log('mouse down')
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects:any = this.raycaster.intersectObjects(this.teeth);

     // console.log('intersects ===>',intersects)
    this.currentTooth= null;
    if (intersects.length) {
      this.currentTooth = intersects[0].object as THREE.Mesh;
     // currentTooth.material.color.set( Math.random() * 0xffffff );
      console.log('currentTooth->',this.currentTooth);
      this.scene.children.forEach((sobj:any)=>{
        if(sobj.type == 'BoxHelper'){
  
          sobj.visible = false
        }
      });

     // this.currentDetailObj  = this.currentTooth
      this.currentObjDetail =  this.currentTooth
      var box = new THREE.BoxHelper( this.currentTooth );
      this.scene.add( box );
         this.tree.treeControl.expandAll();

         console.log( this.currentTooth.id)
      console.log('this.treeControl',this.treeControl)

      this.treeControl.dataNodes.forEach((element:any)=>{
        if(element.id == this.currentTooth.id){
          element.isHighlight = true;

        }else{
          element.isHighlight = false;
        }
      })

      console.log('this.treeFlattener',this.treeFlattener)

      console.log('data sourse',this.dataSource)

      



    }


    if (this.selectedTooth !== this.highlightedTooth) {

    //  console.log(this.selectedTooth);


     // this.selectedTooth && (this.selectedTooth.material = this.selectedTooth.material );
    //  console.log(this.selectedTooth && (this.selectedTooth.material = this.toothMaterial))
     // this.selectedTooth = this.highlightedTooth;
      ///this.selectedTooth && (this.selectedTooth.material = this.currentTooth.material);
    } else {
      //this.selectedTooth && (this.selectedTooth.material = this.highlightedToothMaterial);
      //this.selectedTooth = null;
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
 //this.teeth[findIndex].material..emissive.setHex(0xff0000);
 //.emissive.setHex(0xff0000);

	this.scene.add( box );

  console.log('current obj',this.teeth[findIndex])

  this.currentObjDetail = this.teeth[findIndex]
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

  // getMeshArray(){

  //   this.loaderGLTF.load('assets/robot/scene.gltf',
  //   (obj:any) => {

  //     console.log('getMeshArray',obj.scene)
  //     this.dataSource.data  = [obj.scene]

  //   })
  // }
}

