export type VideoSeriesLoadRequest = {
  userId?: string | number | null
}

export type VideoSeriesItem = {
  seriesId: string | null
  seriesName: string | null
  seriesDescription: string | null
  sort: number | null
  videoCount: number | null
  cover: string | null
  createTime: string
  updateTime: string | null
}

export type VideoSeriesLoadResponse = {
  list: VideoSeriesItem[] | null
}

export type GetVideoSeriesDetailRequest = {
  seriesId: string | number
}

export type VideoSeriesDetail = {
  seriesId: string | null
  userId: string | null
  seriesName: string | null
  seriesDescription: string | null
  sort: number | null
  updateTime: string | null
}

export type SeriesVideoItem = {
  videoId: string | null
  videoCover: string | null
  videoName: string | null
  playCount: number | null
  createTime: string | null
}

export type GetVideoSeriesDetailResponse = {
  videoSeries: VideoSeriesDetail | null
  seriesVideoList: SeriesVideoItem[] | null
}

export type GetAllSeriesVideoListRequest = {
  seriesId?: string | number | null
}

export type SeriesVideoBrief = {
  videoId: string | null
  videoCover: string | null
  videoName: string | null
  playCount: number | null
  createTime: string
}

export type GetAllSeriesVideoListResponse = {
  list: SeriesVideoBrief[] | null
}

export type SaveVideoSeriesRequest = {
  seriesId?: string | number | null
  seriesName: string
  seriesDescription?: string | null
  videoIds?: string | null
}

export type SaveVideoSeriesResponse = {
  seriesId: string | number | null
}

export type LoadVideoSeriesWithVideoRequest = {
  userId?: string | number | null
}

export type VideoSeriesWithVideosItem = {
  seriesId: string | null
  seriesName: string | null
  seriesDescription: string | null
  sort: number | null
  videoInfoList: VideoInfoItem[] | null
}

export type VideoInfoItem = {
  videoId: string | null
  videoCover: string | null
  videoName: string | null
  playCount: number | null
}

export type LoadVideoSeriesWithVideoResponse = {
  list: VideoSeriesWithVideosItem[] | null
}

export type SaveSeriesVideoRequest = {
  seriesId: string | number
  videoIds: string
}

export type DeleteSeriesVideoRequest = {
  seriesId: string | number
  videoId: string | number
}

export type DeleteVideoSeriesRequest = {
  seriesId: string | number
}

export type ChangeVideoSeriesSortRequest = {
  seriesIds: string
}
