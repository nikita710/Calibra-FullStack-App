package com.techbeyond.calibraapi.dao;

import com.techbeyond.calibraapi.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
