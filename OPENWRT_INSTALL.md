# OpenWrt 安装指南

## 前置条件
1. 确保OpenWrt系统已安装Node.js
```bash
opkg update
opkg install node
```

## 安装步骤

1. 在OpenWrt上创建程序目录：
```bash
mkdir -p /usr/local/srun_login
```

2. 复制程序文件到OpenWrt：
```bash
# 复制主程序
cp login.js /usr/local/srun_login/
# 复制依赖项
cp -r node_modules /usr/local/srun_login/
```

3. 创建服务脚本：
```bash
cp openwrt/etc/init.d/srun_login /etc/init.d/
chmod +x /etc/init.d/srun_login
```

4. 配置文件设置：
```bash
mkdir -p /etc
touch /etc/srun_login.conf
```

5. 启用并启动服务：
```bash
/etc/init.d/srun_login enable
/etc/init.d/srun_login start
```

## 查看服务状态
```bash
# 检查服务状态
/etc/init.d/srun_login status

# 查看日志
logread | grep srun_login
```

## 故障排除

1. 如果服务无法启动，检查：
   - Node.js 是否正确安装：`node --version`
   - 配置文件权限：`ls -l /etc/srun_login.conf`
   - 程序文件权限：`ls -l /usr/local/srun_login/`
   - 系统日志：`logread | grep srun_login`

2. 如果遇到权限问题：
```bash
chmod -R 755 /usr/local/srun_login
chmod 644 /etc/srun_login.conf
```