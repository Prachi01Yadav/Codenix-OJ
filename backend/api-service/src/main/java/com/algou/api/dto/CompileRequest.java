package com.algou.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompileRequest {
    private String code;
    private String input;
    private String language;  // CPP, JAVA, PYTHON, JAVASCRIPT, GO, RUST
}
