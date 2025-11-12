export interface SeriesBrief {
  seriesId: string | number
  seriesName: string
  cover?: string
  updateTime?: string | number
  seriesDescription?: string
}

export interface SeriesWithVideos extends SeriesBrief {
  videoInfoList: any[]
}

export interface SeriesDetailResult {
  videoSeries: SeriesBrief
  seriesVideoList: any[]
}

