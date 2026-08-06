-- =====================================================
-- Seed Data: Admin user + 25 problems + test cases
-- Password for admin: 'admin123' (BCrypt hashed)
-- =====================================================

-- Admin user (password: admin123)
INSERT INTO users (id, name, email, handle, password_hash, role, rating, max_rating, created_at)
VALUES ('550e8400-e29b-41d4-a716-446655440000', 'Admin', 'admin@algou.dev', 'admin',
        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN', 2500, 2500, NOW());

-- =====================================================
-- PROBLEMS
-- =====================================================

INSERT INTO problems (id, title, slug, statement, difficulty, constraints, input_format, output_format, time_limit_ms, memory_limit_mb, total_submissions, accepted_submissions, created_by, created_at, updated_at)
VALUES
(1, 'Two Sum', 'two-sum',
 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.',
 'EASY', '2 <= nums.length <= 10^4
-10^9 <= nums[i] <= 10^9
Only one valid answer exists.',
 'First line: n (size of array)
Second line: n space-separated integers
Third line: target value',
 'Two space-separated integers representing the indices.',
 1000, 256, 482000, 429000, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),

(2, 'Add Two Numbers', 'add-two-numbers',
 'You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.',
 'MEDIUM', 'The number of nodes in each linked list is in the range [1, 100].
0 <= Node.val <= 9',
 'Two lines, each containing space-separated digits of the linked list in reverse order.',
 'Space-separated digits of the result linked list in reverse order.',
 1000, 256, 312000, 130000, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),

(3, 'Longest Substring Without Repeating Characters', 'longest-substring',
 'Given a string s, find the length of the longest substring without repeating characters.',
 'MEDIUM', '0 <= s.length <= 5 * 10^4
s consists of English letters, digits, symbols and spaces.',
 'A single string s.',
 'A single integer — the length of the longest substring.',
 1000, 256, 298000, 102000, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),

(4, 'Median of Two Sorted Arrays', 'median-two-sorted-arrays',
 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.

The overall run time complexity should be O(log (m+n)).',
 'HARD', 'nums1.length == m
nums2.length == n
0 <= m <= 1000
0 <= n <= 1000
1 <= m + n <= 2000',
 'First line: m n
Second line: m space-separated integers
Third line: n space-separated integers',
 'A single floating point number — the median.',
 1000, 256, 189000, 68000, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),

(5, 'Longest Palindromic Substring', 'longest-palindromic-substring',
 'Given a string s, return the longest palindromic substring in s.',
 'MEDIUM', '1 <= s.length <= 1000
s consist of only digits and English letters.',
 'A single string s.',
 'The longest palindromic substring.',
 1000, 256, 256000, 79000, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),

(6, 'Regular Expression Matching', 'regex-matching',
 'Given an input string s and a pattern p, implement regular expression matching with support for ''.'' and ''*'' where:
''.'' Matches any single character.
''*'' Matches zero or more of the preceding element.',
 'HARD', '1 <= s.length <= 20
1 <= p.length <= 20
s contains only lowercase English letters.
p contains only lowercase English letters, ''.'', and ''*''.',
 'Two lines: string s and pattern p.',
 'true or false',
 2000, 256, 145000, 39000, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),

(7, 'Container With Most Water', 'container-water',
 'You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).

Find two lines that together with the x-axis form a container, such that the container contains the most water.',
 'MEDIUM', 'n == height.length
2 <= n <= 10^5
0 <= height[i] <= 10^4',
 'First line: n
Second line: n space-separated integers.',
 'A single integer — the maximum area.',
 1000, 256, 201000, 109000, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),

(8, 'Three Sum', 'three-sum',
 'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.

Notice that the solution set must not contain duplicate triplets.',
 'MEDIUM', '3 <= nums.length <= 3000
-10^5 <= nums[i] <= 10^5',
 'First line: n
Second line: n space-separated integers.',
 'Each line contains a triplet of space-separated integers, sorted.',
 1000, 256, 278000, 97000, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),

(9, 'Valid Parentheses', 'valid-parentheses',
 'Given a string s containing just the characters ''('', '')'', ''{'', ''}'', ''['' and '']'', determine if the input string is valid.

An input string is valid if:
Open brackets must be closed by the same type of brackets.
Open brackets must be closed in the correct order.
Every close bracket has a corresponding open bracket of the same type.',
 'EASY', '1 <= s.length <= 10^4
s consists of parentheses only.',
 'A single string s.',
 'true or false',
 1000, 256, 389000, 156000, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),

(10, 'Merge K Sorted Lists', 'merge-k-sorted-lists',
 'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.

Merge all the linked-lists into one sorted linked-list and return it.',
 'HARD', 'k == lists.length
0 <= k <= 10^4
0 <= lists[i].length <= 500
-10^4 <= lists[i][j] <= 10^4',
 'First line: k
Following k lines: each contains space-separated integers of a sorted list.',
 'Space-separated integers of the merged sorted list.',
 2000, 256, 167000, 87000, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),

(11, 'Trapping Rain Water', 'trapping-rain-water',
 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
 'HARD', 'n == height.length
1 <= n <= 2 * 10^4
0 <= height[i] <= 10^5',
 'First line: n
Second line: n space-separated integers.',
 'A single integer — total water trapped.',
 1000, 256, 198000, 116000, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),

(12, 'Word Break', 'word-break',
 'Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.',
 'MEDIUM', '1 <= s.length <= 300
1 <= wordDict.length <= 1000
1 <= wordDict[i].length <= 20',
 'First line: string s
Second line: space-separated dictionary words.',
 'true or false',
 1000, 256, 178000, 84000, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),

(13, 'Binary Tree Inorder Traversal', 'binary-tree-inorder',
 'Given the root of a binary tree, return the inorder traversal of its nodes values.',
 'EASY', 'The number of nodes in the tree is in the range [0, 100].
-100 <= Node.val <= 100',
 'Space-separated integers representing the tree in level-order (use -1 for null).',
 'Space-separated integers of the inorder traversal.',
 1000, 256, 256000, 189000, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),

(14, 'Course Schedule', 'course-schedule',
 'There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai.

Return true if you can finish all courses.',
 'MEDIUM', '1 <= numCourses <= 2000
0 <= prerequisites.length <= 5000',
 'First line: numCourses numPrereqs
Following lines: ai bi pairs.',
 'true or false',
 1000, 256, 234000, 100000, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),

(15, 'Number of Islands', 'number-of-islands',
 'Given an m x n 2D binary grid which represents a map of ''1''s (land) and ''0''s (water), return the number of islands.

An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.',
 'MEDIUM', 'm == grid.length
n == grid[i].length
1 <= m, n <= 300
grid[i][j] is ''0'' or ''1''.',
 'First line: m n
Following m lines: n space-separated characters.',
 'A single integer — number of islands.',
 1000, 256, 312000, 179000, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),

(16, 'Longest Increasing Path in Matrix', 'longest-increasing-path',
 'Given an m x n integers matrix, return the length of the longest increasing path in matrix.

From each cell, you can either move in four directions: left, right, up, or down.',
 'HARD', 'm == matrix.length
n == matrix[i].length
1 <= m, n <= 200
0 <= matrix[i][j] <= 2^31 - 1',
 'First line: m n
Following m lines: n space-separated integers.',
 'A single integer — length of the longest increasing path.',
 2000, 256, 98000, 51000, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),

(17, 'Coin Change', 'coin-change',
 'You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money.

Return the fewest number of coins that you need to make up that amount. If that amount cannot be made up, return -1.',
 'MEDIUM', '1 <= coins.length <= 12
1 <= coins[i] <= 2^31 - 1
0 <= amount <= 10^4',
 'First line: n (number of coins)
Second line: n space-separated coin values
Third line: amount',
 'A single integer — minimum coins needed or -1.',
 1000, 256, 187000, 72000, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),

(18, 'Edit Distance', 'edit-distance',
 'Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2.

You have the following three operations: Insert a character, Delete a character, Replace a character.',
 'HARD', '0 <= word1.length, word2.length <= 500
word1 and word2 consist of lowercase English letters.',
 'Two lines: word1 and word2.',
 'A single integer — minimum edit distance.',
 1000, 256, 134000, 64000, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),

(19, 'Kth Largest Element in Array', 'kth-largest-element',
 'Given an integer array nums and an integer k, return the kth largest element in the array.

Note that it is the kth largest element in the sorted order, not the kth distinct element.',
 'MEDIUM', '1 <= k <= nums.length <= 10^5
-10^4 <= nums[i] <= 10^4',
 'First line: n k
Second line: n space-separated integers.',
 'A single integer — the kth largest element.',
 1000, 256, 201000, 134000, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),

(20, 'Valid Sudoku', 'valid-sudoku',
 'Determine if a 9 x 9 Sudoku board is valid. Only the filled cells need to be validated according to the rules:
Each row must contain the digits 1-9 without repetition.
Each column must contain the digits 1-9 without repetition.
Each of the nine 3 x 3 sub-boxes must contain the digits 1-9 without repetition.',
 'MEDIUM', 'board.length == 9
board[i].length == 9
board[i][j] is a digit 1-9 or ''.''.',
 '9 lines of 9 space-separated characters.',
 'true or false',
 1000, 256, 167000, 94000, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),

(21, 'Reverse Linked List', 'reverse-linked-list',
 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
 'EASY', 'The number of nodes in the list is the range [0, 5000].
-5000 <= Node.val <= 5000',
 'Space-separated integers representing the linked list.',
 'Space-separated integers of the reversed list.',
 1000, 256, 298000, 226000, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),

(22, 'Maximum Subarray', 'maximum-subarray',
 'Given an integer array nums, find the subarray with the largest sum, and return its sum.',
 'MEDIUM', '1 <= nums.length <= 10^5
-10^4 <= nums[i] <= 10^4',
 'First line: n
Second line: n space-separated integers.',
 'A single integer — the maximum subarray sum.',
 1000, 256, 245000, 123000, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),

(23, 'Climbing Stairs', 'climbing-stairs',
 'You are climbing a staircase. It takes n steps to reach the top.

Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
 'EASY', '1 <= n <= 45',
 'A single integer n.',
 'A single integer — the number of distinct ways.',
 1000, 256, 312000, 159000, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),

(24, 'Word Search II', 'word-search-ii',
 'Given an m x n board of characters and a list of strings words, return all words on the board.

Each word must be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring.',
 'HARD', 'm == board.length
n == board[i].length
1 <= m, n <= 12
1 <= words.length <= 3 * 10^4',
 'First line: m n
Following m lines: n space-separated characters
Last line: space-separated words to find.',
 'Space-separated found words, sorted alphabetically.',
 2000, 512, 89000, 31000, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),

(25, 'LRU Cache', 'lru-cache',
 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.

Implement the LRUCache class:
LRUCache(int capacity) - Initialize the LRU cache with positive size capacity.
int get(int key) - Return the value of the key if it exists, otherwise return -1.
void put(int key, int value) - Update the value of the key if it exists. Otherwise, add the key-value pair to the cache.',
 'MEDIUM', '1 <= capacity <= 3000
0 <= key <= 10^4
0 <= value <= 10^5
At most 2 * 10^5 calls will be made to get and put.',
 'First line: capacity
Following lines: operation key [value]',
 'One line per get operation with the returned value.',
 1000, 256, 267000, 115000, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW());

-- =====================================================
-- TAGS
-- =====================================================

INSERT INTO problem_tags (problem_id, tag) VALUES
(1, 'Arrays'), (1, 'Hashing'),
(2, 'Linked Lists'), (2, 'Math'),
(3, 'Strings'), (3, 'Sliding Window'),
(4, 'Arrays'), (4, 'Binary Search'),
(5, 'Strings'), (5, 'DP'),
(6, 'Strings'), (6, 'DP'),
(7, 'Arrays'), (7, 'Two Pointers'),
(8, 'Arrays'), (8, 'Two Pointers'),
(9, 'Stacks'), (9, 'Strings'),
(10, 'Linked Lists'), (10, 'Heaps'),
(11, 'Arrays'), (11, 'Two Pointers'), (11, 'DP'),
(12, 'DP'), (12, 'Strings'),
(13, 'Trees'), (13, 'DFS'),
(14, 'Graphs'), (14, 'BFS'), (14, 'DFS'),
(15, 'Graphs'), (15, 'DFS'), (15, 'BFS'),
(16, 'DP'), (16, 'Graphs'), (16, 'DFS'),
(17, 'DP'),
(18, 'DP'), (18, 'Strings'),
(19, 'Heaps'), (19, 'Arrays'),
(20, 'Arrays'), (20, 'Hashing'),
(21, 'Linked Lists'),
(22, 'Arrays'), (22, 'DP'),
(23, 'DP'), (23, 'Math'),
(24, 'Trie'), (24, 'DFS'), (24, 'Arrays'),
(25, 'Design'), (25, 'Hashing'), (25, 'Linked Lists');

-- =====================================================
-- SAMPLE TEST CASES (visible to users)
-- =====================================================

-- Two Sum
INSERT INTO test_cases (problem_id, input, expected_output, is_sample, explanation, order_index) VALUES
(1, '4
2 7 11 15
9', '0 1', true, 'Because nums[0] + nums[1] == 9, we return [0, 1].', 0),
(1, '3
3 2 4
6', '1 2', true, 'Because nums[1] + nums[2] == 6, we return [1, 2].', 1),
(1, '2
3 3
6', '0 1', false, null, 2),
(1, '5
1 5 3 7 2
8', '1 3', false, null, 3),
(1, '4
-1 -2 -3 -4
-6', '1 3', false, null, 4);

-- Valid Parentheses
INSERT INTO test_cases (problem_id, input, expected_output, is_sample, explanation, order_index) VALUES
(9, '()', 'true', true, 'Simple matching pair.', 0),
(9, '()[]{}', 'true', true, 'All brackets are properly matched.', 1),
(9, '(]', 'false', true, 'Mismatched brackets.', 2),
(9, '([)]', 'false', false, null, 3),
(9, '{[]}', 'true', false, null, 4);

-- Climbing Stairs
INSERT INTO test_cases (problem_id, input, expected_output, is_sample, explanation, order_index) VALUES
(23, '2', '2', true, 'Two ways: 1+1 or 2.', 0),
(23, '3', '3', true, 'Three ways: 1+1+1, 1+2, or 2+1.', 1),
(23, '1', '1', false, null, 2),
(23, '5', '8', false, null, 3),
(23, '10', '89', false, null, 4);

-- Maximum Subarray
INSERT INTO test_cases (problem_id, input, expected_output, is_sample, explanation, order_index) VALUES
(22, '9
-2 1 -3 4 -1 2 1 -5 4', '6', true, 'Subarray [4,-1,2,1] has the largest sum = 6.', 0),
(22, '1
1', '1', true, 'Single element.', 1),
(22, '5
5 4 -1 7 8', '23', false, null, 2);

-- Reverse Linked List
INSERT INTO test_cases (problem_id, input, expected_output, is_sample, explanation, order_index) VALUES
(21, '1 2 3 4 5', '5 4 3 2 1', true, 'Reverse the entire list.', 0),
(21, '1 2', '2 1', true, 'Two element list.', 1),
(21, '1', '1', false, null, 2);

-- Coin Change
INSERT INTO test_cases (problem_id, input, expected_output, is_sample, explanation, order_index) VALUES
(17, '3
1 2 5
11', '3', true, '11 = 5 + 5 + 1', 0),
(17, '1
2
3', '-1', true, 'Amount 3 cannot be made with only coin 2.', 1),
(17, '1
1
0', '0', false, null, 2);

-- Container With Most Water
INSERT INTO test_cases (problem_id, input, expected_output, is_sample, explanation, order_index) VALUES
(7, '9
1 8 6 2 5 4 8 3 7', '49', true, 'Lines at index 1 and 8 form the container with most water.', 0),
(7, '2
1 1', '1', true, 'Minimum case.', 1),
(7, '5
4 3 2 1 4', '16', false, null, 2);
