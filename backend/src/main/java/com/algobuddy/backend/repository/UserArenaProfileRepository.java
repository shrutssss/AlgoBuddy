package com.algobuddy.backend.repository;

import com.algobuddy.backend.dto.ArenaLeaderboardProjection;
import com.algobuddy.backend.entity.UserArenaProfile;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserArenaProfileRepository extends JpaRepository<UserArenaProfile, UUID> {
    
    @Query("SELECT p FROM UserArenaProfile p ORDER BY p.rating DESC, p.xp DESC")
    List<UserArenaProfile> findTopPlayers(Pageable pageable);

    @Query(value = """
            SELECT COUNT(p.user_id) + 1
            FROM user_arena_profiles p
            CROSS JOIN (
                SELECT rating, xp
                FROM user_arena_profiles
                WHERE user_id = :userId
            ) u
            WHERE p.rating > u.rating
               OR (p.rating = u.rating AND p.xp > u.xp)
            """, nativeQuery = true)
    Integer findRankByUserId(@Param("userId") UUID userId);

    @Query(value = """
            SELECT 
                p.user_id AS "userId",
                p.xp AS "xp",
                p.level AS "level",
                p.rating AS "rating",
                p.battles_won AS "battlesWon",
                p.battles_lost AS "battlesLost",
                p.total_problems_solved AS "totalProblemsSolved",
                u.name AS "name",
                u.avatar_url AS "avatarUrl"
            FROM user_arena_profiles p
            LEFT JOIN user_profiles u ON p.user_id = u.id
            WHERE p.user_id = :userId
            """, nativeQuery = true)
    Optional<ArenaLeaderboardProjection> findProfileWithUserDetails(@Param("userId") UUID userId);

    @Query(value = """
            SELECT 
                p.user_id AS "userId",
                p.xp AS "xp",
                p.level AS "level",
                p.rating AS "rating",
                p.battles_won AS "battlesWon",
                p.battles_lost AS "battlesLost",
                p.total_problems_solved AS "totalProblemsSolved",
                u.name AS "name",
                u.avatar_url AS "avatarUrl"
            FROM user_arena_profiles p
            LEFT JOIN user_profiles u ON p.user_id = u.id
            ORDER BY p.rating DESC, p.xp DESC
            """, nativeQuery = true)
    List<ArenaLeaderboardProjection> findTopPlayersWithUserDetails(Pageable pageable);

}
