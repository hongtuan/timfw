import {Component, Input, OnInit} from '@angular/core';
import * as _ from 'lodash';
@Component({
  selector: 'nav-info',
  template: `
    <div fxLayout="row" fxLayoutAlign="space-between" fxLayoutGap="6px">
      <a *ngIf="isInner" [routerLink]='nav.linkUrl'>{{nav.linkName}}</a>
      <a *ngIf="!isInner" [href]="nav.linkUrl" [target]="_target">{{nav.linkName}}</a>
      <span>{{domain}}</span>
    </div>
  `,
})
export class NavInfoComponent implements OnInit {
  @Input() nav: any;
  isInner: boolean = false;
  _target: string;
  domain: string;

  urlRex: RegExp = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;

  ngOnInit(): void {
    this.isInner = this.nav.linkUrl.startsWith('/');
    if (!this.isInner) {
      this._target = _.uniqueId('win_');
      if (!this.nav.linkUrl.toLowerCase().startsWith('http')) {
        this.nav.linkUrl = 'http://' + this.nav.linkUrl;
      }
      const urlRes = this.urlRex.exec(this.nav.linkUrl);
      // console.log(urlRes);
      this.domain = urlRes[3];
      if (this.domain.toLowerCase().startsWith('www.')) {
        this.domain = this.domain.substring(4);
      }
    }else {
      this.domain = this.nav.linkUrl;
      if (this.domain.toLowerCase().startsWith('/pages')) {
        this.domain = this.domain.substring(6);
      }
    }
  }
}
