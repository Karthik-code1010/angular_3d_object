import {
  Component,AfterViewInit,ViewChild,Input,ElementRef,HostListener,OnInit
} from "@angular/core";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { CSS2DRenderer, CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { OrbitControls } from "@avatsaev/three-orbitcontrols-ts";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
@Component({
  selector: 'app-jeep-hover',
  templateUrl: './jeep-hover.component.html',
  styleUrls: ['./jeep-hover.component.scss']
})
export class JeepHoverComponent implements OnInit  {

  @Input() name: string;
  @ViewChild("canvasjeep") canvasRef: ElementRef;
  @HostListener("window:resize", ["$event"])
  onResize(event:any) {
    this.resizeCanvasToDisplaySize(true);
  }
  private loaderGLTF = new GLTFLoader();
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

  tooltip: THREE.Sprite;



  jeepArray:any = []
  jeepMaterial:any = null;
  highlightedJeepMaterial:any = null;
  selectedJeepMaterial:any = null;

  

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(0.4, 0.1, 0.1, 7000);
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
    //console.log(this.mouse)
  }

  onDocumentMouseDown(event:any) {
    console.log('mouse down')
    if (this.selectedTooth !== this.highlightedTooth) {
      this.selectedTooth && (this.selectedTooth.material = this.toothMaterial);
      this.selectedTooth = this.highlightedTooth;
      this.selectedTooth &&
        (this.selectedTooth.material = this.selectedToothMaterial);
    } else {
      this.selectedTooth &&
        (this.selectedTooth.material = this.highlightedToothMaterial);
      this.selectedTooth = null;
    }
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

  createMesh(): void {
    var loader = new FBXLoader();
   
   
    // this.loaderGLTF.load('assets/robot/scene.gltf', (jeep)=>{
    //   console.log('jeep----------->',jeep.scene)
    //   console.log('jeep----------->',jeep.scene.children)
    //   console.log('jeep----------->',jeep.scene.children[0].children[0].children[0].children[0].children[0].children)
    //   this.jeepArray = jeep.scene.children[0].children[0].children[0].children[0].children[0].children
    //   console.log('material',this.jeepArray[0].material)

    //  // this.jeepMaterial = this.jeepArray[0].material;

    // //  this.highlightedJeepMaterial = this.jeepArray[0].material.clone();
        
    //   // console.log('clone', this.highlightedJeepMaterial )
    //   // this.highlightedJeepMaterial.emissive.setHex(0xffff00);
    //   // console.log('emissive', this.highlightedJeepMaterial )
    //   // this.selectedJeepMaterial = this.jeepMaterial[0].material.clone();
    //   // this.selectedJeepMaterial.emissive.setHex(0x00ff00);


    //   this.toothMaterial = this.jeepArray[0].material;
    //   console.log('this.toothMaterial',this.toothMaterial)
    //   this.highlightedToothMaterial = this.jeepArray[0].material.clone();
    //   console.log('clone', this.highlightedToothMaterial )
    //   this.highlightedToothMaterial.emissive.setHex(0xffff00);
    //   console.log('emissive', this.highlightedToothMaterial )
    //   this.selectedToothMaterial = this.jeepArray[0].material.clone();
    //   this.selectedToothMaterial.emissive.setHex(0x00ff00);

    //   console.log('selectedToothMaterial',this.selectedToothMaterial)
    //   let example:any = new THREE.Object3D();
    //   this.jeepArray.forEach((jeepVal:any) => {
    //     // console.log(tooth);
    //      const labelDiv = document.createElement("div");
    //      labelDiv.classList.add("tooth-label");
    //      const num = jeepVal.name;

    //      console.log('labelDiv==>',labelDiv);
    //      console.log('num==>',num)

    //      const numSpan = document.createElement("span");
    //      numSpan.textContent = num.toString();
    //      labelDiv.append(numSpan);

    //      console.log("numSpan==>",numSpan)
    //      console.log("labelDiv==>",labelDiv)
    //      console.log('jeepVal.name',jeepVal.name)

    //      const nameSpan = document.createElement("span");
    //      nameSpan.textContent = jeepVal.name
    //      labelDiv.append(nameSpan);
    //      console.log('nameSpan==>',nameSpan)
    //      console.log('labelDiv==>',labelDiv)
    //      const label = new CSS2DObject(labelDiv);
    //      label.position.set(0, 0, 0);
    //      label.visible = false;
    //      console.log('label',label);
    //      jeepVal.add(label);
    //      console.log('jeepVal add = >',jeepVal);

         
    //    });

    //    example = jeep.scene;
    //    this.scene.add(example);
    //   // this.scene.add(jeep);

    // })
    this.loaderGLTF.load('assets/robot/scene.gltf',
      obj => {
        console.log(obj);

        console.log(obj.scene.children[0].children[0].children[0].children[0].children)
     
        
        obj.scene.children[0].children[0].children[0].children[0].children.forEach((valobj)=>{

          this.teeth = valobj.children

         
       // this.teeth = obj.scene.children[0].children[0].children[0].children[0].children[0].children
         // for(var i=0;i<this.teeth.length;i++){

        //   this.toothMaterial = this.teeth[i].children[0].material;
        // }
        this.toothMaterial = this.teeth[0].material;

        console.log('this.teeth=>',this.teeth);
        console.log('this.toothMaterial',this.toothMaterial)

        this.highlightedToothMaterial = this.teeth[0].material.clone();

        console.log('clone', this.highlightedToothMaterial )
        this.highlightedToothMaterial.emissive.setHex(0xffff00);
        console.log('emissive', this.highlightedToothMaterial )
        this.selectedToothMaterial = this.teeth[0].material.clone();
        this.selectedToothMaterial.emissive.setHex(0x00ff00);

        console.log('selectedToothMaterial',this.selectedToothMaterial)
        let example:any = new THREE.Object3D();

        this.teeth.forEach((tooth:any) => {
         // console.log(tooth);
          const labelDiv = document.createElement("div");
          labelDiv.classList.add("tooth-label");
          const num = parseInt(tooth.name);

          console.log('labelDiv==>',labelDiv);
          console.log('num==>',num)

          // const numSpan = document.createElement("span");
          // numSpan.textContent = num.toString();
          // labelDiv.append(numSpan);

          // console.log("numSpan==>",numSpan)
          // console.log("labelDiv==>",labelDiv)

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
        example = obj.scene;
      this.scene.add(example);
        })
       

      //  this.scene.add(obj);
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

   // console.log('update--------------------------------------------------->>>>>>>>>>>>>>')
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObjects(this.teeth);
    let currentTooth = null;
    //console.log(intersects )
    if (intersects.length) {
      currentTooth = intersects[0].object as THREE.Mesh;
    }

    if (this.highlightedTooth !== currentTooth) {
      if (this.highlightedTooth) {
        if (this.selectedTooth !== this.highlightedTooth) {
          this.highlightedTooth.material = this.toothMaterial;
        }
        this.highlightedTooth.children[0].visible = false;
      }
      this.highlightedTooth = currentTooth;
      if (this.highlightedTooth) {
        if (this.selectedTooth !== this.highlightedTooth) {
          this.highlightedTooth.material = this.highlightedToothMaterial;
        }
        this.highlightedTooth.children[0].visible = true;
      }
    }
  }
}


