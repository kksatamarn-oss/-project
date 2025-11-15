package com.learnislife.borrowing.controller;

import com.learnislife.borrowing.dto.BorrowRequest;
import com.learnislife.borrowing.entity.Borrowing;
import com.learnislife.borrowing.service.BorrowingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/borrowings")
@CrossOrigin(origins = "*")
public class BorrowingController {
    
    @Autowired
    private BorrowingService borrowingService;
    
    @PostMapping
    public ResponseEntity<?> borrowBook(@RequestBody BorrowRequest request) {
        try {
            // For testing, use userId = 1
            Long userId = 1L;
            Borrowing borrowing = borrowingService.borrowBook(userId, request.getBookId());
            return ResponseEntity.ok(borrowing);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PutMapping("/{id}/return")
    public ResponseEntity<?> returnBook(@PathVariable Long id) {
        try {
            // For testing, use userId = 1
            Long userId = 1L;
            Borrowing borrowing = borrowingService.returnBook(id, userId);
            return ResponseEntity.ok(borrowing);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Borrowing>> getUserBorrowings(@PathVariable Long userId) {
        List<Borrowing> borrowings = borrowingService.getUserBorrowings(userId);
        return ResponseEntity.ok(borrowings);
    }
}

