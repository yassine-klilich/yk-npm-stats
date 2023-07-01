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
  chart!: Chart

  ngAfterViewInit() {
    const days: Array<string> = this.package.downloads.map((item) => item.day)
    const downloads: Array<number> = this.package.downloads.map(
      (item) => item.downloads
    )

    this.chart = new Chart(`package-${this.package.name}`, {
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
        spanGaps: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
            },
          },
        },
        plugins: {
          tooltip: {
            intersect: false,
            mode: 'index',
            displayColors: false,
            callbacks: {
              label: (tooltipItem) => {
                return `${tooltipItem.formattedValue} downloads`
              },
            },
          },
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: `Total downloads: ${this.package.countDownloads}`,
          },
          zoom: {
            pan: {
              enabled: true,
              mode: 'x',
              modifierKey: 'ctrl',
            },
            zoom: {
              drag: {
                enabled: true,
              },
              mode: 'x',
            },
          },
        },
      },
    })
  }

  onClickResetZoom() {
    this.chart.resetZoom()
  }
}
