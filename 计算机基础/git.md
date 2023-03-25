# Git 学习笔记

## 一、配置SHH keys

**在管理Git项目上，有两种克隆到本地的方法。**

- 直接使用https url克隆到本地
- 使用SSH url克隆到本地

**这两种方式的主要区别在于：**

- 使用https url对初学者来说会比较方便，复制https url然后到git Bash里面直接用clone命令克隆到本地就好了，但是每次fetch和push代码都需要输入账号和密码，这也是https方式的麻烦之处。
- 使用SSH url需要在只用之前先配置和添加好SSH key。每次fetch和push代码都不需要输入账号和密码，如果你想要每次都输入账号密码才能进行fetch和push也可以另外进行设置。

### 1、检查你电脑上是否有SSH Key

在`Git Bash` 中输入 `~/.ssh` 或者用`~/.ssh ls` 进行查看。

如果有则可以直接使用上面的 **id_rsa.pub** 文件中的秘钥。



### 2、创建SSH Key

**如果你电脑上有了，你就可以直接跳过这一步**

在Git Bash中输入

```bash
ssh-keygen -t rsa -C "你的邮箱"
```

然后就会显示这两行：
**Generating public/private rsa key pair.
Enter file in which to save the key (/c/Users/16627/.ssh/id_rsa):**

这个是设置秘钥保存的文件名，直接回车即可。然后会让你设置密码，这个可以不设置，直接回车。

 ### 3、添加SSH Key 到 GitHub或者Git中

讲刚刚生成的 **id_rsa.pub**文件复制上去即可。



### 4、测试一下SSH Key

在git Bash 中输入以下代码
`$ ssh -T git@github.com`  或者 `$ ssh -T git@gitee.com`  

显示以下信息表示成功了

​     `Hi Song! You've successfully authenticated, but GITEE.COM does not provide shell access.                                                                        `    

显示  `access denied`表示配置失败。





