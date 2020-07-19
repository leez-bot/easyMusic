<template>
  <Modal v-model="infoShow" :closable="false" :mask-closable="false" class="modal-info">
    <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>使用须知</span>
    </p>
    <div class="content-wrapper">
			<div class="content-item">
				<div class="item-title"><Icon type="ios-alert-outline" />&nbsp;免责声明</div>
				<div class="item-detail">
					本站所有音乐资源均来自互联网，本站不修改音乐文件，不提供任何存储和运营，仅作学习交流使用，请勿用于任何商业用途。如有侵权请联系876733271@qq.com，本人会尽快处理。
				</div>
			</div>
			<div class="content-item">
				<div class="item-title"><Icon type="ios-help-circle-outline" />&nbsp;关于本站</div>
				<div class="qa-item" v-for="(item, index) in qaList" :key='index'>
					<div class="question">{{item.title}}</div>
					<div class="answer">{{ item.answer }}</div>
				</div>
			</div>
    </div>
    <div slot="footer">
        <Button type="primary" size="large" long @click="hideInfo">知道了</Button>
    </div>
</Modal>
</template>

<script>
export default {
	props: {
		infoShow: {
			type: Boolean,
			default: false
		}
	},
  data() {
    return {
			qaList: [
				{
					title: '本站用途',
					answer: '本站用于在线搜、听网络音乐。'
				},
				{
					title: '界面太丑，会优化么',
					answer: '鉴于没有专业UI设计，故暂只保证功能正常，如果你愿意重新设计一下该APP，欢迎联系我，当然，是无偿的。'
				},
				{
					title: '功能太简单了，我想要XX,XX,XX',
					answer: '如果可以，我也想什么都做。但目前本应用全靠个人空闲维护，用爱发电。一切的资源都需要去网络上扒取和整合，再编写到应用中，在时间、精力允许的情况下，会持续维护。'
				},
				{
					title: '会有手机APP么',
					answer: '暂无此打算。当然了，如果钱到位。。。'
				},
				{
					title: '下一步计划',
					answer: '首先是对应用代码的重构；其次是对应用功能的扩充，包括但不限于歌词功能、歌手主题页功能、专辑主题页功能、歌单功能、播放条重写。。。工作量巨大。。。先这些吧。'
				},
				{
					title: '注意事项',
					answer: '本站为PC端应用，会尽量适配手机端。欢迎使用，如有意见和建议欢迎联系876733271@qq.com，切记请勿用于任何商业用途。'
				},
				{
					title: '其他',
					answer: '项目代码已经开源到github，欢迎大家fork/pr/star一键三连，如有任何问题也欢迎在github上提交issue，3Q。'
				}
			]
    };
  },
  methods: {
		hideInfo() {
			this.$emit('hideInfo')
		}
	},
  mounted() {}
};
</script>
<style lang="less">
.modal-info{
	text-align: left;
	.ivu-modal-body{
		height: 400px;
		overflow: auto;
	}
	.content-wrapper{
		.content-item{
			.item-title{
				font-size: 18px;
				font-weight: bold;
				border-bottom: 2px solid #ccc;
				margin-bottom: 10px
			}
			.item-detail{
				text-indent: 2em;
				margin-bottom: 10px;
			}
			.qa-item{
				.question{
					font-weight: bold;
					display: inline-block;
					border-bottom: 1px solid #f60;
					color: #f60;
					margin: 10px 0;
				}
				.answer{
					text-indent: 2em;
				}
			}
		}
	}
}
</style>