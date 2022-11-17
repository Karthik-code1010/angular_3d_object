import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CubeComponent } from './cube/cube.component';
import { ModelComponent } from './model/model.component';
import { DomMousehoverComponent } from './dom-mousehover/dom-mousehover.component';
import { JeepObjectComponent } from './jeep-object/jeep-object.component';
import { JeepHoverComponent } from './jeep-hover/jeep-hover.component';
import { FinalJeepComponent } from './final-jeep/final-jeep.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MeterialModule } from './meterial/meterial.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularSplitModule } from 'angular-split';
import { MachineModelComponent } from './machine-model/machine-model.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ModelAxisComponent } from './model-axis/model-axis.component';
import { NewCarComponent } from './new-car/new-car.component';
import { NewCityComponent } from './new-city/new-city.component';
import { SceneComponent } from './scene/scene.component';
import { ParkingComponent } from './parking/parking.component';
import { ThreeDTextComponent } from './three-d-text/three-d-text.component';
@NgModule({
  declarations: [
    ParkingComponent,
    SceneComponent,
    AppComponent,
    CubeComponent,
    ModelComponent,
    DomMousehoverComponent,
    JeepObjectComponent,
    JeepHoverComponent,
    FinalJeepComponent,
    MachineModelComponent,
    ModelAxisComponent,
    NewCarComponent,
    NewCityComponent,
    ThreeDTextComponent
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    AngularSplitModule,
    FlexLayoutModule,
    MeterialModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
