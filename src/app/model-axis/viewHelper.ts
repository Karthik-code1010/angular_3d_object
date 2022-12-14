import * as THREE from 'three' 
export class ViewHelper extends THREE.Object3D 
{
     editorCamera: THREE.Camera 
    private readonly container: HTMLElement 
    private readonly panel: HTMLElement 
    private readonly point = new THREE.Vector3() 
    private readonly dim = 128 
    private readonly posXAxisHelper: THREE.Sprite 
    private readonly posYAxisHelper: THREE.Sprite 
    private readonly posZAxisHelper: THREE.Sprite 
    private readonly negXAxisHelper: THREE.Sprite 
    private readonly negYAxisHelper: THREE.Sprite 
    private readonly negZAxisHelper: THREE.Sprite 
    private readonly camera: THREE.OrthographicCamera 
    private readonly interactiveObjects: THREE.Object3D[] 
    private readonly raycaster = new THREE.Raycaster() 
    private readonly mouse = new THREE.Vector2() 
    constructor(editorCamera: THREE.Camera, container: HTMLElement)
     {
         super()
          this.container = container 
          this.editorCamera = editorCamera 
          const panel:any = document.createElement('div') 
          panel.style.position = 'absolute'
           panel.style.right = '0px' 
          panel.style.bottom = '0px' 
          panel.style.height = '128px' 
          panel.style.width = '128px' 
          panel.addEventListener('mouseup', (event:any) => { 
            event.stopPropagation() 
            event.preventDefault()
             this.handleClick(event)
             }) 
         panel.addEventListener('mousedown', (event:any) => {
             event.stopPropagation()
             })
        container.appendChild(panel) 
        this.panel = panel
         const color1 = new THREE.Color('#ff3653')
          const color2 = new THREE.Color('#8adb00')
           const color3 = new THREE.Color('#2c8fff') 
           const interactiveObjects: THREE.Object3D[] = [] 
           const camera = new THREE.OrthographicCamera(-2, 2, 2, -2, 0, 4) 
           camera.position.set(0, 0, 2) 
           this.camera = camera 
           const geometry = new THREE.BoxGeometry(0.8, 0.05, 0.05).translate(0.4, 0, 0) 
           const xAxis = new THREE.Mesh(geometry, getAxisMaterial(color1)) 
           const yAxis = new THREE.Mesh(geometry, getAxisMaterial(color2))
            const zAxis = new THREE.Mesh(geometry, getAxisMaterial(color3))
             yAxis.rotation.z = Math.PI / 2
              zAxis.rotation.y = -Math.PI / 2 
              this.add(xAxis) 
              this.add(zAxis)
               this.add(yAxis) 
               const posXAxisHelper = new THREE.Sprite(getSpriteMaterial(color1, 'X')) 
               posXAxisHelper.userData.type = 'posX'
                const posYAxisHelper = new THREE.Sprite(getSpriteMaterial(color2, 'Y'))
                posYAxisHelper.userData.type = 'posY'
                const posZAxisHelper = new THREE.Sprite(getSpriteMaterial(color3, 'Z'))
                posZAxisHelper.userData.type = 'posZ'
                    const negXAxisHelper = new THREE.Sprite(getSpriteMaterial(color1))
                     negXAxisHelper.userData.type = 'negX'
                      const negYAxisHelper = new THREE.Sprite(getSpriteMaterial(color2))
                       negYAxisHelper.userData.type = 'negY' 
                       const negZAxisHelper = new THREE.Sprite(getSpriteMaterial(color3))
                        negZAxisHelper.userData.type = 'negZ'
                         posXAxisHelper.position.x = 1 
                         posYAxisHelper.position.y = 1
                          posZAxisHelper.position.z = 1
                           negXAxisHelper.position.x = -1 
                           negXAxisHelper.scale.setScalar(0.8)
                            negYAxisHelper.position.y = -1
                             negYAxisHelper.scale.setScalar(0.8)
                              negZAxisHelper.position.z = -1
                               negZAxisHelper.scale.setScalar(0.8)
                                this.add(posXAxisHelper) 
                                this.add(posYAxisHelper)
                                 this.add(posZAxisHelper)
                                  this.add(negXAxisHelper)
                                   this.add(negYAxisHelper) 
                                this.add(negZAxisHelper)
                                interactiveObjects.push(posXAxisHelper)
                                interactiveObjects.push(posYAxisHelper)
                                 interactiveObjects.push(posZAxisHelper)
                                interactiveObjects.push(negXAxisHelper)
                                interactiveObjects.push(negYAxisHelper)
                                interactiveObjects.push(negZAxisHelper)
                                this.posXAxisHelper = posXAxisHelper
                                 this.posYAxisHelper = posYAxisHelper 
                                 this.posZAxisHelper = posZAxisHelper 
                                 this.negXAxisHelper = negXAxisHelper 
                                 this.negYAxisHelper = negYAxisHelper 
                                 this.negZAxisHelper = negZAxisHelper 
                                 this.interactiveObjects = interactiveObjects } 
                                 render(renderer: THREE.WebGLRenderer) 
                                 { 
                                    this.quaternion.copy(this.editorCamera.quaternion).invert()
                                     this.updateMatrixWorld()
                                      const point = this.point 
                                      point.set(0, 0, 1)
                                      
                                      point.applyQuaternion(this.editorCamera.quaternion) 
                                      if (point.x >= 0) {
                                         this.posXAxisHelper.material.opacity = 1 
                                         this.negXAxisHelper.material.opacity = 0.5 
                                        } else
                                         { 
                                            this.posXAxisHelper.material.opacity = 0.5 
                                            this.negXAxisHelper.material.opacity = 1 
                                        } if (point.y >= 0) { 
                                            this.posYAxisHelper.material.opacity = 1 
                                            this.negYAxisHelper.material.opacity = 0.5 
                                        } else {
                                             this.posYAxisHelper.material.opacity = 0.5
                                              this.negYAxisHelper.material.opacity = 1
                                             } 
                                            if (point.z >= 0) {
                                                 this.posZAxisHelper.material.opacity = 1
                                                  this.negZAxisHelper.material.opacity = 0.5 
                                            } else 
                                            {
                                             this.posZAxisHelper.material.opacity = 0.5
                                              this.negZAxisHelper.material.opacity = 1 
                                            } 
                                            const x = this.container.offsetWidth - this.dim 
                                            const v4 = renderer.getViewport(new THREE.Vector4())
                                             renderer.setViewport(x, 0, this.dim, this.dim)
                                              renderer.render(this, this.camera) 
                                              renderer.setViewport(v4) } 
                                              handleClick(event: MouseEvent) { 
                                                this.mouse.x = (event.offsetX / this.dim) * 2 - 1
                                                 this.mouse.y = -(event.offsetY / this.dim) * 2 + 1 
                                                 this.raycaster.setFromCamera(this.mouse, this.camera)
                                                  const intersects = this.raycaster.intersectObjects(this.interactiveObjects)
                                                   if (intersects.length === 0) {
                                                     return } 
                                                     switch (intersects[0].object.userData.type)
                                                      { 
                                                        case 'posX': console.log('posX')
                                                         break
                                                        case 'posY': break 
                                                        case 'posZ': break 
                                                        case 'negX': break 
                                                        case 'negY': break 
                                                        case 'negZ': break 
                                                        default: console.error('ViewHelper: Invalid axis.') 
                                                    } 
                                                } 
                                                } 
                                                function getAxisMaterial(color: THREE.Color) {
                                                     return new THREE.MeshBasicMaterial({ color: color, toneMapped: false }) } 
                                                function getSpriteMaterial(color: THREE.Color, text?: string) { 
                                                const canvas = document.createElement('canvas') 
                                                canvas.width = 64 
                                                canvas.height = 64 
                                                const context = canvas.getContext('2d')! 
                                                context.beginPath() 
                                                context.arc(32, 32, 16, 0, 2 * Math.PI) 
                                                context.closePath()
                                                 context.fillStyle = color.getStyle()
                                                  context.fill()
                                                   if (text) { context.font = '24px Arial' 
                                                  context.textAlign = 'center'
                                                   context.fillStyle = '#000000'
                                                    context.fillText(text, 32, 41) } 
                                                    
                                                    const texture = new THREE.CanvasTexture(canvas) 
                                                    return new THREE.SpriteMaterial({ map: texture, toneMapped: false })
                                                
                                                }
