package com.learnislife.borrowing.repository;

import com.learnislife.borrowing.entity.Borrowing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BorrowingRepository extends JpaRepository<Borrowing, Long> {
    List<Borrowing> findByUserId(Long userId);
    List<Borrowing> findByUserIdAndReturnDateIsNull(Long userId);
    Optional<Borrowing> findByBookIdAndReturnDateIsNull(Long bookId);
    long countByUserIdAndReturnDateIsNull(Long userId);
}

