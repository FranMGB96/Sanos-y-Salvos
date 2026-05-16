package com.sanosysalvos.petservice.controller;

import com.sanosysalvos.petservice.dto.PetDto;
import com.sanosysalvos.petservice.service.PetService;

import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import java.util.List;

@RestController
@RequestMapping("/pets")
@Tag(name = "Mascotas")

public class PetController {

    @Autowired
    private PetService petService;

    @GetMapping
    public ResponseEntity<List<PetDto>> getAll() {

        return ResponseEntity.ok(
                petService.getAllPets()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<PetDto> getById(@PathVariable Long id) {

        return ResponseEntity.ok(
                petService.getPetById(id)
        );
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<PetDto>> getByOwner(
            @PathVariable Long ownerId
    ) {

        return ResponseEntity.ok(
                petService.getPetsByOwner(ownerId)
        );
    }

    @GetMapping("/especie/{especie}")
    public ResponseEntity<List<PetDto>> getByEspecie(
            @PathVariable String especie
    ) {

        return ResponseEntity.ok(
                petService.getPetsByEspecie(especie)
        );
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PetDto> create(

            @RequestParam("nombre") String nombre,

            @RequestParam("especie") String especie,

            @RequestParam(value = "raza", required = false)
            String raza,

            @RequestParam(value = "color", required = false)
            String color,

            @RequestParam(value = "tamanio", required = false)
            String tamanio,

            @RequestParam(value = "descripcion", required = false)
            String descripcion,

            @RequestParam("ownerId")
            Long ownerId,

            @RequestParam(value = "foto", required = false)
            MultipartFile foto

    ) throws IOException {

        String fotoUrl = "";

        if (foto != null && !foto.isEmpty()) {

            String carpetaUploads =
                    System.getProperty("user.dir")
                            + "/uploads/";

            File carpeta = new File(carpetaUploads);

            if (!carpeta.exists()) {

                carpeta.mkdirs();
            }

            String nombreArchivo =
                    System.currentTimeMillis()
                            + "_"
                            + foto.getOriginalFilename();

            Path rutaArchivo =
                    Paths.get(carpetaUploads + nombreArchivo);

            Files.write(rutaArchivo, foto.getBytes());

            fotoUrl =
                    "http://localhost:8082/uploads/"
                            + nombreArchivo;
        }

        PetDto dto = new PetDto();

        dto.setNombre(nombre);
        dto.setEspecie(especie);
        dto.setRaza(raza);
        dto.setColor(color);
        dto.setTamanio(tamanio);
        dto.setDescripcion(descripcion);
        dto.setOwnerId(ownerId);
        dto.setFotoUrl(fotoUrl);

        PetDto petCreada =
                petService.createPet(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(petCreada);
    }

    @PutMapping(
            value = "/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )

    public ResponseEntity<PetDto> update(

            @PathVariable Long id,

            @RequestParam("nombre")
            String nombre,

            @RequestParam("especie")
            String especie,

            @RequestParam(value = "raza", required = false)
            String raza,

            @RequestParam(value = "color", required = false)
            String color,

            @RequestParam(value = "tamanio", required = false)
            String tamanio,

            @RequestParam(value = "descripcion", required = false)
            String descripcion,

            @RequestParam("ownerId")
            Long ownerId,

            @RequestParam(value = "foto", required = false)
            MultipartFile foto

    ) throws IOException {

        String fotoUrl = "";

        if (foto != null && !foto.isEmpty()) {

            String carpetaUploads =
                    System.getProperty("user.dir")
                            + "/uploads/";

            File carpeta = new File(carpetaUploads);

            if (!carpeta.exists()) {

                carpeta.mkdirs();
            }

            String nombreArchivo =
                    System.currentTimeMillis()
                            + "_"
                            + foto.getOriginalFilename();

            Path rutaArchivo =
                    Paths.get(carpetaUploads + nombreArchivo);

            Files.write(rutaArchivo, foto.getBytes());

            fotoUrl =
                    "http://localhost:8082/uploads/"
                            + nombreArchivo;
        }

        PetDto dto = new PetDto();

        dto.setNombre(nombre);
        dto.setEspecie(especie);
        dto.setRaza(raza);
        dto.setColor(color);
        dto.setTamanio(tamanio);
        dto.setDescripcion(descripcion);
        dto.setOwnerId(ownerId);
        dto.setFotoUrl(fotoUrl);

        PetDto petActualizada =
                petService.updatePet(id, dto);

        return ResponseEntity.ok(
                petActualizada
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id
    ) {

        petService.deletePet(id);

        return ResponseEntity.noContent().build();
    }
}