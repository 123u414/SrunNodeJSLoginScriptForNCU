# SrunNodeJSLoginScriptForNCU

 NCU深澜校园网node.js登录脚本

## 使用方法

### TL;DR

```bash
   git clone https://github.com/123u414/SrunNodeJSLoginScriptForNCU.git
   cd ./SrunNodeJSLoginScriptForNCU
   npm install
```

在脚本里修改账号密码，然后

```bash
   node ./login.js
```

### 详细步骤

1. 下载安装node.js；
2. 下载本项目；
3. 在项目目录下打开命令行；
4. 执行命令`npm install`；
5. 打开`login.js`，修改账号密码并保存；
6. 执行命令`node ./login.js`，程序会输出类似如下信息，其他信息不重要就省略了，重点关注下面这几个是不是`ok`，如果是`ok`就说明登录成功了。

   ```log
   获取到初始化信息: {
    ...
    error: 'ok',
    error_msg: '',
    ...
    res: 'ok',
    ...
   }
   登录结果: {
    ...
    error: 'ok',
    error_msg: '',
    ...
    res: 'ok',
    ...
    suc_msg: 'login_ok',
    ..
   }
    ```

## 其他

本项目使用Apache-2.0协议开源，欢迎使用和修改。
如果有bug或者建议，欢迎提issue。
目前是一个初步版本，适用于登陆IP为222.204.3.154的寝室网络（NCU-5G&NCU-2.4G），其他网络暂未测试，蹲一个大佬继续适配完善。

未来计划写个bash把脚本注册到系统服务，实现开机自启，自动登录等功能。同时学习一下luci的开发，做一个WRT能用的图形化配置界面。

写这个玩意的初衷时玩WRT时候在网上闲逛，发现了一个开源的校园网登录脚本，但是不适配自己学校的登陆页面，遂自己动手丰衣足食。感谢[Srun_Openwrt](https://github.com/NahidaBuer/Srun_Openwrt)、[BitSrunLoginGo](https://github.com/Mmx233/BitSrunLoginGo)等项目的启发。

项目登录原理主要靠复制粘贴校园网登陆界面的js代码，感谢原作者的辛苦付出XD。
