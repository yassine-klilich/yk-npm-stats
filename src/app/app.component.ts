import { Component, OnInit } from '@angular/core';
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
  last_period: string = ""
  start_date: string = ""
  end_date: string = ""

  constructor(private npmDownloadCount: NPMDownloadCount) { }

  ngOnInit() {
    this.packages.forEach(packageName => {
      this.npmDownloadCount
        .setPackageName(packageName)
        .setStartDate(new Date('2023-06-28'))
        .setEndDate(new Date('2023-06-28'))
        .fetch()
        .subscribe((data) => {
          console.count();
          console.log(data);

          this.downloads_count.push(data)
        })
    })
  }

  onPeriodChange() {
    switch (this.last_period) {
      case "day": {
        const today = new Date()
        today.setDate(today.getDate() - 1)

        this.start_date = today.toISOString().split('T')[0]
        this.end_date = today.toISOString().split('T')[0]
      } break;

      case "week": {
        const today = new Date()
        const lastWeek = new Date(today)
        lastWeek.setDate(today.getDate() - 7)
        today.setDate(today.getDate() - 1)

        this.start_date = lastWeek.toISOString().split('T')[0]
        this.end_date = today.toISOString().split('T')[0]
      } break;

      case "month": {
        const today = new Date()
        const last30Days = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

        const year = last30Days.getFullYear()
        const month = String(last30Days.getMonth() + 1).padStart(2, '0')
        const day = String(last30Days.getDate()).padStart(2, '0')
        today.setDate(today.getDate() - 1)

        this.start_date = `${year}-${month}-${day}`
        this.end_date = today.toISOString().split('T')[0]
      } break;
    }
  }
}
