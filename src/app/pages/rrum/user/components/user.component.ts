import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDatepicker, MatDialog, MatDialogRef} from '@angular/material';
import {HttpClient} from '@angular/common/http';
import {Admin} from '../../../../domain/admin.mdl';
import {AdminService} from '../../../../services';
import {BaseDialogComponent, DialogMode} from '../../../../@theme/components';
// import {QsGridBaseComponent} from '../../../common/qsgrid/components/qs-grid-base.component';
import * as _ from 'lodash';

// import { NgForm } from '@angular/forms';


@Component({
  selector: 'user-component',
  templateUrl: 'user.component.html'
})
export class UserComponent extends BaseDialogComponent implements OnInit {
  @ViewChild(MatDatepicker) picker1: MatDatepicker<Date>;

  private errMsg: string;

  // user: Admin;
  roles: any[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              protected dialog: MatDialog,
              public dialogRef: MatDialogRef<UserComponent>,
              protected elementRef: ElementRef,
              private adminService: AdminService) {
    super(dialog, dialogRef, elementRef);
    this.doc = new Admin({name: 'user', email: 'xx@qq.com'});
  }

  ngOnInit(): void {
    if (this.data.user) {
      this.dialogMode = DialogMode.Edit;
      this.doc = this.data.user;
    }
    this.loadRoles();
  }

  loadRoles(): void {
    this.adminService.loadRoles('_id,roleName').subscribe(
      (roles) => {
        this.roles = roles;
      },
      (error) => {
        // layer.msg('load roles failed.');
      }
    );
  }

  disabledWhenEdit(): boolean {
    return this.dialogMode === DialogMode.Edit;
  }

  protected onAddDocument(): void {
    // super.onAddDocument();
    console.log('add user=', JSON.stringify(this.doc));
    this.adminService.addUser(this.doc).subscribe(
      user => {
        this.doc = user;
        layer.msg('User add success.');
        this.closeDialog();
      },
      error => {
        console.log(JSON.stringify(error, null, 2));
        this.errMsg = error.error.message;
        layer.msg('Add user failed.');
      }
    );
  }

  protected onModifyDocument(): void {
    // super.onModifyDocument();
    this.adminService.updateUser(this.doc).subscribe(
      user => {
        this.doc = user;
        layer.msg('User update success.');
        this.closeDialog();
      },
      error => {
        this.errMsg = error.message;
        layer.msg('update failed.' + this.errMsg);
      }
    );
  }

  /*
  onSubmit(): void {
    // this.dialogRef.close(this.user);
    if (this.dialogMode === DialogMode.Add) {
      console.log('add user=', JSON.stringify(this.doc));
      this.adminService.addUser(this.doc).subscribe(
        user => {
          this.doc = user;
          layer.msg('User add success.');
          this.closeDialog();
        },
        error => {
          console.log(JSON.stringify(error, null, 2));
          this.errMsg = error.error.message;
          layer.msg('Add user failed.');
        }
      );
    }
    if (this.dialogMode === DialogMode.Edit) {
      // console.log('before update,user=', JSON.stringify(this.user, null, 2));
      this.adminService.updateUser(this.doc).subscribe(
        user => {
          this.doc = user;
          layer.msg('User update success.');
          this.closeDialog();
        },
        error => {
          this.errMsg = error.message;
          layer.msg('update failed.' + this.errMsg);
        }
      );
    }
  }//*/
}

@Component({
  selector: 'user-password-component',
  templateUrl: 'user.password.component.html',
  styles: [`
    mat-form-field.mat-form-field {
      width: 100%;
      min-width: 100px;
      max-width: 200px;
    }

    material-dialog > #dlg-frame {
      width: 100%;
      height: 400px;
    }

    #dlg-body {
      height: 300px;
      overflow: auto;
    }
  `]
})
export class UserPasswordComponent extends BaseDialogComponent implements OnInit {
  private errMsg: string;

  // user: Admin;
  constructor(protected dialog: MatDialog,
              protected dialogRef: MatDialogRef<UserPasswordComponent>,
              protected elementRef: ElementRef,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private adminService: AdminService) {
    super(dialog, dialogRef, elementRef);
    this.doc = this.data.user;
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    // this.user['newPassword'] = this.user['rePassword'];
    this.adminService.updateUserPassword(this.doc).subscribe(
      user => {
        this.doc = user;
        layer.msg('管理员口令修改成功。');
        this.closeDialog();
      },
      error => {
        this.errMsg = error.message;
        layer.msg('管理员口令修改失败。');
      }
    );
  }
}

@Component({
  selector: 'user-hospital-assign-component',
  templateUrl: 'user.hospital.assign.component.html'
})
export class UserHospitalAssignComponent extends BaseDialogComponent implements OnInit {
  user: Admin;

  constructor(protected dialog: MatDialog,
              protected dialogRef: MatDialogRef<UserHospitalAssignComponent>,
              protected elementRef: ElementRef,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private http: HttpClient,
              private adminService: AdminService) {
    super(dialog, dialogRef, elementRef);
    this.user = this.data.user;
    // console.log(this.user);
  }

  hospitalList: any[];

  ngOnInit(): void {
    this.http.get<any>('/api/hospitals/id-name-list').subscribe(
      idNames => {
        this.hospitalList = idNames;
        // 回填已选中的医院
        _.each(this.hospitalList, (item) => {
          _.each(this.user.hospital, (hid) => {
            if (item._id === hid) {
              this.selectedHospital.push(item);
            }
          });
        });
      }
    );
  }

  onSubmit(): void {
    // console.log(this.selectedHospital, this.user);
    // this.user['newPassword'] = this.user['rePassword'];
    const hospital = [];
    _.each(this.selectedHospital, (item) => {
      hospital.push(item._id);
    });
    // console.log('hospital', hospital);
    const adminData = {_id: this.user._id, hospital: hospital};
    this.adminService.updateUserHospital(adminData).subscribe(
      user => {
        this.user.hospital = user.hospital;
        layer.msg('医院分配成功。');
        this.closeDialog();
      },
      error => {
        layer.msg('医院分配成功失败。');
      }
    );
  }

  key: string = '_id';
  display: Array<string> = ['name'];
  selectedHospital: Array<any> = [];

  format: any = {
    add: '分配医院',
    remove: '去掉医院',
    all: '全选',
    none: '取消选择',
    direction: 'left-to-right',
    draggable: true
  };
}
