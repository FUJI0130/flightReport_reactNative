# Raspberry Pi上のプロジェクトディレクトリ
REMOTE_PROJECT_DIR=/home/pi/workspace/flightReport_reactNative
REMOTE_USER=fuji0130
REMOTE_HOST=192.168.9.14
REMOTE_PATH=$(REMOTE_USER)@$(REMOTE_HOST):$(REMOTE_PROJECT_DIR)

# ホストPC上のプロジェクトディレクトリ
LOCAL_PROJECT_DIR=/home/fuji0130/workspace/flightReport_reactNative
LOCAL_USER=fuji0130
LOCAL_HOST=192.168.9.10
LOCAL_PATH=$(LOCAL_USER)@$(LOCAL_HOST):$(LOCAL_PROJECT_DIR)

# SSHパスワード
SSH_PASS=gastorten0130

# Androidのビルド
build-android:
	@if [ `uname -m` = "aarch64" ]; then \
		echo "Error: Build command cannot be run on Raspberry Pi. Please run this on your host PC."; \
		exit 1; \
	else \
		npx react-native run-android; \
	fi

# Metro Bundlerの起動
start-metro:
	npx react-native start

# プロジェクトの同期（Raspberry Pi -> ホストPC）
sync:
	@if [ `uname -m` = "aarch64" ]; then \
		echo "Raspberry PiからホストPCへの同期中..."; \
		sshpass -p $(SSH_PASS) rsync -avz --progress --exclude 'node_modules' --exclude 'android' $(REMOTE_PROJECT_DIR)/ $(LOCAL_PATH); \
		echo "rsyncコマンドが終了しました"; \
		sshpass -p $(SSH_PASS) ssh $(LOCAL_USER)@$(LOCAL_HOST) 'ls -la $(LOCAL_PROJECT_DIR)'; \
	else \
		rsync -avz --progress --exclude 'node_modules' --exclude 'android' $(LOCAL_PROJECT_DIR)/ $(REMOTE_PATH); \
	fi

# GitHubにプッシュ
push:
	@if [ -z "$(filter-out $@,$(MAKECMDGOALS))" ]; then \
		echo "Error: Commit message is required. Use 'make push \"your commit message\"'"; \
		exit 1; \
	fi; \
	git add .; \
	git commit -m "$(filter-out $@,$(MAKECMDGOALS))"; \
	git push;

# デバイスの確認
devices:
	adb devices

.PHONY: build-android start-metro sync push devices

