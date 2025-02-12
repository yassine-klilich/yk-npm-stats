import { Component } from '@angular/core';
import { NPMDownloadCount } from './services/npm-download-count.service';
import { Chart, registerables } from 'chart.js';
import { IPackage } from './model/IPackage';
import zoomPlugin from 'chartjs-plugin-zoom';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  package_names: Array<string> = [
    'ngx-interpolation',
    'yk-color-picker',
    'yk-color-parser',
    'yk-tool-tipsy',
  ];
  packages: Array<IPackage> = [];
  last_period: Period = Period.LastWeek;
  start_date: string = '';
  end_date: string = '';
  isLoading: boolean = false;

  constructor(private npmDownloadCount: NPMDownloadCount) {}

  public get Period(): typeof Period {
    return Period;
  }

  ngOnInit() {
    Chart.register(...registerables);
    Chart.register(zoomPlugin);
    this.loadPackagesCount();
  }

  onPeriodChange() {
    this.loadPackagesCount();
  }

  onDatePickerChange() {
    if (this.calculateDays(this.start_date, this.end_date) > 365) {
      alert('Date range must be less than 1 year');
    } else {
      this.last_period = Period.Custom;
      this.loadPackagesCount();
    }
  }

  private setTimePeriod(start_date: Date, end_date?: Date) {
    if (end_date == null) {
      end_date = start_date;
    }
    if (start_date.getTime() > end_date.getTime()) {
      const temp: Date = start_date;
      start_date = end_date;
      end_date = temp;
    }

    this.start_date = start_date.toISOString().split('T')[0];
    this.end_date = end_date.toISOString().split('T')[0];

    this.npmDownloadCount.setStartDate(start_date);
    this.npmDownloadCount.setEndDate(end_date);
  }

  private loadPackagesCount() {
    let start_date: Date = new Date();
    let end_date: Date = new Date();

    switch (this.last_period) {
      case Period.LastDay:
        {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);

          start_date = end_date = yesterday;
        }
        break;

      case Period.LastWeek:
        {
          const today = new Date();
          const lastWeek = new Date(today);
          lastWeek.setDate(today.getDate() - 7);
          today.setDate(today.getDate() - 1);

          start_date = lastWeek;
          end_date = today;
        }
        break;

      case Period.LastMonth:
        {
          const today = new Date();
          const last30Days = new Date(
            today.getTime() - 30 * 24 * 60 * 60 * 1000
          );
          today.setDate(today.getDate() - 1);

          start_date = last30Days;
          end_date = today;
        }
        break;

      case Period.Custom:
        {
          start_date = new Date(this.start_date);
          end_date = new Date(this.end_date);
        }
        break;
    }

    if (start_date.getTime() > end_date.getTime()) {
      const temp: Date = start_date;
      start_date = end_date;
      end_date = temp;
    }

    if (!isNaN(start_date.getTime()) && !isNaN(end_date.getTime())) {
      this.setTimePeriod(start_date, end_date);
      this.fetchData();
    }
  }

  private fetchData() {
    this.isLoading = true;
    this.npmDownloadCount
      .setPackageNames(this.package_names)
      .setRange(true)
      .fetch()
      .subscribe((data) => {
        this.isLoading = false;
        this.packages = this.formatFetchedData(data);
      });
  }

  private formatFetchedData(data: any): Array<IPackage> {
    const packages_count: Array<any> = [];

    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        const packageItem: IPackage = {
          name: data[key].package,
          downloads: data[key].downloads,
          countDownloads: data[key].downloads.reduce(
            (sum: number, item: any) => sum + item.downloads,
            0
          ),
        };
        packages_count.push(packageItem);
      }
    }

    return packages_count;
  }

  private calculateDays(start_date: string, end_date: string): number {
    const oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day

    const start: Date = new Date(start_date);
    const end: Date = new Date(end_date);

    // Calculate the difference in milliseconds
    const diff = Math.abs(end.getTime() - start.getTime());

    // Convert the difference to days
    const days = Math.floor(diff / oneDay);

    return days;
  }
}

enum Period {
  Custom = 0,
  LastDay = 1,
  LastWeek = 2,
  LastMonth = 3,
}
