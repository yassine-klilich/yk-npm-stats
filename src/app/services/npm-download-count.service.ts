import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class NPMDownloadCount {

  private npmDownloadURL: string = "https://api.npmjs.org/downloads/"
  private by_range: boolean = false
  private package_name: string = ""
  private start_date: string = ""
  private end_date: string = ""

  constructor(private http: HttpClient) { }

  setRange(by_range: boolean): NPMDownloadCount {
    this.by_range = by_range
    return this
  }

  setStartDate(start_date: Date): NPMDownloadCount {
    this.start_date = this.formatDate(start_date)
    return this
  }

  setEndDate(end_date: Date): NPMDownloadCount {
    this.end_date = this.formatDate(end_date)
    return this
  }

  setPackageName(name: string): NPMDownloadCount {
    this.package_name = name
    return this
  }

  clear(): void {
    this.by_range = false
    this.start_date = ""
    this.end_date = ""
    this.package_name = ""
  }

  fetch(): Observable<any> {
    const range = (this.by_range ? "range" : "point")
    const start_date = this.start_date
    const end_date = this.end_date
    const package_name = this.package_name

    this.clear()

    return this.http.get(`${this.npmDownloadURL}${range}/${start_date}:${end_date}/${package_name}`)
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }
}

