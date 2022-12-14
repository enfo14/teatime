import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TeaTimeEffects } from './store/tea.effects';
import { TeaTimeReducer } from './store/tea.reducers';

import { MainComponent } from './main/main.component';
import { MakersComponent, SingleTeaMaker } from './makers/makers.component';
import { HistoryComponent } from './history/history.component';
import { ConfirmationDialog } from './confirmation-dialog/confirmation-dialog.component';
import { HttpClientModule } from '@angular/common/http';
import { metaReducers } from './app.reducers';
import { HeaderComponent } from './header/header.component';
import { MakerLevelPipe } from './maker-level.pipe';
import { AlertModule } from './alerts/alert.module';

@NgModule({
  declarations: [
    AppComponent,
    ConfirmationDialog,
    HeaderComponent,
    HistoryComponent,
    MainComponent,
    MakersComponent,
    SingleTeaMaker,
    MakerLevelPipe,
  ],
  imports: [
    AlertModule,
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    StoreModule.forRoot({ teaTime: TeaTimeReducer }, { metaReducers }),
    EffectsModule.forRoot([TeaTimeEffects])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
