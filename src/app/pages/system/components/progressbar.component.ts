import {Component, ElementRef, Inject, OnInit} from '@angular/core';
import {BaseDialogComponent} from '../../../@theme/components';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'progress-bar',
  templateUrl: 'progressbar.component.html',
})
export class ProgressbarComponent extends BaseDialogComponent implements OnInit {
  taskName: string;
  refreshInterval: number = 1000;
  progressValue: number;
  progressText: string = '0%';

  constructor(protected dialog: MatDialog,
              protected dialogRef: MatDialogRef<ProgressbarComponent>,
              protected elementRef: ElementRef,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private http: HttpClient) {
    super(dialog, dialogRef, elementRef);
  }

  ngOnInit(): void {
    this.taskName = this.data.taskName;
    if (this.data.refreshInterval) {
      this.refreshInterval = this.data.refreshInterval;
    }
    setTimeout(() => {
      this.startRefreshTaskInfo();
    }, 200);
  }

  startRefreshTaskInfo(): void {
    // this.taskName = param.taskName;
    // console.log('taskName=', this.taskName);
    const interval = setInterval(() => {
      this.http.get<any>('/api/sysinfo/glti/' + this.taskName).subscribe(
        taskInfo => {
          // this.taskInfo = JSON.stringify(taskInfo);
          if (taskInfo['finished']) { // 如果任务结束了，进度条关闭。
            clearInterval(interval);
            // console.log('run over.');
            this.progressValue = 100;
            setTimeout(() => {
              this.dialogRef.close(taskInfo['data']);
            }, 500);
          }else { // 任务进行中，根据访问服务器端的信息来更新进度条。
            // const tmpA = taskInfo.data.split('/');
            // const value = (+tmpA[0]) / (+tmpA[1]) * 100;
            const value = (+taskInfo.data.fc) / (+taskInfo.data.tc) * 100;
            if (value > 0) {
              this.progressValue =  parseFloat(value.toFixed(2));
              this.progressText = `${this.progressValue}%`;
            }
          }
        }
      );
    }, this.refreshInterval);
  }
}
