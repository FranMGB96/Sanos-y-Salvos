package com.sanosysalvos.userservice.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name = "users") @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @NotBlank @Column(nullable = false) private String nombre;
    @Email @NotBlank @Column(nullable = false, unique = true) private String email;
    @NotBlank @Column(nullable = false) private String password;
    @Enumerated(EnumType.STRING) @Column(nullable = false) @Builder.Default private Role rol = Role.OWNER;
    @Column(name = "created_at", updatable = false) @Builder.Default private LocalDateTime createdAt = LocalDateTime.now();
    @Builder.Default private Boolean active = true;
    public enum Role { OWNER, CITIZEN, ORG, ADMIN }
}
