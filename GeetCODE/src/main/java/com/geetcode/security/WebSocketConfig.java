package com.geetcode.security;

import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import lombok.RequiredArgsConstructor;

@Configuration 
@RequiredArgsConstructor 
@EnableWebSocketMessageBroker 
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    
    @Override 
    public void registerStompEndpoints(StompEndpointRegistry registry){
        // 1. The door where React plugs in its Walkie-Talkie ("/ws")
        registry.addEndpoint("/ws").setAllowedOriginPatterns("*");    

    }
    /*A raw WebSocket is just an empty telephone wire — it doesn't have "channels" or "rooms" built in.
STOMP (Simple Text Oriented Messaging Protocol) is the walkie-talkie system on top of WebSockets that lets us
 have named channels like /topic/submissions/42 so User #42 only hears their verdict and not User #99's verdict! */

    @Override 
    public void configureMessageBroker(MessageBrokerRegistry registry){
        // 2. Turn on the speaker for all channels starting with "/topic" (e.g. "/topic/submissions/42")
        registry.enableSimpleBroker("/topic");
    }
}
