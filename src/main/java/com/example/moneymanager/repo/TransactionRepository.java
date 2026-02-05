package com.example.moneymanager.repo;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.moneymanager.entity.Transaction;
import com.example.moneymanager.entity.enums.Division;

public interface TransactionRepository extends MongoRepository<Transaction, String> {

    List<Transaction> findByTransactionDateBetween(
        LocalDateTime start,
        LocalDateTime end
    );

    List<Transaction> findByCategory(String category);

    List<Transaction> findByDivision(Division division);
    
    List<Transaction> findByCreatedAtBetween(
            LocalDateTime start,
            LocalDateTime end
    );

    List<Transaction> findByCategoryAndDivisionAndCreatedAtBetween(
            String category,
            String division,
            LocalDateTime start,
            LocalDateTime end
    );

    List<Transaction> findByDivisionAndCreatedAtBetween(
            String division,
            LocalDateTime start,
            LocalDateTime end
    );

    List<Transaction> findByCategoryAndCreatedAtBetween(
            String category,
            LocalDateTime start,
            LocalDateTime end
    );
}

