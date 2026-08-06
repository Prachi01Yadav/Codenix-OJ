package com.algou.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompileResponse {
    private String stdout;
    private String stderr;
    private int exitCode;
    private int timeMs;
    private int memoryKb;
}
