import {
  Component,AfterViewInit,ViewChild,Input,ElementRef,HostListener,OnInit
} from "@angular/core";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { CSS2DRenderer, CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { OrbitControls } from "@avatsaev/three-orbitcontrols-ts";
//import { OrbitControls } from 'three-orbitcontrols-ts';

@Component({
  selector: 'app-dom-mousehover',
  templateUrl: './dom-mousehover.component.html',
  styleUrls: ['./dom-mousehover.component.scss']
})
export class DomMousehoverComponent implements OnInit {

  @Input() name: string;
  @ViewChild("canvas") canvasRef: ElementRef;
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

  //tooltip: THREE.Sprite;

  

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  constructor() {
    this.scene = new THREE.Scene();
    console.log('construct',this.scene)
    this.camera = new THREE.PerspectiveCamera(35, 1, 0.1, 1000);
    console.log('construct',this.camera )
  }
  ngOnInit(): void {
   // throw new Error("Method not implemented.");
  }

  ngAfterViewInit(): void {
    this.init();
    this.configScene();
    this.configCamera();
    this.configRenderer();
    this.configControls();

    this.createLight();
    this.createMesh();

    this.animate();
  }

  onDocumentMouseMove(event:any) {
    console.log('mouse move');
    event.preventDefault();
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
   // console.log(this.mouse)
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
    this.camera.position.set(-15, 10, 15);
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

    loader.load(
      "/assets/mouth.fbx",
      obj => {
        console.log('obj',obj);
        this.teeth = obj.children.filter(mesh => mesh.name !== "Gums");
        (obj.children.filter(
          mesh => mesh.name === "Gums"
        )[0] as any).material.side = THREE.DoubleSide;
          console.log( this.teeth )

          console.log('this.teeth[0].material',this.teeth[0].material)
          console.log('this.teeth[0].material.clone()',this.teeth[0].material.clone())
        this.toothMaterial = this.teeth[0].material;
        console.log('this.toothMaterial',this.toothMaterial)

        this.highlightedToothMaterial = this.teeth[0].material.clone();
        console.log('clone', this.highlightedToothMaterial )

        this.highlightedToothMaterial.emissive.setHex(0xffff00);
        console.log('emissive', this.highlightedToothMaterial )

        this.selectedToothMaterial = this.teeth[0].material.clone();
        this.selectedToothMaterial.emissive.setHex(0x00ff00);

        console.log('selectedToothMaterial',this.selectedToothMaterial)

        console.log(' this.teeth[0]' ,this.teeth[0])

        this.teeth.forEach((tooth:any) => {
          console.log('tooth',tooth);
          const labelDiv = document.createElement("div");
          labelDiv.classList.add("tooth-label");
          const num = parseInt(tooth.name);

          console.log('labelDiv==>',labelDiv);
          console.log('num==>',num)

          const numSpan = document.createElement("span");
          numSpan.textContent = num.toString();
          labelDiv.append(numSpan);

          console.log("numSpan==>",numSpan)
          console.log("labelDiv==>",labelDiv)

          const nameSpan = document.createElement("span");
          nameSpan.textContent = tooth.name.replace(/_/g, " ").replace(num, "");
          labelDiv.append(nameSpan);
          console.log('nameSpan==>',nameSpan)
          console.log('labelDiv==>',labelDiv)
          const label = new CSS2DObject(labelDiv);
          label.position.set(0, 0, 0);
          label.visible = false;
          console.log('label',label);
          tooth.add(label);
          console.log('tooth add = >',tooth);
        });

        this.scene.add(obj);
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
   // console.log(this.teeth)

    const intersects = this.raycaster.intersectObjects(this.teeth,true);

  

      console.log('intersects ===>',intersects)
    let currentTooth:any = null;
    if (intersects.length) {
      currentTooth = intersects[0].object as THREE.Mesh;
    
    //  console.log('currentTooth->',currentTooth);
    }
   // console.log('currentTooth',currentTooth)
    if (this.highlightedTooth !== currentTooth) {
   //   console.log(this.highlightedTooth);
      if (this.highlightedTooth) {
        if (this.selectedTooth !== this.highlightedTooth) {
          this.highlightedTooth.material = this.toothMaterial;
        }
        this.highlightedTooth.children[0].visible = false;
        console.log('false')
        console.log( this.highlightedTooth)

      }
      this.highlightedTooth = currentTooth;
      console.log(' this.highlightedTooth', this.highlightedTooth)
      if (this.highlightedTooth) {
        if (this.selectedTooth !== this.highlightedTooth) {
          this.highlightedTooth.material = this.highlightedToothMaterial;
        }
        this.highlightedTooth.children[0].visible = true;
        console.log('true')
        // const geometry1 = new THREE.BoxGeometry( 1, 1, 1 );

        // const material1 = new THREE.MeshBasicMaterial( {color: 0x00ffff} );

        // this.highlightedTooth = new THREE.Mesh( geometry1, material1 );
        // console.log( this.highlightedTooth)

       // console.log('true ',this.highlightedTooth)
      }
    }
  }

  onDocumentMouseDown(event:any) {
    console.log('mouse down')
   
  
   
    if (this.selectedTooth !== this.highlightedTooth) {

      this.selectedTooth && (this.selectedTooth.material = this.toothMaterial);

      console.log(this.selectedTooth && (this.selectedTooth.material = this.toothMaterial))
      this.selectedTooth = this.highlightedTooth;

      this.selectedTooth && (this.selectedTooth.material = this.selectedToothMaterial);
    } else {
      this.selectedTooth && (this.selectedTooth.material = this.highlightedToothMaterial);
      this.selectedTooth = null;
    }

    console.log('this.highlightedTooth',this.highlightedTooth);
    console.log('this.toothMaterial',this.toothMaterial);
    console.log(' this.highlightedToothMaterial', this.highlightedToothMaterial);
    console.log('this.selectedTooth',this.selectedTooth);
    console.log('this.selectedTooth.material',this.selectedTooth.material);
  }
}

