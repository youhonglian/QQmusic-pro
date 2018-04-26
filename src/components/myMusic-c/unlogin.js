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
    methods: {
      signIn() {
        alert("dsfsdf")
      },
      open() {
        const h = this.$createElement;
         this.$notify.info({
          message: '用户名或密码错误',
          showClose: false
        });
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {                 
        if (valid) {
          let that = this        
          this.axios.get(`http://127.0.0.1:3000/login/cellphone?phone=${this.ruleForm2.username}&password=${this.ruleForm2.password}`).then((response) => {
              console.log(response)
              if(response.data.code == 200 && response.data.loginType == 1) {
                sessionStorage.username = this.ruleForm2.username
                alert("登录成功")
                } else {
                  that.open()
                }
             }).catch((error) => {
                that.open()                
             })   
        } else {
            that.open()
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();   
      }
    }
    
}