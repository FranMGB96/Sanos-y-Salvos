package com.sanosysalvos.userservice.service;

import com.sanosysalvos.userservice.dto.*;
import com.sanosysalvos.userservice.exception.*;
import com.sanosysalvos.userservice.model.User;
import com.sanosysalvos.userservice.repository.UserRepository;
import com.sanosysalvos.userservice.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {
    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private UserDetailsService userDetailsService;

    public AuthDto.AuthResponse register(AuthDto.RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail()))
            throw new BadRequestException("Ya existe un usuario con ese email");
        User.Role role = User.Role.OWNER;
        if (request.getRol() != null) { try { role = User.Role.valueOf(request.getRol().toUpperCase()); } catch (IllegalArgumentException ignored) {} }
        User user = User.builder().nombre(request.getNombre()).email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword())).rol(role).build();
        user = userRepository.save(user);
        var details = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(details, user.getId(), user.getRol().name());
        return new AuthDto.AuthResponse(token, user.getId(), user.getNombre(), user.getEmail(), user.getRol().name());
    }

    public AuthDto.AuthResponse login(AuthDto.LoginRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        var details = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(details, user.getId(), user.getRol().name());
        return new AuthDto.AuthResponse(token, user.getId(), user.getNombre(), user.getEmail(), user.getRol().name());
    }

    public List<UserDto> getAllUsers() { return userRepository.findAll().stream().map(this::toDto).collect(Collectors.toList()); }

    public UserDto getUserById(Long id) { return toDto(userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + id))); }

    public UserDto updateUser(Long id, UserDto dto) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + id));
        if (dto.getNombre() != null) user.setNombre(dto.getNombre());
        if (dto.getEmail() != null) { if (!user.getEmail().equals(dto.getEmail()) && userRepository.existsByEmail(dto.getEmail())) throw new BadRequestException("Email ya en uso"); user.setEmail(dto.getEmail()); }
        return toDto(userRepository.save(user));
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + id));
        user.setActive(false); userRepository.save(user);
    }

    private UserDto toDto(User u) { return UserDto.builder().id(u.getId()).nombre(u.getNombre()).email(u.getEmail()).rol(u.getRol().name()).active(u.getActive()).createdAt(u.getCreatedAt()).build(); }
}
