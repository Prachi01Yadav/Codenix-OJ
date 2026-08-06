package com.algou.api.service;

import com.algou.api.config.RedisConfig;
import com.algou.api.dto.SubmissionMessageDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubmissionProducer {

    private final RedisTemplate<String, Object> redisTemplate;

    public void sendSubmission(SubmissionMessageDTO message) {
        log.info("Publishing submission message for user {}", message.getUserEmail());
        redisTemplate.convertAndSend(RedisConfig.SUBMISSION_TOPIC, message);
    }
}
