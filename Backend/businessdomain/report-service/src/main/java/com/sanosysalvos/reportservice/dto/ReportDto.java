package com.sanosysalvos.reportservice.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ReportDto {
    private Long id;
    @NotNull(message = "El tipo es obligatorio (PERDIDO o ENCONTRADO)") private String tipo;
    @NotBlank(message = "La descripción es obligatoria") private String descripcion;
    private Double latitud;
    private Double longitud;
    private String ubicacionDescripcion;
    private Long petId;
    @NotNull(message = "El reporterUserId es obligatorio") private Long reporterUserId;
    private String estado;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
