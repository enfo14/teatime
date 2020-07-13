import { async, TestBed, ComponentFixture, tick, fakeAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AlertComponent } from './alert.component';
import { AlertService } from './alert.service';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ExpectedConditions } from 'protractor';
import { Alert, AlertType } from './alert.model';

describe('AlertComponent', () => {
  let fixture: ComponentFixture<AlertComponent>;
  let component: AlertComponent;
  let alerts: AlertService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AlertComponent],
      providers: [AlertService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    alerts = TestBed.get(AlertService);
    component.fade = false;
  });

  it('is created', () => {
    expect(component).toBeTruthy();
  });

  it('subscribes to the alert queue specified by the input id', () => {
    component.id = 'test';
    component.ngOnDestroy();
    component.ngOnInit();
    alerts.info('Wrong queue');
    alerts.info('Right queue', { id: 'test' });
    expect(component.alerts.length).toEqual(1);
    expect(component.alerts[0].message).toEqual('Right queue');
  });

  it('pushes new alerts into the array', () => {
    expect(component.alerts.length).toEqual(0);
    alerts.success('Test');
    expect(component.alerts.length).toEqual(1);
    expect(component.alerts[0].message).toEqual('Test');
  });

  it('autocloses alerts if autoClose is true', fakeAsync(() => {
    alerts.info('Test', { autoClose: true });
    expect(component.alerts.length).toEqual(1);
    expect(component.alerts[0].autoClose).toBeTrue;
    tick(3000);
    expect(component.alerts.length).toEqual(0);
  }));

  it('clears the alerts when empty messages are received', () => {
    alerts.info('Test');
    alerts.error('Test2', { keepAfterRouteChange: true });
    expect(component.alerts.length).toEqual(2);
    alerts.info('');
    expect(component.alerts.length).toEqual(1);
  });

  it('clears the alerts on location change', fakeAsync(() => {
    spyOn(alerts, 'clear').and.callThrough();
    alerts.info('Test');
    const event = new NavigationStart(0, 'http://localhost:4200/support/');
    TestBed.get(Router).events.next(event);
    tick();
    expect(alerts.clear).toHaveBeenCalled();
    expect(component.alerts.length).toEqual(0);
  }));

  it('ignores other router events', fakeAsync(() => {
    spyOn(alerts, 'clear').and.callThrough();
    alerts.info('Test');
    const event = new NavigationEnd(0, 'http://localhost:4200/support/', 'http://localhost:4200/support/');
    TestBed.get(Router).events.next(event);
    tick();
    expect(alerts.clear).not.toHaveBeenCalled();
    expect(component.alerts.length).toEqual(1);
  }));

  describe('removeAlert', () => {
    /*
     * Autoclose is triggered by a 3s timeout, during which the user may have manually cleared the alert
     * The removeAlert method should be able to prevent errors in this case
     */
    it('avoids duplicated removals with autoclose', fakeAsync(() => {
      alerts.info('Test', { autoClose: true });
      expect(component.alerts.length).toEqual(1);
      tick(1000);
      alerts.clear();
      tick(2000);
      expect(component.alerts.length).toEqual(0);
    }));

    it('fades the alert and removes after the fade', fakeAsync(() => {
      component.fade = true;
      alerts.warn('Test', { autoClose: true });
      expect(component.alerts.length).toEqual(1);
      expect(component.alerts[0].fade).toBeFalsy();
      tick(3000);
      expect(component.alerts.length).toEqual(1);
      expect(component.alerts[0].fade).toBeTruthy();
      tick(400);
      expect(component.alerts.length).toEqual(0);
    }));
  });

  describe('cssClass', () => {
    it('returns undefined if the alert is falsy', () => {
      expect(component.cssClass(null)).toBeUndefined();
    });

    it('sets the right type of class modifier for each AlertType', () => {
      expect(component.cssClass(new Alert({ message: 'Test', type: AlertType.Success }))).toEqual(
        'alert alert--success'
      );
      expect(component.cssClass(new Alert({ message: 'Test', type: AlertType.Warning }))).toEqual(
        'alert alert--warning'
      );
      expect(component.cssClass(new Alert({ message: 'Test', type: AlertType.Error }))).toEqual('alert alert--error');
      expect(component.cssClass(new Alert({ message: 'Test', type: AlertType.Info }))).toEqual('alert alert--info');
    });

    it('sets the fade modifier if necessary', () => {
      expect(component.cssClass(new Alert({ message: 'Test', type: AlertType.Info, fade: true }))).toEqual(
        'alert alert--info alert--fade'
      );
    });
  });
});
