package com.example.moneymanager.entity;

import java.time.LocalDateTime;

import com.example.moneymanager.entity.enums.Division;
import com.example.moneymanager.entity.enums.TransactionType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "transactions")
public class Transaction {

    @Id
    private String id;
    
    private TransactionType type;   // INCOME, EXPENSE, TRANSFER
    private Double amount;

    private String category;         // Fuel, Food, Loan, etc
    private Division division;       // PERSONAL, OFFICE

    private String description;

    private String fromAccount;      // For expense / transfer
    private String toAccount;        // For income / transfer

    private LocalDateTime transactionDate;
    private LocalDateTime createdAt;

	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public TransactionType getType() {
		return type;
	}
	public void setType(TransactionType type) {
		this.type = type;
	}
	public Double getAmount() {
		return amount;
	}
	public void setAmount(Double amount) {
		this.amount = amount;
	}
	public String getCategory() {
		return category;
	}
	public void setCategory(String category) {
		this.category = category;
	}
	public Division getDivision() {
		return division;
	}
	public void setDivision(Division division) {
		this.division = division;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getFromAccount() {
		return fromAccount;
	}
	public void setFromAccount(String fromAccount) {
		this.fromAccount = fromAccount;
	}
	public String getToAccount() {
		return toAccount;
	}
	public void setToAccount(String toAccount) {
		this.toAccount = toAccount;
	}
	public LocalDateTime getTransactionDate() {
		return transactionDate;
	}
	public void setTransactionDate(LocalDateTime transactionDate) {
		this.transactionDate = transactionDate;
	}
	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
	
	public Transaction(String id, TransactionType type, Double amount, String category, Division division,
			String description, String fromAccount, String toAccount, LocalDateTime transactionDate,
			LocalDateTime createdAt) {
		super();
		this.id = id;
		this.type = type;
		this.amount = amount;
		this.category = category;
		this.division = division;
		this.description = description;
		this.fromAccount = fromAccount;
		this.toAccount = toAccount;
		this.transactionDate = transactionDate;
		this.createdAt = createdAt;
	}
	
	public Transaction () {
		
	}
}
