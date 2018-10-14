import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { SystemInfoService } from '../../../services/system.info.service';


@Component({
  selector: 'system-info',
  templateUrl: 'system.info.component.html',
  styles: [
    `.clkt {
      cursor: pointer;
    }
    .licon{
      width:24px;
      height:24px;
    }
    #locListPanel{
      min-height:360px;
    }
    `
  ]
})
export class SystemInfoComponent implements OnInit {
  systemInfo: any[];
  constructor(private route: ActivatedRoute, private router: Router,
    private systemInfoService: SystemInfoService) {
  }
  loadSystemInfo(): void {
    this.systemInfoService.getSystemInfo().subscribe(
      systemInfo => {
        this.systemInfo = systemInfo;
      },
      error => {
        layer.msg('load data failed.' + error);
      }
    );
  }

  ngOnInit(): void {
    this.loadSystemInfo();
  }
}

