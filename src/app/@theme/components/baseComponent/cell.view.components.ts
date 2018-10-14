import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {ViewCell} from 'ng2-smart-table';
import {HttpClient} from '@angular/common/http';
import * as _ from 'lodash';

function isMatched(match, configValue, fieldValue) {
  let matched = false;
  let _match = match;
  if (!_match) {
    _match = 'eq';
  }
  switch (_match) {
    case 'in':
      matched = _.includes(configValue, fieldValue);
      break;
    case 'notIn':
      matched = !_.includes(configValue, fieldValue);
      break;
    case 'eq':
      matched = configValue === fieldValue;
      break;
    case 'ueq':
      matched = configValue !== fieldValue;
      break;
    case 'gt':
      matched = +fieldValue > +configValue;
      break;
    case 'gte':
      matched = +fieldValue >= +configValue;
      break;
    case 'lt':
      matched = +fieldValue < +configValue;
      break;
    case 'lte':
      matched = +fieldValue <= +configValue;
      break;
  }
  // console.log('matched=', matched);
  return matched;
}

@Component({
  selector: 'button-view',
  template: `
    <button class="btn btn-primary icon-btn"
            placement="top" [ngbTooltip]="button?.tip"
            *ngFor="let button of buttonList"
            (click)="callMethod(button?.method)"
            [hidden]="hiddenBtn(button?.hiddenCondition)"
            [innerHTML]="button?.title"></button>
  `,
})
export class ButtonViewComponent implements ViewCell, OnInit {
  buttonList: any[] = [];

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() clickEvent: EventEmitter<any> = new EventEmitter();
  constructor(private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
  }

  setButtonConfig(buttonList: any) {
    this.buttonList = buttonList;
    _.each(this.buttonList, (button) => {
      button.title = this.sanitizer.bypassSecurityTrustHtml(button.title);
    });
  }

  callMethod(methodName) {
    this.clickEvent.emit({method: methodName, data: this.rowData});
  }

  hiddenBtn(hiddenCondition): boolean {
    if (!hiddenCondition) {
      // console.log('show it.');
      return false;
    }
    let hidden = false;
    // console.log('hiddenCondition=', hiddenCondition);
    _.each(hiddenCondition, (item, index) => {
      hidden = isMatched(item.match, item.value, this.rowData[item.field]);
    });
    // console.log('hidden=', hidden);
    return hidden;
  }
}

@Component({
  selector: 'label-view',
  template: `
    <span class="btn btn-primary" (click)="callMethod(label?.method)">{{ label?.title }}</span>
  `,
})
export class LabelViewComponent implements ViewCell, OnInit {
  label: any = {method: '', title: ''};
  config: any;
  valueMap: any = null;

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() clickEvent: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    // this.label.title = this.value.toString();
    let appendInfo = this.config.valueMap[this.rowData[this.config.field]];
    if (appendInfo === undefined) {
      appendInfo = this.config.defaultValueText;
    }
    if (this.valueMap) {
      this.label.title = this.valueMap[this.value.toString()];
      if (this.label.title === undefined) {
        this.label.title = this.value.toString();
      }
    }else {
      this.label.title = this.value.toString();
    }
    this.label.title += appendInfo;
  }

  setMethod(methodName: string) {
    this.label.method = methodName;
  }

  isClickAble(): boolean {
    return isMatched(
      this.config.match,
      this.config.value, this.rowData[this.config.field]);
  }

  callMethod(methodName) {
    if (this.isClickAble()) {
      this.clickEvent.emit({method: methodName, data: this.rowData});
    }
  }

  /**
   * {field:'', clickMatch:'', value:'', valueMap:{key1:'value1',key2:'value2'},defaultValueText:''}
   * @param config
   */
  setReferFieldConfig(config: any): void {
    this.config = config;
  }

  setValueMap(valueMap: any): void {
    this.valueMap = valueMap;
  }
}

@Component({
  selector: 'date-time-field-view',
  template: `{{ value | date: _format}}`,
})
export class DateTimeViewComponent implements ViewCell, OnInit {
  _format: string = 'y-MM-dd HH:mm:ss';
  @Input() value: string | number;
  @Input() rowData: any;

  ngOnInit() {
  }

  public setFormat(format: string) {
    this._format = format;
  }
}

@Component({
  selector: 'image-field-view',
  template: `<img [src]="imgSrc" [ngStyle]="imgSize"/>`,
})
export class ImageViewComponent implements ViewCell, OnInit {
  imgSize: any = {width: '100px', height: '100px'};
  imgSrc: string; // = './assets/images/camera1.jpg';
  @Input() value: string | number;
  @Input() rowData: any;

  ngOnInit() {
    this.imgSrc = this.value.toString();
  }

  setSize(size: string) {
    const tmpA = size.split(',');
    this.imgSize.width = tmpA[0] + 'px';
    this.imgSize.height = tmpA[1] + 'px';
  }
}

@Component({
  selector: 'date-field-view',
  template: `{{ value | date: _format}}`,
})
export class DateViewComponent implements ViewCell, OnInit {
  _format: string = 'y-MM-dd';
  @Input() value: string | number;
  @Input() rowData: any;

  ngOnInit() {
  }

  setFormat(format: string) {
    this._format = format;
  }
}

@Component({
  selector: 'date-field-view',
  template: `<span>{{amount}}</span>`,
})
export class AmountViewComponent implements ViewCell, OnInit {

  @Input() value: string | number;
  @Input() rowData: any;
  amount: string | number;

  ngOnInit() {
    if (this.value) {
      this.amount = (+this.value / 100).toFixed(2);
    } else {
      this.amount = 0;
    }
  }
}

@Component({
  selector: 'time-field-view',
  template: `{{ value | date: _format}}`,
})
export class TimeViewComponent implements ViewCell, OnInit {
  _format: string = 'HH:mm:ss';
  @Input() value: string | number;
  @Input() rowData: any;

  ngOnInit() {
  }

  setFormat(format: string) {
    this._format = format;
  }
}

@Component({
  selector: 'switch-field-view',
  template: `<input type="checkbox" title="点击禁用/启用"
                    id="{{switchId}}" value="{{switchValue}}"/>`,
})
export class SwitchViewComponent implements ViewCell, OnInit, AfterViewInit {
  switchId: string;
  dataId: string;
  switchValue: string | number;
  config: any = {
    onText: '打开', onValue: '1',
    offText: '关闭', offValue: '0',
    updateCallback: null, afterUpdateCallback: null,
    updateUrl: '', columnName: 'status',
    needConfirm: 'yes',
  };

  @Input() value: string | number;
  @Input() rowData: any;

  constructor(private httpClient: HttpClient) {
    // console.log('step1:constructor called.');
  }

  ngOnInit() {
    this.dataId = this.rowData._id;
    this.switchId = `${this.config.columnName}_${this.dataId}`;
    this.switchValue = this.value;
    // console.log('step3:ngOnInit called.', this.config.columnName);
  }

  ngAfterViewInit(): void {
    // console.log('step4: ngAfterViewInit called.');
    this.configSwitch();
  }

  setConfig(config): void {
    // console.log('ngOnInit called.');
    if (config.onText) {
      this.config.onText = config.onText;
    }
    if (config.onValue) {
      this.config.onValue = config.onValue;
    }
    if (config.offText) {
      this.config.offText = config.offText;
    }
    if (config.offValue) {
      this.config.offValue = config.offValue;
    }
    if (config.updateCallback) {
      this.config.updateCallback = config.updateCallback;
    }
    if (config.updateUrl) {
      this.config.updateUrl = config.updateUrl;
    }
    if (config.columnName) {
      this.config.columnName = config.columnName;
    }
    if (config.afterUpdateCallback) {
      this.config.afterUpdateCallback = config.afterUpdateCallback;
    }
    if (config.needConfirm) {
      this.config.needConfirm = config.needConfirm;
    }

    $.fn.bootstrapSwitch.defaults.size = config.size || 'mini';
    $.fn.bootstrapSwitch.defaults.onColor = config.onColor || 'success';
    $.fn.bootstrapSwitch.defaults.offColor = config.offColor || 'default';
    $.fn.bootstrapSwitch.defaults.onText = this.config.onText;
    $.fn.bootstrapSwitch.defaults.offText = this.config.offText;
    // console.log('step2:setConfig called.');
  }

  updateSwitch(switchValue): void {
    // console.log('do change task here.', this.dataId, switchValue);
    if (this.config.updateCallback) {
      this.config.updateCallback(this.dataId, switchValue);
      return;
    }
    // console.log('this.config.switchUpdateUrl=', this.config.switchUpdateUrl);
    if (this.config.updateUrl !== '') {
      const reqData = {};
      reqData[this.config.columnName] = switchValue;
      // console.log(reqData);
      // 调用服务器端api更新状态。
      this.httpClient.put<any>(`${this.config.updateUrl}/${this.dataId}`,
        {doc: reqData})
        .subscribe(result => {
            // console.log('result=', result, this.config.afterUpdateCallback);
            if (this.config.afterUpdateCallback) {
              // this.updateEvent.emit({method: this.config.afterUpdateCallback, data: null});
              this.config.afterUpdateCallback();
              // console.log('emit over.');
            }
          },
          err => {
            console.log('err=', err);
          }
        );
    }
  }

  configSwitch() {
    // const bssBt = $(`input:checkbox[name="${this.switchName}"]`);
    // const bssBt = $(`input:checkbox[id="${this.switchId}"]`);
    const bssBt = $('#' + this.switchId);
    // console.log('bssBt.val()=', bssBt.val());
    // 根据值设置初始状态
    bssBt.bootstrapSwitch('state', bssBt.val() === this.config.onValue, true);
    // 绑定状态变化处理事件
    bssBt.on('switchChange.bootstrapSwitch', (event, state) => {
      // 获取到开关要改变为的值。
      const newSwitchValue = state ? this.config.onValue : this.config.offValue;
      if (this.config.needConfirm === 'yes') {
        // 弹出开关状态修改确认对话框
        layerHelper.confirm(
          `要将此开关状态改变为${state ? this.config.onText : this.config.offText}吗?`,
          '操作确认',
          () => {// 选择确定，进行更新处理
            this.updateSwitch(newSwitchValue);
          },
          () => {// 选择取消，回复到最初状态。
            bssBt.bootstrapSwitch('toggleState', true);
          }
        );
      } else {
        this.updateSwitch(newSwitchValue);
      }
    });
    // console.log('step5: configSwitch called.');
  }
}

@Component({
  selector: 'select-field-view',
  template: `<select id="{{selectId}}" name="{{selectId}}" [(ngModel)]="selectValue">
    <option *ngFor="let o of config.list" [value]="o.value">{{o.title}}</option>
  </select>
  `,
})
export class SelectViewComponent implements ViewCell, OnInit, AfterViewInit {
  selectId: string;
  dataId: string;
  selectValue: string;
  config: any = {
    columnName: '',
    list: [],
    updateCallback: null, afterUpdateCallback: null,
    updateUrl: '',
    needConfirm: 'yes',
  };

  @Input() value: string | number;
  @Input() rowData: any;

  constructor(private httpClient: HttpClient, private cdr: ChangeDetectorRef) {
    // console.log('step1:constructor called.');
  }

  ngOnInit() {
    this.dataId = this.rowData._id;
    this.selectId = `${this.config.columnName}_${this.dataId}`;
    this.selectValue = this.value.toString();
    // console.log('step3:ngOnInit called.');
  }

  ngAfterViewInit(): void {
    // console.log('step4: ngAfterViewInit called.');
    this.configSelect();
  }

  setConfig(config): void {
    // console.log('ngOnInit called.');
    if (config.list) {
      this.config.list = config.list;
    }
    if (config.updateCallback) {
      this.config.updateCallback = config.updateCallback;
    }
    if (config.updateUrl) {
      this.config.updateUrl = config.updateUrl;
    }
    if (config.columnName) {
      this.config.columnName = config.columnName;
    }
    if (config.afterUpdateCallback) {
      this.config.afterUpdateCallback = config.afterUpdateCallback;
    }
    if (config.needConfirm) {
      this.config.needConfirm = config.needConfirm;
    }
    // console.log('step2:setConfig called.');
  }

  updateSelect(selectValue): void {
    // console.log('do change task here.', this.dataId, switchValue);
    if (this.config.updateCallback) {
      this.config.updateCallback(this.dataId, selectValue);
      return;
    }
    // console.log('this.config.switchUpdateUrl=', this.config.switchUpdateUrl);
    if (this.config.updateUrl !== '') {
      const reqData = {};
      reqData[this.config.columnName] = selectValue;
      // console.log(reqData);
      // 调用服务器端api更新状态。
      this.httpClient.put<any>(`${this.config.updateUrl}/${this.dataId}`,
        {doc: reqData})
        .subscribe(result => {
            // console.log('result=', result, this.config.afterUpdateCallback);
            if (this.config.afterUpdateCallback) {
              // this.updateEvent.emit({method: this.config.afterUpdateCallback, data: null});
              this.config.afterUpdateCallback();
              // console.log('emit over.');
            }
          },
          err => {
            console.log('err=', err);
          }
        );
    }
  }

  configSelect() {
    const selectCtrl = $('#' + this.selectId);
    // 绑定状态变化处理事件
    selectCtrl.on('change', (event) => {
      const selectedOption = selectCtrl.children('option:selected');
      const newSelectValue = selectedOption.val();
      // console.log('look:', this.dataId, selectedOption.val(), selectedOption.text());
      if (this.config.needConfirm === 'yes') {
        // 弹出开关状态修改确认对话框
        layerHelper.confirm(
          `要将此列表修改为${selectedOption.text()}吗?`,
          '操作确认',
          () => {// 选择确定，进行更新处理
            this.updateSelect(newSelectValue);
          },
          () => {// 选择取消，回复到最初状态。
            // console.log('恢复待处理...', this.selectValue, this.value);
            this.selectValue = this.value.toString();
            // console.log('over', this.selectValue, this.value);
            this.cdr.detectChanges();
          }
        );
      } else {
        this.updateSelect(newSelectValue);
      }
    });
    // console.log('step5: configSelect called.');
  }
}

@Component({
  selector: 'dropdown-menu-view',
  template: `
    <div class="dropdown menu-container" ngbDropdown>
      <button class="btn btn-primary menu-name" ngbDropdownToggle [innerHTML]="menuTitle"></button>
      <ul class="dropdown-menu dd-menu-ext" ngbDropdownMenu>
        <li class="dropdown-item dd-menu-item-ext"
            *ngFor="let button of buttonList"
            (click)="callMethod(button?.method)" [innerHTML]="button?.title"></li>
      </ul>
    </div>
  `,
  styles: [`
    .menu-container {
      background-color: #83c3ed;
      border-radius: 0.25rem;
    }

    .menu-name {
      width: 6rem;
      text-transform: none;
      color: white;
      background: transparent;
    }

    .dd-menu-ext {
      width: 6rem;
      padding: 0;
      margin-left: -2px;
      border-top: white 1px solid;
    }

    .dd-menu-item-ext {
      padding: 0.5rem 1.25rem;
      background: transparent;
    }
  `]
})
export class DropdownMenuViewComponent implements ViewCell, OnInit {
  // 下拉菜单标题，默认用齿轮图标.
  menuTitle: string = '<i class="fa fa-cogs"></i>';
  buttonList: any[] = [];

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() clickEvent: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
  }

  setButtonConfig(buttonList: any) {
    this.buttonList = buttonList;
  }

  setMenuTitle(menuTitle: string) {
    this.menuTitle = menuTitle;
  }

  callMethod(methodName) {
    this.clickEvent.emit({method: methodName, data: this.rowData});
  }
}

@Component({
  selector: 'label-view-simp',
  template: `
    <span>{{ label.title}}</span>
  `,
})
export class LabelSimpViewComponent implements ViewCell, OnInit {
  label: any = {title: ''};
  config: any = {};

  @Input() value: any;
  @Input() rowData: any;

  ngOnInit() {
    this.label.title = this.config[this.value];
  }

  setConfig(config): void {
    this.config = config;
  }
}
