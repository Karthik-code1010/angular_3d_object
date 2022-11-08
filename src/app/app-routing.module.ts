import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CubeComponent } from './cube/cube.component';
import { DomMousehoverComponent } from './dom-mousehover/dom-mousehover.component';
import { FinalJeepComponent } from './final-jeep/final-jeep.component';
import { JeepHoverComponent } from './jeep-hover/jeep-hover.component';
import { JeepObjectComponent } from './jeep-object/jeep-object.component';
import { MachineModelComponent } from './machine-model/machine-model.component';
import { ModelAxisComponent } from './model-axis/model-axis.component';
import { ModelComponent } from './model/model.component';
import { NewCarComponent } from './new-car/new-car.component';
import { NewCityComponent } from './new-city/new-city.component';

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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
