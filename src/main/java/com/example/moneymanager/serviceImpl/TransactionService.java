package com.example.moneymanager.serviceImpl;

import java.io.ByteArrayOutputStream;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.moneymanager.entity.Account;
import com.example.moneymanager.entity.Transaction;
import com.example.moneymanager.entity.enums.TransactionType;
import com.example.moneymanager.exception.EditWindowExpiredException;
import com.example.moneymanager.repo.AccountRepository;
import com.example.moneymanager.repo.TransactionRepository;
import com.example.moneymanager.service.ITransactionService;

@Service
public class TransactionService implements ITransactionService {

    @Autowired
    private TransactionRepository repository;
    
    @Autowired
    private AccountRepository accRepo;
	
	@Override
    public Transaction addTransaction(Transaction txn) {
        txn.setCreatedAt(LocalDateTime.now());
        txn.setTransactionDate(LocalDateTime.now());
        return repository.save(txn);
    }
	
	@Override
	public Map<String, Double> categorySummary(
	        LocalDate start,
	        LocalDate end
	) {
	    return getTransactionsBetween(start, end)
	            .stream()
	            .collect(Collectors.groupingBy(
	                    Transaction::getCategory,
	                    Collectors.summingDouble(Transaction::getAmount)
	            ));
	}

	@Override
	public Map<String, Double> getSummary(
	        LocalDate start,
	        LocalDate end
	) {
	    List<Transaction> txns =
	            getTransactionsBetween(start, end);

	    double income = txns.stream()
	            .filter(t -> t.getType() == TransactionType.income)
	            .mapToDouble(Transaction::getAmount)
	            .sum();

	    double expense = txns.stream()
	            .filter(t -> t.getType() == TransactionType.expense)
	            .mapToDouble(Transaction::getAmount)
	            .sum();

	    return Map.of(
	            "totalIncome", income,
	            "totalExpense", expense,
	            "balance", income - expense
	    );
	}

	@Override
	public List<Transaction> getTransactionsBetween(
	        LocalDate start,
	        LocalDate end
	) {
	    return repository.findByTransactionDateBetween(
	            start.atStartOfDay(),
	            end.atTime(23, 59, 59)
	    );
	}

	@Override
	public Transaction updateTransaction(String id, Transaction updatedTxn) {
	    Transaction existing = repository.findById(id)
	            .orElseThrow();

	    long hours = Duration.between(
	            existing.getCreatedAt(),
	            LocalDateTime.now()
	    ).toHours();

	    if (hours > 12) {
	        throw new EditWindowExpiredException(
	                "Transaction can only be edited within 12 hours"
	        );
	    }

	    existing.setAmount(updatedTxn.getAmount());
	    existing.setCategory(updatedTxn.getCategory());
	    existing.setDivision(updatedTxn.getDivision());
	    existing.setDescription(updatedTxn.getDescription());

	    return repository.save(existing);
	}
	
	@Override
	public byte[] generateExcelReport(LocalDate start, LocalDate end) {

        List<Transaction> transactions =
                getTransactionsBetween(start, end);

        double totalIncome = transactions.stream()
                .filter(t -> t.getType() == TransactionType.income)
                .mapToDouble(Transaction::getAmount)
                .sum();

        double totalExpense = transactions.stream()
                .filter(t -> t.getType() == TransactionType.expense)
                .mapToDouble(Transaction::getAmount)
                .sum();

        double balance = totalIncome - totalExpense;

        Map<String, Double> expenseByCategory =
                transactions.stream()
                        .filter(t -> t.getType() == TransactionType.expense)
                        .collect(Collectors.groupingBy(
                                Transaction::getCategory,
                                Collectors.summingDouble(Transaction::getAmount)
                        ));

        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet("Money Report");
            int rowNum = 0;

            DateTimeFormatter df = DateTimeFormatter.ofPattern("dd-MM-yyyy");

            // ----------------- SUMMARY -----------------
            rowNum = createTitle(sheet, rowNum,
                    "Report Period: " + start + " to " + end);

            rowNum = createKeyValue(sheet, rowNum, "Total Income", totalIncome);
            rowNum = createKeyValue(sheet, rowNum, "Total Expense", totalExpense);
            rowNum = createKeyValue(sheet, rowNum, "Balance", balance);

            rowNum += 2;

            // ----------------- CATEGORY SUMMARY -----------------
            rowNum = createSection(sheet, rowNum, "Category Wise Expense");

            for (var entry : expenseByCategory.entrySet()) {
                rowNum = createKeyValue(sheet, rowNum,
                        entry.getKey(), entry.getValue());
            }

            rowNum += 2;

            // ----------------- INCOME DETAILS -----------------
            rowNum = createSection(sheet, rowNum, "Income Details");
            rowNum = createHeader(sheet, rowNum,
                    "Date", "Category", "Amount", "Description");

            for (Transaction t : transactions) {
                if (t.getType() == TransactionType.income) {
                    Row row = sheet.createRow(rowNum++);
                    row.createCell(0).setCellValue(df.format(t.getCreatedAt()));
                    row.createCell(1).setCellValue(t.getCategory());
                    row.createCell(2).setCellValue(t.getAmount());
                    row.createCell(3).setCellValue(t.getDescription());
                }
            }

            rowNum += 2;

            // ----------------- EXPENSE DETAILS -----------------
            rowNum = createSection(sheet, rowNum, "Expense Details");
            rowNum = createHeader(sheet, rowNum,
                    "Date", "Category", "Division", "Amount", "Description");

            for (Transaction t : transactions) {
                if (t.getType() == TransactionType.expense) {
                    Row row = sheet.createRow(rowNum++);
                    row.createCell(0).setCellValue(df.format(t.getCreatedAt()));
                    row.createCell(1).setCellValue(t.getCategory());
                    row.createCell(2).setCellValue(t.getDivision().name());
                    row.createCell(3).setCellValue(t.getAmount());
                    row.createCell(4).setCellValue(t.getDescription());
                }
            }

            for (int i = 0; i < 6; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate report", e);
        }
    }

	// ---------- Helpers ----------
    private int createTitle(Sheet sheet, int rowNum, String title) {
        Row row = sheet.createRow(rowNum++);
        row.createCell(0).setCellValue(title);
        return rowNum + 1;
    }

    private int createSection(Sheet sheet, int rowNum, String title) {
        Row row = sheet.createRow(rowNum++);
        row.createCell(0).setCellValue(title);
        return rowNum + 1;
    }

    private int createKeyValue(Sheet sheet, int rowNum, String key, double value) {
        Row row = sheet.createRow(rowNum++);
        row.createCell(0).setCellValue(key);
        row.createCell(1).setCellValue(value);
        return rowNum;
    }

    private int createHeader(Sheet sheet, int rowNum, String... headers) {
        Row row = sheet.createRow(rowNum++);
        for (int i = 0; i < headers.length; i++) {
            row.createCell(i).setCellValue(headers[i]);
        }
        return rowNum;
    }

	@Override
	public Account addTransferAccount(Account acc) {
		return accRepo.save(acc);
	}

	@Override
	public void deleteTransaction(String id) {
		Transaction tx = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if (Duration.between(tx.getCreatedAt(), LocalDateTime.now()).toHours() > 12) {
            throw new RuntimeException("Delete not allowed after 12 hours");
        }

        repository.deleteById(id);
    }

}
