import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BurgerStudioPage } from './burger-studio';

@NgModule({
  declarations: [
    BurgerStudioPage,
  ],
  imports: [
    IonicPageModule.forChild(BurgerStudioPage),
  ],
})
export class BurgerStudioPageModule {}
