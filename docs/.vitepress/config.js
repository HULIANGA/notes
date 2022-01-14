module.exports = {
    title: 'huliang的资料',
    description: '资料记录',
    lang: 'zh-CN',
    base: '/note/',
    markdown: {
        lineNumbers: true
    },
    // 主题配置
    themeConfig: {
        //   头部导航
        nav: [
            { text: '首页', link: '/' },
            { text: '找工作', link: '/find-work/' },
            { text: '微前端', link: '/micro-frontend/' }
        ],
        //   侧边导航
        sidebar: [
            {
                text: '找工作', link: '/find-work/', children: [
                    {
                        text: '基础知识', link: '/find-work/concept/'
                    },
                    {
                        text: '代码和算法', link: '/find-work/code/'
                    },
                    {
                        text: '项目管理', link: '/find-work/manage/'
                    }
                ]
            },
            {
                text: '微前端', link: '/micro-frontend/', children: [
                    {
                        text: 'qiankun', link: '/micro-frontend/qiankun/', children: [
                            {
                                text: '子应用接入', link: '/micro-frontend/qiankun/sub-app'
                            },
                            {
                                text: '主应用接入', link: '/micro-frontend/qiankun/main-app'
                            },
                            {
                                text: '其他问题', link: '/micro-frontend/qiankun/question'
                            }
                        ]
                    },
                    {
                        text: 'micro-app', link: '/micro-frontend/micro-app/'
                    },
                    {
                        text: 'garfish', link: '/micro-frontend/garfish/'
                    },
                    {
                        text: 'webpack5', link: '/micro-frontend/webpack5/'
                    },
                    {
                        text: 'emp', link: '/micro-frontend/emp/'
                    }
                ]
            }
        ]
    }
}