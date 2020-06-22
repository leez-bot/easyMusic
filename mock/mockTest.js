const Mock = require('mockjs');
const { Random } = Mock
const gradeName = ['小学一年级', '小学二年级', '小学三年级', '小学四年级','小学五年级','小学六年级','初中一年级','初中二年级','初中三年级','高中一年级','高中二年级','高中三年级']
const className = ['1班','2班','3班','4班','5班','6班','7班','8班','9班','10班','11班','12班','13班','14班','15班','16班','17班','18班','19班','20班','21班','22班','23班','24班','25班','26班','27班']
const courseName = ['语文', '数学', '英语', '政治', '历史', '地理', '物理', '化学', '生物', '自然与科学', '思想与品德', '体育', '音乐', '绘画', '劳动', '马克思与列宁主义']

Random.extend({
  getGradeName: function(date) {
    return this.pick(gradeName)
  },
  getClassName: function(date) {
    return this.pick(className)
  },
  getCourseName: function(date) {
    return this.pick(courseName)
  },
})

// 学校 开始
const testMock = {
  // 年级列表
  'GET /master/main': function(req, res) {
    res.json(
      Mock.mock({
        code: 200,
        message: 'success',
        'data|0-20': [
          {
            grade: '@natural(1, 100000)',
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
module.exports = { ...testMock };