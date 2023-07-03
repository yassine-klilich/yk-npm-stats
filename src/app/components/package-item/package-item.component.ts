import { Component, Input, ViewChild, ElementRef } from '@angular/core'
import { IPackage } from 'src/app/model/IPackage'
import { Chart } from 'chart.js'

@Component({
  selector: 'app-package-item',
  templateUrl: './package-item.component.html',
  styleUrls: ['./package-item.component.css'],
})
export class PackageItemComponent {
  @Input() package!: IPackage
  @ViewChild("chartCanvas") chartCanvas!: ElementRef<HTMLCanvasElement>
  chart!: Chart
  issues: number = 0
  pulls: number = 0
  hideGithubData: boolean = true

  async ngOnInit() {
    const [pulls, issues] = await Promise.all([
      this.fetchApi(this.package.name, "pulls"),
      this.fetchApi(this.package.name, "issues"),
    ])
    if (pulls != null && issues != null) {
      this.pulls = pulls
      this.issues = issues - pulls
      this.hideGithubData = false
    }
    else {
      this.hideGithubData = true
    }
  }

  ngAfterViewInit() {
    const days: Array<string> = this.package.downloads.map((item) => item.day)
    const downloads: Array<number> = this.package.downloads.map(
      (item) => item.downloads
    )

    this.chart = new Chart(this.chartCanvas.nativeElement, {
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

  private async fetchApi(repo: string, resource: string) {
    try {
      const res = await window.fetch(`https://api.github.com/repos/yassine-klilich/${repo}/${resource}?per_page=1`)

      if (res.ok == false) {
        return
      }

      const link = res.headers.get('Link')
      const count = this.parseLastPage(link)
      if (link != null) return count
      const body = await res.json()
      return body.length
    } catch (e) {
      return null
    }
  }

  private parseLastPage(linkHeader: string | null) {
    if (!linkHeader) return null
    const links = linkHeader.split(',')
    const lastLink = links.find(link => link.match(/rel="last"/))
    if (lastLink == null) return 0
    const d = lastLink.match(/[^_]page=(\d+)/)
    if (d == null) return 0
    return Number(d[1])
  }
}
