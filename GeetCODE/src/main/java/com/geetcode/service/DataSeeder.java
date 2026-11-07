package com.geetcode.service;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.geetcode.entity.Problem;
import com.geetcode.entity.TestCase;
import com.geetcode.entity.User;
import com.geetcode.repository.ProblemRepository;
import com.geetcode.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final ProblemRepository problemRepo;
    private final UserRepository userRepo;
    private final PasswordEncoder encoder;

    @Override
    public void run(String... args) {
        seedUsers();
        seedProblems();
    }

    private void seedUsers() {
        if (!userRepo.existsByEmail("admin@geetcode.com")) {
            User admin = new User();
            admin.setName("Admin");
            admin.setEmail("admin@geetcode.com");
            admin.setPassword(encoder.encode("admin123"));
            admin.setRole("ADMIN");
            userRepo.save(admin);
        }
        if (!userRepo.existsByEmail("demo@geetcode.com")) {
            User demo = new User();
            demo.setName("Demo Coder");
            demo.setEmail("demo@geetcode.com");
            demo.setPassword(encoder.encode("demo123"));
            demo.setRole("USER");
            userRepo.save(demo);
        }
    }

    private void seedProblems() {
        if (problemRepo.count() > 0) {
            return; // Already seeded!
        }

        List<Problem> problems = List.of(
            // 1. Two Sum
            p("Two Sum", "EASY", 1000, List.of("Arrays", "Hashing"),
                "Given an array of integers nums and an integer target, return 0-based indices of the two numbers such that they add up to target.\n\nInput Format:\nFirst line: n (size of array)\nSecond line: n space-separated integers\nThird line: target\n\nOutput Format:\nTwo space-separated indices.",
                tc("4\n2 7 11 15\n9", "0 1", true),
                tc("3\n3 2 4\n6", "1 2", true),
                tc("2\n3 3\n6", "0 1", false),
                tc("5\n1 6 3 7 2\n8", "0 3", false)
            ),
            // 2. Add Two Numbers
            p("Add Two Numbers", "MEDIUM", 1000, List.of("Linked Lists", "Math"),
                "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order. Add the two numbers and print the sum digits in reverse order.\n\nInput Format:\nLine 1: n\nLine 2: n space-separated digits\nLine 3: m\nLine 4: m space-separated digits",
                tc("3\n2 4 3\n3\n5 6 4", "7 0 8", true),
                tc("1\n0\n1\n0", "0", true),
                tc("7\n9 9 9 9 9 9 9\n4\n9 9 9 9", "8 9 9 9 0 0 0 1", false)
            ),
            // 3. Longest Substring Without Repeating Characters
            p("Longest Substring Without Repeating Characters", "MEDIUM", 1000, List.of("Strings", "Sliding Window"),
                "Given a string s, find the length of the longest substring without repeating characters.",
                tc("abcabcbb", "3", true),
                tc("bbbbb", "1", true),
                tc("pwwkew", "3", false),
                tc("abcdef", "6", false)
            ),
            // 4. Median of Two Sorted Arrays
            p("Median of Two Sorted Arrays", "HARD", 1000, List.of("Arrays", "Binary Search"),
                "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays formatted to 5 decimal places.",
                tc("2 2\n1 3\n2 4", "2.50000", true),
                tc("1 2\n1 2\n3", "2.00000", true),
                tc("1 1\n2\n1", "1.50000", false)
            ),
            // 5. Longest Palindromic Substring
            p("Longest Palindromic Substring", "MEDIUM", 1000, List.of("Strings", "DP"),
                "Given a string s, return the longest palindromic substring in s.",
                tc("babad", "bab", true),
                tc("cbbd", "bb", true),
                tc("racecar", "racecar", false)
            ),
            // 6. Regular Expression Matching
            p("Regular Expression Matching", "HARD", 2000, List.of("Strings", "DP"),
                "Given an input string s and a pattern p, implement regular expression matching with support for '.' and '*' where '.' matches any single character and '*' matches zero or more of the preceding element.\nPrint true or false.",
                tc("aa\na", "false", true),
                tc("aa\na*", "true", true),
                tc("ab\n.*", "true", false)
            ),
            // 7. Container With Most Water
            p("Container With Most Water", "MEDIUM", 1000, List.of("Arrays", "Two Pointers"),
                "Given n non-negative integers height[i], find two lines that together with the x-axis form a container that holds the most water. Print the maximum area.",
                tc("9\n1 8 6 2 5 4 8 3 7", "49", true),
                tc("2\n1 1", "1", true),
                tc("5\n4 3 2 1 4", "16", false)
            ),
            // 8. Three Sum
            p("Three Sum", "MEDIUM", 1000, List.of("Arrays", "Two Pointers"),
                "Given an integer array nums, print all unique triplets that sum to 0, one triplet per line in sorted order.",
                tc("6\n-1 0 1 2 -1 -4", "-1 -1 2\n-1 0 1", true),
                tc("3\n0 0 0", "0 0 0", true),
                tc("4\n-2 0 1 1", "-2 1 1", false)
            ),
            // 9. Valid Parentheses
            p("Valid Parentheses", "EASY", 1000, List.of("Stacks", "Strings"),
                "Given a string s containing just '(', ')', '{', '}', '[' and ']', determine if the input string is valid. Print true or false.",
                tc("()", "true", true),
                tc("()[]{}", "true", true),
                tc("(]", "false", true),
                tc("([)]", "false", false),
                tc("{[]}", "true", false)
            ),
            // 10. Merge K Sorted Lists
            p("Merge K Sorted Lists", "HARD", 2000, List.of("Linked Lists", "Heaps"),
                "Given k sorted integer lists, merge all lists into one sorted list and print space-separated integers.",
                tc("3\n1 4 5\n1 3 4\n2 6", "1 1 2 3 4 4 5 6", true),
                tc("1\n1", "1", true),
                tc("2\n1 2\n3 4", "1 2 3 4", false)
            ),
            // 11. Trapping Rain Water
            p("Trapping Rain Water", "HARD", 1000, List.of("Arrays", "Two Pointers", "DP"),
                "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
                tc("12\n0 1 0 2 1 0 1 3 2 1 2 1", "6", true),
                tc("6\n4 2 0 3 2 5", "9", true),
                tc("3\n1 0 1", "1", false)
            ),
            // 12. Word Break
            p("Word Break", "MEDIUM", 1000, List.of("DP", "Strings"),
                "Given a string s on line 1 and space-separated dictionary words on line 2, print true if s can be segmented into dictionary words, else false.",
                tc("leetcode\nleet code", "true", true),
                tc("applepenapple\napple pen", "true", true),
                tc("catsandog\ncats dog sand and cat", "false", false)
            ),
            // 13. Binary Tree Inorder Traversal
            p("Binary Tree Inorder Traversal", "EASY", 1000, List.of("Trees", "DFS"),
                "Given level-order integers of a binary tree (-1 for null), print its inorder traversal space-separated.",
                tc("1 -1 2 3", "1 3 2", true),
                tc("1", "1", true),
                tc("2 1 3", "1 2 3", false)
            ),
            // 14. Course Schedule
            p("Course Schedule", "MEDIUM", 1000, List.of("Graphs", "BFS", "DFS"),
                "Given numCourses and numPrereqs on line 1 followed by pairs (a b) meaning b is a prerequisite for a, print true if you can finish all courses, else false.",
                tc("2 1\n1 0", "true", true),
                tc("2 2\n1 0\n0 1", "false", true),
                tc("3 2\n1 0\n2 1", "true", false)
            ),
            // 15. Number of Islands
            p("Number of Islands", "MEDIUM", 1000, List.of("Graphs", "DFS", "BFS"),
                "Given an m x n binary grid of 1s (land) and 0s (water), return the number of islands.",
                tc("4 5\n1 1 1 1 0\n1 1 0 1 0\n1 1 0 0 0\n0 0 0 0 0", "1", true),
                tc("4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1", "3", true),
                tc("2 2\n1 0\n0 1", "2", false)
            ),
            // 16. Longest Increasing Path in Matrix
            p("Longest Increasing Path in Matrix", "HARD", 2000, List.of("DP", "Graphs", "DFS"),
                "Given an m x n integers matrix, return the length of the longest strictly increasing path moving up, down, left, or right.",
                tc("3 3\n9 9 4\n6 6 8\n2 1 1", "4", true),
                tc("3 3\n3 4 5\n3 2 6\n2 2 1", "4", true),
                tc("1 1\n1", "1", false)
            ),
            // 17. Coin Change
            p("Coin Change", "MEDIUM", 1000, List.of("DP"),
                "Given n coin denominations and a target amount, print the fewest number of coins needed to make up that amount, or -1 if impossible.",
                tc("3\n1 2 5\n11", "3", true),
                tc("1\n2\n3", "-1", true),
                tc("1\n1\n0", "0", false)
            ),
            // 18. Edit Distance
            p("Edit Distance", "HARD", 1000, List.of("DP", "Strings"),
                "Given two strings word1 and word2 on separate lines, return the minimum number of operations (insert, delete, replace) to convert word1 to word2.",
                tc("horse\nros", "3", true),
                tc("intention\nexecution", "5", true),
                tc("abc\nabc", "0", false)
            ),
            // 19. Kth Largest Element in Array
            p("Kth Largest Element in Array", "MEDIUM", 1000, List.of("Heaps", "Arrays"),
                "Given n and k on line 1, and n integers on line 2, return the kth largest element in the array.",
                tc("6 2\n3 2 1 5 6 4", "5", true),
                tc("9 4\n3 2 3 1 2 4 5 5 6", "4", true),
                tc("3 1\n1 2 3", "3", false)
            ),
            // 20. Valid Sudoku
            p("Valid Sudoku", "MEDIUM", 1000, List.of("Arrays", "Hashing"),
                "Determine if a 9x9 Sudoku board is valid. Print true or false.",
                tc("5 3 . . 7 . . . .\n6 . . 1 9 5 . . .\n. 9 8 . . . . 6 .\n8 . . . 6 . . . 3\n4 . . 8 . 3 . . 1\n7 . . . 2 . . . 6\n. 6 . . . . 2 8 .\n. . . 4 1 9 . . 5\n. . . . 8 . . 7 9", "true", true),
                tc("8 3 . . 7 . . . .\n6 . . 1 9 5 . . .\n. 9 8 . . . . 6 .\n8 . . . 6 . . . 3\n4 . . 8 . 3 . . 1\n7 . . . 2 . . . 6\n. 6 . . . . 2 8 .\n. . . 4 1 9 . . 5\n. . . . 8 . . 7 9", "false", true)
            ),
            // 21. Reverse Linked List
            p("Reverse Linked List", "EASY", 1000, List.of("Linked Lists"),
                "Given space-separated integers representing a singly linked list, reverse the list and print space-separated integers.",
                tc("1 2 3 4 5", "5 4 3 2 1", true),
                tc("1 2", "2 1", true),
                tc("1", "1", false)
            ),
            // 22. Maximum Subarray
            p("Maximum Subarray", "MEDIUM", 1000, List.of("Arrays", "DP"),
                "Given n on line 1 and n space-separated integers on line 2, find the contiguous subarray with the largest sum and print its sum.",
                tc("9\n-2 1 -3 4 -1 2 1 -5 4", "6", true),
                tc("1\n1", "1", true),
                tc("5\n5 4 -1 7 8", "23", false)
            ),
            // 23. Climbing Stairs
            p("Climbing Stairs", "EASY", 1000, List.of("DP", "Math"),
                "It takes n steps to reach the top. Each time you can climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
                tc("2", "2", true),
                tc("3", "3", true),
                tc("1", "1", false),
                tc("5", "8", false)
            ),
            // 24. Word Search II
            p("Word Search II", "HARD", 2000, List.of("Trie", "DFS", "Arrays"),
                "Given an m x n character board and a list of words on the last line, print all found words space-separated in alphabetical order.",
                tc("4 4\no a a n\ne t a e\ni h k r\ni f l v\noath pea eat rain", "eat oath", true),
                tc("2 2\na b\nc d\nab", "ab", false)
            ),
            // 25. LRU Cache
            p("LRU Cache", "MEDIUM", 1000, List.of("Design", "Hashing", "Linked Lists"),
                "Given cache capacity on line 1 followed by put/get operations, print the output of each get operation on a new line.",
                tc("2\nput 1 1\nput 2 2\nget 1\nput 3 3\nget 2\nput 4 4\nget 1\nget 3\nget 4", "1\n-1\n-1\n3\n4", true),
                tc("1\nput 1 1\nget 1\nput 2 2\nget 1\nget 2", "1\n-1\n2", true)
            ),
            // 26. Best Time to Buy and Sell Stock
            p("Best Time to Buy and Sell Stock", "EASY", 1000, List.of("Arrays", "DP"),
                "Given n on line 1 and n stock prices on line 2, return the maximum profit you can achieve from a single buy and sell. If no profit is possible, print 0.",
                tc("6\n7 1 5 3 6 4", "5", true),
                tc("5\n7 6 4 3 1", "0", true),
                tc("4\n2 4 1 7", "6", false)
            ),
            // 27. Product of Array Except Self
            p("Product of Array Except Self", "MEDIUM", 1000, List.of("Arrays", "Math"),
                "Given n on line 1 and n integers on line 2, print an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i], without using division.",
                tc("4\n1 2 3 4", "24 12 8 6", true),
                tc("5\n-1 1 0 -3 3", "0 0 9 0 0", true),
                tc("3\n2 3 4", "12 8 6", false)
            ),
            // 28. Find Minimum in Rotated Sorted Array
            p("Find Minimum in Rotated Sorted Array", "MEDIUM", 1000, List.of("Arrays", "Binary Search"),
                "Given a rotated sorted array of unique elements (n on line 1, n integers on line 2), return the minimum element in O(log n) time.",
                tc("5\n3 4 5 1 2", "1", true),
                tc("7\n4 5 6 7 0 1 2", "0", true),
                tc("4\n11 13 15 17", "11", false)
            ),
            // 29. Subarray Sum Equals K
            p("Subarray Sum Equals K", "MEDIUM", 1000, List.of("Arrays", "Hashing"),
                "Given n and k on line 1, and n integers on line 2, return the total number of contiguous subarrays whose sum equals k.",
                tc("3 2\n1 1 1", "2", true),
                tc("3 3\n1 2 3", "2", true),
                tc("4 0\n1 -1 1 -1", "4", false)
            ),
            // 30. Longest Common Subsequence
            p("Longest Common Subsequence", "MEDIUM", 1000, List.of("Strings", "DP"),
                "Given two strings text1 and text2 on separate lines, return the length of their longest common subsequence.",
                tc("abcde\nace", "3", true),
                tc("abc\nabc", "3", true),
                tc("abc\ndef", "0", false)
            )
        );

        problemRepo.saveAll(problems);
        System.out.println("Seeded 30 GeetCODE problems into PostgreSQL!");
    }

    private Problem p(String title, String diff, int timeMs, List<String> tags, String statement, TestCase... cases) {
        Problem prob = new Problem();
        prob.setTitle(title);
        prob.setDifficulty(diff);
        prob.setTimeLimitMs(timeMs);
        prob.setTags(tags);
        prob.setStatement(statement);
        prob.setTestCases(List.of(cases));
        return prob;
    }

    private TestCase tc(String input, String expected, boolean sample) {
        TestCase c = new TestCase();
        c.setInput(input);
        c.setExpectedOutput(expected);
        c.setSample(sample);
        return c;
    }
}

