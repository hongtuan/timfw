import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { ImageViewService } from './image.view.service';
import * as _ from 'lodash';

@Component({
  selector: 'image-file',
  template: `
    <label class="preview-label"  [ngStyle]="boxStyle"  *ngFor="let img of imgList; let i = index;">
      <img src="{{img}}" class="imgItem" [ngStyle]="boxStyle" />
      <i class="fa fa-remove img-remove" (click)="remove(i)"></i>
    </label>
    <label class="preview-label" [ngStyle]="boxStyle"  *ngIf="showAdd()">
      <input name="single-file" type="file" ng2FileSelect [uploader]="uploader" (change)="onFileChanged($event)" />
      <i class="fa fa-2x fa-plus img-add"></i>
    </label>
  `,
  styles: [`
    .imgItem {
      width: 100px;
      height: 100px;
    }
    .preview-label {
      width: 100px;
      height: 100px;
      border: 1px dotted #ccc;
      position: relative;
      vertical-align: top;
      display: inline-block;
    }
    .preview-label > input {
      display: none;
    }
    .preview-label .img-add {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .preview-label .img-remove {
      position: absolute;
      top: 5%;
      right: 5%;
    }
  `]
})
export class ImageFileComponent implements OnInit {

  @Input() imgFileInput: any;
  @Input() size: number[] = [100, 100];
  @Input() maxCount: number = 1;
  @Input() maxFileSize: number = 2048000; // 控制上传文件大小的参数，单位是字节，默认2M

  @Input() uploadUrl: string = '/api/uploadImg';
  @Input() fileName: string = 'single-file';
  @Input() autoUpload: boolean = true;

  @Output() imgFileOutput: EventEmitter<string> = new EventEmitter();

  imgList = [];
  boxStyle: any;

  uploader: FileUploader;

  constructor(public imageViewService: ImageViewService) { }

  ngOnInit() {
    if (_.isString(this.imgFileInput)) {
      this.imgList.push(this.imgFileInput);
    }
    if (_.isArray(this.imgFileInput)) {
      this.imgList.concat(this.imgFileInput);
    }
    // 拆分size为数组
    // const sizeInfo = this.size.split(',');
    this.boxStyle = {
      width: this.size[0] + 'px',
      height: this.size[1] + 'px'
    };
    this.uploader = new FileUploader({
      url: this.uploadUrl,
      itemAlias: this.fileName,
      allowedFileType: ['image'],
      maxFileSize: this.maxFileSize // 2M
    });
  }

  onFileChanged(event) {
    if (this.uploader.queue.length < 1) {
      console.log('所选择文件不符合条件。');
      return;
    }
    if (!event.target.files[0]) {
      return;
    }
    // 浏览器端预览
    this.imageViewService.readAsDataUrl(event.target.files[0]).then((result) => {
      this.imgList.push(result);
    });
    // 默认为自动上传，
    if (this.autoUpload) {
      this.uploadFile((filePath) => {
        // console.log('filePath=', filePath);
        this.imgFileInput = filePath;
        this.imgFileOutput.emit(filePath);
      });
    }
  }

  remove(i) {
    this.imgList.splice(i, 1);
    this.uploader.queue.splice(i, 1);
  }

  showAdd(): boolean {
    return this.imgList.length < this.maxCount;
  }

  uploadFile(afterUploadCallback): void {
    // console.log(this.uploader.queue);
    if (this.uploader.queue.length < 1) {
      layer.msg('no file selected.');
      return;
    }
    this.uploader.queue[0].onSuccess = (response, status, headers) => {
      // 上传文件成功
      if (status === 200) {
        if (afterUploadCallback) {
          // 解析服务器端反馈
          const resObj = JSON.parse(response);
          // 针对Windows平台，替换路径分隔符.
          let fileUrl = resObj.obj.path.toString().replace(/\\/g, '\/');
          fileUrl = fileUrl.replace('client', '');
          afterUploadCallback(fileUrl);
        }
      }else {
        // 上传文件后获取服务器返回的数据错误
        console.log('upload image failed,status=', status, 'response=', response);
      }
    };
    this.uploader.queue[0].onError = (response, status, headers) => {
      console.log('upload image error:status=', status, 'response=', response, 'header=', headers);
    };
    // 开始上传
    this.uploader.queue[0].upload();
  }
}
