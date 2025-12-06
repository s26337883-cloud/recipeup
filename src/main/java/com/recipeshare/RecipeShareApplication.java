package com.recipeshare;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class RecipeShareApplication {
    public static void main(String[] args) {
        SpringApplication.run(RecipeShareApplication.class, args);
    }
}

