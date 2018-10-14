import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {Menu, Role, Admin} from '../domain/admin.mdl';

@Injectable()
export class AdminService {

  private jsonRequestOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  private menuUrl = '/api/menu';
  private roleUrl = '/api/role';
  private userUrl = '/api/user';


  constructor(private http: HttpClient) {
  }

  public loadMenu(menuName): Observable<any> {
    const url = `${this.menuUrl}/load/${menuName}`;
    // console.log('url=', url);
    return this.http.get<any>(url);
  }

  public saveMenu(menuData): Observable<Menu> {
    return this.http.post<Menu>(this.menuUrl + '/save', menuData, this.jsonRequestOptions);
  }

  public loadRoles(cols?: string): Observable<Role[]> {
    let url = `${this.roleUrl}/list`;
    if (cols) {
      url += `?cols=${cols}`;
    }
    return this.http.get<Role[]>(url);
  }

  public addRole(roleData): Observable<Role> {
    return this.http.post<Role>(this.roleUrl + '/create', roleData, this.jsonRequestOptions);
  }

  public updateRole(roleData): Observable<Role> {
    return this.http.post<Role>(this.roleUrl + '/update', roleData, this.jsonRequestOptions);
  }

  public deleteRole(roleId): Observable<any> {
    const url = `${this.roleUrl}/delete/${roleId}`;
    return this.http.delete<any>(url);
  }

  public updateRoleMenu(roleId, authMenuList): Observable<any> {
    const menuData = {roleId: roleId, authMenuList: authMenuList};
    return this.http.put<any>(this.roleUrl + '/update-menu',
      menuData, this.jsonRequestOptions);
  }

  public loadUsers(): Observable<Admin[]> {
    return this.http.get<Admin[]>(this.userUrl + '/list');
  }

  public addUser(userData): Observable<Admin> {
    return this.http.post<Admin>(this.userUrl + '/create', userData, this.jsonRequestOptions);
  }

  public updateUserStatus(adminId, status): Observable<any> {
    const adminData = {adminId: adminId, status: status};
    return this.http.put<any>(this.userUrl + '/update-status',
      adminData, this.jsonRequestOptions);
  }

  public updateUser(adminData): Observable<Admin> {
    return this.http.put<Admin>(this.userUrl + '/update', adminData, this.jsonRequestOptions);
  }

  public updateUserPassword(adminData): Observable<Admin> {
    return this.http.put<Admin>(this.userUrl + '/update-pwd', adminData, this.jsonRequestOptions);
  }

  public updateUserHospital(adminData): Observable<Admin> {
    return this.http.put<Admin>(this.userUrl + '/update-hospital', adminData, this.jsonRequestOptions);
  }

  public deleteUser(adminId): Observable<any> {
    const url = `${this.userUrl}/delete/${adminId}`;
    return this.http.delete<any>(url);
  }

}



