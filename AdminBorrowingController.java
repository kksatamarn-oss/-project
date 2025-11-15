package com.learnislife.borrowing.controller;

import com.learnislife.borrowing.entity.Borrowing;
import com.learnislife.borrowing.service.BorrowingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/borrowings")
@CrossOrigin(origins = "*")
public class AdminBorrowingController {
    
    @Autowired
    private BorrowingService borrowingService;
    
    @GetMapping
    public ResponseEntity<List<Borrowing>> getAllBorrowings() {
        List<Borrowing> borrowings = borrowingService.getAllBorrowings();
        return ResponseEntity.ok(borrowings);
    }
    
    @GetMapping("/stats")
    public ResponseEntity<?> getBorrowingStats() {
        return ResponseEntity.ok(borrowingService.getBorrowingStats());
    }
}

