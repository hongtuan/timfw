import {Component, OnInit} from '@angular/core';
import {Sort} from '@angular/material';
import {HttpClient} from '@angular/common/http';

function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

@Component({
  selector: 'package-info',
  templateUrl: 'package.info.component.html',
  styles: [`
    .mat-sort-header-container {
      align-items: center;
    }
  `]
})
export class PackageInfoComponent implements OnInit {
  packageInfo;
  sortedData;

  constructor(private http: HttpClient) {
    // this.sortedData = this.desserts.slice();
  }

  ngOnInit(): void {
    // throw new Error("Method not implemented.");
    this.http.get<any>('/api/sysinfo/lpi').subscribe(
      result => {
        this.packageInfo = result.dependencies;
        this.sortedData = this.packageInfo;
      },
      error => {
        console.log(error);
      }
    );
  }

  sortData(sort: Sort) {
    const data = this.packageInfo;
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'moduleName':
          return compare(a['moduleName'], b['moduleName'], isAsc);
        case 'newVersionCount':
          return compare(+a['newVersionCount'], +b['newVersionCount'], isAsc);
        case 'usingVersionLag':
          return compare(+a['usingVersionLag'], +b['usingVersionLag'], isAsc);
        // case 'calories': return compare(+a.calories, +b.calories, isAsc);
        // case 'fat': return compare(+a.fat, +b.fat, isAsc);
        // case 'carbs': return compare(+a.carbs, +b.carbs, isAsc);
        // case 'protein': return compare(+a.protein, +b.protein, isAsc);
        default:
          return 0;
      }
    });
  }
}
