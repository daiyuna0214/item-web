<template>
  <div class="post-comment">
      <div class="post-comment">
    <van-field
      class="post-field"
      :value="value"
      @input="onInput"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="优质评论将会被优先展示"
      show-word-limit
    />
    <van-button
      class="post-btn"
      type="primary"
      size="small"
      @click="$emit('click-post')"
    >发布</van-button>
  </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      required: 'true'
    }
  },
  data () {
    return {
      message: ''
    }
  },
  methods: {
    onInput (value) {
      this.$emit('input', value)
    }
  }
}
</script>

<style scoped lang="less">
.post-comment {
  display: flex;
  padding: 15px;
  align-items: center;
  .post-field {
    background: #f5f7f9;
  }
  .post-btn {
    margin-left: 10px;
  }
}
</style>
