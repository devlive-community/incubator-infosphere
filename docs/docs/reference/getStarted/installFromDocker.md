---
title: 在 Docker 中部署
---

InfoSphere 项目提供 [devlive-community/infosphere](https://hub.docker.com/r/devlive-community/infosphere) 包含 InfoSphere 服务器和默认配置的 Docker 映像。Docker 映像发布到 Docker Hub，可以与 Docker 运行时等一起使用。

### 运行容器

要在 Docker 中运行 InfoSphere，您必须在计算机上安装 Docker 引擎。您可以从 [Docker website](https://docker.com/), 或使用操作系统的打包系统。

使用 docker 命令从 [devlive-community/infosphere](https://hub.docker.com/r/devlive-community/infosphere) 图像。为其分配 `infosphere` 名称，以便以后更容易引用它。在后台运行它，并将默认 InfoSphere 端口（即 `9099`）从容器内部映射到工作站上的端口 `9099`。

```bash
docker run -d -p 9099:9099 --name infosphere devlive-community/infosphere
```

如果不指定容器映像标记，则默认为 `latest` ，但可以使用许多已发布的 InfoSphere 版本，例如 `devlive-community/infosphere:1.5.0`。

!!! danger

    ```bash
    docker run -d -p 9099:9099 -v /root/application.properties:/opt/app/infosphere/configure/application.properties --name infosphere devlive-community/infosphere
    ```

    假设您的配置文件在 `/root/application.properties`，如需要其他路径请指定绝对路径即可。

运行 `docker ps` 以查看在后台运行的所有容器。

```bash
-> % docker ps
CONTAINER ID   IMAGE                    COMMAND               CREATED      STATUS          PORTS                    NAMES
2096fba19e2a   infosphere:latest        "sh ./bin/debug.sh"   5 days ago   Up 14 seconds   0.0.0.0:9099->9099/tcp   infosphere
```

### 清理

您可以使用 `docker stop infosphere` 和 `docker start infosphere` 命令停止和启动容器。要完全删除已停止的容器，请运行 `docker rm infosphere`。
