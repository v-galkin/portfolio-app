package com.vg.portfolio.service;

import com.vg.portfolio.model.Certification;
import com.vg.portfolio.repository.CertificationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CertificationServiceTest {

    @Mock
    private CertificationRepository certificationRepository;

    @InjectMocks
    private CertificationService certificationService;

    private Certification cert1;
    private Certification cert2;

    @BeforeEach
    void setUp() {
        cert1 = new Certification(1L, "AWS Certified Developer", "Amazon",
                "2023-05", "https://aws.amazon.com/verify/cert1");

        cert2 = new Certification(2L, "Spring Professional", "VMware",
                "2022-11", "https://vmware.com/verify/cert2");
    }

    // -------------------------------------------------------------------------
    // getAll
    // -------------------------------------------------------------------------

    @Test
    void getAll_returnsAllCertifications() {
        when(certificationRepository.findAll()).thenReturn(List.of(cert1, cert2));

        List<Certification> result = certificationService.getAll();

        assertThat(result).hasSize(2).containsExactly(cert1, cert2);
        verify(certificationRepository).findAll();
    }

    // -------------------------------------------------------------------------
    // getById
    // -------------------------------------------------------------------------

    @Test
    void getById_returnsCertification_whenExists() {
        when(certificationRepository.findById(1L)).thenReturn(Optional.of(cert1));

        Certification result = certificationService.getById(1L);

        assertThat(result).isEqualTo(cert1);
        assertThat(result.getName()).isEqualTo("AWS Certified Developer");
        verify(certificationRepository).findById(1L);
    }

    @Test
    void getById_throwsException_whenNotFound() {
        when(certificationRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> certificationService.getById(99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("99");

        verify(certificationRepository).findById(99L);
    }
}