package com.example.espaciodigital2026;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;



@SpringBootApplication
@EntityScan("com.example.espaciodigital2026.entity")
@EnableJpaRepositories("com.example.espaciodigital2026.repository")
@ComponentScan("com.example.espaciodigital2026")
public class Espaciodigital2026Application {
    public static void main(String[] args) {
        SpringApplication.run(Espaciodigital2026Application.class, args);
        
    }
}
