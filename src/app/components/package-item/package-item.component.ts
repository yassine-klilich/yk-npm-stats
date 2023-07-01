import { Component, Input } from '@angular/core'
import { IPackage } from 'src/app/model/IPackage'
import { Chart } from 'chart.js'

@Component({
  selector: 'app-package-item',
  templateUrl: './package-item.component.html',
  styleUrls: ['./package-item.component.css'],
})
export class PackageItemComponent {
  @Input() package!: IPackage

  ngAfterViewInit() {
    const days: Array<string> = this.package.downloads.map((item) => item.day)
    const downloads: Array<number> = this.package.downloads.map(
      (item) => item.downloads
    )

    new Chart(`package-${this.package.name}`, {
      type: 'line',
      data: {
        labels: days,
        datasets: [
          {
            data: downloads,
            backgroundColor: 'red',
            borderColor: 'red',
            borderWidth: 2,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: `Total downloads: ${this.package.countDownloads}`,
          },
        },
      },
    })
  }
}
