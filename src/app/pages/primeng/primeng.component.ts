import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonHttpService } from '../../services';
import * as _ from 'lodash';
import {MenuItem} from 'primeng/api';

function obj2QueryParam(obj) {
  const tmpA = [];
  _.each(obj, function (value, key) {
    tmpA.push(`${key}=${value}`);
  });
  return tmpA.length > 0 ? `?${tmpA.join('&')}` : '';
}

@Component({
  selector: 'prime-ng',
  templateUrl: './primeng.component.html',
  styles: [`
        .custombar1 .ui-scrollpanel-wrapper {
            border-right: 9px solid #f4f4f4;
        }
            
        .custombar1 .ui-scrollpanel-bar {
            background-color: #1976d2;
            opacity: 1;
            transition: background-color .3s;
        }
            
        .custombar1 .ui-scrollpanel-bar:hover {
            background-color: #135ba1;
        }
            
        .custombar2 .ui-scrollpanel-wrapper {
            border-right: 9px solid #757575;
            border-bottom: 9px solid #757575;
        }
            
        .custombar2 .ui-scrollpanel-bar {
            background-color: #68C77D;
            border-radius: 0;
            opacity: 1;
            transition: background-color .3s;
        }
            
        .custombar2:hover .ui-scrollpanel-bar {
            background-color: #46A55A;
        }
    `],
  encapsulation: ViewEncapsulation.None
})
export class PrimengComponent implements OnInit {
  items: MenuItem[];
  title = 'apiTester';
  apiUrl: string = '/api/sysinfo';
  apiId: string;
  methods: any[] = [
    {
      desc: 'Get',
      type: 'GET'
    },
    {
      desc: 'Post',
      type: 'POST'
    },
    {
      desc: 'Put',
      type: 'PUT'
    },
    {
      desc: 'Delete',
      type: 'DELETE'
    },
  ];
  selectedMethod: string = 'GET';
  reqData: string = ''; // JSON.stringify({key: 'value'}, null, 2);
  resData: string = '';
  showBack: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router,
              private httpService: CommonHttpService) {
    // console.log('ApiWebTesterComponent constructor calle.');
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      if (!_.isEmpty(params)) {
        this.showBack = true;
      }
      if (params['_id']) {
        this.apiId = params['_id'];
      }
      if (params['url']) {
        this.apiUrl = params['url'];
      }
      if (params['reqType']) {
        this.selectedMethod = params['reqType'].toUpperCase();
      }
      if (params['reqParam']) {
        let obj = null;
        try {
          obj = JSON.parse(params['reqParam']);
        }catch (e) {
          obj = null;
        }
        this.reqData = obj ? JSON.stringify(obj, null, 2) : '{\n\n}';
      }
    });
    this.items = [{
      label: 'File', icon: 'fa fa-refresh', command: this.fun1
    },
      {
        label: 'Edit',
        items: [
          {label: 'Undo', icon: 'fa fa-refresh'},
          {label: 'Redo', icon: 'fa fa-repeat'}
        ]
      }];
  }

  fun1(event) {
    console.log('fun1 called');
  }

  showResData(resData: any) {
    // console.log('error!!', error);
    this.resData += JSON.stringify(resData, null, 2);
  }
  showError(error: any) {
    // console.log('error!!', error);
    this.resData += error.message + JSON.stringify(error.error, null, 2);
  }

  doTest(): void {
    // 转换请求参数
    let reqDataObj = null;
    if (_.trim(this.reqData) !== '') {
      try {
        reqDataObj = JSON.parse(this.reqData);
      }catch (e) {
        // console.log(e);
        layer.msg('请求参数格式有误！');
        return;
      }
    }
    // console.log('reqDataObj=', reqDataObj, JSON.stringify(reqDataObj, null, 2));
    this.resData = `call ${this.apiUrl} with ${this.selectedMethod} method...\n`;
    switch (this.selectedMethod) {
      case 'GET':
        let getUrl = this.apiUrl;
        if (reqDataObj) {
          // 根据apiUrl形式判断采用查询参数或地址栏参数
          if (getUrl.indexOf(':') !== -1) { // 地址栏参数
            const urlA = getUrl.split('/');
            const nA = [];
            for (const item of urlA){
              // let item = urlA[i];
              // console.log('item=', item);
              if (item.startsWith(':')) {
                nA.push(reqDataObj[item.substr(1)]);
              }else {
                nA.push(item);
              }
              // console.log('after item=', item);
            }
            // console.log(urlA, nA);
            getUrl = nA.join('/');
            // console.log('param:getUrl=', getUrl);
          }else {
            getUrl = this.apiUrl + obj2QueryParam(reqDataObj);
            // console.log('query,getUrl=', getUrl);
          }
        }

        // console.log('getUrl=', getUrl);
        this.resData = `call ${getUrl} with ${this.selectedMethod} method...\n`;
        this.httpService.callGet(getUrl,
          (resData) => this.showResData(resData), (error) => this.showError(error));
        break;
      case 'POST':
        // console.log('call POST method  here.');
        this.httpService.callPost(this.apiUrl, reqDataObj,
          (resData) => this.showResData(resData), (error) => this.showError(error));
        break;
      case 'PUT':
        // console.log('call PUT method  here.');
        this.httpService.callPut(this.apiUrl, reqDataObj,
          (resData) => this.showResData(resData), (error) => this.showError(error));
        break;
      case 'DELETE':
        // console.log('call DELETE method  here.');
        this.httpService.callDelete(this.apiUrl,
          (resData) => this.showResData(resData), (error) => this.showError(error));
    }
    if (this.apiId) {
      // 增加调用次数.
      this.httpService.callPut('/api/apimgr/itt/' + this.apiId, null,
        (resData) => { layer.msg('testTimes added.'); }, (error) => this.showError(error));
    }
  }
  goBack() {
    this.router.navigate(['/pages/dev/apimgr']);
  }
}
