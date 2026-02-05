package com.bank.demo;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BankingAppApplication {

    // 🔥 JVM-level confirmation (runs before Spring)
    static {
        System.out.println("=== JVM STARTING ===");
    }

    public static void main(String[] args) {
        System.out.println("=== ENTERING main() ===");
        SpringApplication.run(BankingAppApplication.class, args);
        System.out.println("=== SpringApplication.run() returned ===");
        System.out.println("Core Banking Application Started...");
    }

    // 🔥 Confirms Spring context loaded successfully
    @PostConstruct
    public void init() {
        System.out.println("=== SPRING CONTEXT LOADED ===");
    }
}
