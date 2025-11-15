package com.learnislife.borrowing.dto;

public class BorrowRequest {
    private Long bookId;
    
    public BorrowRequest() {}
    
    public BorrowRequest(Long bookId) {
        this.bookId = bookId;
    }
    
    public Long getBookId() {
        return bookId;
    }
    
    public void setBookId(Long bookId) {
        this.bookId = bookId;
    }
}

