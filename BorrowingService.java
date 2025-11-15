package com.learnislife.borrowing.service;

import com.learnislife.borrowing.entity.Borrowing;
import com.learnislife.borrowing.repository.BorrowingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class BorrowingService {
    
    @Autowired
    private BorrowingRepository borrowingRepository;
    
    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;
    
    @Value("${borrowing.max-books-per-user:5}")
    private int maxBooksPerUser;
    
    @Value("${borrowing.loan-duration-days:14}")
    private int loanDurationDays;
    
    private final WebClient webClient = WebClient.builder().build();
    
    public Borrowing borrowBook(Long userId, Long bookId) {
        // Check quota
        long activeBorrowings = borrowingRepository.countByUserIdAndReturnDateIsNull(userId);
        if (activeBorrowings >= maxBooksPerUser) {
            throw new RuntimeException("Maximum borrowing limit reached");
        }
        
        // Check if book is already borrowed
        Optional<Borrowing> existingBorrowing = borrowingRepository.findByBookIdAndReturnDateIsNull(bookId);
        if (existingBorrowing.isPresent()) {
            throw new RuntimeException("Book is already borrowed");
        }
        
        // Get book info from Book Service
        String bookTitle = getBookTitle(bookId);
        
        // Create borrowing record
        Borrowing borrowing = new Borrowing();
        borrowing.setUserId(userId);
        borrowing.setBookId(bookId);
        borrowing.setBookTitle(bookTitle);
        borrowing.setBorrowDate(LocalDate.now());
        borrowing.setDueDate(LocalDate.now().plusDays(loanDurationDays));
        
        Borrowing saved = borrowingRepository.save(borrowing);
        
        // Send Kafka event
        kafkaTemplate.send("borrowing-events", "borrowed", saved);
        
        return saved;
    }
    
    public Borrowing returnBook(Long borrowId, Long userId) {
        Optional<Borrowing> borrowingOpt = borrowingRepository.findById(borrowId);
        if (borrowingOpt.isEmpty()) {
            throw new RuntimeException("Borrowing not found");
        }
        
        Borrowing borrowing = borrowingOpt.get();
        if (!borrowing.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        
        if (borrowing.getReturnDate() != null) {
            throw new RuntimeException("Book already returned");
        }
        
        borrowing.setReturnDate(LocalDate.now());
        Borrowing saved = borrowingRepository.save(borrowing);
        
        // Send Kafka event
        kafkaTemplate.send("borrowing-events", "returned", saved);
        
        return saved;
    }
    
    public List<Borrowing> getUserBorrowings(Long userId) {
        return borrowingRepository.findByUserId(userId);
    }
    
    public List<Borrowing> getAllBorrowings() {
        return borrowingRepository.findAll();
    }
    
    public Map<String, Object> getBorrowingStats() {
        List<Borrowing> allBorrowings = borrowingRepository.findAll();
        long totalBorrowings = allBorrowings.size();
        long activeBorrowings = allBorrowings.stream()
                .filter(b -> b.getReturnDate() == null)
                .count();
        long overdueBorrowings = allBorrowings.stream()
                .filter(b -> b.getReturnDate() == null && b.getDueDate().isBefore(LocalDate.now()))
                .count();
        
        Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("totalBorrowings", totalBorrowings);
        stats.put("activeBorrowings", activeBorrowings);
        stats.put("overdueBorrowings", overdueBorrowings);
        stats.put("returnedBorrowings", totalBorrowings - activeBorrowings);
        return stats;
    }
    
    private String getBookTitle(Long bookId) {
        try {
            // Call Book Service
            Map<String, Object> book = webClient.get()
                    .uri("http://localhost:8082/api/books/" + bookId)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();
            if (book != null && book.containsKey("title")) {
                return (String) book.get("title");
            }
            return "Book " + bookId;
        } catch (Exception e) {
            return "Book " + bookId;
        }
    }
}

