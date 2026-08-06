package com.algou.api.service;

import com.algou.api.dto.SubmissionMessageDTO;
import com.algou.api.dto.SubmissionResultDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubmissionConsumer implements MessageListener {

    private final ObjectMapper objectMapper;
    private final SubmissionProcessor submissionProcessor;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    public void onMessage(Message message, byte[] pattern) {
        try {
            SubmissionMessageDTO dto = objectMapper.readValue(message.getBody(), SubmissionMessageDTO.class);
            log.info("Received submission task from queue for problem: {}", dto.getProblemId());

            if (dto.isRunOnly()) {
                // TODO: Handle async run (if needed)
            } else {
                SubmissionResultDTO result = submissionProcessor.processSubmission(dto);
                
                // Push result to WebSocket topic: /topic/submissions/{submissionId}
                String destination = "/topic/submissions/" + result.getId();
                log.info("Pushing result to WebSocket topic {}", destination);
                messagingTemplate.convertAndSend(destination, result);
            }

        } catch (Exception e) {
            log.error("Error processing submission message", e);
        }
    }
}
