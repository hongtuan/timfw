import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import {TreeUtils} from '../pages/rrum/tree.utils';
// import 'rxjs/observable';

import * as _ from 'lodash';
// import {NbAuthService} from '@nebular/auth';
// import {NbAuthJWTToken} from '@nebular/auth/services/token.service';

@Injectable()
export class MenuDataService {
  // menuData: Subject<any> = new Subject<any>();
  private readonly authLinks = [];
  constructor(private http: HttpClient) {
  }
  private readonly menuUrl = '/api/menu';


  public loadMenu(assignedMenuIds: number[], menuName?: string): Observable<any> {
    const url = `${this.menuUrl}/load/${menuName || 'ptMenu'}`;
    // console.log('url=', url);
    // return this.http.get<any>(url);
    return this.http.get<any>(url).map(
      (menuData) => {
        const selectedNodes = TreeUtils.getAssignedNode(menuData, assignedMenuIds);
        this.authLinks.length = 0;
        _.each(selectedNodes, (node) => {
          this.authLinks.push(node.link);
        });
        this.authLinks.push('/pages/defpage');
        // console.log('selectedNodes=', selectedNodes, this.authLinks);
        const sortedSelectedNodes = TreeUtils.getRelatedSelectedNodes(menuData, selectedNodes);
        const treeModel = TreeUtils.buildTreeModel(sortedSelectedNodes);
        // 从this.newTreeModel 中提取menuData
        const assignedMenuData = TreeUtils.cvtTree2Menu(treeModel);
        // console.log(assignedMenuData);
        return assignedMenuData;
      }
    );
  }

  public isLinkAuthenticated(link: string): Observable<boolean> {
    // console.log('isLinkAuthenticated link ', link);
    // console.log('look!', _.includes(this.authLinks, link), this.authLinks);
    // return Observable.of(_.includes(this.authLinks, link));
    console.log('link=', link);
    if (/.*\/.*;.*/.test(link)) {
      const url = link.substr(0, link.indexOf(';'));
      // console.log('url=', url);
      const sc = url.split('/').length;
      // console.log('sc=', sc);
      link = sc > 4 ? url.substr(0, url.lastIndexOf('/')) : url;
      console.log('sublink=', link);
    }
    return Observable.of(_.isEmpty(this.authLinks) || _.includes(this.authLinks, link));
  }
}
