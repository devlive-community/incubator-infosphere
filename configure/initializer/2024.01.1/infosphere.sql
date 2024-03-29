USE `infosphere`;

CREATE TABLE `infosphere_tag`
(
    `id`          BIGINT(20)   NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code`        VARCHAR(100) NOT NULL COMMENT '标签编码',
    `name`        VARCHAR(255)          DEFAULT NULL COMMENT '标签名',
    `description` VARCHAR(255)          DEFAULT NULL COMMENT '标签描述',
    `create_time` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间'
) COMMENT '标签表';

CREATE TABLE `infosphere_tag_article_relation`
(
    `article_id` BIGINT,
    `tag_id`     BIGINT
) COMMENT '标签与文章关系表';

CREATE TABLE `infosphere_article_like`
(
    `id`          BIGINT AUTO_INCREMENT PRIMARY KEY,
    `ip_address`  VARCHAR(255),
    `user_agent`  VARCHAR(255),
    `create_time` DATETIME
) COMMENT '文章点赞表';

CREATE TABLE `infosphere_article_like_article_relation`
(
    `like_id`    BIGINT,
    `article_id` BIGINT
) COMMENT '文章点赞和文章关联表';

CREATE TABLE `infosphere_article_like_user_relation`
(
    `like_id` BIGINT,
    `user_id` BIGINT
) COMMENT '文章点赞和用户关联表';
