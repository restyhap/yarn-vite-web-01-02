#!/bin/bash
###
 # @Author: resty restyhap@hotmail.com
 # @Date: 2025-04-01 17:27:15
 # @LastEditors: resty restyhap@hotmail.com
 # @LastEditTime: 2025-04-02 15:36:03
 # @FilePath: /yarn-vite-web-01-02/deploy.sh
 # @Description: 项目部署脚本
### 

# 设置字符编码
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8

# 不显示执行的命令
set +x

# 配置信息
SERVER_IP="47.93.189.219"
SERVER_USER="root"
DEPLOY_PATH="/home/dist"
BACKUP_DIR="/home/dist_backups"

# 日志函数
log_info() {
  echo -e "\033[1;34m🔄 $1\033[0m"
}

log_success() {
  echo -e "\033[1;32m✅ $1\033[0m"
}

log_error() {
  echo -e "\033[1;31m❌ $1\033[0m"
}

# 解析命令行参数
MODE="prod"  # 默认为生产模式
while [[ "$#" -gt 0 ]]; do
    case $1 in
        -d|--dev) MODE="dev" ;;  # 开发模式
        *) log_error "未知参数: $1"; exit 1 ;;
    esac
    shift
done

if [ "$MODE" = "dev" ]; then
    log_info "启动开发服务器..."
    npm run dev
else
    # 生产模式部署
    log_info "开始部署流程..."
    
    # 清理旧的dist目录
    if [ -d "dist" ]; then
        log_info "清理旧的构建文件..."
        rm -rf dist
    fi
    
    log_info "开始构建项目..."
    
    # 运行构建命令
    npm run build > /tmp/build.log 2>&1
    BUILD_STATUS=$?

    # 检查构建是否成功
    if [ $BUILD_STATUS -ne 0 ]; then
        log_error "构建失败! 详情请查看 /tmp/build.log"
        exit 1
    fi
    
    # 获取最终构建大小
    final_build_size=$(du -sk "dist" 2>/dev/null | cut -f1)
    
    log_success "项目构建成功 (最终大小: $(echo "scale=1; $final_build_size/1024" | bc) MB)"
    
    log_info "正在部署到服务器..."
    # 创建备份目录并备份当前版本
    BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
    log_info "正在备份当前版本到 $BACKUP_DIR/dist_$BACKUP_DATE..."
    ssh $SERVER_USER@$SERVER_IP "mkdir -p $BACKUP_DIR && cp -r $DEPLOY_PATH $BACKUP_DIR/dist_$BACKUP_DATE" > /dev/null 2>&1
    
    # 保存 upload 目录到临时位置
    log_info "正在保存 upload 目录..."
    ssh $SERVER_USER@$SERVER_IP "if [ -d \"$DEPLOY_PATH/upload\" ]; then cp -r $DEPLOY_PATH/upload /tmp/upload_backup; fi" > /dev/null 2>&1
    
    # 清空目标目录
    log_info "正在清空目标目录..."
    ssh $SERVER_USER@$SERVER_IP "rm -rf $DEPLOY_PATH/*" > /dev/null 2>&1
    
    # 上传新文件
    log_info "正在上传新文件..."
    scp -r dist/* $SERVER_USER@$SERVER_IP:$DEPLOY_PATH/ > /dev/null 2>&1
    DEPLOY_STATUS=$?

    # 检查部署是否成功
    if [ $DEPLOY_STATUS -ne 0 ]; then
        log_error "部署失败!"
        exit 1
    fi
    log_success "文件上传完成"
    
    # 恢复 upload 目录
    log_info "正在恢复 upload 目录..."
    ssh $SERVER_USER@$SERVER_IP "if [ -d \"/tmp/upload_backup\" ]; then mkdir -p $DEPLOY_PATH/upload && cp -r /tmp/upload_backup/* $DEPLOY_PATH/upload/ && rm -rf /tmp/upload_backup; else mkdir -p $DEPLOY_PATH/upload; fi" > /dev/null 2>&1

    log_info "正在更新 Nginx 配置..."
    NGINX_OUTPUT=$(ssh $SERVER_USER@$SERVER_IP "nginx -t && nginx -s reload" 2>&1)
    NGINX_STATUS=$?
    
    if [ $NGINX_STATUS -ne 0 ]; then
        log_error "Nginx 配置更新失败!"
        echo "$NGINX_OUTPUT"
        exit 1
    fi
    log_success "Nginx 配置更新成功"

    log_success "部署完成! 新版本已成功上线"
fi