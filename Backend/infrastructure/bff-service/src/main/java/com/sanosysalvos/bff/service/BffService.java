package com.sanosysalvos.bff.service;

import com.sanosysalvos.bff.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BffService {

    @Autowired private RestTemplate restTemplate;

    @Value("${services.user-url}") private String userUrl;
    @Value("${services.pet-url}")  private String petUrl;
    @Value("${services.report-url}") private String reportUrl;

    public DashboardDto getDashboard() {
        List<Object>              usuarios = fetchList(userUrl + "/users", Object.class);
        List<MascotaResumenDto>   mascotas = fetchList(petUrl  + "/pets",  MascotaResumenDto.class);
        List<ReporteConDetalleDto> reportes = getReportesConDetalle();

        long activos     = reportes.stream().filter(r -> "ACTIVO".equals(r.getEstado())).count();
        long perdidos    = reportes.stream().filter(r -> "PERDIDO".equals(r.getTipo())).count();
        long encontrados = reportes.stream().filter(r -> "ENCONTRADO".equals(r.getTipo())).count();

        List<ReporteConDetalleDto> ultimos = reportes.stream()
                .sorted((a, b) -> b.getCreatedAt() != null && a.getCreatedAt() != null ? b.getCreatedAt().compareTo(a.getCreatedAt()) : 0)
                .limit(5).collect(Collectors.toList());

        return DashboardDto.builder()
                .totalUsuarios(usuarios.size()).totalMascotas(mascotas.size()).totalReportes(reportes.size())
                .reportesActivos(activos).reportesPerdidos(perdidos).reportesEncontrados(encontrados)
                .ultimosReportes(ultimos).build();
    }

    public UsuarioConMascotasDto getUsuarioConMascotas(Long userId) {
        var usuario = restTemplate.getForObject(userUrl + "/users/" + userId, java.util.Map.class);
        List<MascotaResumenDto> mascotas = fetchList(petUrl + "/pets/owner/" + userId, MascotaResumenDto.class);
        return UsuarioConMascotasDto.builder()
                .id(userId)
                .nombre(usuario != null ? (String) usuario.get("nombre") : null)
                .email(usuario  != null ? (String) usuario.get("email")  : null)
                .rol(usuario    != null ? (String) usuario.get("rol")    : null)
                .mascotas(mascotas).build();
    }

    public List<ReporteConDetalleDto> getReportesConDetalle() {
        return enriquecer(fetchList(reportUrl + "/reports", java.util.Map.class));
    }

    public List<ReporteConDetalleDto> getReportesPorTipo(String tipo) {
        return enriquecer(fetchList(reportUrl + "/reports/tipo/" + tipo, java.util.Map.class));
    }

    public List<ReporteConDetalleDto> getReportesPorUsuario(Long userId) {
        return enriquecer(fetchList(reportUrl + "/reports/usuario/" + userId, java.util.Map.class));
    }

    // ── helpers ──────────────────────────────────────────────────

    private List<ReporteConDetalleDto> enriquecer(List<java.util.Map> rawList) {
        return rawList.stream().map(r -> {
            Long petId = r.get("petId") != null ? Long.valueOf(r.get("petId").toString()) : null;
            MascotaResumenDto mascota = null;
            if (petId != null) {
                try { mascota = restTemplate.getForObject(petUrl + "/pets/" + petId, MascotaResumenDto.class); }
                catch (Exception ignored) {}
            }
            return ReporteConDetalleDto.builder()
                    .id(Long.valueOf(r.get("id").toString()))
                    .tipo((String) r.get("tipo"))
                    .descripcion((String) r.get("descripcion"))
                    .latitud(r.get("latitud")   != null ? Double.valueOf(r.get("latitud").toString())  : null)
                    .longitud(r.get("longitud")  != null ? Double.valueOf(r.get("longitud").toString()) : null)
                    .ubicacionDescripcion((String) r.get("ubicacionDescripcion"))
                    .estado((String) r.get("estado"))
                    .reporterUserId(r.get("reporterUserId") != null ? Long.valueOf(r.get("reporterUserId").toString()) : null)
                    .mascota(mascota).build();
        }).collect(Collectors.toList());
    }

    @SuppressWarnings("unchecked")
    private <T> List<T> fetchList(String url, Class<T> clazz) {
        try {
            var response = restTemplate.exchange(url, HttpMethod.GET, null, new ParameterizedTypeReference<List<T>>() {});
            return response.getBody() != null ? response.getBody() : Collections.emptyList();
        } catch (Exception e) { return Collections.emptyList(); }
    }
}
