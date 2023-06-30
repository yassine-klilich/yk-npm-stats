import { Component } from '@angular/core';
import { NPMDownloadCount } from './services/npm-download-count.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  packages: Array<string> = [
    "ngx-interpolation",
    "yk-color-parser",
    "yk-tool-tipsy"
  ]
  downloads_count: Array<any> = []
  last_period: Period = Period.LastDay
  start_date: string = ""
  end_date: string = ""

  constructor(private npmDownloadCount: NPMDownloadCount) { }

  public get Period(): typeof Period {
    return Period
  }

  ngOnInit() {
    this.loadPackagesCount()
  }

  onPeriodChange() {
    this.loadPackagesCount()
  }

  onDatePickerChange() {
    // TO-DO: make the date-picker interactive with the radio buttons
    // when selecting a date range that is equals to last week, then check the last week radio button
    // and this must apply on all radio buttons
    this.last_period = Period.Custom
    this.loadPackagesCount()
  }

  private setTimePeriod(start_date: Date, end_date?: Date) {
    if (end_date == null) {
      end_date = start_date
    }
    if (start_date.getTime() > end_date.getTime()) {
      const temp: Date = start_date
      start_date = end_date
      end_date = temp
    }

    this.start_date = start_date.toISOString().split('T')[0]
    this.end_date = end_date.toISOString().split('T')[0]

    this.npmDownloadCount.setStartDate(start_date)
    this.npmDownloadCount.setEndDate(end_date)
  }

  private loadPackagesCount() {
    let start_date: Date = new Date(this.start_date)
    let end_date: Date = new Date(this.end_date)

    switch (this.last_period) {
      case Period.LastDay: {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)

        start_date = end_date = yesterday
      } break;

      case Period.LastWeek: {
        const today = new Date()
        const lastWeek = new Date(today)
        lastWeek.setDate(today.getDate() - 7)
        today.setDate(today.getDate() - 1)

        start_date = lastWeek
        end_date = today
      } break;

      case Period.LastMonth: {
        const today = new Date()
        const last30Days = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
        today.setDate(today.getDate() - 1)

        start_date = last30Days
        end_date = today
      } break;
    }

    if (start_date.getTime() > end_date.getTime()) {
      const temp: Date = start_date
      start_date = end_date
      end_date = temp
    }

    this.setTimePeriod(start_date, end_date)
    this.fetchData()
  }

  private fetchData() {
    this.npmDownloadCount
    .setPackageNames(this.packages)
    .fetch()
    .subscribe((data) => {
      console.log(data);
      const packages_count: Array<any> = []

      for (let key in data) {
        if (data.hasOwnProperty(key)) {
          packages_count.push(data[key])
        }
      }

      this.downloads_count = packages_count
    })
  }
}

enum Period {
  Custom = 0,
  LastDay = 1,
  LastWeek = 2,
  LastMonth = 3,
}
