package com.example.moneymanager.repo;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.moneymanager.entity.Account;

public interface AccountRepository extends MongoRepository<Account, String>{

}
