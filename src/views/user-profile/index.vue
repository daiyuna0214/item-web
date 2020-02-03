<template>
    <div class="user-profile">
    <van-nav-bar
      title="编辑资料"
      left-arrow
      @click-left="$router.back()"
    />

    <van-cell-group>
      <van-cell is-link title="头像" @click="selectFile">
        <van-image
          class="avatar"
          round
          :src="list.photo"
        />
      </van-cell>
      <!-- change事件是原生的dom事件 -->
      <input type="file" hidden ref="file" @change="fileChange">
      <van-cell is-link title="昵称" :value="list.name" @click="isEditNameShow=true" />
      <van-cell is-link title="介绍" />
      <van-cell is-link title="性别" :value="list.gender===0?'女':'男'"
      @click="isEditGenderShow=true"/>
      <van-cell is-link title="生日" :value="list.birthday"
      @click="isEditBirthdayShow=true"
       />
    </van-cell-group>

    <!-- 头像预览 -->
    <van-image-preview v-model="isPreviewShow" :images="images">
      <van-nav-bar
      slot="cover"
        left-text="取消"
        right-text="确定"
        @click-left="isPreviewShow=false"
        @click-right="onUpdateAvatar"
      />
    </van-image-preview>

    <!-- 编辑昵称 -->
    <van-popup
      v-model="isEditNameShow"
      position="bottom">
      <van-nav-bar
      title="编辑昵称"
        left-text="取消"
        right-text="确定"
        @click-left="isEditNameShow=false"
        @click-right="onUpdateName"
      />
      <!-- field组件里面有一个value事件，该事件接收一个参数：输入框的值
      在模板中$event表示事件参数，这是Vue本身提供的 -->
      <van-field
        :value="list.name"
        @input="inputName=$event"
        rows="2"
        autosize
        type="textarea"
        maxlength="20"
        placeholder="请输入昵称"
        show-word-limit
      />
    </van-popup>

    <!-- 编辑用户性别 -->
    <van-action-sheet
      v-model="isEditGenderShow"
      :actions="actions"
      cancel-text="取消"
      @cancel="isEditGenderShow=false"
      @select="onGenderSelect"
    />
    <!-- 编辑生日 -->
    <van-popup v-model="isEditBirthdayShow"
    position="bottom"
    >
    <van-datetime-picker
      :value="currentDate"
      type="date"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel='isEditBirthdayShow=false'
      @confirm='onUpdateBirthday'
    />
    </van-popup>
  </div>
</template>

<script>
import { getUserProfile, updateUserPhoto,
  updateUserProfile } from '../../api/user'
// import { ImagePreview } from 'vant'
import moment from 'moment'
export default {
  data () {
    return {
      list: {},
      isPreviewShow: false, // 头像预览图片是否显示
      images: [], // 预览的图片列表
      isEditNameShow: false, // 编辑昵称的弹层是否显示
      inputName: '', // 输入框里面的内容
      isEditGenderShow: false, // 编辑性别的弹框是否显示
      actions: [
        // name会显示出来，value是我们自己添加的
        { name: '男', value: 1 },
        { name: '女', value: 0 }
      ],
      isEditBirthdayShow: false,
      minDate: new Date(1970, 0, 1),
      maxDate: new Date()
      // currentDate: new Date()
    }
  },
  computed: {
    file () {
      // 这样写的目的是为了直接可以通过this.file访问到选择文件筐file
      return this.$refs['file']
    },
    currentDate () {
      // 把字符串格式的日期转换为js日期对象，设置给vant日期
      return new Date(this.list.birthday)
    }
  },
  methods: {
    // 获取用户资料
    async loadUserProfile () {
      const res = await getUserProfile()
      console.log(res)
      this.list = res.data.data
    },
    selectFile () {
      this.file.click()// 手动让这个筐添加点击
    },
    fileChange () {
      // 预览图片
      // 1,拿到file类型input选择文件对象
      const fileObj = this.file.files[0]
      // 2,使用window.URL.createObjectURL()得到文件数据
      const fileData = URL.createObjectURL(fileObj)
      // 上面这两个是原生js自带的
      // 3,将img的src=第二步的结果
      this.images = [fileData]
      this.isPreviewShow = true// 打开预览头像
      // ImagePreview({
      //   images: [fileData], // 预览图片列表
      //   // 关闭时提示
      //   onClose: this.savePhoto
      // })
    },

    async onUpdateAvatar () {
      try {
        const fileObj = this.file.files[0]
        await this.$dialog.confirm({
          title: '头像选择',
          message: '确认使用该图片作为头像吗'
        })
        // 如果确认，则请求上传
        this.$toast.loading({
          duration: 0, // 持续展示 toast
          message: '保存中...',
          forbidClick: true // 是否禁止背景点击
        })
        // 使用formData
        const fd = new FormData()
        fd.append('photo', fileObj)
        await updateUserPhoto(fd)
        // 更新视图
        this.list.photo = URL.createObjectURL(fileObj)
        this.$toast.success('保存成功')
        this.isPreviewShow = false
      } catch (error) {
        console.log(error)
        this.$toast.fail('保存失败')
      }
    },
    // filed:要修改的数据字段
    // value:数据值
    async updateUserProfile (field, value) {
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        message: '保存中...',
        forbidClick: true // 是否禁止背景点击
      })
      try {
        await updateUserProfile({
          [field]: value// 注意属性名使用中括号包裹，否则会被当成字符串
        })
        this.$toast.success('更新成功')
      } catch (error) {
        console.log(error)
        this.$toast.fail('更新失败')
      }
    },
    async onUpdateName () {
      // 1，请求提交表单
      await this.updateUserProfile('name', this.inputName)
      // 更新视图
      this.list.name = this.inputName
      this.isEditNameShow = false
    },
    async onGenderSelect (data) {
      // 请求提交
      await this.updateUserProfile('gender', data.value)
      // 更新视图
      this.list.gender = data.value
      this.isEditGenderShow = false
    },
    async onUpdateBirthday (value) {
      console.log(value)

      // 使用moment吧日期对象格式化为指定字符串格式
      const date = moment(value).format('YYYY-MM-DD')
      await this.updateUserProfile('birthday', date)
      // 更新数据
      this.list.birthday = date
      // 关闭弹层
      this.isEditBirthdayShow = false
    }
  },
  created () {
    this.loadUserProfile()
  }
}
</script>

<style scoped lang="less">
.user-profile {
  .avatar {
    width: 30px;
    height: 30px;
  }
  /deep/.van-image-preview__cover{
    top:unset;
    left: 0;
    right: 0;
    bottom: 0;
  .van-nav-bar{
    background: #000;
  }
  }
}
.van-popup{
  /deep/.van-nav-bar{
    background: #fff;
    .van-nav-bar__title {
      color: #323233
    }
  }
}
</style>
