<template>
  <div class="mod_profile_unlogin">
    <div class="section_inner">
      <h2 class="profile_unlogin__tit">
        <div class="icon_txt">听我喜欢听的歌</div>
      </h2>
      <div class="profile_unlogin__desc"></div>

      <el-button type="text" @click="dialogFormVisible = true" class="mod_btn_green profile_unlogin__btn js_login" v-if="!isLogin">立即登录</el-button>

      <el-dialog title="立即登录" :visible.sync="dialogFormVisible">
        
         <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
            <el-form-item label="用户名" prop="username" >
                <el-input v-model.number="ruleForm2.username" placeholder="请输入账号"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="ruleForm2.password" auto-complete="off"  placeholder="请输入密码" @keyup.enter.native="submitForm('ruleForm2')"></el-input>
            </el-form-item>                           
            <el-form-item class="el-form-item-buttom">
                <el-button type="primary" @click="submitForm('ruleForm2')" style="backgroundColor:#31c27c">登录</el-button>
                <el-button @click="resetForm('ruleForm2')">重置</el-button>
            </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
    data() {
      var checkName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('用户名不能为空'));
        }
        callback();
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } 
       callback();
       
      };
      return {
        dialogFormVisible: false,
        ruleForm2: {
          username: '',
          password: ''
        },
        rules2: {
          username: [
            { validator: checkName, trigger: 'blur' }
          ],
          password: [
            { validator: validatePass, trigger: 'blur' }
          ]
        }
      };
    },
    computed: {
      isLogin() {
        return this.$store.state.isLogin
      }
    },
    methods: {
      fail() {
        const h = this.$createElement;
         this.$notify.info({
          message: '用户名或密码错误',
          showClose: false
        });
      },
      success() {
        const h = this.$createElement;
         this.$notify.success({
          message: '登录成功',
          showClose: false
        });
      },
      info() {
        const h = this.$createElement;
         this.$notify.info({
          message: '请先登录',
          showClose: false
        });
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {                 
        if (valid) {
          let that = this        
          this.axios.get(`http://127.0.0.1:3000/login/cellphone?phone=${this.ruleForm2.username}&password=${this.ruleForm2.password}`).then((response) => {
              if(response.data.code == 200 && response.data.loginType == 1) {
                this.$store.commit('save_nickname', response.data.profile.nickname)
                this.$store.commit('save_avatarUrl', response.data.profile.avatarUrl)
                this.$store.commit('save_userId', response.data.account.id)
                // console.log('用户ID'+this.$store.state.user.userId)
                sessionStorage.username = this.ruleForm2.username
                console.log(this.$store.state.user.nickname)
                console.log(this.$store.state.user.avatarUrl)
                this.$store.state.isLogin = true
                console.log(this.$store.state.isLogin)
                this.dialogFormVisible = false
                that.success()
                // this.$router.push({path: '/myMusic/'})
                } else {
                  that.fail()                  
                }
             }).catch((error) => {
                that.fail()        
             })   
        } else {
            that.fail()
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();   
      }
    }
    
}
</script>

<style lang="scss">
@import "./myMusic-c/unlogin.scss";
</style>
