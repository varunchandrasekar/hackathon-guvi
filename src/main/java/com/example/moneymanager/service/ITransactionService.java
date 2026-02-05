package com.example.moneymanager.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import com.example.moneymanager.entity.Account;
import com.example.moneymanager.entity.Transaction;

public interface ITransactionService {

	public Transaction addTransaction(Transaction txn);

	public Map<String, Double> categorySummary(LocalDate start, LocalDate end);

	public Map<String, Double> getSummary(LocalDate start, LocalDate end);

	public List<Transaction> getTransactionsBetween(LocalDate start, LocalDate end);

	public Transaction updateTransaction(String id, Transaction txn);

	public byte[] generateExcelReport(LocalDate start, LocalDate end);

	public Account addTransferAccount(Account acc);

	public void deleteTransaction(String id);

}
