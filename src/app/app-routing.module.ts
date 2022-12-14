import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CubeComponent } from './cube/cube.component';
import { DomMousehoverComponent } from './dom-mousehover/dom-mousehover.component';
import { FactoryMachineComponent } from './factory-machine/factory-machine.component';
import { FinalJeepComponent } from './final-jeep/final-jeep.component';
import { JeepHoverComponent } from './jeep-hover/jeep-hover.component';
import { JeepObjectComponent } from './jeep-object/jeep-object.component';
import { MachineModelComponent } from './machine-model/machine-model.component';
import { ModelAxisComponent } from './model-axis/model-axis.component';
import { ModelComponent } from './model/model.component';
import { NewCarComponent } from './new-car/new-car.component';
import { NewCityComponent } from './new-city/new-city.component';
import { ParkingComponent } from './parking/parking.component';
import { SceneComponent } from './scene/scene.component';
import { ThreeDTextComponent } from './three-d-text/three-d-text.component';

const routes: Routes = [
  {
    path: "",
    component: CubeComponent
  },
  {
    path: "model",
    component: ModelComponent
  },
  {
    path:"mousehover",
    component:DomMousehoverComponent
  },
  {
    path:"jeep-object",
    component:JeepObjectComponent
  },
  {
    path:"jeep-hover",
    component:JeepHoverComponent
  },
  {
    path:"finaljeep",
    component:FinalJeepComponent
  },
  {
    path:"machine",
    component:MachineModelComponent
  },{
    path:"model_axis",
    component:ModelAxisComponent
  },{
    path:"newcar",
    component:NewCarComponent
  },{
    path:"newcity",
    component:NewCityComponent
  },
  {
    path:'scene',
    component:SceneComponent
  },{
    path:'parking',
    component:ParkingComponent
  },{
    path:'3dtext',
    component:ThreeDTextComponent
  },
  {
    path:'factory',
    component:FactoryMachineComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
