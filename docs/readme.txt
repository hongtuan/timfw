2018.5.24
整理一套基于MEAN架构的框架
基于ngx-admin、express
集成必要的第三方库。
ngx-admin 2.2.0
express4.16.0
集成必要的功能模块：
1、服务器信息查看
2、日志查看
3、packageinfo
4、管理员及资源、权限管理
5、api管理及测试

集成步骤：
1、集成package-info模块过来
2、集成apimgr模块
3、迁移rrum模块

cool!
https://www.primefaces.org/primeng/#/

https://www.primefaces.org/primeng/#/setup

https://www.primefaces.org/themes/

https://www.jb51.net/article/115968.htm


 [style]="{'width':'150px','height':'26px'}"

<p-dropdown [options]="reqMethods" [(ngModel)]="item.reqType" name="reqType" [style]="{'width':'150px','height':'26px'}"></p-dropdown>

<mat-form-field class="full-width">
          <mat-select placeholder="请求方式" name="reqType" panel="dlg" [(ngModel)]="item.reqType">
            <mat-option value="get">Get</mat-option>
            <mat-option value="post">Post</mat-option>
            <mat-option value="put">Put</mat-option>
            <mat-option value="delete">Delete</mat-option>
          </mat-select>
        </mat-form-field>

<mat-form-field class="full-width">
        <mat-select placeholder="请求方式" name="reqType" panel="dlg" [(ngModel)]="item.reqType">
          <mat-option *ngFor="let rm of reqMethods" value="rm.value">{{rm.label}}</mat-option>
        </mat-select>
      </mat-form-field>

private cdr: ChangeDetectorRef
this.cdr.detectChanges();

tht@sina.com
tht001
