const Mock = require('mockjs');

// 学校 开始
const musicSearchListMock = {
  // 年级列表
  'GET /master/main': function(req, res) {
    res.json(
      Mock.mock({
        count: '200',
        head: null,
        'list|0-20': [
          {
            gqm: '@natural(1, 100000)',
            'gradeType|1': ['小学', '初中', '高中'],
            gradeName: '@getGradeName()',
            gradeIndex: '@natural(0, 1000)',
            late: '@natural(0, 10000)',
            leaveEarly: '@natural(0, 1000)',
            absence: '@natural(0, 1000)'
          }
        ]
      })
    )
  }
};
module.exports = { ...musicSearchListMock };