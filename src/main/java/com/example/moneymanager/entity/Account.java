package com.example.moneymanager.entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "accounts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Account {

    @Id
    private String id;
    @NotBlank
    private String fromAccountId;

    @NotBlank
    private String toAccountId;

    @NotNull
    @Positive
    private Double amount;

    private String description;
    
    private LocalDateTime transactionDate;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getFromAccount() {
		return fromAccountId;
	}

	public void setFromAccount(String fromAccount) {
		this.fromAccountId = fromAccount;
	}

	public String getToAccount() {
		return toAccountId;
	}

	public void setToAccount(String toAccount) {
		this.toAccountId = toAccount;
	}

	public Double getAmount() {
		return amount;
	}

	public void setAmount(Double amount) {
		this.amount = amount;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public LocalDateTime getTransactionDate() {
		return transactionDate;
	}
	public void setTransactionDate(LocalDateTime transactionDate) {
		this.transactionDate = transactionDate;
	}
}

