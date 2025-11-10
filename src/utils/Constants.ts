export const ACTION_TYPE = {
    UNKNOW: {
        value: 0,
        desc: "未知行为"
    },
    COMMENT_LIKE: {
        value: 1,
        desc: "评论喜欢点赞"
    },
    COMMENT_HATE: {
        value: 2,
        desc: "讨厌评论"
    },
    VIDEO_LIKE: {
        value: 3,
        desc: "视频点赞"
    },
    VIDEO_COLLECT: {
        value: 4,
        desc: "视频收藏"
    },
    VIDEO_COIN: {
        value: 5,
        desc: "视频投币"
    }
} as const

export type ActionTypeKey = keyof typeof ACTION_TYPE
export type ActionTypeItem = typeof ACTION_TYPE[ActionTypeKey]
