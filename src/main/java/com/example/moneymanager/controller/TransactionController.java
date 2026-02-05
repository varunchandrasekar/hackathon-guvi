package com.example.moneymanager.controller;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.moneymanager.entity.Account;
import com.example.moneymanager.entity.Transaction;
import com.example.moneymanager.service.ITransactionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@CrossOrigin(
	    origins = "http://192.168.1.16:8081",
	    allowedHeaders = "*",
	    methods = { 
	        RequestMethod.GET, 
	        RequestMethod.POST, 
	        RequestMethod.PUT, 
	        RequestMethod.DELETE, 
	        RequestMethod.OPTIONS 
	    }
	)
public class TransactionController {

	@Autowired
    private ITransactionService service;

    @PostMapping("/")
    public Transaction add(@RequestBody Transaction txn) {
        return service.addTransaction(txn);
    }
    
    @PostMapping("/transferAccounts")
    public Account add(@RequestBody Account acc) {
        return service.addTransferAccount(acc);
    }

    @PutMapping("/{id}")
    public Transaction update(
            @PathVariable String id,
            @RequestBody Transaction txn
    ) {
        return service.updateTransaction(id, txn);
    }

    @GetMapping("/range")
    public List<Transaction> byDateRange(
            @RequestParam LocalDate start,
            @RequestParam LocalDate end
    ) {
        return service.getTransactionsBetween(start, end);
    }

    @GetMapping("/summary")
    public Map<String, Double> summary(
            @RequestParam LocalDate start,
            @RequestParam LocalDate end
    ) {
        return service.getSummary(start, end);
    }

    @GetMapping("/category-summary")
    public Map<String, Double> categorySummary(
            @RequestParam LocalDate start,
            @RequestParam LocalDate end
    ) {
        return service.categorySummary(start, end);
    }
    
    @GetMapping("/excelReport")
    public ResponseEntity<byte[]> downloadReport(
            @RequestParam LocalDate start,
            @RequestParam LocalDate end
    ) {

        byte[] data = service.generateExcelReport(start, end);

        return ResponseEntity.ok()
                .header("Content-Disposition",
                        "attachment; filename=money-report.xlsx")
                .contentType(
                        MediaType.APPLICATION_OCTET_STREAM)
                .body(data);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<String> delete(
            @PathVariable String id
    ) {
    	
         service.deleteTransaction(id);
         return ResponseEntity.ok("Transaction deleted successfully");
    }
}

